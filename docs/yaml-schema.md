# YAML schema reference

Every service in `src/content/services/<slug>.yml` is validated against the Zod schema in `src/lib/schema.mjs`. This page documents every recognised field. The schema is the source of truth — when in doubt, read the file.

## Core required fields

| Field | Type | Notes |
|---|---|---|
| `name` | string (1-60) | Display name as published. |
| `slug` | kebab-case string | Matches the filename. |
| `category` | category slug | Must exist in `src/content/categories/`. |
| `logo` | `/logos/<slug>.svg` | Local path; file must exist in `public/logos/`. |
| `summary` | string (10-180) | One-sentence "what is this." |
| `tier_type` | enum | `always-free` · `free-plan` · `trial-credit` · `pay-as-you-go`. |
| `free_tier` | array of strings | At least 1 bullet. Each ≥3 chars. |
| `pricing` | array of pricingTier | At least 1 row (typically a `Free` row). |
| `official_url` | URL | Homepage. |
| `date_added` | date | First time we listed it. |
| `date_verified` | date | **Bump on every PR that touches the entry.** Drives the 60-day stale cron. |

## Optional core fields

| Field | Type | Notes |
|---|---|---|
| `subcategory` | enum | `permanent` · `expiring-credits` · `limited`. Buckets within a category. |
| `brand_color` | `#RRGGBB` hex | From simpleicons.org cascade. `#888888` = placeholder. |
| `notes` | string | Any caveat: auto-pause behaviour, geographic restrictions, "no scraping" ToS line. |
| `tier_type` notes via `pricing[].description` | string | Per-tier elaboration. |
| `tags` | array of kebab-case | Auto-derivable from category + free_tier text. ≤8 recommended. |
| `paid_tier_highlights` | array of strings | Mirror of `free_tier[]` for the paid side. |
| `pricing_url` · `docs_url` | URLs | Preferred over homepage for pricing/docs. |
| `date_updated` | YYYY-MM-DD | Last content change (vs `date_verified` which can be a no-content-change re-verification). |
| `last_changed` | date | What pricing actually moved — for diff-tracking. |
| `maintainer_notes` · `submitted_by` | strings | Provenance. |

## `pricing[]` rows (`pricingTier`)

| Field | Type | Notes |
|---|---|---|
| `name` | string | "Free" · "Pro" · "Team" · "Enterprise" · "Pay-as-you-go". |
| `price` | number or string | Numeric ($/mo) for fixed plans, string ("Custom" / "Contact sales") otherwise. |
| `unit` | string | `/user/mo` · `/mo` · `/req` · etc. |
| `description` | string | One-line summary of what this tier is. |
| `features` | array of strings | 3-7 bullets of what's included. |
| `cta_url` | URL | Tier-specific signup link if there's a deep link. |
| `billing` | enum | `monthly` · `annual` · `one-time` · `usage-based` · `free`. |

## `facets:` block — structured quotas + capabilities

Optional. Every key is optional and nullable (tristate where appropriate). The audit script extracts these from `free_tier` text via heuristics in `scripts/backfill-facets-tags.mjs`.

| Key | Type | Meaning |
|---|---|---|
| `team_seats` | int | How many users on the free plan. |
| `projects` | int | Project / workspace cap. |
| `storage_gb` | number | Persistent storage allowance. |
| `bandwidth_gb_month` | number | Outgoing bandwidth allowance. |
| `requests_per_day` · `requests_per_month` | int | API/request budget. |
| `custom_domain` · `ssl` · `api_access` · `oss` · `self_host` | bool | Capability flags. |
| `cc_required` | bool | Credit card required at signup. |
| `auto_pause_days` | int | Idle threshold before the service pauses. |
| `branding_required` | bool | "Made with X" attribution must remain visible. |
| `trial_days` · `credit_usd` · `credit_expiry_days` | numbers | For `trial-credit` services. |
| `support_channels` | array enum | `community` · `email` · `chat` · `phone`. |
| `data_retention_days` | int | How long the service keeps your data after deletion. |

## v2.0.0 capture-everything blocks

All optional. Goal: model what *exists* in the wild so future renderers and audits have data. Renderers should null-check every key.

### `signup_friction`
The hidden onboarding tax.

| Key | Type | When to use |
|---|---|---|
| `requires_cc` | bool | Mirror of `facets.cc_required` — duplicated here for grouping. |
| `phone_verification` | bool | SMS / phone OTP step. |
| `github_gate` | bool | Account creation requires GitHub OAuth (no email signup). |
| `email_confirmation` | bool | Cold-email verification before first use. |

