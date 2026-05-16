# Lighthouse baseline

Story 5.1d — measure the actual Lighthouse scores on the production domain, don't assume from local dev. This file is the methodology + the recorded baseline.

## When this runs

After v2.0.0 tags and the GitHub Pages deploy succeeds on `rebuild/astro`. If 5.14 (DNS cutover to `freestack.is-a.dev`) is still upstream-pending, run against the GitHub Pages preview URL instead and note the URL below.

## How to run it

Three pages, two viewports each (mobile = throttled 4G + Moto G4 emulation; desktop = no throttling, 1440×900).

```bash
# Pages Lighthouse should audit
URLS=(
  "https://freestack.is-a.dev/"
  "https://freestack.is-a.dev/service/anthropic-claude"
  "https://freestack.is-a.dev/catalog"
)

# Install if not present
npm install -g @lhci/cli

# Run (one viewport at a time so the report names don't collide)
for u in "${URLS[@]}"; do
  npx lighthouse "$u" \
    --output=html --output=json \
    --output-path="./docs/lighthouse/$(echo "$u" | sed 's|https://||; s|/|_|g')-mobile.html" \
    --preset=mobile \
    --quiet
  npx lighthouse "$u" \
    --output=html --output=json \
    --output-path="./docs/lighthouse/$(echo "$u" | sed 's|https://||; s|/|_|g')-desktop.html" \
    --preset=desktop \
    --quiet
done
```

`docs/lighthouse/*.html` is gitignored — only the scores in this file are committed.

## Baseline (placeholder until v2.0.0 is live)

Run the audits after the tag pushes + the Pages deploy goes green. Fill in this table.

| Page | Viewport | Perf | A11y | Best | SEO | Notes |
|---|---|---|---|---|---|---|
| `/` | mobile | _ | _ | _ | _ | _ |
| `/` | desktop | _ | _ | _ | _ | _ |
| `/service/anthropic-claude` | mobile | _ | _ | _ | _ | _ |
| `/service/anthropic-claude` | desktop | _ | _ | _ | _ | _ |
| `/catalog` | mobile | _ | _ | _ | _ | _ |
| `/catalog` | desktop | _ | _ | _ | _ | _ |

## Expected gaps and which v2.1 task addresses each

| Audit warning | v2.1 task | Notes |
|---|---|---|
| LCP > 2.5s on mobile | [#73 — font subset](.../tasks/73) | Fraunces is the LCP element on most pages; self-hosting + preload will buy ~200ms. |
| `Image elements do not have explicit width and height` | none — already done | All service-card logos carry width/height attributes. Re-check after audit. |
| `og:image` is a 32×32 SVG (favicon) | [#72 — per-service OG cards](.../tasks/72) | Generate 1200×630 PNG per page at build time with Satori + sharp. |
| Render-blocking CSS | tracked if it appears | Astro inlines critical CSS by default; only an issue if Pagefind CSS is loaded eagerly. |
| Unused CSS | tracked if it appears | Likely from the SponsorMeter footer variant — small enough to ignore unless > 10 KB. |

## Acceptance bar

- **Performance ≥ 85 mobile / ≥ 95 desktop** — passing
- **Accessibility = 100** — non-negotiable; we passed WCAG AA in 5.2
- **Best Practices ≥ 95** — passing
- **SEO = 100** — non-negotiable; we shipped 5.3

If Performance ≥ 90 mobile, we ship v2.0.0 as-is and 5.1b/5.1c become v2.1 follow-ups. If < 90 mobile, prioritise the font subset (which adds maybe 4 hours of work) before tagging anything past v2.0.0.
