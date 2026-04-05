# Backend as a Service (BaaS)

> Managed backend platforms with auth, database, storage, and functions built-in.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Firebase** | Spark plan (no credit card required) | 1 GiB Firestore storage, 10 GB Realtime DB storage, 10 GB/mo download, 50K auth MAUs, 2M Cloud Function invocations/mo, 10 GB hosting storage | 100 simultaneous Realtime DB connections; Cloud Storage requires Blaze plan as of Feb 2026 (no-cost usage tier still applies on Blaze) | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| **Supabase** | Free plan (no credit card required) | 2 projects, 500 MB database, 1 GB file storage, 50K auth MAUs, 500K edge function invocations/mo, 5 GB bandwidth, unlimited API requests | Projects pause after 7 days of inactivity, no backups, no SLA | ✅ 2026-04 | [supabase.com/pricing](https://supabase.com/pricing) |
| **Appwrite** | Free plan | 2 projects, 500K DB reads/mo, 250K DB writes/mo, 750K function executions/mo, 2M messaging/mo, 250 concurrent realtime connections, 5 GB bandwidth | Projects **pause after 7 days of inactivity** (policy updated Feb 2026); freezes read-only on limit exceed | ✅ 2026-04 | [appwrite.io/pricing](https://appwrite.io/pricing) |
| **Convex** | Starter plan (no credit card required) | 1M function calls/mo, 6 team members, 40 deployments, document/file storage included | Perpetual free tier, no project pausing, pay-as-you-go beyond limits | ✅ 2026-04 | [convex.dev/pricing](https://www.convex.dev/pricing) |
| **Nhost** | Starter plan (free forever) | 1 GB database, 1 GB storage, 5 GB bandwidth, Hasura GraphQL engine, auth & functions included | 1 active project per org, pauses after 1 week of inactivity; reactivates instantly | ✅ 2026-04 | [nhost.io/pricing](https://nhost.io/pricing) |
| **Strapi Cloud** | Free plan (no credit card required) | 2,500 API requests/mo, 500 database entries, 10 GB storage, 10 GB bandwidth, 100 emails/mo, 1 production environment | Auto cold-start on inactivity; no overages (hard cap); personal/non-commercial use only | ✅ 2026-04 | [strapi.io/pricing-cloud](https://strapi.io/pricing-cloud) |
| **Directus Cloud** | Community Cloud (free) | Unlimited users, roles, collections, items, API requests, and bandwidth; dedicated server + SQL database, asset storage, global CDN | No quota limits on usage; 24/7 system monitoring; BSL license (free for orgs under $5M revenue) | ✅ 2026-04 | [directus.io/pricing](https://directus.io/pricing) |
| **Back4App** | Free plan (no credit card required) | 25K requests/mo, 250 MB data storage, 1 GB file storage, 1 GB transfer, up to 5 projects | Hard limits; Parse Server compatible | ✅ 2026-04 | [back4app.com/pricing](https://www.back4app.com/pricing) |
| **Backendless** | Free plan (no credit card required) | 20 data tables, 15K data objects, 1 GB file storage, up to 5 apps, unlimited API calls | 300 API calls/min rate limit; exceeding fixed limits blocks app with 30-day grace period | ✅ 2026-04 | [backendless.com/pricing](https://backendless.com/pricing/) |
| **PocketBase** | Free (open-source, self-hosted) | Unlimited -- single Go binary, embedded SQLite, auth/storage/realtime built-in | Self-hosted only (no managed free cloud), runs on any $5/mo VPS | ✅ 2026-04 | [pocketbase.io](https://pocketbase.io/) |

## Notes

- **Firebase** Cloud Storage now requires the Blaze (pay-as-you-go) plan as of February 2026. However, the no-cost usage allowance still applies on Blaze, so you may not actually pay anything at low usage.
- **Appwrite** reversed its Sep 2025 no-pause policy and now pauses free projects after 7 days of inactivity (updated Feb 2026). Data is preserved; projects reactivate from the Console.
- **Supabase** and **Nhost** also pause projects on inactivity -- not ideal for production without upgrading.
- **Convex** stands out with a generous perpetual free tier, no project pausing, and no credit card required.
- **Directus Community Cloud** is remarkably generous: unlimited users, items, API requests, and bandwidth. The BSL license is free for organizations under $5M revenue.
- **Strapi Cloud** free plan is new and useful for headless CMS needs, but the 2,500 API requests/mo and 500 entries limit is tight. Intended for personal/non-commercial use.
- **PocketBase** is fully self-hosted (single binary), so "free" means the software itself; you provide the server.
