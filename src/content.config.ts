import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { serviceSchema, categorySchema } from '~/lib/schema';

const services = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/services' }),
  schema: serviceSchema,
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/categories' }),
  schema: categorySchema,
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
