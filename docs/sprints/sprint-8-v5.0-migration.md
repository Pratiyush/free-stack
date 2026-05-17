# Sprint 8 — v5.0 migration plan: live Astro site → v3 prototype design

**Date:** 2026-05-16
**Inputs:**
- Live Astro v4.0 site (master, deployed to GitHub Pages at `pratiyush.github.io/opentier/`)
- v3 prototype: `local/theme-mocks/14-saas-prototype-v3.html` + 52 PNG snapshots
- Round-1 + Round-2 prototype reviews: `docs/sprints/sprint-7-prototype-review.md`

**Verdict from round-2 review:** v3 is a viable design target but lands "closer to Series A than Wirecutter" — the sidebar pattern + receipt aesthetic are well-executed *templates*, not opentier-original. Migration recommendation: ship the architecture (sidebar + drawer + palette + combobox + 27 categories) as v5.0; defer the brand-register call to a v5.1 polish pass once we see real content in the real shell.

---

## Side-by-side: live v4.0 vs v3 prototype

| Area | Live v4.0 (current) | v3 prototype (target) | Delta |
|---|---|---|---|
| **Top-level layout** | Top header nav (logo + 5-6 links) | 240px left sidebar (4 groups × 4-6 items) | Full layout refactor |
| **Theme** | Light only | Light + dark + system, via `[data-theme]` | New: dark CSS + theme toggle |
| **Service detail** | `/service/[slug]` full page route | Right-slide drawer overlay | Drawer.astro new; `/service/[slug]` becomes deep-link fallback |
| **Categories** | Top-of-catalog dropdown + chip row | 27-cat scrollable group in sidebar + 5 quick-chips + ⌘K | CategorySidebar new |
| **Search** | None on most pages | ⌘K command palette indexes 300 services + 10 pages | CommandPalette new |
| **Compare** | `/compare?a=X&b=Y` URL-driven, 2 services | Autocomplete combobox, up to 4, in-page state | CompareCombobox new |
| **Filters** | `cc_required` + `oss` checkboxes in catalog toolbar | Same — already in v4.0 ✓ | No change |
| **Tokens** | Minimal — FALLBACK_BRAND_COLOR in `theme.ts` | ~24 CSS custom properties (bg/ink/accent/rule/shadow/font + dark variants) | Token system expansion |
| **Mobile breakpoint** | One implicit @768 from Astro defaults | Explicit @880 + @480 with hamburger off-canvas | Need component-level media queries |
| **Home hero** | Almanac-style serif h2 over stats grid | Rugpull-receipt panel + receipt-style proof above stats | Re-layout `index.astro` |
| **Sponsors ledger** | Already shipped in v4.0 (Day 2) | Plain-text monospace receipt with dashed dividers | Re-style `/sponsors` |
| **Lazy-render** | `content-visibility: auto` on all cards | Paged 60-at-a-time + scroll listener | Keep v4.0's CV strategy (simpler) |
| **A11y modals** | N/A (no modals) | aria-modal + focus-trap + focus-return + inert background | Bring `focus-trap` npm into Drawer + Palette |
| **Keyboard** | Tab-navigable only | ⌘K, Esc, J/K in drawer, ↑↓ Enter in palette/combobox | Global keyboard hook |
| **URL state** | Server-routed pages | Hash-based view + service deep-links (`#service=slug`) | Keep server routes; add hash listener for deep-link drawer |

---

## File-by-file mapping

### Files to create (new components / pages)

