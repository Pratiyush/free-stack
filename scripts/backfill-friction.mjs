#!/usr/bin/env node
/**
 * Day-4 backfill — populate the v2.0.0 capture-everything blocks for the
 * top-20 most-popular services. Pure heuristic, NO web fetches. Idempotent:
 * never overwrites an existing value, only fills empties.
 *
 * Derives:
 *   - signup_friction.requires_cc ← facets.cc_required (mirror)
 *   - tos_red_flags ← regex on `notes` for "no scraping", "abuse", "revoke",
 *     "fair use", "data ownership", "closed to new signups"
 *   - inactive_account_policy.days_until_deletion ← parse `notes` for
 *     "delete after N days", "purge after N days", "inactive N days"
 *
 * Usage:
 *   node scripts/backfill-friction.mjs            # write changes
 *   node scripts/backfill-friction.mjs --dry-run  # preview only
 *
 * Reports services touched + field additions to stdout.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const DRY_RUN = process.argv.includes('--dry-run');
const RUN_ALL = process.argv.includes('--all');
const SERVICES_DIR = path.resolve('src/content/services');

// Top-20 canonical services (verified to exist in the catalog). Hand-picked
// by category coverage. The --all flag widens the run to every YAML.
const TOP_20 = [
  'anthropic-claude',
  'openai',
  'vercel',
  'supabase',
  'neon',
  'cloudflare-pages',
  'cloudflare-workers-ai',
  'github',
  'github-pages',
  'render',
  'turso',
  'mongodb-atlas',
  'sentry',
  'stripe',
  'twilio',
  'resend',
  'groq',
  'upstash-redis',
  'plane',
  'cloudflare-r2',
];

// ToS red-flag regex map — each (flag, /regex/i) produces a one-line string.
const TOS_PATTERNS = [
  { flag: 'no scraping', re: /no scraping|don'?t scrape|prohibits scraping/i },
  { flag: 'no automated agents', re: /no (?:bots|crawlers|automated agents|automation)/i },
  { flag: 'usage revocable at any time', re: /revoke|may discontinue|terminate at any time/i },
  { flag: 'closed to new signups', re: /closed to new signups|new accounts paused/i },
  { flag: 'fair-use clause', re: /fair use|fair-use|fair usage/i },
  {
    flag: 'data ownership transfers on inactivity',
    re: /ownership transfers|data becomes property/i,
  },
];

// Inactive-account heuristic — "after N days of inactivity" / "delete after N days".
const INACTIVE_RE =
  /(?:delete|purge|remove|inactive)\s*(?:after|for|>)\s*(\d+)\s*days?|(\d+)\s*days?\s*(?:of\s+)?inactivity/i;

function deriveSignupFriction(data) {
  const ccRequired = data.facets?.cc_required;
  if (typeof ccRequired !== 'boolean') return undefined;
  return { requires_cc: ccRequired };
}

function deriveTosRedFlags(data) {
  const haystack = `${data.notes ?? ''} ${data.free_tier?.join(' ') ?? ''}`;
  const flags = [];
  for (const { flag, re } of TOS_PATTERNS) {
    if (re.test(haystack)) flags.push(flag);
  }
  return flags.length ? flags : undefined;
}

function deriveInactivePolicy(data) {
  const haystack = `${data.notes ?? ''} ${data.free_tier?.join(' ') ?? ''}`;
  const match = haystack.match(INACTIVE_RE);
  if (!match) return undefined;
  const days = parseInt(match[1] ?? match[2], 10);
  if (!Number.isFinite(days) || days <= 0 || days > 9999) return undefined;
  return { days_until_deletion: days };
}

async function processSlug(slug) {
  const file = path.join(SERVICES_DIR, `${slug}.yml`);
  let raw;
  try {
    raw = await readFile(file, 'utf-8');
  } catch (err) {
    return { slug, skipped: true, reason: `missing file (${err.code})` };
  }

  const data = yaml.load(raw);
  const additions = {};

  if (!data.signup_friction) {
    const sf = deriveSignupFriction(data);
    if (sf) additions.signup_friction = sf;
  }
  if (!data.tos_red_flags) {
    const flags = deriveTosRedFlags(data);
    if (flags) additions.tos_red_flags = flags;
  }
  if (!data.inactive_account_policy) {
    const pol = deriveInactivePolicy(data);
    if (pol) additions.inactive_account_policy = pol;
  }

  if (Object.keys(additions).length === 0) {
    return { slug, skipped: true, reason: 'no derivable additions' };
  }

  // Merge additions into the data object, preserving key order roughly by
  // dumping the original then appending — js-yaml.dump produces stable output.
  const merged = { ...data, ...additions };
  // Re-bump date_verified to today to reflect the metadata refresh.
  const today = new Date().toISOString().slice(0, 10);
  merged.date_verified = today;

  if (DRY_RUN) {
    return { slug, additions: Object.keys(additions), dry_run: true };
  }
  const out = yaml.dump(merged, { lineWidth: 110, noRefs: true });
  await writeFile(file, out, 'utf-8');
  return { slug, additions: Object.keys(additions) };
}

async function listAllSlugs() {
  const entries = await readdir(SERVICES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.yml'))
    .map((e) => e.name.replace(/\.yml$/, ''))
    .sort();
}

async function main() {
  const slugs = RUN_ALL ? await listAllSlugs() : TOP_20;
  console.log(
    `Backfilling ${slugs.length} services${RUN_ALL ? ' (--all)' : ''}${DRY_RUN ? ' (DRY RUN)' : ''}\n`,
  );
  const results = [];
  for (const slug of slugs) {
    results.push(await processSlug(slug));
  }
  let touched = 0,
    skipped = 0,
    sf = 0,
    tos = 0,
    inact = 0;
  for (const r of results) {
    if (r.skipped) {
      if (!RUN_ALL) console.log(`· ${r.slug.padEnd(28)} skip (${r.reason})`);
      skipped++;
    } else {
      console.log(`✓ ${r.slug.padEnd(28)} ${r.additions.join(', ')}`);
      touched++;
      if (r.additions.includes('signup_friction')) sf++;
      if (r.additions.includes('tos_red_flags')) tos++;
      if (r.additions.includes('inactive_account_policy')) inact++;
    }
  }
  console.log('');
  console.log(`Touched: ${touched}  Skipped: ${skipped}`);
  console.log(
    `signup_friction added: ${sf}  tos_red_flags: ${tos}  inactive_account_policy: ${inact}`,
  );
}

main().catch((err) => {
  console.error('backfill-friction crashed:', err);
  process.exit(1);
});
