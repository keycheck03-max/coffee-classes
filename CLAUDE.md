# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Cloudflare Workers site for "Make Coffee With Love" — Jimmy's 1-on-1 barista training business in Cairns, Australia. The project is a single-page landing page with an embedded Calendly booking widget, served by a Worker that also exposes an `/api/chat` endpoint backed by the Anthropic API.

## Commands

Requires [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed globally (`npm install -g wrangler`).

```bash
wrangler dev          # Local dev server (hot reload)
wrangler deploy       # Deploy to Cloudflare Workers

# Set the required API key secret in Cloudflare (one-time setup)
wrangler secret put ANTHROPIC_API_KEY
```

There is no build step, no bundler, no test suite, and no `package.json`.

## Architecture

```
src/index.js          ← Cloudflare Worker entry point
public/index.html     ← The entire frontend (HTML + CSS + JS, all inline)
public/images/        ← Gallery and session photos served as static assets
wrangler.toml         ← Worker config: name, main, assets binding
```

**Request routing in `src/index.js`:**
- `POST /api/chat` → proxies to Anthropic API (`claude-haiku-4-5-20251001`, max 400 tokens, last 10 messages of history, `SYSTEM_PROMPT` hardcoded in the file)
- `OPTIONS /api/chat` → CORS preflight
- Everything else → `env.ASSETS.fetch(request)` (serves `public/` directory)

**Frontend (`public/index.html`):**
- Self-contained: all CSS and JS are inline in the single file
- Uses CSS custom properties for the colour palette (`--espresso`, `--latte`, `--cream`, etc.)
- Fonts loaded from Google Fonts (Playfair Display + Inter)
- Calendly inline widget embedded in the `#book` section
- A chat widget exists in the file but is **archived** (`display: none` on `#chat-widget`) — the code is preserved but hidden. The `/api/chat` Worker endpoint still works; re-enable by removing the `display: none` line

**`public/make-coffee-with-love-booking.html`** is an older/alternate version of the page kept for reference.

## Key Business Details (in SYSTEM_PROMPT)

The Worker's `SYSTEM_PROMPT` in `src/index.js` contains all authoritative business information. If pricing, session names, availability, or cancellation policy changes, update it there — and mirror the change in `public/index.html` which has the same information in the page copy.

Current sessions: Barista Fundamentals (2.5hrs, $180), Latte Art 1-on-1 (2.5hrs, $180), Full Barista Programme (6hrs, $400). Deposits: $20 for single sessions, $50 for the Programme.

## Environment Variables

| Variable | Where set | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Cloudflare Worker secret | Calls Anthropic API for `/api/chat` |

Set via `wrangler secret put ANTHROPIC_API_KEY` — never commit this value.

## Unsorted / Reference Docs

- `Booking Scripts — Make Coffee With Love.md` — DM/email copy-paste templates for Jimmy's booking workflow
- `Calendly + Stripe Setup Guide.md` — one-time setup guide for the booking system
- `unsorted/` — raw assets (photos, PDFs, screenshots); not served or used by the site
