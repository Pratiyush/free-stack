#!/usr/bin/env node
/**
 * backfill-facets-tags.mjs
 *
 * Stories 5.4 + 5.5 — Programmatically derive `facets` and `tags` for every
 * service YAML from existing fields (free_tier bullets, summary, category,
 * pricing, tier_type, notes). NO web fetching, NO LLM — pure regex + heuristics.
 *
 * Usage:  node scripts/backfill-facets-tags.mjs [--dry-run]
 *
 *   --dry-run   Print what would change but do not write files.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const DRY_RUN = process.argv.includes('--dry-run');

const SERVICES_DIR = path.resolve('src/content/services');
const TODAY = '2026-05-16'; // currentDate from env context

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip thousands-separator commas and parse as float. */
function parseNum(s) {
  return parseFloat(String(s).replace(/,/g, ''));
}

/** Flatten all text fields that carry free-tier information into one array. */
function collectBullets(svc) {
  const bullets = [];
  if (Array.isArray(svc.free_tier)) bullets.push(...svc.free_tier.map(String));
  if (svc.summary) bullets.push(String(svc.summary));
  if (svc.notes) bullets.push(String(svc.notes));
  return bullets;
}

/** Run regex against every bullet; return first numeric capture or null. */
function extractFirst(bullets, re) {
  for (const b of bullets) {
    const m = b.match(re);
    if (m) return m[1];
  }
  return null;
}

// ---------------------------------------------------------------------------
// FACET DERIVATION
// ---------------------------------------------------------------------------

/**
 * Derive a facets object from a service record.
 * Returns only the keys that could be determined — caller merges with existing.
 */
