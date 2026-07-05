'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.join(__dirname, '..');
const HTML_FILES = [
  ['index.html'],
  ['make-coffee-with-love-booking.html'],
];

describe.each(HTML_FILES)('%s — anchor link integrity', (filename) => {
  let $;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(ROOT, filename), 'utf8');
    $ = cheerio.load(html);
  });

  test('every href="#id" points to an existing element in the document', () => {
    const broken = [];
    $('a[href^="#"]').each((_, el) => {
      const href = $(el).attr('href');
      const id = href.slice(1);
      if (id && $(`[id="${id}"]`).length === 0) {
        broken.push(href);
      }
    });
    expect(broken).toEqual([]);
  });

  test('nav links each resolve to a real section', () => {
    const broken = [];
    $('nav a[href^="#"]').each((_, el) => {
      const id = $(el).attr('href').slice(1);
      if ($(`[id="${id}"]`).length === 0) broken.push(`#${id}`);
    });
    expect(broken).toEqual([]);
  });

  test('"Book This" CTAs all point to a section that exists', () => {
    const broken = [];
    $('a.session-cta[href^="#"]').each((_, el) => {
      const id = $(el).attr('href').slice(1);
      if ($(`[id="${id}"]`).length === 0) broken.push(`#${id}`);
    });
    expect(broken).toEqual([]);
  });

  test('hero primary CTA resolves', () => {
    const heroHref = $('a.btn-primary[href^="#"]').first().attr('href');
    if (heroHref) {
      const id = heroHref.slice(1);
      expect($(`[id="${id}"]`).length).toBeGreaterThan(0);
    }
  });
});
