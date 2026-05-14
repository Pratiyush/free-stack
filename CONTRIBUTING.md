# Contributing to free-stack

Thanks for contributing! Here's how to do it right.

---

## Issue-First Workflow

**Every change must have a GitHub issue first.** Before making any PR:

1. Check existing issues — your idea may already be there
2. If not, create a new issue describing the change
3. Wait for a maintainer to acknowledge or tag it
4. Reference the issue number in your PR

This helps us track what's being worked on and avoids duplicate effort.

---

## Good First Issues

Look for issues tagged with these labels:

| Label | Meaning |
|-------|---------|
| `good first issue` | Perfect for first-time contributors |
| `add-service` | Add a new service entry |
| `verify` | Re-verify a service's free tier limits |
| `help wanted` | We need community help on this |

---

## Adding a Service

### 1. Pick the right category

Check the [README](README.md) for the category list. If your service doesn't fit any existing category, open an issue to suggest a new one.

### 2. Follow the table format

Every entry must use this exact format:

```markdown
| Service Name | What you get free | Specific limits | API/rate limits | Credit Card | Verified | Link |
```

**Example:**
```markdown
| Vercel | Hobby plan — static + serverless | 100GB bandwidth, 100 deploys/day | 1K API req/min | No | Apr 2026 | [vercel.com/pricing](https://vercel.com/pricing) |
```

### 3. Icons

We use [Lucide icons](https://github.com/lucide-icons/lucide) where a match exists for the service or its category. When adding a service, check if a relevant Lucide icon exists and include it if so.

### 4. Verify before submitting

- Visit the **official pricing page** (not a blog post)
- Confirm the free tier exists and note specific limits
- Add the current month as the verified date
- Link to the pricing page, not the homepage

### 5. Open a PR

- **ONE service per PR** (preferred) or a few related services max
- Create a branch: `add/[service-name]`
- PR title: `add: [service-name] to [category]`
- PR body: briefly explain what the service does
- Reference the issue: `Closes #123`

---

## Detailed Comparisons (Deferred to v2)

Detailed per-service comparison sections (pros/cons, best-use-cases, head-to-head tables) are deferred until the data-first restructure lands. Once services live as structured YAML (see [#372](https://github.com/Pratiyush/free-stack/issues/372)), comparison content will be reintroduced as schema-driven sections that stay consistent across categories. We will reopen scoped issues for community help once the infrastructure exists.

---

## Reporting Outdated Entries

If a service has changed its free tier or shut down:

1. Open an issue using the "Report Outdated" template
2. Include a link to the current pricing page
3. Describe what changed

---

## Quality Bar

We only accept entries that:

- Offer a **genuine free tier** (not just a free trial)
- Are **actively maintained** and operational
- Have **clear pricing documentation**
- Are **useful to developers** (no filler)

We will close PRs that:
- Don't reference a GitHub issue
- Add services without verification
- Use inconsistent formatting
- Add self-hosted software (this list is for SaaS/PaaS/IaaS only)
- Add services that only offer free trials

---

## Style Guide

- Service names: capitalize properly (e.g., "Supabase" not "supabase")
- Links: always link to the pricing page, not homepage
- Limits: be specific ("500MB" not "limited storage")
- One line per service — no multi-line descriptions
- No emojis in table cells (emojis only in category headers)
- Verified date: format as `Mon YYYY` (e.g., `Apr 2026`)
- Icons: use [Lucide icons](https://lucide.dev) where a match exists

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Add service | `add/[service]` | `add/supabase` |
| Update service | `update/[service]` | `update/vercel` |
| Expand category | `expand/[category]` | `expand/databases` |
| Fix | `fix/[description]` | `fix/dead-links` |
| Icons | `icons/[category]` | `icons/hosting` |

---

## Code of Conduct

Be respectful. This is a community resource. No spam, no self-promotion without genuine value.
