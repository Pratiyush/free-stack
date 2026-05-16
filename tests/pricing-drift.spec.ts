import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Playwright pricing-drift verifier (story 5.8).
 *
 * Runs the ~20 services whose pricing pages are JS-rendered or bot-blocked,
 * so the curl-based `scripts/audit-services.mjs` content check can't reach
 * them. For each candidate slug we:
 *   1. Open the YAML's `pricing_url` in headless Chromium.
 *   2. Wait for `networkidle` so client-side pricing has rendered.
 *   3. Read `page.content()` and check that every numeric `pricing[].price`
 *      from the YAML appears somewhere in the rendered HTML.
 *
 * Failures bubble up with the slug, expected price, and URL so the weekly
 * cron (.github/workflows/playwright-drift.yml) can file an issue with the
 * exact drift list.
 */

const SERVICES_DIR = path.resolve('src/content/services');
const CANDIDATE_LIST_PATH = path.resolve('data/js-rendered-services.json');

/** Fallback when data/js-rendered-services.json hasn't been generated yet. */
const FALLBACK_CANDIDATES = [
  'anthropic-claude',
  'openai',
  'vercel',
  'supabase',
  'neon',
  'planetscale',
  'railway',
  'render',
  'fly-io',
  'cloudflare-workers',
];

/** Prices we can't drift-check numerically. */
const NON_NUMERIC_PRICES = new Set([
  'custom',
  'contact sales',
  'contact us',
  'enquire',
  'usage-based',
  'pay-as-you-go',
  'pay as you go',
  'tbd',
]);

interface PricingRow {
  name: string;
  price: number | string;
  unit?: string;
  billing?: string;
}

interface ServiceYaml {
  slug: string;
  name: string;
  pricing_url?: string;
  pricing: PricingRow[];
}

