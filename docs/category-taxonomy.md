# Free-Stack Category Taxonomy (Draft for Review)

> **Status:** APPROVED 2026-05-15 by maintainer. Locked for Sprint 1.
> Source: audit of all 27 `categories/*.md` files on 2026-05-15.
> Total entries audited: **319** by `awk` row count (`grep -c '^|' minus header+separator`). README claims 323 — 4-entry gap left to reconcile during Sprint 3 migration when each row gets transcribed.

---

## Decisions At A Glance

| # | Category | Slug | Decision | Lucide Icon | Order |
|---|---|---|---|---|---|
| 1 | AI & ML APIs | `ai-apis` | **RENAME** from `ai-ml` | `brain` | 70 |
| 2 | Analytics & Monitoring | `analytics` | Keep | `bar-chart-3` | 120 |
| 3 | Authentication & Identity | `auth` | Keep | `key-round` | 30 |
| 4 | Backend as a Service | `baas` | Keep | `server-cog` | 170 |
| 5 | Code Quality | `code-quality` | Keep | `code-2` | 90 |
| 6 | Team Collaboration | `collaboration` | Keep | `users-round` | 230 |
| 7 | Communication APIs | `communication` | Keep | `radio` | 200 |
| 8 | Containers & Registries | `containers` | Keep | `container` | 110 |
| 9 | Databases | `databases` | Keep | `database` | 20 |
| 10 | Design & UI Tools | `design` | Keep | `palette` | 250 |
| 11 | Developer Tools | `dev-tools` | Keep | `wrench` | 80 |
| 12 | DNS & Domains | `dns` | Keep | `globe` | 60 |
| 13 | Documentation & CMS | `documentation` | **RENAME** from `docs` | `book-open` | 260 |
| 14 | Email & Messaging | `email` | Keep | `mail` | 50 |
| 15 | Hosting & Deployment | `hosting` | Keep | `cloud` | 10 |
| 16 | Infrastructure as a Service | `iaas` | Keep | `cloud-cog` | 150 |
| 17 | Log Management | `logs` | Keep | `scroll-text` | 130 |
| 18 | Maps & Geolocation | `maps` | Keep | `map` | 210 |
| 19 | Mobile Services | `mobile` | Keep | `smartphone` | 220 |
| 20 | Platform as a Service | `paas` | Keep | `layers-3` | 160 |
| 21 | Payments & Billing | `payments` | Keep | `credit-card` | 180 |
| 22 | Project Management | `project-management` | Keep | `kanban-square` | 240 |
| 23 | Search | `search` | Keep | `search` | 190 |
| 24 | Security | `security` | Keep | `shield-check` | 140 |
| 25 | Storage & CDN | `storage` | Keep | `hard-drive` | 40 |
| 26 | Testing & CI/CD | `testing` | Keep | `flask-conical` | 100 |
| 27 | Translation & i18n | `translation` | Keep | `languages` | 270 |

**Two renames only.** No merges, no splits, no deletions. 27 → 27.

---

## Why Minimal Changes

1. **`ai-ml` → `ai-apis`** — The blueprint (`ref/docs/ARCHITECTURE.md` §11) specifies `ai-apis`. The content is overwhelmingly LLM/inference APIs, not classical ML training platforms. The new slug is more precise.
2. **`docs` → `documentation`** — `docs/` is already used as the top-level repo folder for project docs. Using `docs` as both a content slug and a folder name guarantees confusion in commits, PR descriptions, and search. `documentation` is unambiguous.

**Why not merge `iaas` + `paas` + `baas`?** Audit shows 11/10/11 entries each — sufficient depth. Different audiences (devops vs app devs vs no-backend devs). Merging loses the entry-point clarity that lets a visitor find the right page in one click.

**Why not split `dev-tools`?** Single table of 16 entries (git hosting, IDEs, API tools, tunneling). Splitting creates 4 tiny categories of 3–5 entries each. Better as one "kitchen sink" category with tags.

