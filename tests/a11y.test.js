/**
 * @jest-environment jsdom
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

// axe-core is designed to audit a rendered body fragment.
// We pass the body innerHTML rather than the full document string.
function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

describe('axe accessibility audit — index.html', () => {
  // Note: axe runs against the rendered body in jsdom. CSS-dependent checks
  // (e.g. colour contrast based on external stylesheets) are not reliable
  // without a real browser, but ARIA and semantic violations are caught.
  test('no critical or serious violations', async () => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    const results = await axe(extractBody(html));
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    // Report violation ids + descriptions on failure for easy diagnosis.
    expect(critical.map((v) => `${v.id}: ${v.description}`)).toEqual([]);
  }, 15000);
});
