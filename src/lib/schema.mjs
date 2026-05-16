/**
 * Single source of truth for the free-stack content Zod schemas.
 *
 * This file is plain ESM (`.mjs`) so it can be imported by:
 *   - `src/content.config.ts` (Astro's content collections)
 *   - `scripts/validate-services.mjs` (`pnpm validate`)
 *   - `scripts/audit-services.mjs` (`pnpm audit-services`)
 *
 * Story 5.10 — Sprint 5 code-quality cleanup. Previously the scripts redefined
 * a subset of these schemas; that drift caused script-validation to silently
 * pass YAML that the Astro build would later reject. Centralising here keeps
 * the three consumers in lock-step.
 */
// Astro's content collection runtime uses `zod/v4` (the v4-preview shipped
// alongside zod@3.25). Match that import so the schemas pass through Astro's
// JSON-schema generator without `_zod.def` shape mismatches.
import * as z from 'zod/v4';

export const TIER_TYPES = ['always-free', 'free-plan', 'trial-credit', 'pay-as-you-go'];

export const SUBCATEGORIES = ['permanent', 'expiring-credits', 'limited'];

export const BILLING_TYPES = ['monthly', 'annual', 'one-time', 'usage-based', 'free'];

export const pricingTier = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  // v0.9.0 additions — content depth across all 300 services.
  features: z.array(z.string().min(2)).optional(),
  cta_url: z.string().url().optional(),
  billing: z.enum(BILLING_TYPES).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  category: z.string().regex(/^[a-z0-9-]+$/),
  subcategory: z.enum(SUBCATEGORIES).optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'brand_color must be a #RRGGBB hex')
    .optional(),
  logo: z.string().regex(/^\/logos\/.+\.svg$/, 'logo must be /logos/<slug>.svg'),
  summary: z
    .string()
    .min(10, 'summary must be at least 10 chars')
    .max(180, 'summary must be 180 chars or fewer'),
  notes: z.string().optional(),
  tier_type: z.enum(TIER_TYPES),
  free_tier: z.array(z.string().min(3)).min(1, 'at least one free_tier bullet required'),
  paid_tier_highlights: z.array(z.string().min(3)).optional(),
  pricing: z.array(pricingTier).min(1, 'at least one pricing tier required'),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  official_url: z.string().url(),
  pricing_url: z.string().url().optional(),
  docs_url: z.string().url().optional(),
  date_added: z.coerce.date(),
  date_updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  date_verified: z.coerce.date(),
  last_changed: z.coerce.date().optional(),
  maintainer_notes: z.string().optional(),
  submitted_by: z.string().optional(),
  facets: z
    .object({
      // Quotas
      team_seats: z.number().int().nonnegative().nullable().optional(),
      projects: z.number().int().nonnegative().nullable().optional(),
      storage_gb: z.number().nonnegative().nullable().optional(),
      bandwidth_gb_month: z.number().nonnegative().nullable().optional(),
      requests_per_day: z.number().int().nonnegative().nullable().optional(),
      requests_per_month: z.number().int().nonnegative().nullable().optional(),
      // Capabilities (tristate: true/false/null)
      custom_domain: z.boolean().nullable().optional(),
      ssl: z.boolean().nullable().optional(),
      api_access: z.boolean().nullable().optional(),
      oss: z.boolean().nullable().optional(),
      self_host: z.boolean().nullable().optional(),
      // Restrictions
      cc_required: z.boolean().nullable().optional(),
      auto_pause_days: z.number().int().nonnegative().nullable().optional(),
      branding_required: z.boolean().nullable().optional(),
      // For credits/trials
      trial_days: z.number().int().nonnegative().nullable().optional(),
      credit_usd: z.number().nonnegative().nullable().optional(),
      credit_expiry_days: z.number().int().nonnegative().nullable().optional(),
      // Operational
      support_channels: z.array(z.enum(['community', 'email', 'chat', 'phone'])).optional(),
      data_retention_days: z.number().int().nonnegative().nullable().optional(),
    })
    .partial()
    .optional(),
  sources: z
    .object({
      pricing: z
        .object({
          url: z.string().url(),
          section: z.string().optional(),
          verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
        .optional(),
      brand: z
        .object({
          url: z.string().url(),
          type: z.enum([
            'simpleicons',
            'lucide',
            'devicon',
            'lobe-icons',
            'selfhst',
            'custom',
            'manual',
          ]),
          verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
        .optional(),
      overrides: z
        .record(
          z.string(),
          z.object({
            url: z.string().url(),
            verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(60),
  blurb: z.string().min(10).max(220),
  icon: z.string().optional(),
  order: z.number().default(100),
  parent: z.string().nullable().optional(),
});