function deriveFacets(svc) {
  const derived = {};
  const bullets = collectBullets(svc);
  const allText = bullets.join(' ');
  const summaryLower = (svc.summary || '').toLowerCase();
  const notesLower = (svc.notes || '').toLowerCase();
  const freeTierText = Array.isArray(svc.free_tier)
    ? svc.free_tier.join(' ').toLowerCase()
    : '';

  // --- cc_required -------------------------------------------------------
  // Positive signal: "credit card required" / "CC required" / "requires CC"
  const ccRequired =
    /credit card required|CC required|requires credit card|requires a credit card/i.test(allText);
  // Negative signal: "no credit card" / "without credit card" / "no CC"
  const ccNotRequired =
    /no credit card|without credit card|no CC|credit-card-free|does not require.*credit/i.test(
      allText,
    );

  if (ccRequired && !ccNotRequired) {
    derived.cc_required = true;
  } else if (ccNotRequired && !ccRequired) {
    derived.cc_required = false;
  }

  // --- oss ---------------------------------------------------------------
  const ossSignals =
    /open[- ]source|AGPL|Apache 2|MIT license|BSD license|GPL v[23]|open source self.hosted/i;
  if (ossSignals.test(allText)) {
    derived.oss = true;
  }

  // --- self_host ---------------------------------------------------------
  const selfHostSignals =
    /self[- ]host|self_host|Docker image|docker.io|on.premises|on-prem|run your own|deploy yourself/i;
  if (selfHostSignals.test(allText)) {
    derived.self_host = true;
  }

  // --- storage_gb --------------------------------------------------------
  // Two-pass approach:
  // Pass 1: tight match — GB immediately adjacent to storage/disk keyword
  //         e.g. "2 GB storage", "5 GB of storage", "10 GB disk"
  // Pass 2: loose match — GB appears in a bullet that contains the word storage
  //         e.g. "5 GB S3 Standard storage (12 months only)"
  // Explicitly exclude "data transfer" and "bandwidth" bullets.
  // Exclude bullets that are about bandwidth/egress/transfer/ingest/RAM
  const storageBullets = bullets.filter(
    (b) => !/data transfer|bandwidth|egress|ingress|ingest|\bRAM\b|\bram\b/i.test(b),
  );
  let storageMatch = extractFirst(
    storageBullets,
    /(\d+(?:\.\d+)?)\s*GB\s*(?:of\s+)?(?:storage|disk)\b/i,
  );
  if (storageMatch === null) {
    // Loose pass: find a bullet with "GB" AND "storage" keyword (but not excluded topics)
    const looseBullet = storageBullets.find(
      (b) => /\d+(?:\.\d+)?\s*GB/i.test(b) && /\bstorage\b/i.test(b),
    );
    if (looseBullet) {
      const m = looseBullet.match(/(\d+(?:\.\d+)?)\s*GB/i);
      if (m) storageMatch = m[1];
    }
  }
  if (storageMatch !== null) {
    derived.storage_gb = parseNum(storageMatch);
  }

  // --- bandwidth_gb_month -----------------------------------------------
  // Matches: "5 GB bandwidth", "100 GB of bandwidth", "100 GB data transfer", "20 GB egress"
  const bwMatch = extractFirst(
    bullets,
    /(\d+(?:\.\d+)?)\s*(?:GB|TB)\s*(?:of\s+)?(?:bandwidth|data transfer|egress)\b/i,
  );
  if (bwMatch !== null) {
    derived.bandwidth_gb_month = parseNum(bwMatch);
  }

  // --- requests_per_day -------------------------------------------------
  // Matches: "14.4K requests/day", "500 API calls per day", "14,400 requests/day"
  const rpdRaw = extractFirst(
    bullets,
    /(\d+(?:[,.]?\d+)*[Kk]?)\s*(?:requests?|API calls?)\s*(?:per\s+|\/)\s*day\b/i,
  );
  if (rpdRaw !== null) {
    let val = rpdRaw.replace(/,/g, '');
    if (/k$/i.test(val)) val = parseFloat(val) * 1000;
    else val = parseFloat(val);
    derived.requests_per_day = Math.round(val);
  }

  // --- requests_per_month -----------------------------------------------
  // Matches: "6M messages/month", "10K search requests/month", "1M API calls/month"
  const rpmRaw = extractFirst(
    bullets,
    /(\d+(?:[,.]?\d+)*[KkMm]?)\s*(?:messages?|requests?|API calls?|searches?)\s*(?:per\s+|\/)\s*month\b/i,
  );
  if (rpmRaw !== null) {
    let val = rpmRaw.replace(/,/g, '');
    if (/m$/i.test(val)) val = parseFloat(val) * 1_000_000;
    else if (/k$/i.test(val)) val = parseFloat(val) * 1_000;
    else val = parseFloat(val);
    derived.requests_per_month = Math.round(val);
  }

  // --- team_seats (the schema field is team_seats, not seats) -----------
  // Matches: "2 seats", "5 users", "3 team members", "10 collaborators"
  const seatsMatch = extractFirst(
    bullets,
    /(\d+)\s*(?:seats|users|team\s*members|collaborators)\b/i,
  );
  if (seatsMatch !== null) {
    derived.team_seats = parseInt(seatsMatch, 10);
  }

  // --- trial_days -------------------------------------------------------
  // Only for trial-credit tier_type
  if (svc.tier_type === 'trial-credit') {
    const trialMatch = extractFirst(
      bullets,
      /(\d+)\s*[- ]?day\s*(?:free\s*)?trial\b/i,
    );
    if (trialMatch !== null) {
      derived.trial_days = parseInt(trialMatch, 10);
    }
  }

  // --- credit_usd -------------------------------------------------------
  // Only for trial-credit tier_type
  if (svc.tier_type === 'trial-credit') {
    // Matches: "$5 credit", "$200 free credit", "$300 sign-up bonus"
    const creditMatch = extractFirst(
      bullets,
      /\$(\d+(?:[,.]?\d+)?)\s*(?:free\s+)?(?:credit|credits|sign[- ]?up\s+bonus)\b/i,
    );
    if (creditMatch !== null) {
      derived.credit_usd = parseNum(creditMatch);
    }
  }

  return derived;
}

// ---------------------------------------------------------------------------
// TAG DERIVATION
// ---------------------------------------------------------------------------

/** Category → sensible extra tag mappings */
const CATEGORY_EXTRA_TAGS = {
  'ai-apis': ['ai', 'api'],
  analytics: ['analytics'],
  auth: ['auth', 'identity'],
  baas: ['backend-as-a-service'],
  'code-quality': ['code-quality', 'ci-cd'],
  collaboration: ['collaboration'],
  communication: ['communication'],
  containers: ['containers', 'docker'],
  databases: ['database'],
  design: ['design'],
  'dev-tools': ['dev-tools'],
  dns: ['dns'],
  documentation: ['docs'],
  email: ['email'],
  hosting: ['hosting'],
  iaas: ['cloud', 'infrastructure'],
  logs: ['logging', 'observability'],
  maps: ['maps', 'geolocation'],
  mobile: ['mobile'],
  paas: ['paas', 'platform'],
  payments: ['payments'],
  'project-management': ['project-management'],
  search: ['search'],
  security: ['security'],
  storage: ['storage'],
  testing: ['testing'],
  translation: ['translation', 'i18n'],
};

