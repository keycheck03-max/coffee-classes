'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

describe('HTML structure — index.html', () => {
  let $;

  beforeAll(() => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    $ = cheerio.load(html);
  });

  test('<html> element has a lang attribute', () => {
    expect($('html').attr('lang')).toBeTruthy();
  });

  test('page has a non-empty <title>', () => {
    expect($('title').text().trim().length).toBeGreaterThan(0);
  });

  test('meta viewport tag is present', () => {
    expect($('meta[name="viewport"]').length).toBeGreaterThan(0);
  });

  test('page has exactly one <h1>', () => {
    expect($('h1').length).toBe(1);
  });

  test('all <img> elements have alt attributes', () => {
    const missing = [];
    $('img:not([alt])').each((_, el) => {
      missing.push($(el).attr('src') || '(no src)');
    });
    expect(missing).toEqual([]);
  });

  // FAQ items are <div> elements styled with cursor:pointer but have no
  // keyboard support. They need to be <button> elements — or at minimum carry
  // role="button" + tabindex="0" — so keyboard and screen-reader users can
  // activate them.
  test('interactive FAQ toggle elements are keyboard-accessible', () => {
    const inaccessible = [];
    $('.faq-q').each((_, el) => {
      const tag = $(el).prop('tagName').toLowerCase();
      const role = $(el).attr('role');
      const tabindex = $(el).attr('tabindex');
      const ok =
        tag === 'button' ||
        tag === 'a' ||
        role === 'button' ||
        tabindex !== undefined;
      if (!ok) inaccessible.push($(el).text().trim().slice(0, 60));
    });
    expect(inaccessible).toEqual([]);
  });
});