| New file | Source from prototype | Effort |
|---|---|---|
| `src/components/ui/Drawer.astro` | `#drawer` element + drawer JS (lines 717-770, 1112-1230) | ~3 days |
| `src/components/ui/CommandPalette.astro` | `#palette` + palette JS (lines 1352-1430) | ~2 days |
| `src/components/ui/CompareCombobox.astro` | `compare-search` + combobox JS (lines 1273-1348) | ~1.5 days |
| `src/components/ui/CategorySidebar.astro` | Sidebar `aside.side` block + cat-list JS | ~1 day |
| `src/components/ui/ThemeToggle.astro` | `theme-row` + theme JS | ~0.5 day |
| `src/lib/storage.ts` | `safeStorage` wrapper | ~30 min |
| `src/styles/tokens.css` | All `:root` + `[data-theme=dark]` CSS custom properties | ~1 day |

### Files to refactor (existing)

| Existing file | Change | Effort |
|---|---|---|
| `src/layouts/BaseLayout.astro` | Replace top-header layout with sidebar shell (slot for `<aside>` + `<main>`) | ~1 day |
| `src/pages/index.astro` | Add rugpull receipt section above stats grid | ~3 hr |
| `src/pages/catalog/[...].astro` (or wherever catalog lives) | Add "+ 22 more · ⌘K" chip; wire drawer trigger on card click | ~4 hr |
| `src/pages/compare.astro` | Replace 2-service URL-driven with CompareCombobox + 4-service state | ~4 hr |
| `src/pages/sponsors.astro` | Re-style ledger as plain-text mono receipt with dashed dividers | ~2 hr |
| `src/pages/service/[slug].astro` | Keep as fallback deep-link target; also opens via Drawer on client | ~3 hr |
| `src/components/ui/ServiceCard.astro` | Trigger drawer on click instead of nav to `/service/[slug]` | ~2 hr |
| `src/components/ui/ServiceTable.astro` | Same drawer trigger | ~1 hr |

### Files to delete or deprecate

| File | Reason |
|---|---|
| `local/theme-mocks/01-12-*.html` | Decision: keep all 12 mocks for archival (gitignored anyway) |

---

## Phased plan

Splitting v5.0 across 3 mini-sprints so we can deploy incrementally rather than big-bang.

### v5.0 — Layout + theme (week 1)

The shell + tokens. Doesn't change any service content; lays the chrome.

1. `tokens.css` + dark mode
2. `BaseLayout.astro` sidebar shell
3. `CategorySidebar.astro` (collapsible 27)
4. `ThemeToggle.astro`
5. `storage.ts`
6. Mobile hamburger + 480px breakpoint
7. Deploy → site looks different but content unchanged

**Risk:** dark-mode contrast on per-service `brand_color`. Mitigation: the prototype's `color-mix()` lighten works fine in testing.

### v5.1 — Components: drawer + palette + combobox (week 2)

The interactive pieces. Drawer replaces `/service/[slug]` navigation; deep-link to `/service/[slug]` stays as SSR fallback.

1. `Drawer.astro` (with focus-trap, prev/next, J/K, remember-origin)
2. `CommandPalette.astro` (with prefix-rank, debounced search, aria-live)
3. `CompareCombobox.astro` (with max-4, aria-live status)
4. Wire `ServiceCard` + `ServiceTable` to open Drawer instead of navigating
5. Hash listener for `#service=slug` deep-links
6. Deploy

**Risk:** `/service/[slug]` SEO. Pages still SSR for crawlers; drawer is client-only enhancement.

### v5.2 — Content + brand pass (week 3)

The receipt aesthetic + final polish.

1. Home rugpull-receipt section
2. Sponsors ledger → plain-text mono receipt
3. Issue №009 framing unified across home / sponsors / report
4. Document.title pattern (`Page · opentier`)
5. Lazy-load "scroll for more" hint
6. Brand register call — A (plain text) / B (restore repetition) / C (tighten current) — see sprint-7 review for options
7. Lighthouse mobile re-test (target: Home/Catalog/Service ≥ 95)
8. Playwright keyboard tests (Tab cycles, Esc closes, J/K navigates, max-4 enforced)
9. Deploy → v5.0.0 tag

---

## Round-2 review fixes baked into v5.0

