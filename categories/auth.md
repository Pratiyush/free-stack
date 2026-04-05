# Authentication & Identity

> Free authentication, identity, and user management services.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| WorkOS AuthKit | Free up to 1M MAU | 1M monthly active users, MFA included at all tiers | Enterprise SSO billed separately ($125/connection/mo) | ✅ 2026-04 | [workos.com/pricing](https://workos.com/pricing) |
| Clerk | Free up to 50K monthly retained users | 50,000 monthly retained users (users who return after first 24 hrs), no credit card required | - | ✅ 2026-04 | [clerk.com/pricing](https://clerk.com/pricing) |
| Supabase Auth | Free plan (Supabase platform) | 50,000 MAU, 2 projects, unlimited API requests | Projects pause after 7 days inactivity on free tier | ✅ 2026-04 | [supabase.com/pricing](https://supabase.com/pricing) |
| Firebase Auth | Spark plan (free) | 50,000 MAU for email/password and social logins, unlimited projects | Phone/SMS auth charged separately even on free tier; no enterprise SSO on Spark | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Logto | Free plan | 50,000 MAU, 3 applications, 1 M2M app, 1 API resource, 100K tokens/mo | No RBAC on free plan (removed Oct 2025), 1 developer seat, 1 webhook | ✅ 2026-04 | [logto.io/pricing](https://logto.io/pricing) |
| Auth0 | Free plan | 25,000 MAU, social connections (Google, GitHub, Facebook), passwordless login | No custom domains, limited MFA, no RBAC on free tier | ✅ 2026-04 | [auth0.com/pricing](https://auth0.com/pricing) |
| Stytch | Free plan | 10,000 MAU, 5 SSO/SCIM connections, 1,000 M2M tokens, 10,000 fingerprints | All auth methods included, phishing-resistant MFA, unlimited OAuth connections | ✅ 2026-04 | [stytch.com/pricing](https://stytch.com/pricing) |
| Descope | Free Forever plan | 7,500 MAU, 10 tenants, 3 SSO connections, 1 federated app | No overages allowed; must upgrade when any limit is hit (grace period provided) | ✅ 2026-04 | [descope.com/pricing](https://www.descope.com/pricing) |
| SuperTokens | Free (self-hosted: unlimited; cloud: 5K MAU) | Self-hosted: unlimited MAU, no restrictions. Cloud/SaaS: 5,000 MAU free, then $0.02/MAU | Open-source, can be fully self-hosted | ✅ 2026-04 | [supertokens.com/pricing](https://supertokens.com/pricing) |

## Notes

- **WorkOS AuthKit** stands out with 1M free MAU -- by far the most generous managed free tier for authentication.
- **Keycloak** is open-source and fully self-hostable with no user limits, but has no managed cloud free tier and is excluded from this list (it requires your own infrastructure).
- **SuperTokens** is unique in offering both a managed cloud tier and a fully open-source self-hosted option with no limits.
- Supabase Auth and Firebase Auth project-pause/inactivity policies may affect production suitability on the free tier.
