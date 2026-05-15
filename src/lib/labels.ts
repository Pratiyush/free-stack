// Display-label constants. Kept separate from content.config.ts so they can
// be imported into Astro components without pulling in the zod runtime that
// content.config.ts also re-exports for build-time schema validation.

export type TierType = 'always-free' | 'free-plan' | 'trial-credit' | 'pay-as-you-go';

export type Subcategory = 'permanent' | 'expiring-credits' | 'limited';

export const TIER_LABELS: Record<TierType, string> = {
  'always-free': 'Always Free',
  'free-plan': 'Free Plan',
  'trial-credit': 'Trial Credit',
  'pay-as-you-go': 'Pay As You Go',
};

export const SUBCATEGORY_LABELS: Record<Subcategory, string> = {
  permanent: 'Permanent Free Tiers',
  'expiring-credits': 'Free Credits / Trial',
  limited: 'Severely Limited',
};

export const SUBCATEGORY_BLURBS: Record<Subcategory, string> = {
  permanent: 'Free tiers that work today and are advertised as permanent — no trial expiry.',
  'expiring-credits':
    "Free credits or trial offers that expire — track the expiry date in each service's notes.",
  limited: 'Free tiers that are technically free but too restrictive for production use.',
};

// Order in which subcategory sections render on category pages. Permanent
// comes first because it's the default and the most common case.
export const SUBCATEGORY_ORDER: readonly Subcategory[] = [
  'permanent',
  'expiring-credits',
  'limited',
] as const;
