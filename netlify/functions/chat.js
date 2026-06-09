const https = require('https');

function anthropicPost(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Server configuration error — API key missing.' }),
    };
  }

  let messages;
  try {
    ({ messages } = JSON.parse(event.body));
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const system = `You are the booking assistant for "Make Coffee With Love," a 1-on-1 barista training business in Cairns, Australia run by Jimmy.

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

  try {
    const { status, body } = await anthropicPost(apiKey, {
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system,
      messages: messages.slice(-10),
    });

    const data = JSON.parse(body);

    if (status !== 200) {
      console.error('Anthropic API error:', status, body);
      const friendlyError =
        status === 401 ? 'API key is invalid — check it in Netlify environment variables.' :
        status === 402 ? 'No credits on the Anthropic account — add billing at console.anthropic.com.' :
        status === 403 ? 'API key does not have permission to use this model.' :
        status === 429 ? 'Too many requests — wait a moment and try again.' :
        `Anthropic returned an error (${status}). Check Netlify function logs for details.`;
      return {
        statusCode: 502,
        headers: corsHeaders(),
        body: JSON.stringify({ error: friendlyError }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      body: JSON.stringify({ reply: data.content[0].text }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Something went wrong — please try again.' }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
