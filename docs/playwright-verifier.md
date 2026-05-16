# Playwright pricing-drift verifier

The curl-based audit in `scripts/audit-services.mjs` only sees server-rendered
HTML. For roughly twenty services the pricing widget is JS-rendered or the
host bot-blocks plain `fetch`, so curl always reports a "drift" that isn't
real. Story 5.8 fixes that with a headless-Chromium verifier.

## When it runs

`/.github/workflows/playwright-drift.yml` runs every Monday at 09:00 UTC (and
on `workflow_dispatch`). It installs Chromium, runs
`pnpm playwright test tests/pricing-drift.spec.ts`, and uploads the log plus
the HTML report as an artifact.

## What it checks

For every slug in the candidate list it loads the YAML's `pricing_url`, waits
for `networkidle` (max 15 s), grabs `page.content()`, then asserts that each
numeric `pricing[].price` value appears in the rendered HTML. `"Custom"` /
`"Contact sales"` rows are skipped. Free-tier rows match `$0`, `0`, `0.00`,
or `Free`.

## Adding a service

1. Run `pnpm drift:identify` locally — it writes
   `data/js-rendered-services.json` with slugs whose raw HTML matches fewer
   than 50% of the YAML prices. The Playwright spec reads `slugs[]` from that
   file on startup; falls back to a hardcoded ten-slug seed if it's missing.
2. Or edit `FALLBACK_CANDIDATES` in `tests/pricing-drift.spec.ts`.

## Interpreting failures

Drift workflow opens an issue labeled `pricing-drift` listing each
`slug → expected price → URL`. Triage:

1. Open the URL in a browser. If the live price changed, update the YAML and
   bump `date_verified`.
2. If the page still shows the YAML price, the verifier missed a DOM render
   (rare with `networkidle`) — re-run the workflow with
   `workflow_dispatch`, and if it still fails, widen `priceMatchVariants` in
   the spec.
3. If the host is blocking the GitHub runner IP, move the slug to the manual
   verification queue and note it in `docs/sprints/sprint-5.md`.
