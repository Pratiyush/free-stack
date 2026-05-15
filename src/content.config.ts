import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const TIER_TYPES = ['always-free', 'free-plan', 'trial-credit', 'pay-as-you-go'] as const;

const SUBCATEGORIES = ['permanent', 'expiring-credits', 'limited'] as const;

const pricingTier = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/services' }),
  schema: z.object({
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
    pricing: z.array(pricingTier).min(1, 'at least one pricing tier required'),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    official_url: z.string().url(),
    pricing_url: z.string().url().optional(),
    docs_url: z.string().url().optional(),
    date_added: z.coerce.date(),
    date_verified: z.coerce.date(),
    last_changed: z.coerce.date().optional(),
    maintainer_notes: z.string().optional(),
    submitted_by: z.string().optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/categories' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1).max(60),
    blurb: z.string().min(10).max(220),
    icon: z.string().optional(),
    order: z.number().default(100),
    parent: z.string().nullable().optional(),
  }),
});

export const collections = { services, categories };

// Display labels for tier_type and subcategory live in src/lib/labels.ts so
// they can be imported into components without pulling zod into the runtime
// bundle.
export {
  TIER_LABELS,
  SUBCATEGORY_LABELS,
  SUBCATEGORY_BLURBS,
  SUBCATEGORY_ORDER,
} from '~/lib/labels';
export type { TierType, Subcategory } from '~/lib/labels';
