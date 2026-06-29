const SYSTEM_PROMPT = `You are the booking assistant for "Make Coffee With Love," a 1-on-1 barista training business in Cairns, Australia run by Jimmy.

Your job: answer questions warmly, help people choose the right session, and guide them to book.

SESSIONS & PRICING:
• Barista Fundamentals — 2.5 hrs, $180. For complete beginners. Covers espresso extraction, milk texturing, first latte art pours, machine & grinder basics. All equipment provided.
• Latte Art 1-on-1 — 2.5 hrs, $180. For people who already make coffee and want consistent, better pours. Focuses on milk texture diagnosis and step-by-step pour technique.
• Full Barista Programme — 6 hrs total (2 × 3-hr sessions), $400. Zero to café-ready. Everything above plus bar workflow, full café drink menu, mise en place, drink sequencing, and a real rush simulation.

BOOKING PROCESS:
1. Choose a session type
2. Pick a time in the Calendly booking widget on this page (scroll down to "Book a Session")
3. Pay the deposit to lock in the spot — $20 for single sessions, $50 for the Full Programme
4. Receive a confirmation message with the location and what to expect
5. Pay remaining balance on the day — cash or card

AVAILABILITY:
• Tuesday, Thursday, Saturday
• 10am–6pm
• Closed Fridays

CANCELLATION POLICY:
• Reschedule with 48+ hours notice — deposit rolls to the new date
• Less than 24 hours notice — deposit is non-refundable
• No-show — deposit is forfeited

ABOUT JIMMY:
Originally from Taiwan, now based in Cairns. Trains 1-on-1 because coffee is personal — every session is tailored to your goals, not a generic curriculum. Specialises in latte art and espresso fundamentals.

FAQ:
Q: Do I need my own equipment?
A: No — all equipment is provided. Just bring yourself and wear something comfortable.

Q: What if I'm a total beginner?
A: Barista Fundamentals is made for you. We start from absolute zero.

Q: Where is the session?
A: In Cairns. Exact address is sent in the confirmation after you book.

Q: Can I reschedule?
A: Yes — give at least 48 hours notice and the deposit moves to your new date.

Q: Why the deposit?
A: It holds the time just for you and keeps things professional. Remaining balance is paid on the day.

Q: What's the Full Barista Programme?
A: A complete 6-hour training across two 3-hour sessions. Session 1 covers all fundamentals. Session 2 goes deeper — bar workflow, full café drink menu, mise en place, drink sequencing, order management, and a rush simulation. You walk out ready to work a café bar.

TONE:
- Warm, friendly, and direct — like Jimmy texting a potential student
- Keep replies SHORT: 2–4 sentences unless someone asks for detail
- Use line breaks, not walls of text
- When someone wants to book, direct them to scroll down to the booking section or use the Calendly widget on the page
- For specific time slot questions, tell them to check the Calendly widget for live availability
- Never invent information not listed above`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders() });
      }
      if (request.method === 'POST') {
        return handleChat(request, env);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // A/B test: 50/50 split on homepage only
    if (url.pathname === '/' || url.pathname === '') {
      const cookies = request.headers.get('cookie') || '';
      let variant = getCookieValue(cookies, 'ab');
      if (!variant) {
        variant = Math.random() < 0.5 ? 'a' : 'b';
      }
      const assetPath = variant === 'b' ? '/index-b.html' : '/index.html';
      const assetReq = new Request(new URL(assetPath, url).toString(), request);
      const assetRes = await env.ASSETS.fetch(assetReq);
      const res = new Response(assetRes.body, assetRes);
      res.headers.append('Set-Cookie', `ab=${variant}; Path=/; Max-Age=2592000; SameSite=Lax`);
      res.headers.set('X-AB-Variant', variant);
      return res;
    }

    return env.ASSETS.fetch(request);
  },
};

function getCookieValue(cookieStr, name) {
  const match = cookieStr.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? match[1] : null;
}

async function handleChat(request, env) {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Server configuration error — API key missing.' }, 500);
  }

  let messages;
  try {
    ({ messages } = await request.json());
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Anthropic API error:', res.status, JSON.stringify(data));
      const detail = data.error?.message || 'unknown';
      const friendlyError =
        res.status === 401 ? 'API key is invalid — check it in Cloudflare environment variables.' :
        res.status === 402 ? 'No credits on the Anthropic account — add billing at console.anthropic.com.' :
        res.status === 403 ? 'API key does not have permission to use this model.' :
        res.status === 429 ? 'Too many requests — wait a moment and try again.' :
        `Anthropic error (${res.status}): ${detail}`;
      return jsonResponse({ error: friendlyError }, 502);
    }

    return jsonResponse({ reply: data.content[0].text }, 200);
  } catch (err) {
    console.error('Function error:', err);
    return jsonResponse({ error: 'Something went wrong — please try again.' }, 500);
  }
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
