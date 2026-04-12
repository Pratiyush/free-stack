# Authentication & Identity

> Free authentication, identity, and user management services.

| Service | Free Tier | Limits | Notes | Verified | Link |
|---------|-----------|--------|-------|----------|------|
| WorkOS AuthKit | Free up to 1M MAU | 1M monthly active users, MFA included at all tiers | Enterprise SSO billed separately ($125/connection/mo). No credit card required. Social login included. | ✅ 2026-04 | [workos.com/pricing](https://workos.com/pricing) |
| Clerk | Free up to 50K monthly retained users | 50,000 monthly retained users, 100 monthly retained organizations | No credit card required. Social login (Google, GitHub, Facebook, etc.) included. MFA requires Pro plan ($25/mo). Updated Feb 2026 with new plans. | ✅ 2026-04 | [clerk.com/pricing](https://clerk.com/pricing) |
| Supabase Auth | Free plan (Supabase platform) | 50,000 MAU, 2 projects, unlimited API requests | Hard MAU ceiling -- no overage option, must upgrade. Projects pause after 7 days inactivity. 500 MB database, 1 GB file storage included. | ✅ 2026-04 | [supabase.com/pricing](https://supabase.com/pricing) |
| Firebase Auth | Spark plan (free) | 3,000 DAU (daily active users) for most providers; 50,000 MAU for email/social on Blaze (pay-as-you-go with free tier) | Spark plan uses DAU limit (3,000/day). Blaze plan has 50K MAU free tier. Phone/SMS auth charged separately. No enterprise SSO on Spark. | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Auth0 | Free plan | 25,000 MAU, unlimited social + Okta connections, passwordless login | Custom domains now included on free plan. Organizations included. B2B plans upgraded Jan 2026 with free Self-Service SSO and SCIM. No credit card required. | ✅ 2026-04 | [auth0.com/pricing](https://auth0.com/pricing) |
| Kinde | Free plan | 10,500 MAU, all core features included | No credit card required. Social login, passkeys, passwordless, custom domains, organizations, RBAC all included on free tier. No feature gates. B2B plan upgraded to 25K MAU (Feb 2026). | ✅ 2026-04 | [kinde.com/pricing](https://www.kinde.com/pricing/) |
| Logto | Free plan | 50,000 MAU, 3 applications, 1 M2M app, 1 API resource, 100K tokens/mo | RBAC removed from free plan (Oct 2025) -- now $32 add-on on Pro. Social login included. 1 developer seat, 1 webhook. Refresh tokens no longer count toward usage. Open-source self-hosted option also available. | ✅ 2026-04 | [logto.io/pricing](https://logto.io/pricing) |
| Stytch | Free plan | 10,000 MAU, 5 SSO/SCIM connections, 1,000 M2M tokens, 10,000 fingerprints | All auth methods included with no feature gates: MFA, SSO, RBAC, SCIM, OTPs, unlimited OAuth connections. Overage billed at usage rates (no forced upgrade). | ✅ 2026-04 | [stytch.com/pricing](https://stytch.com/pricing) |
| PropelAuth | Free plan | 10,000 MAU, unlimited organizations | B2B-focused. Custom domains, 2FA, RBAC included on free plan. Growth plan at $150/mo adds user impersonation, SCIM. No credit card required. | ✅ 2026-04 | [propelauth.com/pricing](https://www.propelauth.com/pricing) |
| Hanko | Free plan | 10,000 MAU | Passkey-first authentication. $0.01/MAU overage. Open-source self-hosted option available. Startup plan offers 1M MAU free (if <$500K ARR / <$1M funding). Social login and passwordless included. | ✅ 2026-04 | [hanko.io/pricing](https://www.hanko.io/pricing) |
| Descope | Free Forever plan | 7,500 MAU, 10 tenants, 3 SSO connections, 1 federated app | No-code/low-code auth flows. No overages allowed -- must upgrade when limit hit (grace period provided). All auth methods available on free tier. | ✅ 2026-04 | [descope.com/pricing](https://www.descope.com/pricing) |
| SuperTokens | Free (self-hosted: unlimited; cloud: 5K MAU) | Self-hosted: unlimited MAU, no restrictions. Cloud: 5,000 MAU free, then $0.02/MAU | Open-source, fully self-hostable. Cloud and self-hosted have same features. Linear pricing with no tier jumps. | ✅ 2026-04 | [supertokens.com/pricing](https://supertokens.com/pricing) |
| Passage by 1Password | Free up to 1,000 MAU | 1,000 MAU free, then $0.02-$0.05/MAU/mo | Passkey-focused: Passkey Complete (full identity platform) and Passkey Flex (add passkeys to existing auth). Niche -- best for passkey-only use cases. | ✅ 2026-04 | [passage.1password.com/pricing](https://passage.1password.com/pricing) |
| Ory (Kratos) | Free (self-hosted: unlimited; cloud: free developer plan) | Self-hosted: unlimited, open-source. Cloud (Ory Network): free developer plan for dev/staging; Production from $770/yr ($0.14/aDAU/mo) | Uses average daily active users (aDAU) billing -- can be ~85% cheaper than MAU billing. Supports passkeys, social login, OIDC, magic link, MFA, SAML, TOTP. Headless/API-first -- bring your own UI. | ✅ 2026-04 | [ory.com/pricing](https://www.ory.com/pricing) |

## Notes

- **WorkOS AuthKit** stands out with 1M free MAU -- by far the most generous managed free tier for authentication.
- **Clerk** updated pricing in Feb 2026; 50K monthly retained users (not MAU -- users who return after first 24 hrs) with no credit card.
- **Firebase Auth** changed to a DAU-based limit (3,000/day) on the Spark plan. The commonly cited 50K MAU applies to the Blaze (pay-as-you-go) plan's free tier, which requires a credit card.
- **Auth0** upgraded B2B plans in Jan 2026 adding free Self-Service SSO and SCIM. Custom domains now included on the free plan.
- **Kinde** is a strong all-rounder: 10,500 MAU with zero feature gates (social, passkeys, passwordless, RBAC, custom domains all free). B2B plan expanded to 25K MAU in Feb 2026.
- **Logto** removed RBAC from the free plan in Oct 2025 (now a $32/mo add-on). Still offers 50K MAU free.
- **Hanko** is passkey-first with a generous startup program (1M MAU free if under $500K ARR).
- **PropelAuth** targets B2B specifically with 10K MAU free and RBAC/2FA included.
- **Ory Kratos** and **SuperTokens** are both open-source and fully self-hostable with no user limits -- best if you can manage your own infrastructure.
- **Passage by 1Password** is niche -- best for adding passkey authentication to existing systems rather than full identity management.
- **Keycloak** is open-source and fully self-hostable with no user limits but has no managed cloud free tier and is excluded from this list (requires your own infrastructure).
- **Frontegg** offers 7,500 MAU free with social login included, but advanced SSO, audit logs, and branding require paid plans -- excluded from the main table as its free tier is less competitive and primarily B2B/enterprise-focused.
