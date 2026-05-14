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
  permanent: 'Permanent Free Tier',
  'expiring-credits': 'Free Credits (Expire)',
  limited: 'Severely Limited',
};
