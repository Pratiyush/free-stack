/**
 * TypeScript re-export of the canonical Zod schemas.
 *
 * The runtime objects live in `./schema.mjs` so Node-only scripts
 * (`pnpm validate`, `pnpm audit-services`) can import them without a build
 * step. This `.ts` shim gives Astro components and `content.config.ts` typed
 * access to the same values via `~/lib/schema`.
 */
export {
  TIER_TYPES,
  SUBCATEGORIES,
  BILLING_TYPES,
  pricingTier,
  serviceSchema,
  categorySchema,
} from './schema.mjs';
