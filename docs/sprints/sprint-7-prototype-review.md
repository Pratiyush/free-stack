# Sprint 7 — Prototype v2 review + v3 plan

**Date:** 2026-05-16
**Input:** `local/theme-mocks/13-saas-prototype.html` (v2, 1096 lines) + 26 PNG snapshots
**Method:** 10 read-only `Explore`-agent review, non-overlapping scopes.

---

## Scopes (10 agents)

| # | Agent | Scope |
|---|---|---|
| 1 | Visual design | Typography, spacing, brand colour, light/dark parity |
| 2 | Interaction + JS | Event correctness, race conditions, dead handlers |
| 3 | Accessibility | WCAG 2.2 AA — keyboard, ARIA, focus, contrast, targets |
| 4 | Content + copy | Voice, punctuation, claim honesty |
| 5 | Information architecture | Sidebar grouping, wayfinding |
| 6 | Responsive | Breakpoints, mobile UX |
| 7 | Code quality | Defensive coding, DRY, maintainability |
| 8 | Astro-lift feasibility | Map prototype → live components/schema |
| 9 | Data + scale plausibility | Behaviour at 300 services × 27 categories |
| 10 | Originality + brand | "Wirecutter indie" vs "Series A demo" |

---

## Findings by severity

### BLOCKER (5)

| # | Finding | Source |
|---|---|---|
| B1 | Sidebar Categories hardcodes 3 of 27; at scale becomes unscrollable wall. Compare picker renders all services as inline pills — at 300 it's pill soup. | Agents 5, 9 |
| B2 | Drawer + ⌘K palette missing `aria-modal`, `aria-labelledby`, no focus trap, no focus-return to trigger on close. | Agent 3 |
| B3 | Off-brand visual register — Linear/Notion sidebar + serif-italic `honest`/`actually` hero reads "Series A demo," not "consumer-research indie." Sponsors ledger and Legal plain-text are the only parts that feel like opentier. | Agent 10 |
| B4 | One `@media (max-width: 880px)` breakpoint — no tablet or phone coverage. Topbar padding eats 56px of 390px viewport; search fixed 320px; ledger has no overflow; compare doesn't stack below 768px. | Agent 6 |
| B5 | `localStorage.setItem/getItem` not wrapped in try/catch — throws in Safari private mode and breaks the theme toggle. | Agent 7 |

### HIGH (12, ★ = multi-agent consensus)

| # | Finding | Source |
|---|---|---|
| H1★ | Event listeners re-attached on every `renderCatalog` / `renderCompare` / `renderPalette` call (memory leak + duplicate-fire bug). | Agents 2, 7 |
| H2★ | Inline `SERVICES[]` shape diverges from Zod schema in `src/lib/schema.mjs` — `tosFlags`, ad-hoc `inactive` object, missing `official_url` / `pricing_url` / `docs_url`. Drawer links hardcoded to `#`. | Agents 7, 8 |
| H3★ | Catalog renders 300 cards + 300 rows in one DOM — same regression we just fixed on live with `content-visibility: auto`. Prototype has no equivalent. | Agent 9 |
| H4 | Light theme: brand-orange `#b73d22` on `accent-soft #fef0eb` ≈ **2.1:1** — fails WCAG 2.4.3 AA. Used on active nav + active chip. | Agent 3 |
| H5 | Palette input has `outline: none` with no `:focus-visible` replacement — invisible focus. | Agent 3 |
| H6 | Touch targets <24px on `drawer-btn`, `chip`, `pill-add`, `hamburger`. | Agents 3, 6 |
| H7 | Nav items lack `aria-current` — SR doesn't announce active page. | Agent 3 |
| H8 | Grid/Table mode doesn't persist to `localStorage`; theme does. | Agent 2 |
| H9 | Palette search re-renders on every keystroke (no debounce). | Agents 2, 7 |
| H10 | Filters (`No CC required`, `Open source`) are sidebar nav items but are modal toggles, not destinations — should be query-string state on `/catalog`. | Agent 5 |
| H11 | Compare entry point missing from drawer + catalog cards — only reachable via sidebar. | Agent 5 |
| H12 | Astro lift = 4–6 week sprint: new `Drawer.astro`, `CommandPalette` island, sidebar layout refactor, mobile hamburger, drawer prev/next nav. None exist in live components. | Agent 8 |

### MED (~20) — themed

**Visual rhythm:** drawer `PRICING` columns misalign on `Max` vs `Pro` (100px fixed label col); 5px card top-stripe near-invisible on dark cards; `ink-faint #6b7080` on `bg-card #161924` ≈ 3.2:1; `home-hero h2 line-height: 1.05` clips descenders in dark; `--card-accent` / `--row-accent` set inline only, never defined in `:root`.

