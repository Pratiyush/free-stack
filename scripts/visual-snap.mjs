#!/usr/bin/env node
// One-off visual snapshot of key pages. NOT a test — just produces PNGs in
// dist-assets/snapshots/ for design review. Run with:
//   pnpm dev   (in another terminal)
//   node scripts/visual-snap.mjs
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.SNAP_BASE ?? 'http://localhost:4321';
const OUT = path.resolve('dist-assets/snapshots');

const PAGES = [
  { slug: 'index', url: '/' },
  { slug: 'catalog', url: '/catalog' },
  { slug: 'category-ai-apis', url: '/category/ai-apis' },
  { slug: 'service-anthropic', url: '/service/anthropic-claude' },
  { slug: 'state-of-free-tiers', url: '/state-of-free-tiers/2026' },
  { slug: 'compare', url: '/compare' },
  { slug: 'legal', url: '/legal' },
];

const VIEWPORTS = [
  { tag: 'desktop', width: 1440, height: 900 },
  { tag: 'mobile', width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height } });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const url = `${BASE}${p.url}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        const out = path.join(OUT, `${p.slug}.${v.tag}.png`);
        await page.screenshot({ path: out, fullPage: true });
        console.log(`✓ ${v.tag.padEnd(7)} ${p.slug.padEnd(22)} → ${path.relative(process.cwd(), out)}`);
      } catch (err) {
        console.error(`✗ ${v.tag} ${p.slug}: ${err.message}`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\nSnapshots in ${path.relative(process.cwd(), OUT)}/`);