/**
 * Derive tags array from a service record (after facets are already computed).
 * Caller merges with existing tags and dedupes.
 */
function deriveTags(svc, derivedFacets) {
  const tags = new Set();
  const allText = collectBullets(svc).join(' ');
  const summaryLower = (svc.summary || '').toLowerCase();
  const freeTierLower = Array.isArray(svc.free_tier)
    ? svc.free_tier.join(' ').toLowerCase()
    : '';

  // 1. Category as tag
  if (svc.category) tags.add(svc.category);

  // 2. Subcategory as tag
  if (svc.subcategory) tags.add(svc.subcategory);

  // 3. tier_type as tag
  if (svc.tier_type) tags.add(svc.tier_type);

  // 4. Category-specific extras
  const extras = CATEGORY_EXTRA_TAGS[svc.category] || [];
  for (const t of extras) tags.add(t);

  // 5. oss / self-host from derived facets
  if (derivedFacets.oss === true) tags.add('open-source');
  if (derivedFacets.self_host === true) tags.add('self-host');

  // 6. serverless
  if (/serverless|edge function|lambda/i.test(allText)) {
    tags.add('serverless');
  }

  // 7. realtime
  if (/real[- ]?time|websocket|live\b/i.test(summaryLower + ' ' + freeTierLower)) {
    tags.add('realtime');
  }

  // 8. ai — already covered by category extra, but also catch summary mentions
  if (svc.category === 'ai-apis' || /\bLLM\b|GPT|embedding/i.test(allText)) {
    tags.add('ai');
  }

  // 9. api — if the service is API-accessible
  if (/\bAPI\b/.test(allText)) {
    tags.add('api');
  }

  return tags;
}

// ---------------------------------------------------------------------------
// MERGE HELPERS
// ---------------------------------------------------------------------------

/**
 * Merge derived facets into existing facets.
 * Existing explicit values are NEVER overwritten.
 */
function mergeFacets(existing, derived) {
  const merged = { ...(existing || {}) };
  for (const [k, v] of Object.entries(derived)) {
    if (!(k in merged) || merged[k] === undefined || merged[k] === null) {
      merged[k] = v;
    }
  }
  return merged;
}

/**
 * Merge derived tags into existing tags. Dedupe, keep ≤ 8, kebab-case.
 * Existing tags take precedence (they're added first).
 */
