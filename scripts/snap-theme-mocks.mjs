#!/usr/bin/env node
// Snap the 5 theme mocks in local/theme-mocks/ to PNG for the Day-3 marketing
// post. Output goes to dist-assets/snapshots/themes/ (gitignored under
// dist-assets/). One desktop + one mobile snap per mock.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const MOCKS = [
  { slug: '01-almanac-current', label: 'Almanac (shipped)' },
  { slug: '02-newspaper', label: 'Newspaper Modernism' },
  { slug: '03-terminal', label: 'Terminal' },
  { slug: '04-dashboard', label: 'Dashboard SaaS' },
  { slug: '05-clean-white', label: 'Clean white' },
  { slug: '06-saas-polished', label: 'SaaS polished' },
  { slug: '07-magazine-editorial', label: 'Magazine editorial' },
  { slug: '08-saas-sidebar', label: 'SaaS sidebar' },
  { slug: '09-saas-stripe', label: 'SaaS Stripe' },
  { slug: '10-almanac-forest', label: 'Almanac forest' },
  { slug: '11-almanac-navy', label: 'Almanac navy' },
  { slug: '12-almanac-plum', label: 'Almanac plum' },
];

const MOCK_DIR = path.resolve('local/theme-mocks');
const OUT_DIR = path.resolve('dist-assets/snapshots/themes');

if (!existsSync(MOCK_DIR)) {
  console.error(`Mock directory missing: ${MOCK_DIR}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });

const VIEWPORTS = [
  { tag: 'desktop', width: 1440, height: 1200 },
  { tag: 'mobile', width: 390, height: 1400 },
];

try {
  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height } });
    const page = await ctx.newPage();
    for (const m of MOCKS) {
      const url = `file://${MOCK_DIR}/${m.slug}.html`;
      const out = path.join(OUT_DIR, `${m.slug}.${v.tag}.png`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.screenshot({ path: out, fullPage: false });
        console.log(
          `✓ ${v.tag.padEnd(7)} ${m.label.padEnd(22)} → ${path.relative(process.cwd(), out)}`,
        );
      } catch (err) {
        console.error(`✗ ${v.tag} ${m.slug}: ${err.message}`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\nSnapshots in ${path.relative(process.cwd(), OUT_DIR)}/`);
console.log('Compose into a 2×3 grid with: magick montage 01-*.desktop.png 02-*.desktop.png');
console.log('  03-*.desktop.png 04-*.desktop.png 05-*.desktop.png -tile 3x2 -geometry +8+8');
console.log('  dist-assets/snapshots/themes/themes-grid.png');
