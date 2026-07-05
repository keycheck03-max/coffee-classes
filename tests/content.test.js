'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const BOOKING_PATH = path.join(ROOT, 'make-coffee-with-love-booking.html');

describe('Duplicate page consistency', () => {
  test('index.html and make-coffee-with-love-booking.html are identical', () => {
    const index = fs.readFileSync(INDEX_PATH, 'utf8');
    const booking = fs.readFileSync(BOOKING_PATH, 'utf8');
    expect(index).toBe(booking);
  });
});

describe('Pricing consistency — index.html', () => {
  let $;

  beforeAll(() => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    $ = cheerio.load(html);
  });

  test('session cards list prices $180, $180, $400 in order', () => {
    const prices = [];
    $('.session-card .session-meta-item').each((_, el) => {
      const text = $(el).text().trim();
      if (/^\$\d+$/.test(text)) prices.push(text);
    });
    expect(prices).toEqual(['$180', '$180', '$400']);
  });

  test('pricing section boxes show totals 180, 180, 400 in order', () => {
    const totals = [];
    $('.price-box').each((_, el) => {
      const digits = $(el).find('.price-tag').text().replace(/\D/g, '');
      if (digits) totals.push(Number(digits));
    });
    expect(totals).toEqual([180, 180, 400]);
  });

  test('session card prices match pricing section totals', () => {
    const cardPrices = [];
    $('.session-card .session-meta-item').each((_, el) => {
      const text = $(el).text().trim();
      if (/^\$\d+$/.test(text)) cardPrices.push(Number(text.slice(1)));
    });

    const boxTotals = [];
    $('.price-box').each((_, el) => {
      const digits = $(el).find('.price-tag').text().replace(/\D/g, '');
      if (digits) boxTotals.push(Number(digits));
    });

    expect(cardPrices).toEqual(boxTotals);
  });

  test('Barista Fundamentals: stated deposit + stated remainder equals the total', () => {
    const box = $('.price-box').eq(0);
    const total = Number(box.find('.price-tag').text().replace(/\D/g, ''));
    const depositText = box.find('.price-deposit').text();

    const depositMatch = depositText.match(/\$(\d+)\s+deposit/i);
    const remainderMatch = depositText.match(/Remaining\s+\$(\d+)/i);

    expect(depositMatch).not.toBeNull();
    // If a specific remainder amount is stated, it must add up correctly.
    if (remainderMatch) {
      const deposit = Number(depositMatch[1]);
      const remainder = Number(remainderMatch[1]);
      expect(deposit + remainder).toBe(total);
    }
  });

  test('Calendly embed is present with a valid data-url', () => {
    const widget = $('[data-url*="calendly.com"]');
    expect(widget.length).toBeGreaterThan(0);
    expect(widget.first().attr('data-url')).toMatch(/^https:\/\/calendly\.com\//);
  });

  test('Calendly script tag is present', () => {
    expect($('script[src*="calendly"]').length).toBeGreaterThan(0);
  });
});
