# Sprint 4 — `v0.8.0` "Editorial Polish"

> **Source of truth.** Drawn from the 10-agent design review of `ref/` on 2026-05-15. Replaces the Sprint-4 stub in `~/.claude/plans/and-get-ignore-and-cozy-frog.md`.

**Owner:** Pratiyush  **Branch base:** `rebuild/astro`  **Tag on completion:** `v0.8.0`  **Generated:** 2026-05-15

---

## Sprint goal

The v0.5.0 site is functionally complete but visually reserved. v0.8.0 makes it *sing* — periodic-table card treatment, editorial chrome (Issue №, dateline, roman-numeral section dividers), drawer-as-route SEO migration, real `/compare` page, and filter cleanup.

## Locked decisions (from 2026-05-15)

- **Drawer → route** (`/service/[slug]` via View Transitions API). Overlay drawer becomes progressive-enhancement nicety, not the canonical surface.
- **Periodic-table hero on homepage**: full reveal-on-hover wall of brand-colored logos. Replaces the current stats grid.
- **Italic Fraunces in pricing**: Free row only, brand-color tint. Other rows stay neutral.
- **Issue №**: global across site, tied to release version (e.g. Issue №005 = v0.5.0, Issue №008 = v0.8.0).
- **Dashboard view**: deferred to v1.0+.

## Stories

| # | Story | Effort | Owner | Status |
|---|---|---|---|---|
| 4.1 | **Card library v2 — periodic-table treatment** | M | editorial-designer + astro-implementer | ⏳ in flight |
| 4.2 | **Almanac chrome on service detail** (Issue №, dateline, roman-numerals, italic Fraunces Free row) | S | astro-implementer | ⏸ pending |
| 4.3 | **Homepage hero rebuild** — paper-cream + radial tints + wall-of-logos preview grid | M | editorial-designer + astro-implementer | ⏸ pending |
| 4.4 | **Drawer-as-route migration** — `/service/[slug]` becomes canonical; View Transitions API; hash-sync ported from `ref/design-experiments/combined-v3.html` | L | astro-tech-lead + astro-implementer | ⏸ pending |
| 4.5 | **`/compare?slugs=…` real route** — sortable columns, `<details>` accordion per subcategory | M | astro-implementer | ⏸ pending |
| 4.6 | **Filter chip cluster cleanup + sticky-scroll** — collapse "Requires" into chip row, restore `__all` reset chip, live category counts, sticky-with-shadow on scroll | S | astro-implementer | ⏸ pending |

Plus the standard release-engineering items (Sprint 4 §10 — Playwright pricing-drift upgrade is its own track, run by `site-verifier`).

## Card library v2 spec (story 4.1)

Drawn from combined-v4 `isMonochrome()` + freestack-full per-card CSS vars + v3-brief S1–S7 + dashboard.html chevron pattern.

**Visual:**
- 4px brand-color accent head-band at the top of every card (not left, like today).
- Tinted hero zone — `color-mix(in oklch, var(--brand) 9%, var(--color-paper-warm))` background for the logo + name area.
- Logo in a white-framed inset (16px logo on 32px white square with `box-shadow: inset 0 0 0 1px var(--color-rule)`).
- Saturation floor for monochrome brands (Vercel black, Resend black) — `oklch(from var(--brand) l max(c, 0.06) h)` so they don't disappear.
- Hanging em-dash bullets in free-tier list (`text-indent: -1.4em` + `::before: '— '`).
- Card serial number top-right (e.g. `№ 042 / AI`), JetBrains Mono, ink-faint.
- Tier badge (always-free / free-plan / trial-credit / pay-as-you-go) bottom-left in tier-color pill.
- "No CC" pill ONLY when `cc_required: true` — merged into the tier badge row, not standalone.

**States:**
- default: 1px border, brand head-band visible
- hover: border-color darken (no translate, no shadow change); brand head-band stays
- focus-visible (kbd): coral 2px outline + 1px inner offset; head-band stays
- selected (in compare): coral border + ★ in top-right corner

**Drop:**
- `transform: translateY(-2px)` on hover (jittery)
- summary text that duplicates the keyfact pill number
- the standalone "No CC" pill on every card

## Almanac chrome spec (story 4.2)

- **Service detail header:** small monospace `§ <CATEGORY> · № <SERIAL>` above the service name (e.g. `§ AI APIS · № 042`).
- **Dateline rule:** under the name, JetBrains Mono uppercase `VERIFIED MAY 15, 2026 · ADDED MAY 1, 2026` with a 1px border above.
- **Roman-numeral section dividers** between sections: `i. Free tier`, `ii. Pricing`, `iii. Limits & notes`, `iv. Sources`. Italic Fraunces 1.15rem.
- **Italic Fraunces brand-color Free row** in the pricing table (only the row where `name === 'Free'`).
- **Footnote-style sources** at the bottom: each `sources` entry gets a numbered footnote with the URL + verified date.

## Drawer-as-route spec (story 4.4)

- Card click → `<a href="/service/<slug>">` with `transition:name="card-<slug>"` (View Transitions API).
- Service detail page becomes the canonical drawer view.
- Hash-sync on the catalog page tracks scroll position so back-button returns to the exact card.
- Compare-bar pin button becomes `<a href="/compare?slugs=...">` (no JS modal needed).
- Overlay drawer remains as progressive-enhancement nicety for users with JS (intercepts the link, shows the same content in-overlay); falls back gracefully to the route.

## `/compare?slugs=…` spec (story 4.5)

- Real Astro route at `src/pages/compare.astro`.
- Reads `slugs` from URL search params (max 4 services).
- Renders a sortable table with click-to-sort indicators (↑↓ in coral, JetBrains Mono).
- `<details>` accordion per facet group (Quota / Capabilities / Restrictions / Trial info / Ops).
- Shareable URL — works without JS.
- 404 if any slug isn't found.

## Out of scope for v0.8.0

- Dashboard view (deferred to v1.0)
- Newsletter signup block
- UTM tracking on outbound links (intentional privacy choice)
- Cloudflare Pages migration (Sprint 5)
- Production cut-over (story 3.13, deferred)
- Playwright pricing-drift upgrade — separate track owned by `site-verifier`

## Verification per story

1. `pnpm validate && pnpm audit-services --no-http && pnpm build` green.
2. Visual smoke at `http://localhost:4321/` against the spec.
3. `site-verifier` agent runs the keyboard / accessibility / responsive checklist before sign-off.
4. Story-level commit + cherry-pick onto `rebuild/astro`.

## Tag-time gates

- All 6 stories merged.
- `pnpm lint && pnpm validate && pnpm check-logos && pnpm audit-services --no-http && pnpm build` green.
- `CHANGELOG.md` `[Unreleased]` rolled to `[0.8.0] - YYYY-MM-DD`.
- `release-notes/v0.8.0.md` written by maintainer.
- Tag pushed + GitHub Release published.
