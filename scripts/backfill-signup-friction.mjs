#!/usr/bin/env node
/**
 * backfill-signup-friction.mjs
 *
 * Task #105 — Backfill `signup_friction` block across the catalog.
 * Derives values from existing YAML fields (no web fetches).
 *
 * Derivation rules:
 * 1. requires_cc  — from facets.cc_required, or notes/free_tier text patterns
 * 2. phone_verification — from notes/free_tier text patterns
 * 3. github_gate  — from notes text patterns
 * 4. email_confirmation — from notes text patterns
 * 5. Default fill — if no rules fire and tier_type is free-plan/always-free/free-tier,
 *    set { requires_cc: false }
 *
 * Idempotent: existing signup_friction values are preserved (merged, not overwritten).
 * date_verified is bumped to today ONLY when signup_friction is added/changed.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const TODAY = '2026-05-16';
const SERVICES_DIR =
  '/Users/deepshikhasingh/Desktop/2026/production/free-stack/src/content/services';

// ── Pattern constants ──────────────────────────────────────────────────────────
// IMPORTANT: must match "credit card required" but NOT "no credit card required".
// Use negative lookbehind to exclude "no " before the phrase.
const CC_REQUIRED_PATTERN = /(?<!no )(credit card required|cc required)/i;
const CC_NOT_REQUIRED_PATTERN = /no credit card|no cc required/i;
const PHONE_PATTERN = /phone verification|sms verification|phone number required/i;
const GITHUB_GATE_PATTERN = /github login|github oauth|github only|sign in with github/i;
const GITHUB_NOT_REQUIRED = /no github required|no signup required/i;
const EMAIL_CONFIRM_PATTERN = /email confirmation|verify.*email|confirm.*email/i;

// Tier types that qualify for the default fill (rule 5)
const DEFAULT_FILL_TIERS = new Set(['free-plan', 'always-free']);

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Collect all text from notes + free_tier bullets into a single string */
function collectText(doc) {
  const parts = [];
  if (doc.notes) parts.push(doc.notes);
  if (Array.isArray(doc.free_tier)) parts.push(...doc.free_tier);
  return parts.join('\n');
}

/**
 * Derive signup_friction fields from a parsed YAML document.
 * Returns { derived: {}, rulesFired: string[] }.
 * derived only contains fields where a rule actually fired.
 */
function deriveSignupFriction(doc) {
  const derived = {};
  const rulesFired = [];

  const notesText = doc.notes || '';
  const combinedText = collectText(doc);

  // ── Rule 1: requires_cc ──────────────────────────────────────────────────────
  // Order matters: check facets first, then text patterns.
  // For text patterns, check CC_NOT_REQUIRED first to avoid false positives
  // where "credit card required" is a substring of "no credit card required".
  const facetCC = doc.facets?.cc_required;
  if (facetCC === true) {
    derived.requires_cc = true;
    rulesFired.push('requires_cc=true (facets.cc_required)');
  } else if (facetCC === false) {
    derived.requires_cc = false;
    rulesFired.push('requires_cc=false (facets.cc_required)');
  } else if (CC_NOT_REQUIRED_PATTERN.test(combinedText)) {
    // "no credit card" pattern takes priority over CC_REQUIRED to avoid false positives
    derived.requires_cc = false;
    rulesFired.push('requires_cc=false (text pattern: no credit card)');
  } else if (CC_REQUIRED_PATTERN.test(combinedText)) {
    derived.requires_cc = true;
    rulesFired.push('requires_cc=true (text pattern)');
  }

  // ── Rule 2: phone_verification ───────────────────────────────────────────────
  if (PHONE_PATTERN.test(combinedText)) {
    derived.phone_verification = true;
    rulesFired.push('phone_verification=true (text pattern)');
  }

  // ── Rule 3: github_gate ──────────────────────────────────────────────────────
  if (GITHUB_GATE_PATTERN.test(notesText)) {
    derived.github_gate = true;
    rulesFired.push('github_gate=true (text pattern)');
  } else if (GITHUB_NOT_REQUIRED.test(notesText)) {
    derived.github_gate = false;
    rulesFired.push('github_gate=false (text pattern)');
  }

  // ── Rule 4: email_confirmation ───────────────────────────────────────────────
  if (EMAIL_CONFIRM_PATTERN.test(notesText)) {
    derived.email_confirmation = true;
    rulesFired.push('email_confirmation=true (text pattern)');
  }

  // ── Rule 5: default fill ─────────────────────────────────────────────────────
  // Fire only when NO rules above fired (derived is empty) and tier qualifies
  if (Object.keys(derived).length === 0 && DEFAULT_FILL_TIERS.has(doc.tier_type)) {
    derived.requires_cc = false;
    rulesFired.push('requires_cc=false (default fill — free-plan/always-free)');
  }

  return { derived, rulesFired };
}

/**
 * Merge derived fields into existing signup_friction, respecting "don't overwrite" rule.
 * Returns { merged, changed }.
 */