**Why keep `testing` not `ci-cd`?** Blueprint specifies `ci-cd` but the file already mixes CI/CD with visual regression testing and E2E tools. The name `testing` captures both. Add `ci-cd` as a heavily-used tag.

---

## Display Order Rationale

Order field (10-spaced for easy insertion): grouped by "frequency of need" when standing up a new project on free tiers.

**Build & Ship (10–60)** — what you need on day 1: hosting, db, auth, storage, email, dns.
**Develop (70–110)** — what you reach for during dev: ai-apis, dev-tools, code-quality, testing, containers.
**Operate (120–140)** — what runs in production: analytics, logs, security.
**Infrastructure (150–170)** — when you outgrow PaaS: iaas, paas, baas.
**Application Services (180–220)** — feature-level integrations: payments, search, communication, maps, mobile.
**Team & Content (230–270)** — internal tooling: collaboration, project-management, design, documentation, translation.

---

## Per-Category Detail (proposed YAML)

Each block below is the exact YAML that will land in `src/content/categories/<slug>.yml`.

### 1. AI & ML APIs

```yaml
slug: ai-apis
name: AI & ML APIs
blurb: Free AI APIs, LLM access, and ML inference platforms — permanent free tiers, not expiring trial credits.
icon: brain
order: 70
parent: null
```
- Migrated from: `ai-ml.md` (21 entries)
- Uses tier subcategories: `permanent` / `expiring-credits` / `limited`
- Notable: Google Gemini, Groq, Mistral, Cerebras, Cloudflare Workers AI, OpenRouter, Cohere

### 2. Analytics & Monitoring

```yaml
slug: analytics
name: Analytics & Monitoring
blurb: Web analytics, product analytics, APM, observability, and uptime monitoring with real free tiers.
icon: bar-chart-3
order: 120
parent: null
```
- Migrated from: `analytics.md` (20 entries)
- Product subdivisions handled via tags: `product-analytics`, `apm`, `uptime-monitoring`
- Notable: PostHog, GA4, Mixpanel, Grafana Cloud, Sentry, UptimeRobot

### 3. Authentication & Identity

```yaml
slug: auth
name: Authentication & Identity
blurb: Drop-in auth, identity providers, and user management — passwordless, social, enterprise SSO.
icon: key-round
order: 30
parent: null
```
- Migrated from: `auth.md` (15 entries)
- Notable: WorkOS AuthKit, Clerk, Supabase Auth, Firebase Auth, Logto, Kinde, Stytch

### 4. Backend as a Service

```yaml
slug: baas
name: Backend as a Service
blurb: Full backends without the backend — auth + db + storage + APIs bundled, no server management.
icon: server-cog
order: 170
parent: null
```
- Migrated from: `baas.md` (11 entries)
- Notable: Firebase, Supabase, Appwrite, Convex, Nhost, PocketBase

### 5. Code Quality

```yaml
slug: code-quality
name: Code Quality
blurb: Static analysis, code review, coverage, and AI-powered code review — free for open source or hobby use.
icon: code-2
order: 90
parent: null
```
- Migrated from: `code-quality.md` (11 entries)
- Notable: SonarCloud, Codacy, Codecov, DeepSource, CodeRabbit, Qlty

### 6. Team Collaboration

```yaml
slug: collaboration
name: Team Collaboration
blurb: Chat, docs, wikis, and lightweight project tools — free tiers that work for real teams.
icon: users-round
order: 230
parent: null
```
- Migrated from: `collaboration.md` (12 entries)
- Notable: Slack, Discord, Notion, Linear, Trello, ClickUp

### 7. Communication APIs

```yaml
slug: communication
name: Communication APIs
blurb: Real-time messaging, video, voice, and presence APIs — free dev tiers, transparent rate limits.
icon: radio
order: 200
parent: null
```
- Migrated from: `communication.md` (12 entries)
- Notable: Agora, Ably, Daily.co, Pusher, Stream, LiveKit, Liveblocks

