# Sprint 3 — `v0.5.0` Full Migration + Category Refinement (Detailed)

> **Source of truth.** This file replaces story 3.x bullet lists in `~/.claude/plans/and-get-ignore-and-cozy-frog.md` for Sprint 3 execution. The plan file remains the cross-sprint roadmap.

**Owner:** Pratiyush  **Branch base:** `rebuild/astro`  **Tag on completion:** `v0.5.0`  **Generated:** 2026-05-15

---

## Goals

- Migrate every service from `categories/*.md` → typed YAML in `src/content/services/`. Total: **305 services across 27 categories**.
- Of those, **48** already shipped in v0.2.0 and only need verification. **257** are new in Sprint 3.
- Land schema bump for `subcategory: enum(permanent | expiring-credits | limited)` *before* migration so each YAML is written once, not twice.
- Every service must carry: `brand_color` from simpleicons.org, a colored logo SVG, a live pricing URL, a current `date_verified`, and a Zod-validated YAML.
- After all 305 are migrated and the audit script passes, delete the legacy `categories/*.md` and cut production over to the Astro build.

## Non-Goals (deferred to later sprints)

- Contributor automation — issue forms, submission-to-PR, link-verify cron → Sprint 4 (`v0.8.0`).
- Cloudflare Pages migration → Sprint 5 story 5.x (we stay on GitHub Pages through v0.5.0).
- Lighthouse ≥98, takedown policy, Schema.org-only refinements → Sprint 5 (`v2.0.0`).

## Release artifacts (per CLAUDE.md §Releases)

1. Annotated tag `v0.5.0` (signed if a key is set up).
2. `CHANGELOG.md` `[Unreleased]` rolled to `[0.5.0] - YYYY-MM-DD`.
3. `release-notes/v0.5.0.md` with a user-facing first line.
4. GitHub Release published via `gh release create v0.5.0 --notes-file release-notes/v0.5.0.md --target rebuild/astro`.
5. Build assets attached: `data/index.json`, `data/services.md` (flat exports for downstream consumers).

---

## Definition of Done — per service (acceptance criteria)

A service is considered migrated only when **all** of these are true. Tick the checkbox in §6 once every line below holds.

1. **Schema** — `src/content/services/<slug>.yml` exists and `pnpm validate` exits 0.
2. **Brand color** — `brand_color` matches the `hex` field at `https://simpleicons.org/icons/<simpleicons-slug>` OR is recorded in `docs/logo-coverage.md` with the fallback rationale.
3. **Logo** — `public/logos/<slug>.svg` exists and renders with `fill="#<brand_color>"` (full color, not monochrome grey).
4. **Pricing URL** — `pricing_url` returns HTTP 2xx or 3xx (no 404). Checked by `scripts/audit-services.mjs`.
5. **Date verified** — `date_verified: 2026-05` (or current month at migration time).
6. **Subcategory** — `subcategory ∈ {permanent, expiring-credits, limited}` matches the original section in the source MD.
7. **Summary** — `summary` field ≤ 180 chars (Zod-enforced).
8. **Free-tier accuracy** — limits and rate limits copied from the source MD AND spot-checked against the live pricing page if `date_verified` is older than 30 days.
9. **Visual** — open `/service/<slug>` in `pnpm dev`: brand-color accent strip visible, logo full-color, pricing table populated, outbound links open in a new tab with `rel="noopener noreferrer"`.

## Definition of Done — per category

After every service in a category passes the per-service AC:

1. **Build** — `pnpm build` is clean (0 errors, 0 warnings).
2. **Category page** — `/category/<slug>` renders all services in correct order and correct subsection groupings.
3. **Three random services** — pick three at random and walk through `/service/<slug>`: brand color, logo, pricing URL, free-tier limits, last-verified date all match the original MD.
4. **Logo coverage** — every service in this category has a non-placeholder logo OR is logged in `docs/logo-coverage.md` with a deliberate fallback.
5. **Tick the category-level checkbox at the top of the category's section in §6.**

## Visual Verification Protocol

This is the gate the user asked for. Apply it once per category before ticking the category-level box.

```
1. pnpm dev → open http://localhost:4321/category/<slug>
2. For each service card on the page:
     a. The accent strip color matches the simpleicons.org hex swatch
        (open https://simpleicons.org/?q=<service> in a second tab to compare)
     b. The logo is full-color, not monochrome grey or black
     c. The tier badge matches the subsection the service came from
3. Click 3 random service cards:
     a. /service/<slug> opens cleanly (no broken Astro hydration)
     b. Pricing URL link works in a new tab and lands on a live page
     c. All limits/rate-limit text matches the source MD row
     d. Notes section renders if present, is absent if empty
4. Tick the category-level checkbox in §6.
```

If any service fails the visual check, do NOT tick the box. Fix the YAML, re-run `pnpm dev`, re-verify.

---

## Refined Story Order

Schema and verification scripts land first so the migration writes the right field once and CI catches breakages early.

| # | Story | Branch | Output | Blocks |
|---|---|---|---|---|
| 3.1 | Verify taxonomy against schema | `meta/taxonomy-verify` | `docs/category-taxonomy.md` audited; no changes if already correct | 3.2 |
| 3.2 | Subcategory schema bump | `feat/schema-subcategory` | Zod enum + smoke fixture | 3.3 |
| 3.3 | Migration script + audit harness | `tooling/migrate-and-audit` | `scripts/migrate-md-to-yaml.mjs`, `scripts/audit-services.mjs` | 3.5, 3.6 |
| 3.4 | Category YAML files (27) | `content/categories-yaml` | 27 files in `src/content/categories/` | 3.5 |
| 3.5 | Migrate all services | `content/migrate-all` | 255 new YAMLs in `src/content/services/` (50 already seeded) | 3.6 |
| 3.6 | Logo + brand color sweep | `content/logos-all` | `scripts/bulk-fetch-logos.mjs` + `docs/logo-coverage.md` | 3.7 |
| 3.7 | Resolve simpleicons coverage gaps | `content/logo-gaps` | Per-service fallback decision (manual SVG / Lucide / no logo) | 3.8 |
| 3.8 | Subcategory rendering on category pages | `feat/subcategory-render` | 3 subsection groups on `/category/<slug>` | 3.9 |
| 3.9 | Sitemap + RSS + JSON-LD | `feat/seo-machine-readable` | All three feeds valid against W3C/Rich Results test | 3.10 |
| 3.10 | README + CONTRIBUTING + CLAUDE.md rewrite | `docs/rewrite-for-astro` | All three docs describe the YAML workflow | 3.11 |
| 3.11 | Verification sweep (audit + Playwright pricing-drift + manual) | `meta/verify-sweep` | `pnpm audit-services` green; `pnpm verify-pricing` ≥90% services scoring ≥80%; manual spot-check of 30 random pages logged | 3.12 |
| 3.12 | Delete `categories/*.md` | `cleanup/remove-md-categories` | 27 files removed, all internal links updated | 3.13 |
| 3.13 | Production cut-over | `release/v0.5.0-cutover` | `freestack.is-a.dev` serves the Astro build | tag |

