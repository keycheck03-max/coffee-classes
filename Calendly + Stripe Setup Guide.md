# Calendly + Stripe Setup Guide
### Make Coffee With Love — Booking System

---

## Overview

This guide walks you through setting up your booking system in under 1 hour.
You only need to do this once. After that, clients book and pay themselves.

**Two tools:**
- **Calendly** → handles time selection + scheduling
- **Stripe** → handles the $50 deposit payment

---

## PART 1 — Set Up Calendly

### Step 1: Create your account
1. Go to **calendly.com**
2. Click **Sign Up** → use your email (keycheck03@gmail.com or a business email)
3. Choose the **Free plan** to start (it's enough for 1 event type)

---

### Step 2: Create your two event types

You'll create **two separate events** in Calendly — one for each class.

**Event Type 1 — Barista Fundamentals**

1. Click **+ New Event Type** → choose **"One-on-One"**
2. Fill in:

| Field | What to enter |
|-------|---------------|
| **Event name** | Barista Fundamentals (2.5hr) |
| **Duration** | 2 hours 30 minutes |
| **Location** | Add your address (or "Details sent after booking") |
| **Description** | Beginner-friendly 1-on-1 session. We cover the full journey — espresso extraction, milk texturing, and your first latte art pours. All equipment provided. $20 deposit required to confirm — remaining $160 paid on the day. |

**Event Type 2 — Latte Art 1-on-1**

1. Click **+ New Event Type** again → choose **"One-on-One"**
2. Fill in:

| Field | What to enter |
|-------|---------------|
| **Event name** | Latte Art 1-on-1 Session (2.5hr) |
| **Duration** | 2 hours 30 minutes |
| **Location** | Add your address (or "Details sent after booking") |
| **Description** | Skill-focused 1-on-1 session for people who already make coffee and want to level up their latte art. We fix your milk texture and break down your pouring technique. All equipment provided. $20 deposit required to confirm — remaining $160 paid on the day. |

---

### Step 3: Set your availability (do this for both events)
1. Click **"Availability"** in the event settings
2. Set your available days. Example:
   - Tuesday: 10am – 6pm
   - Thursday: 10am – 6pm
   - Saturday: 9am – 4pm
3. Set a **buffer time**: 30 minutes before/after (so you have setup + cleanup time — especially important for the 2.5hr Fundamentals session)
4. Set **minimum notice**: 24 hours (so people can't book last-minute)

---

### Step 4: Add intake questions

**For Barista Fundamentals**, add:
1. "Have you made coffee at home or in a café before?" *(required, text)*
2. "What are you hoping to be able to do after this session?" *(required, text)*
3. "Do you have any equipment at home we can build on?" *(optional, text)*

**For Latte Art 1-on-1**, add:
1. "What's your current experience level with coffee?" *(required, text)*
2. "What specifically are you struggling with — milk texture, pouring, or both?" *(required, text)*
3. "Have you done any barista training before?" *(optional, yes/no)*

These answers help you prepare and personalise each session from the start.

---

### Step 5: Get your booking link
1. Click **"Share"** on your event
2. Copy your **personal Calendly link** — your Latte Art link is already live at: `calendly.com/keycheck03/latte-art-1-on-1-session-2hrs`
3. Save this link. You'll use it in your DMs and on the landing page.

---

### Step 6 (Optional): Embed on your landing page
1. In Calendly, click **"Share"** → **"Add to Website"** → **"Inline Embed"**
2. Copy the embed code
3. Open the file `make-coffee-with-love-booking.html`
4. Find the comment that says `<!-- REPLACE THIS BLOCK WITH YOUR CALENDLY EMBED CODE -->`
5. Replace the placeholder block with your Calendly embed code
6. Save the file — the calendar will now appear live on your page

---

## PART 2 — Set Up Stripe (Payment Link)

### Step 1: Create your Stripe account
1. Go to **stripe.com**
2. Click **"Start now"** → sign up with your email
3. Fill in your business details (you can use "Make Coffee With Love" as the business name)
4. Add your Australian bank account so payments go directly to you

> **Note:** Stripe charges ~1.7% + 30¢ per transaction (Australian cards). On a $20 deposit, you receive about $19.36.

---

### Step 2: Create a Payment Link for the $50 deposit
1. In Stripe dashboard, go to **"Payment Links"** (left sidebar)
2. Click **"+ New"**
3. Set up:

| Field | What to enter |
|-------|---------------|
| **Product name** | Coffee Training — $20 Deposit |
| **Price** | $20 AUD |
| **Quantity** | Fixed (1) |
| **Description** | Secures your 1-on-1 latte art session. Remaining $160 paid on the day. |

4. Click **"Create link"**
5. Copy the link — it looks like: `buy.stripe.com/xxxxxx`

---

### Step 3: Add a confirmation message
In the payment link settings, add a **"After payment" message:**

> "You're in! 🙌 Your $50 deposit is confirmed. Jimmy from Make Coffee With Love will be in touch within 24 hours to confirm your session details. Get ready to level up your coffee!"

---

### Step 4: Test it
Before sending to clients, do a test payment yourself using a test card:
- Card number: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVV

Check that the money (minus fee) appears in your Stripe dashboard.

---

## PART 3 — Connect the two tools

You don't need to technically integrate them. Here's the simple flow:

```
Client picks time on Calendly
        ↓
Calendly sends automatic confirmation email to client
        ↓
YOU send them the Stripe payment link via DM or email
        ↓
Client pays $50 deposit
        ↓
YOU send final confirmation with location + prep details
```

**Optional upgrade:** Calendly Pro ($12/month) lets you add a payment step directly inside the booking flow — so payment is automatic without you needing to send a link manually.

---

## PART 4 — Automate your reminders

### Free option (manual)
Set a phone reminder the day before each session to send the reminder DM.

### Slightly better option (free)
In Calendly, go to **"Workflows"** and set up:
- **Email reminder** to client: 24 hours before session
- **Email reminder** to client: 1 hour before session

You can customise the message in the workflow editor.

---

## You're done. Your system is live. ✅

**Your daily reality after this setup:**
1. Client books via Calendly link
2. You get a notification
3. You send them the Stripe payment link
4. They pay — you get notified
5. You send the final confirmation
6. Session happens
7. They pay the remaining $100 on the day

**Total time per client: ~5 minutes of admin.**

---

## Quick Reference — Your Key Links

| Item | Where to find it |
|------|-----------------|
| Calendly booking link | calendly.com → your event → Share |
| Stripe deposit link | stripe.com → Payment Links |
| Stripe dashboard (payments) | dashboard.stripe.com |
| Your landing page | make-coffee-with-love-booking.html |

---

*Make Coffee With Love — Setup Guide v1*