function mergeSignupFriction(existing, derived) {
  const merged = { ...(existing || {}) };
  let changed = false;

  for (const [key, value] of Object.entries(derived)) {
    if (!(key in merged)) {
      merged[key] = value;
      changed = true;
    }
    // If key already exists, leave it as-is
  }

  return { merged, changed };
}

/**
 * Reserialize a YAML document preserving structure.
 * We use dump with specific options to keep things tidy.
 */
function dumpYaml(doc) {
  return yaml.dump(doc, {
    lineWidth: 120,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
    // Keep dates as plain strings (they come in as Date objects from yaml.load)
    replacer: (key, value) => {
      if (value instanceof Date) {
        // Preserve ISO date strings
        return value.toISOString().split('T')[0];
      }
      return value;
    },
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────

const files = readdirSync(SERVICES_DIR)
  .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
  .sort();

const stats = {
  total: files.length,
  touched: 0,
  skipped: 0,
  alreadyHadAll: 0,
  distribution: {
    requires_cc_true: 0,
    requires_cc_false: 0,
    phone_verification_true: 0,
    github_gate_true: 0,
    github_gate_false: 0,
    email_confirmation_true: 0,
    default_fill: 0,
  },
  nontrivialExamples: [],
};

const log = [];

for (const file of files) {
  const filePath = join(SERVICES_DIR, file);
  const raw = readFileSync(filePath, 'utf-8');

  let doc;
  try {
    doc = yaml.load(raw);
  } catch (err) {
    console.error(`PARSE ERROR in ${file}: ${err.message}`);
    continue;
  }

  const { derived, rulesFired } = deriveSignupFriction(doc);

  // If no rules fired at all, skip
  if (Object.keys(derived).length === 0) {
    stats.skipped++;
    log.push(`SKIP  ${file} — no rules fired (tier_type: ${doc.tier_type})`);
    continue;
  }

  const existing = doc.signup_friction;
  const { merged, changed } = mergeSignupFriction(existing, derived);

  if (!changed) {
    stats.alreadyHadAll++;
    log.push(`NOOP  ${file} — all derived fields already set`);
    continue;
  }

  // Apply changes
  doc.signup_friction = merged;
  doc.date_verified = TODAY;
  if (!doc.date_updated) doc.date_updated = TODAY;
  else doc.date_updated = TODAY;

  // Update distribution stats
  const isDefault = rulesFired.some((r) => r.includes('default fill'));
  if (isDefault) stats.distribution.default_fill++;
  if ('requires_cc' in merged) {
    if (merged.requires_cc) stats.distribution.requires_cc_true++;
    else stats.distribution.requires_cc_false++;
  }
  if (merged.phone_verification === true) stats.distribution.phone_verification_true++;
  if ('github_gate' in merged) {
    if (merged.github_gate) stats.distribution.github_gate_true++;
    else stats.distribution.github_gate_false++;
  }
  if (merged.email_confirmation === true) stats.distribution.email_confirmation_true++;

  // Track non-trivial examples (any rule other than just default fill)
  const isNonTrivial = rulesFired.some((r) => !r.includes('default fill'));
  if (isNonTrivial && stats.nontrivialExamples.length < 10) {
    stats.nontrivialExamples.push({ file, rules: rulesFired, merged });
  }

  // Serialize and write
  const serialized = dumpYaml(doc);
  writeFileSync(filePath, serialized, 'utf-8');

  stats.touched++;
  log.push(`WRITE ${file} — rules: [${rulesFired.join('; ')}]`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n=== backfill-signup-friction summary ===');
console.log(`Total files  : ${stats.total}`);
console.log(`Touched      : ${stats.touched}`);
console.log(`Skipped      : ${stats.skipped} (no rules fired)`);
console.log(`Already set  : ${stats.alreadyHadAll} (all derived fields already present)`);
console.log('');
console.log('=== Distribution of derived fields ===');
console.log(`  requires_cc: false   = ${stats.distribution.requires_cc_false}`);
console.log(`  requires_cc: true    = ${stats.distribution.requires_cc_true}`);
console.log(`  phone_verification   = ${stats.distribution.phone_verification_true}`);
console.log(`  github_gate: true    = ${stats.distribution.github_gate_true}`);
console.log(`  github_gate: false   = ${stats.distribution.github_gate_false}`);
console.log(`  email_confirmation   = ${stats.distribution.email_confirmation_true}`);
console.log(`  (via default fill)   = ${stats.distribution.default_fill}`);
console.log('');
console.log('=== Non-trivial derivations (up to 10) ===');
for (const ex of stats.nontrivialExamples) {
  console.log(`  ${ex.file}`);
  console.log(`    rules : ${ex.rules.join('; ')}`);
  console.log(`    result: ${JSON.stringify(ex.merged)}`);
}
console.log('');
console.log('=== Per-file log ===');
for (const line of log) {
  console.log(line);
}