async function loadCandidateSlugs(): Promise<string[]> {
  if (!existsSync(CANDIDATE_LIST_PATH)) return FALLBACK_CANDIDATES;
  try {
    const raw = await readFile(CANDIDATE_LIST_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { slugs?: unknown };
    if (Array.isArray(parsed.slugs) && parsed.slugs.every((s) => typeof s === 'string')) {
      return parsed.slugs.length > 0 ? (parsed.slugs as string[]) : FALLBACK_CANDIDATES;
    }
  } catch {
    // Fall through to fallback.
  }
  return FALLBACK_CANDIDATES;
}

// v3.0 — synchronous candidate load at module-eval time so `playwright test --list`
// generates a stable suite. Falls back to the hardcoded list if the JSON file
// doesn't exist or fails to parse. Async loader above kept for compatibility.
function loadCandidateSlugsSync(): string[] {
  if (!existsSync(CANDIDATE_LIST_PATH)) return FALLBACK_CANDIDATES;
  try {
    const raw = readFileSync(CANDIDATE_LIST_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { slugs?: unknown };
    if (Array.isArray(parsed.slugs) && parsed.slugs.every((s) => typeof s === 'string')) {
      const slugs = parsed.slugs as string[];
      return slugs.length > 0 ? slugs : FALLBACK_CANDIDATES;
    }
  } catch {
    // Fall through.
  }
  return FALLBACK_CANDIDATES;
}

async function loadService(slug: string): Promise<ServiceYaml | null> {
  // Try exact slug match first, then fall back to scanning the directory.
  const direct = path.join(SERVICES_DIR, `${slug}.yml`);
  const candidates: string[] = [direct, path.join(SERVICES_DIR, `${slug}.yaml`)];
  for (const file of candidates) {
    if (existsSync(file)) {
      const raw = await readFile(file, 'utf-8');
      const data = yaml.load(raw) as ServiceYaml;
      if (data?.slug === slug) return data;
    }
  }
  // Slug → filename mismatch fallback (cheap; only runs if direct miss).
  const all = await readdir(SERVICES_DIR);
  for (const entry of all) {
    if (!/\.(ya?ml)$/.test(entry)) continue;
    const raw = await readFile(path.join(SERVICES_DIR, entry), 'utf-8');
    const data = yaml.load(raw) as ServiceYaml;
    if (data?.slug === slug) return data;
  }
  return null;
}

function isFreePrice(price: number | string): boolean {
  if (typeof price === 'number') return price === 0;
  const lower = String(price).trim().toLowerCase();
  return lower === '0' || lower === '$0' || lower === 'free' || lower === '$0.00';
}

function isSkippablePrice(price: number | string): boolean {
  if (typeof price === 'number') return false;
  const lower = String(price).trim().toLowerCase();
  return NON_NUMERIC_PRICES.has(lower);
}

/**
 * Build candidate substrings to match a YAML price against rendered HTML.
 * Returns lowercased variants so the caller can search a lowercased haystack.
 */
function priceMatchVariants(price: number | string): string[] {
  if (isFreePrice(price)) {
    return ['$0', 'free', '0.00', '$0.00'];
  }
  const raw = String(price).trim();
  const stripped = raw.replace(/^\$/, '');
  const variants = new Set<string>();
  variants.add(raw.toLowerCase());
  variants.add(stripped.toLowerCase());
  variants.add(`$${stripped}`.toLowerCase());
  if (/^\d+(\.\d+)?$/.test(stripped)) {
    const n = Number(stripped);
    if (Number.isInteger(n)) {
      variants.add(`${n}`);
      variants.add(`${n}.00`);
      variants.add(`$${n}`);
      variants.add(`$${n}.00`);
    }
  }
  return [...variants].filter((v) => v.length > 0);
}

function priceAppearsInHtml(price: number | string, htmlLower: string): boolean {
  const variants = priceMatchVariants(price);
  return variants.some((v) => htmlLower.includes(v));
}

// v3.0 — DON'T use serial mode. In serial, one failure skips all remaining
// tests in the describe block, which defeats the verifier (we want a FULL
// drift report, not "first 1 broken"). Use default mode + a single worker
// (set in playwright.config.ts via `workers: 1`) to avoid hammering hosts.

// Resolve the candidate list synchronously at module eval so the for-loop
// below generates one test per real candidate (not the fallback).
const CANDIDATES = loadCandidateSlugsSync();

test.describe('pricing-drift (JS-rendered candidates)', () => {
  test.beforeAll(async () => {
    console.log(`Pricing drift check across ${CANDIDATES.length} candidate services.`);
  });

  for (const slug of CANDIDATES) {
    test(`${slug}: live prices match YAML`, async ({ page }) => {
      const service = await loadService(slug);
      test.skip(!service, `no YAML found for slug "${slug}"`);
      // Narrow the type after the skip — Playwright's skip throws, so anything
      // below this line is guaranteed to have `service`.
      const data = service as ServiceYaml;
      test.skip(!data.pricing_url, `no pricing_url for "${slug}"`);
      test.skip(
        !Array.isArray(data.pricing) || data.pricing.length === 0,
        `no pricing rows for "${slug}"`,
      );

      await page.goto(data.pricing_url as string, { waitUntil: 'domcontentloaded' });
      // networkidle gives JS-rendered prices a chance to settle, but a few
      // pages keep long-poll connections open — cap the wait at 15s.
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {
        // Some pages never reach networkidle; the content is usually present
        // anyway — fall through and let the price assertions decide.
      });

      const html = await page.content();
      const htmlLower = html.toLowerCase();

      const drifts: { name: string; price: number | string }[] = [];
      const matched: { name: string; price: number | string }[] = [];
      const skipped: { name: string; price: number | string }[] = [];

      for (const row of data.pricing) {
        if (isSkippablePrice(row.price)) {
          skipped.push({ name: row.name, price: row.price });
          continue;
        }
        if (priceAppearsInHtml(row.price, htmlLower)) {
          matched.push({ name: row.name, price: row.price });
        } else {
          drifts.push({ name: row.name, price: row.price });
        }
      }

      const summary = `${slug}: matched=${matched.length} drift=${drifts.length} skipped=${skipped.length}`;
      console.log(summary);

      if (drifts.length > 0) {
        const detail = drifts
          .map((d) => `  - "${d.name}" expected price "${d.price}" — not found in rendered HTML`)
          .join('\n');
        expect(
          drifts,
          [
            `Pricing drift detected for ${slug}`,
            `URL: ${data.pricing_url}`,
            'Missing prices:',
            detail,
          ].join('\n'),
        ).toEqual([]);
      }
    });
  }
});