---

## §6 — Service Migration Tracker (story 3.5 subtasks)

Status legend: ☑️ already shipped in v0.2.0 (48 services) · ⬜ to migrate in this sprint (257 services).

Each service line is one subtask. Per-service AC is the 9-point checklist in §Definition of Done — per service. Per-category AC is the 5-point checklist below each category. **Do not** repeat the AC inline per service — it applies to every service identically.

### AI & Machine Learning — `ai-ml` &nbsp; (18 services, 5 seeded, 13 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (8)

- [x] `google-gemini` — Google Gemini API — [pricing](https://ai.google.dev/gemini-api/docs/rate-limits) &nbsp; ☑️ *seeded*
- [x] `groq` — Groq — [pricing](https://console.groq.com/docs/rate-limits) &nbsp; ☑️ *seeded*
- [x] `mistral` — Mistral AI — [pricing](https://mistral.ai/pricing) &nbsp; ☑️ *seeded*
- [x] `cerebras` — Cerebras — [pricing](https://www.cerebras.ai/pricing) &nbsp; ☑️ *seeded*
- [x] `cloudflare-workers-ai` — Cloudflare Workers AI — [pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) &nbsp; ☑️ *seeded*
- [ ] `openrouter` — OpenRouter — [pricing](https://openrouter.ai/collections/free-models)
- [ ] `cohere` — Cohere — [pricing](https://cohere.com/pricing)
- [ ] `hugging-face-inference` — Hugging Face Inference — [pricing](https://huggingface.co/pricing)

#### Expiring Credits / Trial (7)

- [ ] `together-ai` — Together AI — [pricing](https://www.together.ai/pricing)
- [ ] `deepseek` — DeepSeek — [pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [ ] `xai-grok` — xAI (Grok) — [pricing](https://docs.x.ai/developers/models)
- [ ] `sambanova` — SambaNova — [pricing](https://cloud.sambanova.ai/plans/pricing)
- [ ] `anthropic-claude` — Anthropic (Claude) — [pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [ ] `fireworks-ai` — Fireworks AI — [pricing](https://fireworks.ai/pricing)
- [ ] `replicate` — Replicate — [pricing](https://replicate.com/pricing)

#### Severely Limited (3)

- [ ] `openai` — OpenAI — [pricing](https://openai.com/api/pricing/)
- [ ] `perplexity-api` — Perplexity API — [pricing](https://docs.perplexity.ai/docs/getting-started/pricing)
- [ ] `meta-llama-api` — Meta Llama API — [pricing](https://www.llama.com/products/llama-api/)

### Analytics — `analytics` &nbsp; (17 services, 5 seeded, 12 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (17)

- [x] `google-analytics-4` — Google Analytics 4 — [pricing](https://analytics.google.com/) &nbsp; ☑️ *seeded*
- [x] `posthog` — PostHog — [pricing](https://posthog.com/pricing) &nbsp; ☑️ *seeded*
- [x] `mixpanel` — Mixpanel — [pricing](https://mixpanel.com/pricing/) &nbsp; ☑️ *seeded*
- [x] `amplitude` — Amplitude — [pricing](https://amplitude.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `umami-cloud` — Umami Cloud — [pricing](https://umami.is/pricing)
- [ ] `plausible` — Plausible — [pricing](https://plausible.io/)
- [ ] `goatcounter` — GoatCounter — [pricing](https://www.goatcounter.com/)
- [ ] `openpanel` — OpenPanel — [pricing](https://openpanel.dev/pricing)
- [x] `new-relic` — New Relic — [pricing](https://newrelic.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `grafana-cloud` — Grafana Cloud — [pricing](https://grafana.com/pricing/)
- [ ] `sentry` — Sentry — [pricing](https://sentry.io/pricing/)
- [ ] `datadog` — Datadog — [pricing](https://www.datadoghq.com/pricing/)
- [ ] `launchdarkly-observability` — LaunchDarkly Observability — [pricing](https://launchdarkly.com/docs/home/observability)
- [ ] `uptimerobot` — UptimeRobot — [pricing](https://uptimerobot.com/pricing/)
- [ ] `betterstack` — BetterStack — [pricing](https://betterstack.com/pricing)
- [ ] `checkly` — Checkly — [pricing](https://www.checklyhq.com/pricing/)
- [ ] `cronitor` — Cronitor — [pricing](https://cronitor.io/pricing)

### Authentication — `auth` &nbsp; (14 services, 4 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (14)

- [ ] `workos-authkit` — WorkOS AuthKit — [pricing](https://workos.com/pricing)
- [x] `clerk` — Clerk — [pricing](https://clerk.com/pricing) &nbsp; ☑️ *seeded*
- [x] `supabase-auth` — Supabase Auth — [pricing](https://supabase.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `firebase-auth` — Firebase Auth — [pricing](https://firebase.google.com/pricing)
- [x] `auth0` — Auth0 — [pricing](https://auth0.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `kinde` — Kinde — [pricing](https://www.kinde.com/pricing/)
- [ ] `logto` — Logto — [pricing](https://logto.io/pricing)
- [x] `stytch` — Stytch — [pricing](https://stytch.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `propelauth` — PropelAuth — [pricing](https://www.propelauth.com/pricing)
- [ ] `hanko` — Hanko — [pricing](https://www.hanko.io/pricing)
- [ ] `descope` — Descope — [pricing](https://www.descope.com/pricing)
- [ ] `supertokens` — SuperTokens — [pricing](https://supertokens.com/pricing)
- [ ] `passage-by-1password` — Passage by 1Password — [pricing](https://passage.1password.com/pricing)
- [ ] `ory-kratos` — Ory (Kratos) — [pricing](https://www.ory.com/pricing)

### Backend-as-a-Service — `baas` &nbsp; (10 services, 1 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `firebase` — **Firebase** — [pricing](https://firebase.google.com/pricing)
- [x] `supabase` — **Supabase** — [pricing](https://supabase.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `appwrite` — **Appwrite** — [pricing](https://appwrite.io/pricing)
- [ ] `convex` — **Convex** — [pricing](https://www.convex.dev/pricing)
- [ ] `nhost` — **Nhost** — [pricing](https://nhost.io/pricing)
- [ ] `strapi-cloud` — **Strapi Cloud** — [pricing](https://strapi.io/pricing-cloud)
- [ ] `directus-cloud` — **Directus Cloud** — [pricing](https://directus.io/pricing)
- [ ] `back4app` — **Back4App** — [pricing](https://www.back4app.com/pricing)
- [ ] `backendless` — **Backendless** — [pricing](https://backendless.com/pricing/)
- [ ] `pocketbase` — **PocketBase** — [pricing](https://pocketbase.io/)

### Code Quality — `code-quality` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `sonarcloud-sonarqube-cloud` — SonarCloud (SonarQube Cloud) — [pricing](https://www.sonarsource.com/plans-and-pricing/)
- [ ] `codacy` — Codacy — [pricing](https://www.codacy.com/pricing)
- [ ] `qlty-formerly-codeclimate` — Qlty (formerly CodeClimate) — [pricing](https://codeclimate.com/quality/pricing)
- [ ] `codecov` — Codecov — [pricing](https://about.codecov.io/pricing/)
- [ ] `coveralls` — Coveralls — [pricing](https://coveralls.io/pricing)
- [ ] `deepsource` — DeepSource — [pricing](https://deepsource.com/pricing)
- [ ] `coderabbit` — CodeRabbit — [pricing](https://www.coderabbit.ai/pricing)
- [ ] `qodana-jetbrains` — Qodana (JetBrains) — [pricing](https://www.jetbrains.com/qodana/buy/)
- [ ] `trunk-check` — Trunk Check — [pricing](https://trunk.io/pricing)
- [ ] `biome` — Biome — [pricing](https://github.com/biomejs/biome)

### Collaboration — `collaboration` &nbsp; (11 services, 0 seeded, 11 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (11)

- [ ] `slack` — Slack — [pricing](https://slack.com/pricing)
- [ ] `discord` — Discord — [pricing](https://discord.com/)
- [ ] `lark` — Lark — [pricing](https://www.larksuite.com/en_us/plans)
- [ ] `notion` — Notion — [pricing](https://www.notion.so/pricing)
- [ ] `linear` — Linear — [pricing](https://linear.app/pricing)
- [ ] `trello` — Trello — [pricing](https://trello.com/pricing)
- [ ] `twist` — Twist — [pricing](https://twist.com/pricing)
- [ ] `basecamp` — Basecamp — [pricing](https://basecamp.com/pricing)
- [ ] `asana` — Asana — [pricing](https://asana.com/pricing)
- [ ] `clickup` — ClickUp — [pricing](https://clickup.com/pricing)
- [ ] `mondaycom` — Monday.com — [pricing](https://monday.com/pricing)

### Communication — `communication` &nbsp; (11 services, 0 seeded, 11 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (11)

- [ ] `agora` — Agora — [pricing](https://www.agora.io/en/pricing/)
- [ ] `ably` — Ably — [pricing](https://ably.com/pricing)
- [ ] `dailyco` — Daily.co — [pricing](https://www.daily.co/pricing/video-sdk/)
- [ ] `pusher-channels` — Pusher Channels — [pricing](https://pusher.com/channels/pricing/)
- [ ] `stream` — Stream — [pricing](https://getstream.io/chat/pricing/)
- [ ] `sendbird` — Sendbird — [pricing](https://sendbird.com/pricing/chat)
- [ ] `livekit` — LiveKit — [pricing](https://livekit.com/pricing)
- [ ] `liveblocks` — Liveblocks — [pricing](https://liveblocks.io/pricing)
- [ ] `partykit-cloudflare` — PartyKit (Cloudflare) — [pricing](https://www.partykit.io/)
- [ ] `twilio` — Twilio — [pricing](https://www.twilio.com/en-us/pricing)
- [ ] `vonage` — Vonage — [pricing](https://www.vonage.com/communications-apis/pricing/)

### Containers — `containers` &nbsp; (9 services, 0 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [ ] `docker-hub` — Docker Hub — [pricing](https://www.docker.com/pricing/)
- [ ] `github-container-registry` — GitHub Container Registry — [pricing](https://docs.github.com/en/billing/concepts/product-billing/github-packages)
- [ ] `gitlab-container-registry` — GitLab Container Registry — [pricing](https://about.gitlab.com/pricing/)
- [ ] `quayio` — Quay.io — [pricing](https://quay.io/plans/)
- [ ] `aws-ecr-public` — AWS ECR Public — [pricing](https://aws.amazon.com/ecr/pricing/)
- [ ] `google-artifact-registry` — Google Artifact Registry — [pricing](https://cloud.google.com/artifact-registry/pricing)
- [ ] `harbor-self-hosted` — Harbor (self-hosted) — [pricing](https://goharbor.io/)
- [ ] `github-codespaces` — GitHub Codespaces — [pricing](https://github.com/features/codespaces)
- [ ] `gitpod` — Gitpod — [pricing](https://gitpod.io/pricing)

### Databases — `databases` &nbsp; (15 services, 5 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (15)

- [x] `supabase` — Supabase — [pricing](https://supabase.com/pricing) &nbsp; ☑️ *seeded*
- [x] `neon` — Neon — [pricing](https://neon.com/pricing) &nbsp; ☑️ *seeded*
- [x] `mongodb-atlas` — MongoDB Atlas — [pricing](https://www.mongodb.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `firebase-realtime-db` — Firebase Realtime DB — [pricing](https://firebase.google.com/pricing)
- [ ] `cloud-firestore` — Cloud Firestore — [pricing](https://firebase.google.com/pricing)
- [ ] `cloudflare-d1` — Cloudflare D1 — [pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [x] `turso` — Turso — [pricing](https://turso.tech/pricing) &nbsp; ☑️ *seeded*
- [x] `upstash-redis` — Upstash Redis — [pricing](https://upstash.com/pricing/redis) &nbsp; ☑️ *seeded*
- [ ] `tidb-cloud-starter` — TiDB Cloud Starter — [pricing](https://www.pingcap.com/pricing/)
- [ ] `convex` — Convex — [pricing](https://www.convex.dev/pricing)
- [ ] `xata` — Xata — [pricing](https://xata.io/pricing)
- [ ] `motherduck` — MotherDuck — [pricing](https://motherduck.com/product/pricing/)
- [ ] `deno-kv` — Deno KV — [pricing](https://deno.com/deploy/pricing)
- [ ] `cockroachdb` — CockroachDB — [pricing](https://www.cockroachlabs.com/pricing/)
- [ ] `aiven` — Aiven — [pricing](https://aiven.io/pricing)

### Design — `design` &nbsp; (11 services, 0 seeded, 11 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (11)

- [ ] `figma` — Figma — [pricing](https://www.figma.com/pricing/)
- [ ] `penpot` — Penpot — [pricing](https://penpot.app/pricing)
- [ ] `canva` — Canva — [pricing](https://www.canva.com/pricing/)
- [ ] `framer` — Framer — [pricing](https://www.framer.com/pricing)
- [ ] `spline` — Spline — [pricing](https://spline.design/pricing)
- [ ] `rive` — Rive — [pricing](https://rive.app/pricing)
- [ ] `excalidraw` — Excalidraw — [pricing](https://plus.excalidraw.com/pricing)
- [ ] `storybook` — Storybook — [pricing](https://storybook.js.org/)
- [ ] `iconbuddy` — IconBuddy — [pricing](https://iconbuddy.com/)
- [ ] `zeplin` — Zeplin — [pricing](https://zeplin.io/pricing/)
- [ ] `eraserio` — Eraser.io — [pricing](https://www.eraser.io/pricing)

### Developer Tools — `dev-tools` &nbsp; (15 services, 0 seeded, 15 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (15)

- [ ] `github` — **GitHub** — [pricing](https://github.com/pricing)
- [ ] `gitlab` — **GitLab** — [pricing](https://about.gitlab.com/pricing/)
- [ ] `bitbucket` — **Bitbucket** — [pricing](https://www.atlassian.com/software/bitbucket/pricing)
- [ ] `linear` — **Linear** — [pricing](https://linear.app/pricing)
- [ ] `figma` — **Figma** — [pricing](https://www.figma.com/pricing/)
- [ ] `postman` — **Postman** — [pricing](https://www.postman.com/pricing/)
- [ ] `insomnia` — **Insomnia** — [pricing](https://insomnia.rest/pricing)
- [ ] `github-copilot` — **GitHub Copilot** — [pricing](https://github.com/features/copilot)
- [ ] `cursor` — **Cursor** — [pricing](https://cursor.com/docs/models-and-pricing)
- [ ] `windsurf` — **Windsurf** — [pricing](https://windsurf.com/pricing)
- [ ] `val-town` — **Val Town** — [pricing](https://www.val.town/pricing)
- [ ] `replit` — **Replit** — [pricing](https://replit.com/pricing)
- [ ] `ngrok` — **ngrok** — [pricing](https://ngrok.com/pricing)
- [ ] `tailscale` — **Tailscale** — [pricing](https://tailscale.com/pricing)
- [ ] `jetbrains-intellij-idea` — **JetBrains IntelliJ IDEA** — [pricing](https://www.jetbrains.com/idea/download/)

### DNS — `dns` &nbsp; (12 services, 5 seeded, 7 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (12)

- [x] `cloudflare-dns` — **Cloudflare DNS** — [pricing](https://www.cloudflare.com/plans/) &nbsp; ☑️ *seeded*
- [ ] `cloudflare-1111-warp` — **Cloudflare 1.1.1.1 + WARP** — [pricing](https://1.1.1.1/)
- [x] `nextdns` — **NextDNS** — [pricing](https://nextdns.io/pricing) &nbsp; ☑️ *seeded*
- [ ] `dns4eu` — **DNS4EU** — [pricing](https://www.joindns4.eu/for-public)
- [x] `namecheap-freedns` — **Namecheap FreeDNS** — [pricing](https://www.namecheap.com/domains/freedns/) &nbsp; ☑️ *seeded*
- [x] `duckdns` — **DuckDNS** — [pricing](https://www.duckdns.org/) &nbsp; ☑️ *seeded*
- [ ] `no-ip` — **No-IP** — [pricing](https://www.noip.com/pricing)
- [ ] `vercel-dns` — **Vercel DNS** — [pricing](https://vercel.com/docs/domains)
- [ ] `netlify-dns` — **Netlify DNS** — [pricing](https://docs.netlify.com/manage/domains/)
- [x] `bunny-dns` — **Bunny DNS** — [pricing](https://bunny.net/pricing/dns/) &nbsp; ☑️ *seeded*
- [ ] `squarespace-domains` — **Squarespace Domains** — [pricing](https://domains.squarespace.com/)
- [ ] `aws-route-53` — **AWS Route 53** — [pricing](https://aws.amazon.com/route53/pricing/)

### Documentation — `docs` &nbsp; (9 services, 0 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [ ] `gitbook` — GitBook — [pricing](https://www.gitbook.com/pricing)
- [ ] `read-the-docs` — Read the Docs — [pricing](https://about.readthedocs.com/pricing/)
- [ ] `hashnode` — Hashnode — [pricing](https://hashnode.com/pricing)
- [ ] `mintlify` — Mintlify — [pricing](https://www.mintlify.com/pricing)
- [ ] `docusaurus-github-pages` — Docusaurus + GitHub Pages — [pricing](https://docusaurus.io/)
- [ ] `docsify-github-pages` — Docsify + GitHub Pages — [pricing](https://docsify.js.org/)
- [ ] `nextra` — Nextra — [pricing](https://nextra.site/)
- [ ] `starlight-astro` — Starlight (Astro) — [pricing](https://starlight.astro.build/)
- [ ] `fumadocs` — Fumadocs — [pricing](https://www.fumadocs.dev/)

### Email — `email` &nbsp; (13 services, 4 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (13)

- [x] `resend` — Resend — [pricing](https://resend.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `brevo-sendinblue` — Brevo (Sendinblue) — [pricing](https://www.brevo.com/pricing/)
- [x] `mailtrap` — Mailtrap — [pricing](https://mailtrap.io/pricing/) &nbsp; ☑️ *seeded*
- [x] `mailgun` — Mailgun — [pricing](https://www.mailgun.com/pricing/) &nbsp; ☑️ *seeded*
- [ ] `postmark` — Postmark — [pricing](https://postmarkapp.com/pricing)
- [x] `plunk` — Plunk — [pricing](https://www.useplunk.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `mailersend` — MailerSend — [pricing](https://www.mailersend.com/pricing)
- [ ] `amazon-ses` — Amazon SES — [pricing](https://aws.amazon.com/ses/pricing/)
- [ ] `smtp2go` — SMTP2GO — [pricing](https://www.smtp2go.com/pricing/)
- [ ] `brevo-sendinblue` — Brevo (Sendinblue) — [pricing](https://www.brevo.com/pricing/)
- [ ] `loops` — Loops — [pricing](https://loops.so/pricing)
- [ ] `mailchimp` — Mailchimp — [pricing](https://mailchimp.com/pricing/marketing/)
- [ ] `emailjs` — EmailJS — [pricing](https://www.emailjs.com/pricing/)

### Hosting — `hosting` &nbsp; (11 services, 5 seeded, 6 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (11)

- [x] `vercel` — Vercel — [pricing](https://vercel.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `netlify` — Netlify — [pricing](https://www.netlify.com/pricing/)
- [x] `cloudflare-pages` — Cloudflare Pages — [pricing](https://www.cloudflare.com/plans/developer-platform/) &nbsp; ☑️ *seeded*
- [x] `github-pages` — GitHub Pages — [pricing](https://github.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `render` — Render — [pricing](https://render.com/pricing)
- [ ] `firebase-hosting` — Firebase Hosting — [pricing](https://firebase.google.com/pricing)
- [x] `deno-deploy` — Deno Deploy — [pricing](https://deno.com/deploy/pricing) &nbsp; ☑️ *seeded*
- [x] `koyeb` — Koyeb — [pricing](https://www.koyeb.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `surgesh` — Surge.sh — [pricing](https://surge.sh/pricing)
- [ ] `zeabur` — Zeabur — [pricing](https://zeabur.com/pricing)
- [ ] `stormkit` — Stormkit — [pricing](https://www.stormkit.io/)

### IaaS — `iaas` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `oracle-cloud-always-free` — Oracle Cloud Always Free — [pricing](https://www.oracle.com/cloud/free/)
- [ ] `gcp-always-free` — GCP Always Free — [pricing](https://cloud.google.com/free)
- [ ] `aws-always-free` — AWS Always Free — [pricing](https://aws.amazon.com/free/)
- [ ] `aws-free-plan-new-accounts-post-july-2025` — AWS Free Plan (new accounts, post-July 2025) — [pricing](https://aws.amazon.com/free/)
- [ ] `azure-always-free` — Azure Always Free — [pricing](https://azure.microsoft.com/en-us/pricing/free-services)
- [ ] `azure-12-month-free` — Azure 12-Month Free — [pricing](https://azure.microsoft.com/en-us/pricing/free-services)
- [ ] `ibm-cloud` — IBM Cloud — [pricing](https://www.ibm.com/products/cloud/free)
- [ ] `vultr` — Vultr — [pricing](https://www.vultr.com/)
- [ ] `linode-akamai` — Linode (Akamai) — [pricing](https://www.linode.com/pricing/)
- [ ] `hetzner` — Hetzner — [pricing](https://www.hetzner.com/cloud/)

### Logs & Observability — `logs` &nbsp; (9 services, 0 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [ ] `grafana-cloud-loki` — Grafana Cloud (Loki) — [pricing](https://grafana.com/pricing/)
- [ ] `axiom` — Axiom — [pricing](https://axiom.co/pricing)
- [ ] `better-stack-logtail` — Better Stack (Logtail) — [pricing](https://betterstack.com/pricing)
- [ ] `sumo-logic` — Sumo Logic — [pricing](https://www.sumologic.com/pricing)
- [ ] `papertrail` — Papertrail — [pricing](https://www.papertrail.com/plans/)
- [ ] `logflare` — Logflare — [pricing](https://logflare.app/pricing)
- [ ] `hyperdx` — HyperDX — [pricing](https://www.hyperdx.io/pricing)
- [ ] `seq-self-hosted` — Seq (self-hosted) — [pricing](https://datalust.co/pricing)
- [ ] `vector-open-source` — Vector (open-source) — [pricing](https://vector.dev/)

### Maps — `maps` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `mapbox` — Mapbox — [pricing](https://www.mapbox.com/pricing)
- [ ] `google-maps-platform` — Google Maps Platform — [pricing](https://mapsplatform.google.com/pricing/)
- [ ] `here` — HERE — [pricing](https://www.here.com/get-started/pricing)
- [ ] `nominatim-openstreetmap` — Nominatim (OpenStreetMap) — [pricing](https://operations.osmfoundation.org/policies/nominatim/)
- [ ] `stadia-maps` — Stadia Maps — [pricing](https://stadiamaps.com/pricing/)
- [ ] `geoapify` — Geoapify — [pricing](https://www.geoapify.com/pricing/)
- [ ] `locationiq` — LocationIQ — [pricing](https://locationiq.com/pricing)
- [ ] `maptiler` — MapTiler — [pricing](https://www.maptiler.com/cloud/pricing/)
- [ ] `protomaps` — Protomaps — [pricing](https://protomaps.com/)
- [ ] `opencage` — OpenCage — [pricing](https://opencagedata.com/pricing)

### Mobile — `mobile` &nbsp; (11 services, 0 seeded, 11 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (11)

- [ ] `firebase-fcm` — **Firebase (FCM)** — [pricing](https://firebase.google.com/pricing)
- [ ] `firebase-crashlytics` — **Firebase (Crashlytics)** — [pricing](https://firebase.google.com/pricing)
- [ ] `firebase-remote-config` — **Firebase (Remote Config)** — [pricing](https://firebase.google.com/pricing)
- [ ] `firebase-app-distribution` — **Firebase (App Distribution)** — [pricing](https://firebase.google.com/pricing)
- [ ] `expo-eas` — **Expo (EAS)** — [pricing](https://expo.dev/pricing)
- [ ] `onesignal` — **OneSignal** — [pricing](https://onesignal.com/pricing)
- [ ] `revenuecat` — **RevenueCat** — [pricing](https://www.revenuecat.com/pricing/)
- [ ] `codemagic` — **Codemagic** — [pricing](https://codemagic.io/pricing/)
- [ ] `bitrise` — **Bitrise** — [pricing](https://bitrise.io/pricing)
- [ ] `fastlane` — **Fastlane** — [pricing](https://fastlane.tools/)
- [ ] `testflight` — **TestFlight** — [pricing](https://developer.apple.com/testflight/)

### PaaS — `paas` &nbsp; (9 services, 1 seeded, 8 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [ ] `render` — **Render** — [pricing](https://render.com/pricing)
- [x] `koyeb` — **Koyeb** — [pricing](https://www.koyeb.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `digitalocean-app-platform` — **DigitalOcean App Platform** — [pricing](https://www.digitalocean.com/pricing/app-platform)
- [ ] `coolify` — **Coolify** — [pricing](https://coolify.io/pricing)
- [ ] `adaptableio` — **Adaptable.io** — [pricing](https://adaptable.io/pricing)
- [ ] `coherence` — **Coherence** — [pricing](https://www.withcoherence.com/pricing)
- [ ] `zeabur` — **Zeabur** — [pricing](https://zeabur.com/pricing)
- [ ] `back4app-containers` — **Back4App Containers** — [pricing](https://www.back4app.com/pricing/container-as-a-service)
- [ ] `qovery` — **Qovery** — [pricing](https://www.qovery.com/pricing)

### Payments — `payments` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `stripe` — Stripe — [pricing](https://stripe.com/pricing)
- [ ] `lemonsqueezy` — LemonSqueezy — [pricing](https://www.lemonsqueezy.com/pricing)
- [ ] `paddle` — Paddle — [pricing](https://www.paddle.com/pricing)
- [ ] `polar` — Polar — [pricing](https://polar.sh/resources/pricing)
- [ ] `creem` — Creem — [pricing](https://www.creem.io/pricing)
- [ ] `revenuecat` — RevenueCat — [pricing](https://www.revenuecat.com/pricing/)
- [ ] `hyperswitch` — Hyperswitch — [pricing](https://hyperswitch.io/)
- [ ] `lago` — Lago — [pricing](https://getlago.com/pricing)
- [ ] `gumroad` — Gumroad — [pricing](https://gumroad.com/pricing)
- [ ] `paypal` — PayPal — [pricing](https://www.paypal.com/us/business/pricing)

### Project Management — `project-management` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `jira` — Jira — [pricing](https://www.atlassian.com/software/jira/pricing)
- [ ] `youtrack` — YouTrack — [pricing](https://www.jetbrains.com/youtrack/buy/)
- [ ] `plane` — Plane — [pricing](https://plane.so/pricing)
- [ ] `taiga` — Taiga — [pricing](https://taiga.io/deployment-pricing-options/)
- [ ] `shortcut` — Shortcut — [pricing](https://www.shortcut.com/pricing)
- [ ] `height` — Height — [pricing](https://height.app/pricing)
- [ ] `huly` — Huly — [pricing](https://huly.io/pricing)
- [ ] `vikunja` — Vikunja — [pricing](https://vikunja.io/)
- [ ] `appflowy` — AppFlowy — [pricing](https://appflowy.com/pricing)
- [ ] `focalboard` — Focalboard — [pricing](https://www.focalboard.com/)

### Search — `search` &nbsp; (9 services, 4 seeded, 5 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [x] `algolia` — **Algolia** — [pricing](https://www.algolia.com/pricing) &nbsp; ☑️ *seeded*
- [x] `orama` — **Orama** — [pricing](https://docs.orama.com/cloud/understanding-orama/pricing-limits) &nbsp; ☑️ *seeded*
- [x] `trieve` — **Trieve** — [pricing](https://www.trieve.ai/blog/usage-based-pricing) &nbsp; ☑️ *seeded*
- [ ] `typesense-cloud` — **Typesense Cloud** — [pricing](https://cloud.typesense.org/pricing)
- [ ] `paradedb` — **ParadeDB** — [pricing](https://github.com/paradedb/paradedb)
- [x] `meilisearch` — **Meilisearch** — [pricing](https://www.meilisearch.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `zincsearch` — **ZincSearch** — [pricing](https://github.com/zincsearch/zincsearch)
- [ ] `elasticsearch` — **Elasticsearch** — [pricing](https://www.elastic.co/pricing)
- [ ] `tantivy` — **Tantivy** — [pricing](https://github.com/quickwit-oss/tantivy)

### Security — `security` &nbsp; (10 services, 0 seeded, 10 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [ ] `snyk` — **Snyk** — [pricing](https://snyk.io/plans/)
- [ ] `semgrep` — **Semgrep** — [pricing](https://semgrep.dev/pricing/)
- [ ] `dependabot-github` — **Dependabot (GitHub)** — [pricing](https://docs.github.com/en/code-security/dependabot)
- [ ] `socketdev` — **Socket.dev** — [pricing](https://socket.dev/pricing)
- [ ] `gitguardian` — **GitGuardian** — [pricing](https://www.gitguardian.com/pricing)
- [ ] `trivy-aqua-security` — **Trivy (Aqua Security)** — [pricing](https://trivy.dev/)
- [ ] `lets-encrypt` — **Let's Encrypt** — [pricing](https://letsencrypt.org/docs/rate-limits/)
- [ ] `cloudflare-ssl` — **Cloudflare SSL** — [pricing](https://www.cloudflare.com/plans/free/)
- [ ] `hashicorp-vault` — **HashiCorp Vault** — [pricing](https://www.hashicorp.com/en/lp/vault-p)
- [ ] `1password` — **1Password** — [pricing](https://github.com/1Password/for-open-source)

### Storage — `storage` &nbsp; (12 services, 5 seeded, 7 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (12)

- [x] `cloudflare-r2` — Cloudflare R2 — [pricing](https://developers.cloudflare.com/r2/pricing/) &nbsp; ☑️ *seeded*
- [x] `backblaze-b2` — Backblaze B2 — [pricing](https://www.backblaze.com/cloud-storage/pricing) &nbsp; ☑️ *seeded*
- [x] `supabase-storage` — Supabase Storage — [pricing](https://supabase.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `firebase-storage` — Firebase Storage — [pricing](https://firebase.google.com/pricing)
- [x] `uploadthing` — Uploadthing — [pricing](https://uploadthing.com/) &nbsp; ☑️ *seeded*
- [x] `cloudinary` — Cloudinary — [pricing](https://cloudinary.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `imagekit` — ImageKit — [pricing](https://imagekit.io/plans/)
- [ ] `tigris` — Tigris — [pricing](https://www.tigrisdata.com/pricing/)
- [ ] `tebi` — Tebi — [pricing](https://www.tebi.com/pricing)
- [ ] `jsdelivr` — jsDelivr — [pricing](https://www.jsdelivr.com/)
- [ ] `aws-s3` — AWS S3 — [pricing](https://aws.amazon.com/free/)
- [ ] `bunny-cdn` — Bunny CDN — [pricing](https://bunny.net/pricing/)

### Testing — `testing` &nbsp; (10 services, 4 seeded, 6 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (10)

- [x] `github-actions` — GitHub Actions — [pricing](https://github.com/pricing) &nbsp; ☑️ *seeded*
- [ ] `gitlab-ci` — GitLab CI — [pricing](https://about.gitlab.com/pricing/)
- [ ] `circleci` — CircleCI — [pricing](https://circleci.com/pricing/)
- [ ] `percy-browserstack` — Percy (BrowserStack) — [pricing](https://percy.io/pricing)
- [x] `chromatic` — Chromatic — [pricing](https://www.chromatic.com/pricing) &nbsp; ☑️ *seeded*
- [x] `argos-ci` — Argos CI — [pricing](https://argos-ci.com/pricing) &nbsp; ☑️ *seeded*
- [x] `playwright` — Playwright — [pricing](https://playwright.dev/) &nbsp; ☑️ *seeded*
- [ ] `qase` — Qase — [pricing](https://qase.io/pricing)
- [ ] `travis-ci` — Travis CI — [pricing](https://www.travis-ci.com/pricing/)
- [ ] `browserstack` — BrowserStack — [pricing](https://www.browserstack.com/pricing)

### Translation — `translation` &nbsp; (9 services, 0 seeded, 9 remaining)

- [ ] **Category gate** — all 9 per-service AC met for every service below AND 5-point per-category AC met (build clean, render check, 3 random services walked, logo coverage OK).

#### Permanent Free Tiers (9)

- [ ] `tolgee` — Tolgee — [pricing](https://tolgee.io/pricing)
- [ ] `crowdin` — Crowdin — [pricing](https://crowdin.com/pricing)
- [ ] `weblate` — Weblate — [pricing](https://weblate.org/en/hosting/)
- [ ] `poeditor` — POEditor — [pricing](https://poeditor.com/pricing/)
- [ ] `transifex` — Transifex — [pricing](https://www.transifex.com/pricing)
- [ ] `lokalise` — Lokalise — [pricing](https://lokalise.com/pricing/)
- [ ] `locize` — Locize — [pricing](https://locize.com/pricing.html)
- [ ] `simplelocalize` — SimpleLocalize — [pricing](https://simplelocalize.io/pricing/)
- [ ] `phrase` — Phrase — [pricing](https://phrase.com/pricing/)

---

## §7 — Logo Coverage Tracker (story 3.7)

Populated by `scripts/bulk-fetch-logos.mjs`. Three buckets:

- **simpleicons hit** — SVG fetched + hex captured automatically. No manual work.
- **Lucide fallback** — no simpleicons entry; use a generic Lucide icon tinted with a brand-appropriate color. Document the choice.
- **No logo** — no acceptable icon anywhere; render a neutral monogram tile. Document.

The tracker table is regenerated by the script; do not edit by hand. Expected coverage: ~85% simpleicons hit, ~10% Lucide, ~5% monogram (extrapolated from the 50-seed sample).

---

## §8 — Verification Artifacts (story 3.11)

Before ticking the final sprint-level box:

1. **Audit script green** — `pnpm audit-services` returns 0 errors. Outputs JSON report at `data/audit-report.json`. CI runs this on every PR.
2. **Playwright pricing-drift report** — `pnpm verify-pricing` runs the harness specified in §10. Outputs `data/pricing-verify-report.json` (per-service score) and `docs/sprints/sprint-3-pricing-drift.md` (human-readable triage list). Pass threshold: ≥ 90% of services score ≥ 80%; the ≤ 10% with drift get hand-fixed or removed before tagging.
3. **Manual spot-check log** — 30 services chosen by `shuf -n 30 src/content/services/ | head -30`, each walked via the Visual Verification Protocol. Result logged at `docs/sprints/sprint-3-verification-log.md` (one line per service: slug + pass/fail + note).
4. **Lighthouse smoke** — `/`, `/catalog`, one `/service/*`, one `/category/*` all return mobile score ≥ 90 (Sprint 5 raises the bar to 98).
5. **Build artifact diff** — `du -sh dist/` before and after the sprint, logged for future tuning.

---

## §9 — Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pricing URLs have moved since April 2026 verification | High | Med | `audit-services.mjs` flags 4xx/5xx; failing URLs get re-verified or service removed |
| simpleicons.org has no entry for ~15% of services | Certain | Low | Story 3.7 owns the fallback decision per service; documented in `logo-coverage.md` |
| Free-tier limits changed since April 2026 (≥30 days stale) | High | Med | `pnpm verify-pricing` (Playwright text-presence) catches drift on every service every sweep; manual spot-check of 30 random services backs it up; bump `date_verified` to 2026-05 only after both pass |
| Playwright false-positives from bot-blocked, captcha-walled, or image-only pricing pages | Med | Low | Each service in the report gets a `bot-blocked` or `image-only` flag and is excluded from the drift score; per-service `pricing_in_image: true` opt-out lands in Sprint 5; screenshot-diff fallback for the bot-blocked subset is a Sprint-5 follow-on |
| Vendor sunsets free tier silently (e.g. Heroku 2022, SendGrid May 2025, Postman Mar 2026) | Med | High | Playwright spec searches for sunset phrases ("no longer offer", "discontinued", "free tier ended") and hard-fails any service that matches — caught the moment the page changes wording |
| Subcategory enum mismatch — services migrated as `permanent` when source MD had a subsection | Med | Low | Migration script in 3.3 emits `subcategory` from the section heading, not from a guess |
| Bulk migration takes longer than 3 weeks | Med | Med | The 305-row tracker in §6 makes day-by-day progress visible; if behind by week 2, drop story 3.13 to a follow-on `v0.5.1` |
| Production cut-over (3.13) breaks freestack.is-a.dev | Low | High | Cut over via GH Pages branch toggle, not DNS — instant rollback by flipping the branch back |

---

## §10 — Playwright Pricing-Drift Verification (story 3.11 deep dive)

Free-tier values drift. Vendors quietly cut limits, change rate caps, expire credits, or yank entire free tiers (Heroku 2022, SendGrid May 2025, Postman Mar 2026, Gemini Dec 2025). The migration in story 3.5 froze 305 services as-of 2026-04; within ~30 days some are already stale. This section is the automated drift detector and applies to **both free and paid** tier values.

### Goal

For each service, fetch the live `pricing_url` with Playwright, extract visible text, and verify that the values claimed in the YAML (`free_tier[]` bullets + every `pricing[].price`) still appear on the page. If a claimed value vanishes, flag the service for re-verification. Both free-tier limits and paid-plan prices are checked.

### Approach (text-presence, not strict scraping)

Pricing pages vary wildly in HTML structure. Strict CSS-selector scraping breaks weekly. Loose **text-presence verification** is more robust:

1. Playwright headless Chromium navigates to `pricing_url`.
2. Wait for `networkidle` (handles JS-rendered SaaS pricing pages).
3. Extract page text (`page.locator('body').innerText()`).
4. Normalize: strip HTML, collapse whitespace, lowercase.
5. For each value the YAML claims, check whether a normalized token still appears in the page text:
   - **Numeric quotas** (e.g. `"500 MB"`, `"1 GB"`, `"100 RPD"`): exact or near-exact substring match.
   - **Plan names** (e.g. `"Free"`, `"Pro"`, `"Team"`): substring match in headings or table cells.
   - **Currency** (e.g. `"$25"`, `"$0"`, `"€10"`): substring match.
6. Each service produces a score: `matched / claimed`. ≥ 80% = pass; < 80% = drift suspected.

### What the spec checks (three buckets)

| Bucket | Source field in YAML | Threshold |
|---|---|---|
| Free-tier limits | `free_tier[]` (e.g. "500 MB storage", "5 GB egress/mo") | ≥ 80% of bullets matched |
| Pricing plans | `pricing[].price` AND `pricing[].name` (both free and paid) | All listed prices + plan names present |
| Page health | HTTP status + sunset-phrase scan | Hard fail on 4xx/5xx OR any sunset phrase match |

**Sunset phrases** (case-insensitive regex, hard fail if matched): `we no longer offer`, `discontinued`, `this plan is retiring`, `moved to paid`, `free tier ended`, `previously free`, `legacy plan`, `not accepting new`.

### Files this story produces

- `tests/pricing-verify.spec.ts` — Playwright test; one `test()` per service, auto-generated.
- `playwright.config.ts` — 8 parallel workers, `chromium` only, 30s timeout per service, UA `Mozilla/5.0 ... free-stack-verify/1.0`.
- `scripts/generate-pricing-tests.mjs` — regenerates the spec from current YAMLs.
- `scripts/run-pricing-verify.mjs` — wrapper invoked by `pnpm verify-pricing`; runs Playwright, post-processes JSON output, writes the two reports below.
- `data/pricing-verify-report.json` — per-service result (slug, score, matched, unmatched, sunset flag, runtime, http status).
- `docs/sprints/sprint-3-pricing-drift.md` — human triage list grouped by category, ordered by lowest score first.

### Runtime budget

302 services × ~5s avg / 8 parallel workers = **~3 min** per full sweep. Acceptable for once-per-sprint and once-per-month runs.

### Known limitations (call out so future-you isn't surprised)

- **JS-only pricing pages with lazy-load** sometimes need extra `waitForSelector`. Add per-service `wait_for: <selector>` field when this happens — schema bump deferred to Sprint 5.
- **Bot-blocked / captcha-walled pages** (Stripe, some Cloudflare-protected vendors) return 403 / captcha. Spec tags them `bot-blocked` and excludes from the drift score; logs to the report for manual check.
- **Unit reformat false-negatives** (e.g. "1 GB" vs "1000 MB", "$5/mo" vs "5 USD per month"). Normalizer splits each bullet into tokens, drops English filler words (`free`, `month`, `per`), and tries trivial unit conversions before matching.
- **Marketing pages that hide numbers in images** can't be text-extracted. Maintain an allowlist of services with `pricing_in_image: true` and rely on screenshot-diff (Sprint 5 follow-on).

### Sprint integration

- **Sprint 3 (this story)** ships the harness AND runs it once as the verification gate before tagging `v0.5.0`.
- **Sprint 5 story 5.3** wires it into a monthly GitHub Actions cron, auto-files a tracking issue for any service with score < 80% OR `bot-blocked`, and adds the screenshot-diff fallback for the bot-blocked subset.

### Acceptance criteria (revised for story 3.11)

1. `pnpm audit-services` exits 0 (no hard errors).
2. `pnpm verify-pricing` completes with **≥ 90% of services scoring ≥ 80%**. The remaining ≤ 10% become triage tickets — drop the service or hand-fix the YAML before tagging.
3. `data/pricing-verify-report.json` AND `docs/sprints/sprint-3-pricing-drift.md` both committed.
4. Manual spot-check of 30 random services logged at `docs/sprints/sprint-3-verification-log.md` (unchanged).
5. Lighthouse smoke ≥ 90 mobile on the four canonical pages.

---

## §11 — Sprint-Level Definition of Done

- [ ] Every service checkbox in §6 is ticked
- [ ] Every category gate box in §6 is ticked
- [ ] `pnpm lint && pnpm validate && pnpm check-logos && pnpm audit-services && pnpm verify-pricing && pnpm build` all green on `rebuild/astro`
- [ ] `pnpm verify-pricing` report: ≥ 90% of services scoring ≥ 80%, remaining drift triaged
- [ ] `data/pricing-verify-report.json` AND `docs/sprints/sprint-3-pricing-drift.md` committed
- [ ] `docs/logo-coverage.md` exists and matches `public/logos/` reality
- [ ] `docs/sprints/sprint-3-verification-log.md` exists with ≥30 manual spot-checks
- [ ] `CHANGELOG.md` `[Unreleased]` rolled to `[0.5.0] - <date>`
- [ ] `release-notes/v0.5.0.md` written; first line is user-facing
- [ ] Annotated tag `v0.5.0` pushed
- [ ] GitHub Release created with build assets attached
- [ ] `freestack.is-a.dev` serves the Astro build (story 3.13 verification)
- [ ] Sprint retro entry added at `docs/sprint-retros.md`

