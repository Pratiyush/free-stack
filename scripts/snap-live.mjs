import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
// Resolve relative to this script regardless of the project's working-dir
// name. The folder is still locally called "free-stack" even after the
// brand rename to opentier.
const OUT = new URL('../dist-assets/snapshots/v3.0-live', import.meta.url).pathname;
const BASE = 'https://pratiyush.github.io/opentier';
const PAGES = [
  ['index', '/'],
  ['catalog', '/catalog'],
  ['category-ai-apis', '/category/ai-apis'],
  ['service-anthropic', '/service/anthropic-claude'],
  ['state-of-free-tiers', '/state-of-free-tiers/2026'],
  ['compare', '/compare'],
  ['sponsors', '/sponsors'],
  ['legal', '/legal'],
  ['changelog', '/changelog'],
  ['methodology', '/methodology'],
  ['about', '/about'],
  ['submit', '/submit'],
];
const VIEWPORTS = [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
];
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [vTag, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const [slug, url] of PAGES) {
    try {
      const r = await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 25000 });
      const status = r ? r.status() : 'no-response';
      await page.screenshot({ path: path.join(OUT, `${slug}.${vTag}.png`), fullPage: true });
      const dim = await page.evaluate(() => ({
        h: document.documentElement.scrollHeight,
        dom: document.querySelectorAll('*').length,
      }));
      console.log(`${vTag.padEnd(7)} ${slug.padEnd(22)} ${status} h=${dim.h}px dom=${dim.dom}`);
    } catch (e) {
      console.log(`${vTag.padEnd(7)} ${slug.padEnd(22)} ERR ${e.message}`);
    }
  }
  await ctx.close();
}
await browser.close();