Out of the round-2 review (`docs/sprints/sprint-7-prototype-review.md`), every BLOCKER + HIGH that lives in the **prototype** needs to land in **Astro components**. Component-level so the same bug doesn't re-appear:

| Round-2 finding | Astro component to fix |
|---|---|
| `urlsFor()` broken fallback | N/A — Astro uses real `official_url` / `pricing_url` / `docs_url` from Zod schema |
| Body not `inert` when modal open | Drawer.astro + CommandPalette.astro: `document.body.querySelector('.shell').inert = true` |
| Palette `outline: none` overrides focus-visible | CommandPalette.astro |
| Combobox Enter `compareCurrent.length` vs `items.length` | CompareCombobox.astro |
| Palette alphabetical ranking | CommandPalette.astro — add prefix-rank scoring |
| `theme=system` doesn't react to OS change | ThemeToggle.astro — wire `matchMedia.addEventListener('change', ...)` |
| Scroll listener re-runs filter on every event | Keep `content-visibility: auto` instead, drops the listener entirely |
| `trapFocus` selector misses `select`/`textarea`/`details` | Use `focus-trap` npm library — handles this |
| Drawer prev/next tabbable when `aria-disabled` | Drawer.astro — toggle `tabindex="-1"` |
| Filter chips lack `aria-pressed` | Catalog component |
| Compare remove ✕ <44px touch target | CompareCombobox.astro — bump to ≥24px tappable area |
| Combobox ARIA conformance | CompareCombobox.astro — full APG 1.2 pattern |
| Drawer prev/next/Esc 28px on mobile | Drawer.astro — bump to ≥44px |
| Mobile PAGE_SIZE | Catalog component — viewport-aware |

---

## Out of scope for v5.0

- **Catalog virtualisation** (#111) — `content-visibility: auto` covers it. Re-evaluate at v5.3 if mobile perf degrades.
- **Sponsor live API** (#112) — keep hand-edited JSON for v5.0. Backlogged.
- **GitLab Pages mirror** (#87) — Day 5 gate, unrelated.
- **opentier.dev DNS** (#88) — gated on domain purchase.
- **Drawer position indicator** ("Anthropic · 1 of 6") — v5.1 candidate.
- **Rugpull source links** (citing official announcements per row) — v5.1.

---

## Risk register

| Risk | Mitigation |
|---|---|
| Sidebar pattern still reads "Series A" — brand register punt to v5.2 | Lock the *interaction* now, brand polish later when content lands in real shell |
| Drawer breaks SEO if `/service/[slug]` no longer SSRs | Keep SSR. Drawer is client enhancement; `<a href="/service/foo">` still works without JS |
| `focus-trap` npm adds ~3 KB | Acceptable vs hand-rolled bugs |
| `[data-theme=dark]` on `<html>` causes FOUC on slow first paint | Inline `<script>` in `<head>` that reads `localStorage` synchronously before body paint |
| 27-category sidebar on mobile = scroll-soup | Collapse-by-default on mobile; only expand on tap |
| Astro view-transitions vs manual transforms | Drop manual; Astro's `transition:name` on cards handles snap |

---

## Estimate

| Phase | Days | Rolling |
|---|---|---|
| v5.0 Layout + theme | 5 | 5 |
| v5.1 Components | 7 | 12 |
| v5.2 Content + brand | 5 | 17 |
| **Total** | **~3.5 weeks** | |

Round-1 estimate was 4-6 weeks. Round-2 revised to 5-7. This phased breakdown comes in at 3.5 weeks because every piece can ship to production incrementally — no big-bang release. **Realistic ship: v5.0 in ~1 week, v5.0.0 tag in ~3.5 weeks.**

---

## Next action

1. User approves this plan (or amends sprint slicing).
2. Push current v4.0 wrap (sprint-7 review doc + snap script) to `rebuild/astro`.
3. v5.0 sprint kickoff: start with `tokens.css` + `BaseLayout.astro` shell.
