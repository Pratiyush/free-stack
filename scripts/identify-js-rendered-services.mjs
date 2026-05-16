#!/usr/bin/env node
/**
 * Identify JS-rendered (or bot-blocked) pricing pages.
 *
 * Story 5.8 — for each src/content/services/*.yml, do a plain `fetch` against
 * the YAML's `pricing_url`, parse the HTML body, and count how many of the
 * `pricing[].price` values appear in the raw markup. If fewer than 50% match
 * the prices in the YAML, the page is almost certainly JS-rendered (or the
 * server is bot-blocking us). Those services need the Playwright drift
 * verifier (tests/pricing-drift.spec.ts) instead of the curl-based audit.
 *
 * Output: data/js-rendered-services.json
 *
 * Usage:
 *   node scripts/identify-js-rendered-services.mjs
 *   pnpm drift:identify
 *
 * Heuristic notes:
 *   - "Custom" / "Contact sales" / non-numeric prices are skipped.
 *   - Services with fewer than 2 numeric pricing rows are skipped (signal is
 *     too noisy with only one row).
 *   - HTTP errors (timeouts, 403, etc.) are treated as candidates — if curl
 *     can't reach the page, Playwright probably needs to.
 *
 * This script is for tooling only — output is advisory. It doesn't need to be
 * perfect; it just generates the candidate list to seed the Playwright spec.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const SERVICES_DIR = path.resolve('src/content/services');
const REPORT_DIR = path.resolve('data');
const REPORT_FILE = path.join(REPORT_DIR, 'js-rendered-services.json');

const MATCH_THRESHOLD = 0.5; // <50% prices visible → candidate
const FETCH_TIMEOUT_MS = 15_000;
const CONCURRENCY = 6;

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 free-stack-drift-identify/1.0';

const NON_NUMERIC_PRICES = new Set([
  'custom',
  'contact sales',
  'contact us',
  'enquire',
  'usage-based',
  'pay-as-you-go',
  'pay as you go',
  'free',
  'tbd',
]);

function isNumericPrice(price) {
  if (typeof price === 'number') return true;
  if (typeof price !== 'string') return false;
  const lower = price.trim().toLowerCase();
  if (!lower) return false;
  if (NON_NUMERIC_PRICES.has(lower)) return false;
  // Must contain at least one digit.
  return /\d/.test(lower);
}

function normalisePrice(price) {
  if (typeof price === 'number') return String(price);
  return String(price ?? '').trim();
}

/** Build candidate substrings to search for in the raw HTML. */
function priceVariants(price) {
  const raw = normalisePrice(price);
  const variants = new Set();
  variants.add(raw);

  // Strip leading "$" and add bare form.
  const stripped = raw.replace(/^\$/, '');
  variants.add(stripped);
  variants.add(`$${stripped}`);

  // If purely numeric, also try "<n>.00" and "<n>" forms.
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

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

async function fetchHtml(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, body: '', error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

function evaluateService(data, html) {
  const numericPrices = (data.pricing ?? []).filter((row) => isNumericPrice(row.price));
  if (numericPrices.length < 2) {
    return { skipped: true, reason: 'fewer than 2 numeric pricing rows' };
  }

  const lower = html.toLowerCase();
  const details = [];
  let matched = 0;
  for (const row of numericPrices) {
    const variants = priceVariants(row.price).map((v) => v.toLowerCase());
    const hit = variants.find((v) => lower.includes(v));
    if (hit) {
      matched += 1;
      details.push({ name: row.name, price: row.price, matched: true, hit });
    } else {
      details.push({ name: row.name, price: row.price, matched: false });
    }
  }
  const ratio = matched / numericPrices.length;
  return {
    skipped: false,
    total: numericPrices.length,
    matched,
    ratio,
    candidate: ratio < MATCH_THRESHOLD,
    details,
  };
}

async function processOne(file) {
  const rel = path.relative(process.cwd(), file);
  let data;
  try {
    data = yaml.load(await readFile(file, 'utf-8'));
  } catch (err) {
    return { file: rel, skipped: true, reason: `yaml parse error: ${err.message}` };
  }
  if (!data?.slug || !data?.pricing_url) {
    return { file: rel, slug: data?.slug, skipped: true, reason: 'no pricing_url' };
  }

  const fetchResult = await fetchHtml(data.pricing_url);
  if (!fetchResult.ok) {
    // Bot-blocked / HTTP error → candidate (Playwright should retry).
    return {
      file: rel,
      slug: data.slug,
      name: data.name,
      pricing_url: data.pricing_url,
      http_status: fetchResult.status,
      error: fetchResult.error ?? null,
      candidate: true,
      reason: `http ${fetchResult.status || 'error'} — likely bot-blocked`,
    };
  }

  const evalResult = evaluateService(data, fetchResult.body);
  if (evalResult.skipped) {
    return {
      file: rel,
      slug: data.slug,
      name: data.name,
      pricing_url: data.pricing_url,
      skipped: true,
      reason: evalResult.reason,
    };
  }
  return {
    file: rel,
    slug: data.slug,
    name: data.name,
    pricing_url: data.pricing_url,
    http_status: fetchResult.status,
    total_prices: evalResult.total,
    matched_prices: evalResult.matched,
    match_ratio: Number(evalResult.ratio.toFixed(2)),
    candidate: evalResult.candidate,
    details: evalResult.details,
  };
}

/** Tiny concurrency limiter — keeps fetch parallelism polite. */
async function pMap(items, fn, concurrency) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  const files = await listYaml(SERVICES_DIR);
  if (files.length === 0) {
    console.log('No services found.');
    return;
  }
  console.log(`Scanning ${files.length} services for JS-rendered pricing pages…`);
  const results = await pMap(files, processOne, CONCURRENCY);

  const candidates = results.filter((r) => r.candidate);
  const skipped = results.filter((r) => r.skipped);
  const passed = results.filter((r) => !r.candidate && !r.skipped);

  console.log('');
  console.log(`Scanned:    ${results.length}`);
  console.log(`Candidates: ${candidates.length}  (likely JS-rendered or bot-blocked)`);
  console.log(`Passed:     ${passed.length}  (price text visible in raw HTML)`);
  console.log(`Skipped:    ${skipped.length}  (no pricing_url / too few rows)`);

  if (candidates.length > 0) {
    console.log('');
    console.log('Candidate slugs:');
    for (const c of candidates) {
      const ratio = typeof c.match_ratio === 'number' ? ` (match ${c.match_ratio})` : '';
      const reason = c.reason ? ` — ${c.reason}` : '';
      console.log(`  - ${c.slug}${ratio}${reason}`);
    }
  }

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(
    REPORT_FILE,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        threshold: MATCH_THRESHOLD,
        total: results.length,
        candidates: candidates.length,
        passed: passed.length,
        skipped: skipped.length,
        slugs: candidates.map((c) => c.slug).filter(Boolean),
        results,
      },
      null,
      2,
    ),
    'utf-8',
  );
  console.log('');
  console.log(`Report: ${path.relative(process.cwd(), REPORT_FILE)}`);
}

main().catch((err) => {
  console.error('identify-js-rendered-services crashed:', err);
  process.exit(1);
});
