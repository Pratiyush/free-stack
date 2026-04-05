# Contributing to free-stack

Thanks for contributing! Here's how to do it right.

---

## Adding a Service

### 1. Pick the right category

Check the [README](README.md) for the category list. If your service doesn't fit any existing category, open an issue to suggest a new one.

### 2. Follow the table format

Every entry must use this exact format:

```markdown
| Service Name | What you get free | Specific limits | API/rate limits | ✅ YYYY-MM | [site](https://example.com) |
```

**Example:**
```markdown
| Vercel | Hobby plan — static + serverless | 100GB bandwidth, 100 deploys/day | 1K API req/min | ✅ 2026-04 | [vercel.com](https://vercel.com/pricing) |
```

### 3. Verify before submitting

- Visit the **official pricing page** (not a blog post)
- Confirm the free tier exists and note specific limits
- Add the current month as the verified date
- Link to the pricing page, not the homepage

### 4. Open a small PR

- **ONE service per PR** (preferred) or a few related services max
- PR title: `add: [service-name] to [category]`
- PR body: briefly explain what the service does

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
- Verified date: format as `✅ YYYY-MM`

---

## Code of Conduct

Be respectful. This is a community resource. No spam, no self-promotion without genuine value.