### 8. Containers & Registries

```yaml
slug: containers
name: Containers & Registries
blurb: Container image registries and cloud dev environments — Docker Hub, GHCR, Quay, plus Gitpod and Codespaces.
icon: container
order: 110
parent: null
```
- Migrated from: `containers.md` (10 entries)
- Notable: Docker Hub, GitHub Container Registry, GitLab Container Registry, Gitpod, GitHub Codespaces

### 9. Databases

```yaml
slug: databases
name: Databases
blurb: Postgres, MySQL, SQLite, Redis, Mongo, DuckDB and more — managed or serverless, all with usable free tiers.
icon: database
order: 20
parent: null
```
- Migrated from: `databases.md` (16 entries)
- Notable: Supabase, Neon, MongoDB Atlas, Turso, Upstash, Cloudflare D1, Xata, MotherDuck

### 10. Design & UI Tools

```yaml
slug: design
name: Design & UI Tools
blurb: Design files, prototyping, animation, and component documentation tools — free tiers for solo + small teams.
icon: palette
order: 250
parent: null
```
- Migrated from: `design.md` (12 entries)
- Notable: Figma, Penpot, Canva, Framer, Spline, Rive, Excalidraw, Storybook

### 11. Developer Tools

```yaml
slug: dev-tools
name: Developer Tools
blurb: Git hosting, IDEs, API clients, tunneling, AI assistants — the everyday glue of a developer's stack.
icon: wrench
order: 80
parent: null
```
- Migrated from: `dev-tools.md` (16 entries)
- Notable: GitHub, GitLab, Bitbucket, Cursor, Windsurf, Postman, ngrok, Val Town

### 12. DNS & Domains

```yaml
slug: dns
name: DNS & Domains
blurb: DNS hosting, resolvers, and dynamic DNS — free authoritative DNS plus privacy-focused recursive options.
icon: globe
order: 60
parent: null
```
- Migrated from: `dns.md` (13 entries)
- Notable: Cloudflare DNS, NextDNS, DNS4EU, DuckDNS, Bunny DNS

### 13. Documentation & CMS

```yaml
slug: documentation
name: Documentation & CMS
blurb: Hosted doc platforms and open-source static-site doc generators — pick one and start writing.
icon: book-open
order: 260
parent: null
```
- Migrated from: `docs.md` (10 entries) — **RENAMED slug** to avoid clash with repo docs/ folder
- Notable: GitBook, Read the Docs, Mintlify, Docusaurus, Starlight, Fumadocs

### 14. Email & Messaging

```yaml
slug: email
name: Email & Messaging
blurb: Transactional email, marketing email, client-side senders, and SMS — every free tier verified against the pricing page.
icon: mail
order: 50
parent: null
```
- Migrated from: `email.md` (17 entries)
- Product subdivisions via tags: `transactional`, `marketing`, `client-side`, `sms`
- Notable: Resend, Brevo, Mailtrap, Postmark, MailerSend, Loops

### 15. Hosting & Deployment

```yaml
slug: hosting
name: Hosting & Deployment
blurb: Static hosting, JAMstack platforms, and edge deployment — free tiers honest about bandwidth and build minutes.
icon: cloud
order: 10
parent: null
```
- Migrated from: `hosting.md` (12 entries)
- Notable: Vercel, Netlify, Cloudflare Pages, GitHub Pages, Render, Deno Deploy

### 16. Infrastructure as a Service

```yaml
slug: iaas
name: Infrastructure as a Service
blurb: VMs, block storage, and networking — Oracle Always Free, GCP Always Free, AWS Always Free, plus low-cost VPS options.
icon: cloud-cog
order: 150
parent: null
```
- Migrated from: `iaas.md` (11 entries)
- Notable: Oracle Cloud Always Free, GCP Always Free, AWS Always Free, IBM Cloud, Hetzner, Vultr

