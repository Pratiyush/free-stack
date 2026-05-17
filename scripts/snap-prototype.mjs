import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const OUT = new URL('../dist-assets/snapshots/prototype-v3', import.meta.url).pathname;
await mkdir(OUT, { recursive: true });
const FILE = 'file://' + new URL('../local/theme-mocks/14-saas-prototype-v3.html', import.meta.url).pathname;
const browser = await chromium.launch({ headless: true });

const VIEWS = [
  { id: 'home', click: '.nav-item[data-target="home"]' },
  { id: 'catalog-grid', click: '.nav-item[data-target="catalog"]', after: () => null },
  { id: 'catalog-table', click: '[data-mode="table"]' },
  { id: 'drawer', click: '.table-row' },
  { id: 'compare', click: '.nav-item[data-target="compare"]', escFirst: true },
  { id: 'sponsors', click: '.nav-item[data-target="sponsors"]' },
  { id: 'report', click: '.nav-item[data-target="report"]' },
  { id: 'methodology', click: '.nav-item[data-target="methodology"]' },
  { id: 'about', click: '.nav-item[data-target="about"]' },
  { id: 'submit', click: '.nav-item[data-target="submit"]' },
  { id: 'changelog', click: '.nav-item[data-target="changelog"]' },
  { id: 'legal', click: '.nav-item[data-target="legal"]' },
  { id: 'palette', key: 'Meta+k' },
];

const VIEWPORTS = [
  { tag: '', width: 1440, height: 900 },          // desktop (no suffix)
  { tag: '.mobile', width: 390, height: 844 },    // iPhone 14 pro
];

for (const vp of VIEWPORTS) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.addInitScript((t) => localStorage.setItem('opentier-theme', t), theme);
    await page.goto(FILE, { waitUntil: 'networkidle' });

    for (const v of VIEWS) {
      if (v.escFirst) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); }
      // On mobile, sidebar is collapsed — open it for nav clicks, then close before snap
      const isSideClick = v.click && v.click.includes('.nav-item');
      if (vp.tag === '.mobile' && isSideClick) {
        await page.locator('[data-toggle-side]').click({ force: true });
        await page.waitForTimeout(150);
      }
      if (v.click) await page.locator(v.click).first().click({ force: true });
      if (v.key) await page.keyboard.press(v.key);
      await page.waitForTimeout(240);
      if (vp.tag === '.mobile' && isSideClick) {
        // sidebar auto-closes on nav already; just settle
        await page.waitForTimeout(120);
      }
      await page.screenshot({ path: path.join(OUT, `${v.id}.${theme}${vp.tag}.png`), fullPage: false });
      console.log(`✓ ${theme}${vp.tag || ' desktop'} ${v.id}`);
      if (v.key === 'Meta+k') { await page.keyboard.press('Escape'); await page.waitForTimeout(120); }
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`\nSnapshots in ${path.relative(process.cwd(), OUT)}/`);