### `free_tier_limits`
Soft floors that the free tier puts under your usage.

| Key | Type | When to use |
|---|---|---|
| `auto_pause_threshold_days` | int | Days of idleness before the service freezes the account. |
| `cold_start_latency_ms` | int | Observed cold-start latency in milliseconds. |
| `geographic_regions` | array of strings | If free tier limited to a subset (e.g. `['us-east', 'eu-west']`). |
| `account_age_gate_days` | int | "After 30 days you must upgrade or downgrade." |

### `regional_pricing`
For services that price per region. Array of rows.

| Key | Type | When to use |
|---|---|---|
| `region` | string | Free-text region name. |
| `price` | number | Numeric price. |
| `currency` | ISO-4217 | `USD`, `EUR`, `INR`, etc. Audit warns if unrecognised. |
| `notes` | string | Anything regional ("only available to India-billing accounts"). |

### `tos_red_flags`
Array of short strings flagging policy clauses that matter for free-tier users. Examples:
- `"no scraping"` · `"no automated agents"` · `"usage can be revoked at any time"` · `"closed to new signups"` · `"data ownership transfers to provider on inactive accounts"`

### `refund_policy`
Helps signal credibility for paid tiers.

| Key | Type | When to use |
|---|---|---|
| `days` | int | Refund window in days. |
| `percentage` | number 0-100 | Partial-refund percentage if applicable. |
| `notes` | string | "Pro-rated minus payment-processor fees", etc. |

### `support_sla`
Operational expectations.

| Key | Type | When to use |
|---|---|---|
| `tier` | enum | `free` (community only) · `basic` (email, business-hours) · `premium` (chat, 24x7). |
| `response_time_hours` | number | Promised response time. |
| `availability` | enum | `business-hours` · `24x7`. |

### `compliance_certifications`
Array of recognised cert names. Audit will warn if an unknown string appears. Recognised: `SOC2` · `HIPAA` · `GDPR` · `ISO27001` · `PCI-DSS` · `CCPA`.

### `inactive_account_policy`
Often the most important free-tier risk — services that delete inactive data are unsafe for long-term storage.

| Key | Type | When to use |
|---|---|---|
| `days_until_deletion` | int | Days of inactivity before data is purged. |
| `warning_days` | int | Days before deletion when the service notifies you. |
| `data_recovery_possible` | bool | Whether deleted data can be recovered. |

### `rate_limits`
Performance boundaries beyond the storage/bandwidth in `facets`.

| Key | Type | When to use |
|---|---|---|
| `requests_per_second` | int | Per-second cap. |
| `concurrent_connections` | int | Maximum open connections. |
| `burst_allowance` | int | Permitted burst above the steady-state. |

### `contract_terms`
For paid tiers only — what's hidden in the fine print.

| Key | Type | When to use |
|---|---|---|
| `min_commitment_months` | int | Annual lock-in if any. |
| `auto_renewal` | bool | Defaults to auto-renew or to lapse? |
| `cancellation_notice_days` | int | "Give us N days written notice." |

## `sources:` block — per-fact provenance

Optional. Lets a reader audit any fact in the YAML back to its source URL on a specific date.

```yaml
sources:
  pricing:
    url: https://anthropic.com/pricing
    section: API Pricing
    verified: 2026-05-16
  brand:
    url: https://simpleicons.org/anthropic
    type: simpleicons # one of: simpleicons / lucide / devicon / lobe-icons / selfhst / custom / manual
    verified: 2026-05-16
  overrides:
    free_tier:
      url: https://anthropic.com/api
      verified: 2026-05-16
```

## Audit warnings

Run `pnpm audit-services --no-http`. Warnings (not errors) surface where capture-everything data is missing:

| Trigger | Warning |
|---|---|
| `tier_type=free-plan` AND no `signup_friction` | "capture cc/phone/github gates" |
| `pricing[].name` matches `/enterprise/i` AND no `support_sla` | "support_sla is missing" |
| `regional_pricing[].currency` not in the ISO-4217 short list | "currency not recognised" |
| `brand_color` is `#888888` | "placeholder brand_color" (story 3.6 cascade fallback) |
| `public/logos/<slug>.svg` missing | "missing logo file" |

## Adding a new field

1. Edit `src/lib/schema.mjs` — add the field as optional + partial where appropriate.
2. Run `pnpm validate` — confirm all 327 existing YAMLs still validate.
3. Document the field here.
4. Optionally extend `scripts/audit-services.mjs` with a domain warn when the field is missing on services where it should exist.
5. Optionally extend `scripts/backfill-facets-tags.mjs` (or write a sibling backfill script) to populate the field from existing text.