### 17. Log Management

```yaml
slug: logs
name: Log Management
blurb: Log aggregation, search, and analysis — cloud platforms with free quotas plus self-hosted open-source options.
icon: scroll-text
order: 130
parent: null
```
- Migrated from: `logs.md` (10 entries)
- Notable: Grafana Cloud (Loki), Axiom, Better Stack, Papertrail, Logflare

### 18. Maps & Geolocation

```yaml
slug: maps
name: Maps & Geolocation
blurb: Map tiles, geocoding, routing, and place search — free tiers from Mapbox to Nominatim, plus fully open-source stacks.
icon: map
order: 210
parent: null
```
- Migrated from: `maps.md` (11 entries)
- Notable: Mapbox, Google Maps, HERE, Nominatim, Stadia Maps, Protomaps

### 19. Mobile Services

```yaml
slug: mobile
name: Mobile Services
blurb: Mobile-specific BaaS, push notifications, build pipelines, and beta distribution for iOS and Android.
icon: smartphone
order: 220
parent: null
```
- Migrated from: `mobile.md` (12 entries)
- Notable: Firebase (FCM, Crashlytics), Expo (EAS), OneSignal, RevenueCat, Codemagic, TestFlight

### 20. Platform as a Service

```yaml
slug: paas
name: Platform as a Service
blurb: App platforms — push code, get a running service — with permanent free tiers (not 14-day trials).
icon: layers-3
order: 160
parent: null
```
- Migrated from: `paas.md` (10 entries)
- Notable: Render, Koyeb, DigitalOcean App Platform, Coolify, Zeabur, Back4App

### 21. Payments & Billing

```yaml
slug: payments
name: Payments & Billing
blurb: Payment processors, merchants-of-record, and subscription billing — no monthly fee, per-transaction pricing.
icon: credit-card
order: 180
parent: null
```
- Migrated from: `payments.md` (11 entries)
- Notable: Stripe, LemonSqueezy, Paddle, Polar, RevenueCat, Hyperswitch

### 22. Project Management

```yaml
slug: project-management
name: Project Management
blurb: Issue trackers, kanban boards, roadmapping — permanent free tiers and self-hostable open-source options.
icon: kanban-square
order: 240
parent: null
```
- Migrated from: `project-management.md` (11 entries)
- Notable: Jira, YouTrack, Linear, Plane, Taiga, Huly, Vikunja

### 23. Search

```yaml
slug: search
name: Search
blurb: Hosted search APIs and self-hostable search engines — full-text, vector, hybrid.
icon: search
order: 190
parent: null
```
- Migrated from: `search.md` (10 entries)
- Notable: Algolia, Orama, Trieve, Typesense, Meilisearch, Elasticsearch

### 24. Security

```yaml
slug: security
name: Security
blurb: SAST, SCA, secret scanning, SSL, and secrets management — free for OSS and small teams.
icon: shield-check
order: 140
parent: null
```
- Migrated from: `security.md` (11 entries)
- Notable: Snyk, Semgrep, Dependabot, Socket.dev, GitGuardian, Trivy, Let's Encrypt

### 25. Storage & CDN

```yaml
slug: storage
name: Storage & CDN
blurb: Object storage, image CDNs, file uploads — egress-friendly free tiers (R2, B2) plus image-optimized services.
icon: hard-drive
order: 40
parent: null
```
- Migrated from: `storage.md` (13 entries)
- Notable: Cloudflare R2, Backblaze B2, Supabase Storage, Cloudinary, ImageKit, jsDelivr

### 26. Testing & CI/CD

```yaml
slug: testing
name: Testing & CI/CD
blurb: CI/CD pipelines, visual regression, and E2E testing tools — generous free tiers for public repos.
icon: flask-conical
order: 100
parent: null
```
- Migrated from: `testing.md` (11 entries)
- Notable: GitHub Actions, GitLab CI, CircleCI, Percy, Chromatic, Argos CI, Playwright