function mergeTags(existing, derived) {
  const seen = new Set();
  const result = [];

  // Existing tags first
  for (const t of existing || []) {
    const normalized = t.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  // Then derived tags
  for (const t of derived) {
    const normalized = t.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(normalized) && result.length < 8) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// YAML SERIALISATION
// ---------------------------------------------------------------------------

/**
 * Serialize a service object back to YAML.
 *
 * js-yaml dump options:
 *   - lineWidth: -1 keeps long lines intact (no mid-value wrapping)
 *   - quotingType: '"' matches the style already used in the files
 *   - forceQuotes: false — only quote when necessary
 *   - noRefs: true — no YAML aliases
 */
function dumpYaml(obj) {
  return yaml.dump(obj, {
    lineWidth: -1,
    quotingType: "'",
    forceQuotes: false,
    noRefs: true,
    indent: 2,
  });
}

// ---------------------------------------------------------------------------
// CANONICAL FIELD ORDER
// ---------------------------------------------------------------------------

/** Reorder keys to match the canonical YAML style used in the project. */
const FIELD_ORDER = [
  'name',
  'slug',
  'category',
  'subcategory',
  'brand_color',
  'logo',
  'summary',
  'notes',
  'tier_type',
  'free_tier',
  'paid_tier_highlights',
  'pricing',
  'tags',
  'official_url',
  'pricing_url',
  'docs_url',
  'facets',
  'sources',
  'date_added',
  'date_updated',
  'date_verified',
  'last_changed',
  'maintainer_notes',
  'submitted_by',
];

function reorder(obj) {
  const ordered = {};
  for (const key of FIELD_ORDER) {
    if (key in obj) ordered[key] = obj[key];
  }
  // Any keys not in the canonical list go at the end
  for (const key of Object.keys(obj)) {
    if (!(key in ordered)) ordered[key] = obj[key];
  }
  return ordered;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  const entries = (await readdir(SERVICES_DIR, { withFileTypes: true }))
    .filter((e) => e.isFile() && /\.ya?ml$/.test(e.name))
    .map((e) => path.join(SERVICES_DIR, e.name));

  let updatedCount = 0;
  let totalNewFacetKeys = 0;
  let totalNewTags = 0;
  let emptyFacetsCount = 0;
  const emptyFacetSlugs = [];
  const errors = [];

  console.log(`Processing ${entries.length} service files...\n`);

  for (const filePath of entries) {
    const raw = await readFile(filePath, 'utf-8');
    let svc;
    try {
      // Use JSON_SCHEMA to prevent js-yaml from auto-converting YYYY-MM-DD
      // strings to Date objects (which then serialise as ISO timestamps).
      svc = yaml.load(raw, { schema: yaml.JSON_SCHEMA });
    } catch (err) {
      errors.push(`${path.basename(filePath)}: YAML parse error: ${err.message}`);
      continue;
    }

    if (!svc || typeof svc !== 'object') {
      errors.push(`${path.basename(filePath)}: unexpected non-object YAML`);
      continue;
    }

    const originalFacets = svc.facets ? { ...svc.facets } : undefined;
    const originalTags = svc.tags ? [...(svc.tags || [])] : [];

    // 1. Derive
    const derivedFacets = deriveFacets(svc);
    const derivedTags = deriveTags(svc, {
      ...(svc.facets || {}),
      ...derivedFacets,
    });

    // 2. Merge facets
    const mergedFacets = mergeFacets(svc.facets, derivedFacets);
    const newFacetKeys =
      Object.keys(mergedFacets).length - Object.keys(svc.facets || {}).length;

    // 3. Merge tags
    const mergedTags = mergeTags(svc.tags, derivedTags);
    const newTagCount = mergedTags.length - (svc.tags || []).length;

    // 4. Track empty facets
    if (Object.keys(mergedFacets).length === 0) {
      emptyFacetsCount++;
      emptyFacetSlugs.push(svc.slug || path.basename(filePath, '.yml'));
    }

    // 5. Detect actual changes
    const facetsChanged =
      JSON.stringify(mergedFacets) !== JSON.stringify(svc.facets || {});
    const tagsChanged = JSON.stringify(mergedTags) !== JSON.stringify(svc.tags || []);
    const changed = facetsChanged || tagsChanged;

    if (!changed) continue;

    // 6. Apply changes
    svc.facets = mergedFacets;
    svc.tags = mergedTags;
    if (changed) {
      svc.date_updated = TODAY;
      // date_verified: bump only if facets or tags actually changed
      svc.date_verified = TODAY;
    }

    // 7. Re-order fields
    const reordered = reorder(svc);

    // 8. Serialise
    const newYaml = dumpYaml(reordered);

    if (DRY_RUN) {
      console.log(`[dry-run] Would update: ${path.basename(filePath)}`);
      console.log(`  facets keys added: ${newFacetKeys}`);
      console.log(`  tags added:        ${newTagCount}`);
    } else {
      await writeFile(filePath, newYaml, 'utf-8');
    }

    updatedCount++;
    totalNewFacetKeys += Math.max(0, newFacetKeys);
    totalNewTags += Math.max(0, newTagCount);
  }

  // ---------------------------------------------------------------------------
  // Summary report
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('BACKFILL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Services processed:          ${entries.length}`);
  console.log(`Services updated:            ${updatedCount}`);
  console.log(`New facet key assignments:   ${totalNewFacetKeys}`);
  console.log(`New tag entries:             ${totalNewTags}`);
  console.log(`Services with empty facets:  ${emptyFacetsCount}`);

  if (emptyFacetSlugs.length > 0 && emptyFacetSlugs.length <= 30) {
    console.log('\nSlugs with empty facets (no quantifiable data extracted):');
    for (const slug of emptyFacetSlugs) {
      console.log(`  - ${slug}`);
    }
  } else if (emptyFacetSlugs.length > 30) {
    console.log(
      `\n(${emptyFacetSlugs.length} slugs with empty facets — list omitted for brevity)`,
    );
  }

  if (errors.length > 0) {
    console.log('\nERRORS:');
    for (const e of errors) console.error(`  ! ${e}`);
  }

  if (DRY_RUN) {
    console.log('\n[dry-run mode — no files were written]');
  }

  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
