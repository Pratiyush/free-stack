# Sprint 3 — Pricing-Drift Verification Report

**Generated:** 2026-05-15  ·  **Method:** curl text-presence (no JS render — Sprint-4 upgrade ships Playwright)  ·  **Coverage:** 302/302 services  ·  **Pass threshold:** score ≥ 80

## Headline

| Verdict | Count | % |
|---|---:|---:|
| ✅ Pass (score ≥ 80) | 220 | 72.8% |
| ⚠️ Drift (score < 80) | 67 | 22.2% |
|     · likely false-positive (generic bullets) | 16 | — |
|     · real drift candidate | 51 | — |
| 🪦 Sunset (hard match) | 0 | 0.0% |
| 🕯️ Weak sunset (`legacy plan` only — demoted) | 8 | — |
| 🤖 Bot-blocked (HTTP 4xx/5xx) | 10 | 3.3% |
| 🎭 Needs JS render | 2 | 0.7% |
| 💥 Error (connection failed) | 3 | 1.0% |

**Pass rate: 72.8%**  ·  Target ≥ 90%.

After excluding the 16 likely-false-positive drift entries (only generic bullets unmatched), the effective real-drift rate is 51 services (16.9%).

## Sprint 3.11 acceptance criteria status

- [ ] **≥ 90% services score ≥ 80** — currently 72.8%, below target. Most of the gap is curl/heuristic false positives; real drift count is 51.
- [x] `data/pricing-verify-report.json` written
- [x] `docs/sprints/sprint-3-pricing-drift.md` written
- [ ] Manual spot-check log of 30 random services at `docs/sprints/sprint-3-verification-log.md` (still pending)

## §1 — Real drift candidates (51)

Re-verify against the live page; update YAML free-tier bullets, or drop the service if the tier is gone. Sorted by lowest score first.

- **percy-browserstack** — score 0 (0/2 bullets, 0/1 prices) · unmatched: _5,000 screenshots/mo · Screenshots reset monthly_
- **percy** — score 10 (1/5 bullets, 0/2 prices) · unmatched: _5K screenshots/mo · Unlimited users and projects · 30-day build history_
- **google-analytics-4** — score 10 (1/5 bullets, 0/1 prices) · unmatched: _Unlimited events (10M/property/mo recommended) · 500 event types · 50 custom dimensions_
- **gumroad** — score 25 (1/2 bullets, 0/1 prices) · unmatched: _Higher rate but simplest setup, no code required, instant storefront_
- **playwright** — score 40 (4/5 bullets, 0/1 prices) · unmatched: _No limits on runs_
- **cursor** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **fumadocs** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **vercel-dns** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **nominatim-openstreetmap** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **stripe** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **testflight** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **perplexity-api** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **pocketbase** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **xai-grok** — score 50 (3/3 bullets, 0/1 prices) · unmatched: _—_
- **creem** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **deepseek** — score 50 (3/3 bullets, 0/1 prices) · unmatched: _—_
- **nextra** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **lark** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **paypal** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **polar** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **together-ai** — score 50 (3/3 bullets, 0/1 prices) · unmatched: _—_
- **weblate** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **hyperswitch** — score 50 (2/2 bullets, 0/1 prices) · unmatched: _—_
- **mistral** — score 65 (4/5 bullets, 1/2 prices) · unmatched: _500K TPM_
- **google-gemini** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **tebi** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _No documented rate limits_
- **turso** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **amplitude** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **auth0** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **plunk** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **qodana-jetbrains** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _No documented rate limits_
- **replit** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Compute caps enforced_
- **koyeb** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **mailgun** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **nextdns** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **cloudflare-workers-ai** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **mailtrap** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **taiga** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _No documented rate limits_
- **trieve** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **typesense** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **back4app** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Hard limits; Parse Server compatible_
- **chromatic** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **neon** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **supabase** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **youtrack** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _No documented rate limits_
- **algolia** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **argos-ci** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **mixpanel** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **posthog** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **supabase-auth** — score 75 (5/5 bullets, 1/2 prices) · unmatched: _—_
- **windsurf** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Credits reset monthly_

## §2 — Likely false-positive drift (16)

Unmatched bullets are generic tokens (`Free`, `OSS`, `No credit card`, etc.) that the curl heuristic can't match. Safe to defer unless you're re-verifying anyway. Sprint 4's Playwright upgrade with smarter token mapping fixes most of these.

