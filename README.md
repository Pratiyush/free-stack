# opentier

> **300 verified developer free tiers across 27 categories — every record a typed YAML, validated by Zod, re-checked on a monthly cron.**

Browse the catalog: **[opentier.dev](https://opentier.dev)** *(once DNS lands — preview at [pratiyush.github.io/opentier](https://pratiyush.github.io/opentier))*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Data: CC0](https://img.shields.io/badge/data-CC0-cc0?style=flat-square)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Categories](https://img.shields.io/badge/categories-27-blue?style=flat-square)](#categories)
[![Services](https://img.shields.io/badge/services-300-green?style=flat-square)](#categories)
[![Verified](https://img.shields.io/badge/verified-May%202026-orange?style=flat-square)](#methodology)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro%206-ff5d01?style=flat-square)](https://astro.build)

> **A note on history.** opentier was previously called "free-stack" and lived at `freestack.is-a.dev`. The data, the verification cron, and the takedown SLA carry over unchanged. Old release notes still mention the previous name — intentional, the history is the record.

---

## Why opentier?

Most "free-for-dev" lists are abandoned, vague, or stuck in a single giant Markdown file. opentier is a structured catalog:

- **One typed YAML per service** in `src/content/services/<slug>.yml`, schema-checked at build time.
- **Specific free-tier limits** — quotas, rate limits, CC-required flags, trial windows — captured as machine-readable fields, not buzzwords.
- **Verified dates on every entry** — a `date_verified` field, re-checked against the live pricing page on a published cadence.
- **Sunsetted services stay out** — services that pulled their free tier are listed below in "Services We Don't Include" with a one-line reason.
- **Open data** — the YAML records are public, the schema lives in [`src/content.config.ts`](src/content.config.ts), and a flat-file export ships with each release.

---

## How the data is shaped

Every service is a single YAML record. The full schema is in [`src/content.config.ts`](src/content.config.ts); a record looks like this:

```yaml
name: Backblaze B2
slug: backblaze-b2
category: storage
brand_color: '#E32636'
logo: /logos/backblaze-b2.svg

summary: Cloud storage with 10 GB free, 1 GB daily downloads, and S3-compatible API at no cost.

tier_type: always-free

free_tier:
  - 10 GB storage
  - 1 GB download/day
  - 2.5K Class B and 2.5K Class C transactions/day

pricing:
  - name: Free
    price: 0
    unit: /month
  - name: Pay-as-you-go
    description: $0.01/GB/mo storage
    price: 'Usage'

tags: [object-storage, s3-compatible, cloud-storage]
official_url: https://www.backblaze.com/
pricing_url: https://www.backblaze.com/cloud-storage/pricing
date_added: 2026-05-15
date_verified: 2026-05-15
```

Optional `facets` (typed quotas/capabilities) and `sources` (where each fact was verified) extend the record without breaking the base shape — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full field list.

---

## Categories

The full taxonomy lives in [`docs/category-taxonomy.md`](docs/category-taxonomy.md) and as YAML in [`src/content/categories/`](src/content/categories). The 27 categories cover hosting, databases, auth, AI/ML APIs, email & messaging, storage, search, mobile, testing/CI, dev tools, DNS, documentation, security, communication, PaaS, BaaS, design, payments, collaboration, code quality, project management, maps, containers, logs, translation, IaaS, and analytics.

Browse them on the site at **[opentier.dev/catalog](https://opentier.dev/catalog)** or open any category page directly (e.g. `/category/storage`).

---

## Methodology

The full inclusion/exclusion rules are documented on the site at **[opentier.dev/methodology](https://opentier.dev/methodology)** (source: [`src/pages/methodology.astro`](src/pages/methodology.astro)).

In short:

- **Tier types we accept:** `always-free`, `free-plan`, `trial-credit`, `pay-as-you-go` (with a meaningful free baseline).
- **Tier types we reject:** 14-day trials calling themselves "free", non-commercial-only gates on essentials, undisclosed CC-required signups, abandoned tools.
- **Re-verification cadence:** every entry was re-verified during the Sprint 3 pricing-drift sweep ([`docs/sprints/sprint-3-pricing-drift.md`](docs/sprints/sprint-3-pricing-drift.md)). Ongoing verification moves to a weekly cron in Sprint 5; the site weekly link-check (`.github/workflows/link-check.yml`) already runs against all `pricing_url`s.

---

## Services We Don't Include

These once had free tiers but don't anymore:

| Service       | Removed  | Reason                              |
| ------------- | -------- | ----------------------------------- |
| PlanetScale   | Apr 2024 | Free tier removed                   |
| ElephantSQL   | Jan 2025 | Service shut down                   |
| Heroku        | Nov 2022 | Free tier removed                   |
| SendGrid      | May 2025 | Free tier removed                   |
| Railway       | 2024     | Trial credits only                  |
| Fly.io        | 2024     | Free tier removed for new users     |
| Fauna         | May 2025 | Service shut down                   |
| Travis CI     | 2020     | No meaningful free tier             |
| Microsoft AppCenter | Mar 2025 | Retired                       |

If a service in the catalog stops offering a real free tier, it moves here (and out of `src/content/services/`).

---

## Contributing

Full guide in [CONTRIBUTING.md](CONTRIBUTING.md). The short version:

1. **Open a GitHub issue first** describing what you want to add, update, or remove. Wait for the maintainer to label it.
2. **Once labelled, open a PR** that edits the YAML at `src/content/services/<slug>.yml` directly (or scaffolds a new one with `pnpm new:service <slug>`). Sprint 4 will add a bot that scaffolds the YAML from the issue automatically; until then, hand-edit.
3. **Run the local gate** before pushing: `pnpm lint && pnpm validate && pnpm check-logos && pnpm audit-services --no-http && pnpm build`. All five must pass.
4. **Use Conventional Commits** for the PR title (`feat:`, `fix:`, `content:`, `docs:`, `chore:`) — the lint workflow enforces this.

---

## Releases

Releases follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) and [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Every shippable change lands as an annotated tag with matching release notes:

- [`CHANGELOG.md`](CHANGELOG.md) — rolling per-version log
- [`release-notes/`](release-notes/) — per-tag release notes with a user-facing first line ([template](release-notes/_TEMPLATE.md))
- GitHub Releases — published from `release-notes/vX.Y.Z.md` once the deploy is green

See the [release-notes README](release-notes/README.md) for the tag/release workflow.

---

## License

[MIT](LICENSE)

---

Made by [Pratiyush](https://github.com/Pratiyush).
