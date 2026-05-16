/**
 * Theme constants shared across components and pages.
 *
 * Centralising the fallback brand color avoids the v0.9.0 drift where five
 * files independently hard-coded `'#1a1a1a'` and would have to be edited in
 * lockstep when the placeholder convention changes.
 */

/** Default accent for services that ship without a `brand_color`. */
export const FALLBACK_BRAND_COLOR = '#1a1a1a';

/** Sentinel `brand_color` used by the bulk-logo pipeline when no real
 *  brand color could be sourced — surfaced by `--strict` audits and skipped
 *  from the periodic-table wall. */
export const PLACEHOLDER_BRAND_COLOR = '#888888';
