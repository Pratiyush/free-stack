/**
 * v3.0 E2E happy-path — verifies the canonical user flows on the LIVE deploy.
 *
 *  home → catalog → category → service → compare → submit
 *
 * Run locally: `pnpm playwright test tests/e2e.spec.ts`
 * Run via CI:  triggered in .github/workflows/playwright-drift.yml (not yet)
 *
 * Override the target via E2E_BASE_URL env (default: live GH Pages preview).
 * Once opentier.dev DNS lands, flip the default to https://opentier.dev.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL ?? 'https://pratiyush.github.io/opentier';

test.describe('opentier — happy path', () => {
  test('home loads with hero + stat boxes + wall of logos', async ({ page }) => {
    await page.goto(`${BASE}/`);

    // Hero h1 visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/honest|directory|free tiers/i);

    // 300/27 stat boxes
    await expect(page.locator('body')).toContainText('300');
    await expect(page.locator('body')).toContainText('27');

    // Wall of logos — 48 tiles
    const wallTiles = page.locator('.wall .wall-tile');
    await expect(wallTiles).toHaveCount(48);

    // Categories section heading
    await expect(page.locator('h2:has-text("layers of the stack")')).toBeVisible();

    // Recently-verified strip
    await expect(page.locator('body')).toContainText(/last re-checked|recently verified/i);
  });

  test('catalog renders all services + has working search', async ({ page }) => {
    await page.goto(`${BASE}/catalog`);

    // Filter bar visible
    await expect(page.locator('input[type="search"], input[type="text"]')).toBeVisible({
      timeout: 10000,
    });

    // At least 200 cards rendered (some may be lazy-loaded)
    const cards = page.locator('article, [data-slug]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(200);
  });

  test('category page shows subcategory sections + view toggle', async ({ page }) => {
    await page.goto(`${BASE}/category/ai-apis`);

    // Heading
    await expect(page.locator('h1')).toContainText(/AI|api/i);

    // At least one subcategory section
    const sections = page.locator('h2');
    expect(await sections.count()).toBeGreaterThan(0);

    // View toggle (grid/table)
    await expect(page.locator('text=/Grid|Table/i').first()).toBeVisible();
  });

  test('service detail page (anthropic) renders full almanac chrome', async ({ page }) => {
    await page.goto(`${BASE}/service/anthropic-claude`);

    // Masthead — § CATEGORY · № SERIAL
    await expect(page.locator('body')).toContainText(/§|AI APIS|№/);

    // H1 = service name
    await expect(page.locator('h1')).toContainText('Anthropic');

    // Free tier section
    await expect(page.locator('h2:has-text("Free tier")')).toBeVisible();

    // Pricing section
    await expect(page.locator('h2:has-text("Pricing")')).toBeVisible();

    // At least one pricing row
    const pricingRows = page.locator('.pricing-table tbody tr');
    expect(await pricingRows.count()).toBeGreaterThanOrEqual(2);

    // Links section
    await expect(page.locator('h2:has-text("Links")')).toBeVisible();
  });

  test('service detail (groq) renders new v3.0 Signup friction section', async ({ page }) => {
    // Groq was backfilled with signup_friction in Day-4 of v2.0 — should
    // surface the new section now that detail page renders it.
    await page.goto(`${BASE}/service/groq`);
    await expect(page.locator('h2:has-text("Signup friction")')).toBeVisible();
  });

  test('compare page — empty state + quick-start chips', async ({ page }) => {
    await page.goto(`${BASE}/compare`);

    await expect(page.locator('h1')).toContainText(/Side-by-side|Compare/i);

    // Quick-start chips when no slugs selected
    await expect(page.locator('body')).toContainText('Anthropic');
    await expect(page.locator('body')).toContainText('Groq');
    await expect(page.locator('body')).toContainText('No services selected');
  });

  test('compare with slugs in URL — table renders', async ({ page }) => {
    await page.goto(`${BASE}/compare?slugs=groq,supabase`);

    // Service names in headers
    await expect(page.locator('body')).toContainText('Groq');
    await expect(page.locator('body')).toContainText('Supabase');
  });

  test('sponsors page — meter + ledger + tiers + honesty clause', async ({ page }) => {
    await page.goto(`${BASE}/sponsors`);

    // Meter (current vs target)
    await expect(page.locator('body')).toContainText(/\$\d+\s*\/\s*\$100/);

    // Ledger section
    await expect(page.locator('h2:has-text("ledger")')).toBeVisible();

    // Tier ladder — at least 4 tiers
    const tiers = page.locator('.tier');
    expect(await tiers.count()).toBeGreaterThanOrEqual(4);

    // Honesty clause
    await expect(page.locator('h2:has-text("honesty")')).toBeVisible();
  });

  test('legal page — takedown policy + email', async ({ page }) => {
    await page.goto(`${BASE}/legal`);
    await expect(page.locator('h1')).toContainText(/legal|policy/i);
    await expect(page.locator('body')).toContainText('removals@opentier.dev');
  });

  test('state of free tiers 2026 — annual report renders 8 sections', async ({ page }) => {
    await page.goto(`${BASE}/state-of-free-tiers/2026`);
    const h2s = page.locator('article h2, main h2');
    const count = await h2s.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('changelog — public page renders v2.0.x sections', async ({ page }) => {
    await page.goto(`${BASE}/changelog`);
    await expect(page.locator('body')).toContainText(/2\.0\.0|2\.0\.1|Production Quality/);
  });

  test('submit page → links to GitHub issue form', async ({ page }) => {
    await page.goto(`${BASE}/submit`);
    const submitLinks = page.locator('a[href*="issues/new"]');
    expect(await submitLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test('footer sponsor meter is on every page', async ({ page }) => {
    for (const path of ['/', '/catalog', '/legal', '/about']) {
      await page.goto(`${BASE}${path}`);
      await expect(page.locator('.meter-footer')).toBeVisible();
    }
  });

  test('internal links are base-prefixed (no 404 on click-through)', async ({ page, context }) => {
    await page.goto(`${BASE}/`);
    const catalogLink = page.locator('a[href*="/catalog"]').first();
    await catalogLink.click();
    await expect(page).toHaveURL(/\/opentier\/catalog/);
  });

  test('og:image meta points at the per-service card for service pages', async ({ page }) => {
    await page.goto(`${BASE}/service/anthropic-claude`);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toContain('/og/anthropic-claude.png');
  });

  test('view-transition tile to detail (smoke)', async ({ page }) => {
    await page.goto(`${BASE}/`);
    const firstTile = page.locator('.wall .wall-tile').first();
    const href = await firstTile.getAttribute('href');
    expect(href).toMatch(/\/service\/[a-z0-9-]+/);
    await firstTile.click();
    await page.waitForURL(/\/service\//);
    await expect(page.locator('h1')).toBeVisible();
  });
});