- **docsify-github-pages** — score 25 (1/2 bullets, 0/1 prices) · unmatched: _Fully free (OSS + free hosting)_
- **starlight-astro** — score 25 (1/2 bullets, 0/1 prices) · unmatched: _Fully free (OSS, MIT license)_
- **docusaurus-github-pages** — score 25 (1/2 bullets, 0/1 prices) · unmatched: _Fully free (OSS + free hosting)_
- **betterstack** — score 50 (0/1 bullets, 1/1 prices) · unmatched: _Free tier_
- **umami-cloud** — score 50 (0/1 bullets, 1/1 prices) · unmatched: _Free tier_
- **emailjs** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free forever_
- **mailchimp** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free forever (heavily restricted)_
- **daily-co** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free plan (permanent)_
- **iconbuddy** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free tier_
- **mailersend** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free forever_
- **smtp2go** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free forever_
- **basecamp** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free plan_
- **surge-sh** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free plan_
- **rive** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free plan_
- **discord** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free (no paid requirement)_
- **loops** — score 75 (1/2 bullets, 1/1 prices) · unmatched: _Free forever_

## §3 — Bot-blocked (10) — manual eyeball

Site is up but returned HTTP 4xx/5xx to our curl. Browse manually; if the free tier still exists, no action needed.

- **netlify-dns** — HTTP 404 — https://docs.netlify.com/manage/domains/
- **canva** — HTTP 403 — https://www.canva.com/pricing/
- **oracle-cloud-always-free** — HTTP 403 — https://www.oracle.com/cloud/free/
- **vonage** — HTTP 403 — https://www.vonage.com/communications-apis/pricing/
- **hashicorp-vault** — HTTP 429 — https://www.hashicorp.com/en/lp/vault-p
- **linode-akamai** — HTTP 403 — https://www.linode.com/pricing/
- **namecheap-freedns** — HTTP 403 — https://www.namecheap.com/domains/freedns/
- **orama** — HTTP 404 — https://docs.orama.com/cloud/understanding-orama/pricing-limits
- **focalboard** — HTTP 530 — https://www.focalboard.com/
- **openai** — HTTP 403 — https://openai.com/api/pricing/

## §4 — JS-rendered pages (2) — Sprint 4 Playwright

Page loaded but extracted text was too short — pricing is rendered client-side. Re-verified by Playwright in Sprint 4.

- **gitpod** — https://gitpod.io/pricing
- **browserstack** — https://www.browserstack.com/pricing

## §5 — Connection errors (3) — retry

curl could not reach the page. Retry manually; update or remove the entry if persistent.

- **adaptable-io** — HTTP 0 — https://adaptable.io/pricing
- **coherence** — HTTP 0 — https://www.withcoherence.com/pricing
- **height** — HTTP 0 — https://height.app/pricing

## §6 — Weak sunset hits (8) — manual eyeball

Only matched the generic phrase `legacy plan`. Often appears on pricing pages describing existing grandfathered plans, NOT a free-tier sunset. Demoted from `sunset` to a normal verdict; review manually only if you want certainty.

- **onesignal** — phrase `legacy plan` — https://onesignal.com/pricing
- **phrase** — phrase `legacy plan` — https://phrase.com/pricing/
- **poeditor** — phrase `legacy plan` — https://poeditor.com/pricing/
- **revenuecat** — phrase `legacy plan` — https://www.revenuecat.com/pricing/
- **socket-dev** — phrase `legacy plan` — https://socket.dev/pricing
- **tailscale** — phrase `legacy plan` — https://tailscale.com/pricing
- **mixpanel** — phrase `legacy plan` — https://mixpanel.com/pricing/
- **tolgee** — phrase `legacy plan` — https://tolgee.io/pricing

## §7 — Known false-positive patterns (Sprint-4 calibration notes)

- **Generic bullets** like `Free`, `OSS`, `No credit card` can't be matched by token presence. Either skip them or special-case to semantic equivalents (`free` → `$0`, `free tier`, `forever free`).
- **`legacy plan` sunset regex** is too broad. Tighten to `legacy free plan` or require a co-matching sunset signal.
- **`price: 0` plans** score weakly because curl pages render `Free`, not `$0`. Map `price: 0` to the `"free"` text token.
- **Unit reformat** (`1 GB` vs `1000 MB`) still produces false negatives. Sprint-4 normalization pass.
- **JS-rendered pricing pages** (Stripe, Vercel marketing, Percy, GitPod) return 0 matches — Playwright in Sprint 4 fixes this.

## §8 — Full per-service detail

Open `data/pricing-verify-report.json` for the complete 302-record dataset (slug, score, matched/unmatched, http_status, sunset, verdict, batch).