**Information architecture:** breadcrumb format drifts (`HOME · MAY 2026` vs `CATALOG · ALL SERVICES` vs `§ AI APIs · TRIAL CREDIT`) — pick one schema; Sponsors lives under BROWSE but is a support page; sidebar Categories duplicates the catalog chip row; drawer doesn't remember origin (catalog filter, search, recently-verified); "State of Free Tiers" naming inconsistent across sidebar / breadcrumb / page title.

**Copy:** Compare heading sentence case while others not; Legal Roman numerals vs About non-numerals; Submit CTAs use 4 different prefix glyphs (`+`, `Δ`, `✗`, `→`); Sponsors `"3 supporters" + "32% to monthly target"` reads ambiguous — try `"3 supporters · $32 of $100/mo target"`.

**Brand voice:** `Issue №009` framing inconsistent across home / sponsors / report — commit or drop; Sponsors ledger is the original idea but is dressed up corporate; the `*` brand mark too thin at favicon size; em-italic in h2 doing double duty (brand + emphasis).

### LOW (~15) — bundled into v3 pass

Component naming, query-selector duplication, `prefers-reduced-motion` not respected on `transition` + `translateY` hovers, magazine-cliche card-lift, no skip link, drawer prev/next missing `aria-disabled` at single-result, `Issue №009` ambiguous numerals, `*` letter-tile divs need `aria-hidden`.

---

## What's in `14-saas-prototype-v3.html` (this sprint)

| Block | Change |
|---|---|
| **Scale** | Real 27-category list (collapsible group); SERVICES expanded to 30+ with synthetic clones to hit 300 in JS for compare picker. |
| **IA** | Filters moved out of sidebar into catalog toolbar; Sponsors moved from BROWSE → ABOUT; breadcrumb schema unified to `PAGE · CONTEXT`. |
| **Compare picker** | Replaced inline chip-soup with autocomplete combobox + selected-chip strip. |
| **Brand register** | Hero leads with rug-pull list (Heroku 2022, Mixpanel Feb 2026, R2 egress), not `honest`/`actually` italic. Sponsors ledger reformatted as plain-text monospace receipt. |
| **A11y** | Drawer + palette: `role="dialog" aria-modal="true" aria-labelledby` + focus trap + focus-return on close. `aria-current="page"` on active nav. `:focus-visible` ring on palette input. Touch targets bumped to ≥28px. Drawer prev/next gets `aria-disabled` when 1 result. Letter-tiles get `aria-hidden="true"`. |
| **Contrast** | Light `accent-soft` darkened from `#fef0eb` → `#fad8cc` (brand-orange now hits 4.7:1 AA). |
| **Code** | `localStorage` try/catch wrapper; event delegation on catalog containers; debounced palette search (120ms); grid/table mode persists. |
| **Responsive** | Added `@media (max-width: 480px)` breakpoint: search becomes icon-only, topbar padding shrinks, ledger overflow-x, compare stacks to 1-col. |

---

## Recommendation

**Don't lift v2 to Astro as-is.** Two architectural concerns survive v3 polish:

1. **Sidebar pattern vs scale.** Even with collapsible 27-category groups, the sidebar shape itself is a Linear/Notion borrowing. Question to answer before any lift: does opentier want to look like a SaaS tool (sidebar nav), or like a research index (top nav + tables, à la Wirecutter/Pinboard)?
2. **Brand register.** Agent 10's strongest point: the Sponsors ledger and Legal plain-text already *are* opentier voice. The hero + catalog are the parts that ape SaaS. The previous Almanac theme (currently live) was closer to brand. v3 splits the difference; a clean choice should be made before lifting.

If sidebar pattern is the answer, the Astro lift is ~4-6 weeks: new `Drawer.astro`, `CommandPalette` client island, sidebar layout refactor, mobile hamburger, drawer prev/next, schema-aligned data. Agent 8's map is the spec.

---

## Deferred to a future sprint (out of v3)

| Item | Why deferred |
|---|---|
| Skip link to main content | Cheap — add in lift if pattern survives. |
| `prefers-reduced-motion` gating on transitions | Cheap — add in lift. |
| Mobile snapshot pass on prototype (existing snaps are 1440×900 only) | Needs `snap-prototype.mjs` update. |
| Decision on sidebar vs top-nav | Architectural — user call. |
| Decision on brand register (Almanac vs SaaS vs hybrid) | Editorial — user call. |