### 27. Translation & i18n

```yaml
slug: translation
name: Translation & i18n
blurb: Translation platforms and localization workflows — open-source self-hostable picks alongside managed SaaS.
icon: languages
order: 270
parent: null
```
- Migrated from: `translation.md` (10 entries)
- Notable: Tolgee, Crowdin, Weblate, POEditor, Lokalise, SimpleLocalize

---

## Subcategory Schema

The Zod schema (`src/content.config.ts`, Story 1.3) will define:

```ts
subcategory: z.enum(['permanent', 'expiring-credits', 'limited']).optional()
```

This applies **only** to the tier sub-grouping used in `ai-apis`. For `analytics` (product analytics vs APM vs uptime) and `email` (transactional vs marketing vs client-side vs SMS), the product-level grouping is handled via the existing `tags` array — not via `subcategory`. This keeps `subcategory` semantically single-purpose: tier permanence, not product type.

### Tag conventions (per category)

| Category | Suggested tags |
|---|---|
| `ai-apis` | `llm`, `image-gen`, `embeddings`, `speech`, `coding-assistant`, `open-source-models` |
| `analytics` | `product-analytics`, `web-analytics`, `apm`, `uptime-monitoring`, `error-tracking` |
| `email` | `transactional`, `marketing`, `client-side`, `sms`, `inbound` |
| `databases` | `postgres`, `mysql`, `sqlite`, `redis`, `mongodb`, `duckdb`, `vector`, `serverless`, `edge` |
| `hosting` | `static`, `jamstack`, `edge`, `serverless`, `nodejs`, `php` |
| `dev-tools` | `git-hosting`, `ide`, `api-client`, `tunnel`, `ai-coding`, `code-editor` |
| `testing` | `ci-cd`, `e2e`, `visual-regression`, `unit`, `load-testing` |
| `security` | `sast`, `sca`, `secret-scanning`, `ssl`, `vulnerability-scanning`, `secrets-management` |

(Complete tag conventions deferred to per-category migration PR in Sprint 3.)

---

## Resolved Items (2026-05-15)

1. **Entry-count discrepancy** — `awk`-confirmed actual table-row count: **319** across 27 files. README's 323 is +4 high. Resolved during Sprint 3 migration PRs (each row gets eyeballed when transcribed to YAML).
2. **`testing` vs `ci-cd` slug** — **Keep `testing`.** Category contains CI/CD + visual regression + E2E. `ci-cd` becomes a tag inside the category.
3. **`dev-tools` scope** — **Keep as one kitchen-sink category.** Tag-based sub-grouping: `git-hosting`, `ide`, `api-client`, `tunnel`, `ai-coding`.
4. **Lucide icon names** — Validated during Story 1.2 implementation. If any name doesn't exist in `lucide-astro` exports, swap to the closest match in that PR.
5. **Order numbers** — Approved. 10-gap spacing for insertion. Grouping: Build & Ship → Develop → Operate → Infra → App Services → Team & Content.
6. **Subcategory scope** — **Tier-only enum**: `subcategory: z.enum(['permanent', 'expiring-credits', 'limited']).optional()`. Product subdivisions live in `tags`.
7. **27 → 27, renames only** — Confirmed. Only `ai-ml → ai-apis` and `docs → documentation`.

---

## Approval Sign-off

- [x] Maintainer reviewed taxonomy (2026-05-15)
- [x] Open items 1–7 resolved
- [ ] `docs/category-taxonomy.md` committed to `rebuild/astro` branch (pending Sprint 1 branch creation)
- [ ] Sprint 1 issues opened (stories 0.1 through 1.10) referencing this doc

This is now the source-of-truth for Sprint 2 seed content and Sprint 3 full migration.
