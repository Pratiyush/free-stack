# 🔥 Backend as a Service (BaaS)

> Managed backend platforms with auth, database, storage, and functions built-in.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Firebase | Spark plan (no credit card required) | 1 GiB Firestore storage, 10 GB Realtime DB storage, 10 GB/mo download, 50K auth MAUs, 2M Cloud Function invocations/mo, 10 GB hosting storage | 100 simultaneous Realtime DB connections, Cloud Storage requires Blaze plan for new buckets as of Feb 2026 | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Supabase | Free plan (no credit card required) | 2 projects, 500 MB database, 1 GB file storage, 50K auth MAUs, 500K edge function invocations/mo, 5 GB bandwidth, unlimited API requests | Projects pause after 7 days of inactivity, no backups, no SLA | ✅ 2026-04 | [supabase.com/pricing](https://supabase.com/pricing) |
| Appwrite | Free plan | 2 projects, 500K DB reads/mo, 250K DB writes/mo, 750K function executions/mo, 5 GB bandwidth | Projects no longer paused (as of Sep 2025), freezes on limit exceed (read-only) | ✅ 2026-04 | [appwrite.io/pricing](https://appwrite.io/pricing) |
| Convex | Starter plan (no credit card required) | 1M function calls/mo, 6 team members, 40 deployments, document/file storage included | Perpetual free tier, pay-as-you-go beyond limits | ✅ 2026-04 | [convex.dev/pricing](https://www.convex.dev/pricing) |
| Nhost | Starter plan (free forever) | 1 GB database, 1 GB storage, 5 GB bandwidth, Hasura GraphQL engine, auth & functions included | 1 active project per org, pauses after 1 week of inactivity | ✅ 2026-04 | [nhost.io/pricing](https://nhost.io/pricing) |
| Back4App | Free plan (no credit card required) | 25K requests/mo, 250 MB data storage, 1 GB file storage, 1 GB transfer, up to 5 projects | Hard limits, Parse Server compatible | ✅ 2026-04 | [back4app.com/pricing](https://www.back4app.com/pricing) |
| Backendless | Free plan (no credit card required) | Limited data/file storage, limited API calls, auth/DB/push/serverless included, visual app builder | Exceeding limits blocks API requests, 30-day grace period to fix or upgrade | ✅ 2026-04 | [backendless.com/pricing](https://backendless.com/pricing/) |
| PocketBase | Free (open-source, self-hosted) | Unlimited -- single Go binary, embedded SQLite, auth/storage/realtime built-in | Self-hosted only (no managed free cloud), runs on any $5/mo VPS | ✅ 2026-04 | [pocketbase.io](https://pocketbase.io/) |

## Notes

- Firebase's Cloud Storage now requires the Blaze (pay-as-you-go) plan for new default buckets as of February 2026.
- Supabase and Nhost pause projects on inactivity -- not ideal for production without upgrading.
- PocketBase is fully self-hosted (single binary), so "free" means the software itself; you provide the server.
- Convex stands out with a generous perpetual free tier and no project pausing.
