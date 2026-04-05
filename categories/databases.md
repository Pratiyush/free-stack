# Databases

> Free managed database services -- SQL, NoSQL, key-value, and edge databases.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Supabase | Free plan (Postgres) | 500MB database storage, 1GB file storage, 5GB egress/mo, 50K monthly active users, 2 projects | Pauses after 7 days inactivity, unlimited API requests | ✅ 2026-04 | [supabase.com/pricing](https://supabase.com/pricing) |
| Neon | Free plan (serverless Postgres) | 10 projects, 0.5GB storage/branch, 100 compute-hours/project/mo, 5GB egress/mo | Scale-to-zero after 5 min idle, auto-scale up to 2 CU, no credit card required | ✅ 2026-04 | [neon.com/pricing](https://neon.com/pricing) |
| MongoDB Atlas | M0 free cluster (forever free) | 512MB storage, shared infrastructure, 1 free cluster per project | 100 operations/sec, 32MB sort memory, no backups | ✅ 2026-04 | [mongodb.com/pricing](https://www.mongodb.com/pricing) |
| Firebase Realtime DB | Spark plan (free) | 1GB stored, 10GB downloaded/mo | 100 simultaneous connections, hard cap (no overage) | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Cloud Firestore | Spark plan (free) | 1 GiB stored, 10 GiB network egress/mo | 50K reads/day, 20K writes/day, 20K deletes/day, resets at midnight PT | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Cloudflare D1 | Workers Free plan (SQLite at edge) | 5GB total storage, 10 databases/account, 500MB per database | 5M rows read/day, 100K rows written/day, resets at midnight UTC | ✅ 2026-04 | [developers.cloudflare.com/d1/platform/pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| Turso | Free plan (libSQL/SQLite) | 5GB storage, no credit card required, commercial use allowed | 500M rows read/mo, 10M rows written/mo | ✅ 2026-04 | [turso.tech/pricing](https://turso.tech/pricing) |
| Upstash Redis | Free plan (serverless Redis) | 256MB data size, 10 free databases | 500K commands/mo, 200GB bandwidth/mo | ✅ 2026-04 | [upstash.com/pricing/redis](https://upstash.com/pricing/redis) |
| CockroachDB | Free monthly allowance (Postgres-compatible) | 10 GiB storage, 50M Request Units/mo (equivalent to $15/mo credit) | Requires payment method on file, pay-as-you-go orgs only | ✅ 2026-04 | [cockroachlabs.com/pricing](https://www.cockroachlabs.com/pricing/) |
| Xata | Free plan (Postgres) | 15GB storage, 10 branches, no record limits | 75 requests/sec, 15 parallel connections, no cold starts or pausing | ✅ 2026-04 | [xata.io/pricing](https://xata.io/pricing) |
| Aiven | Free plan (Postgres + Kafka available) | Postgres: 1GB storage, 20 connections; Kafka: 5 topics, 3-day retention | Kafka throughput: 250 kb/s (in+out), powers off after 24h inactivity | ✅ 2026-04 | [aiven.io/pricing](https://aiven.io/pricing) |

## Notes

- **PlanetScale** was evaluated but excluded: they removed their free tier (Hobby plan) on April 8, 2024. Minimum plan is now $5/mo.
- **ElephantSQL** was evaluated but excluded: the service shut down entirely in January 2025.
- Neon, Turso, and Xata are standout options for generous free Postgres/SQLite hosting.
- CockroachDB's free allowance requires a payment method, but you are not charged if usage stays under $15/mo.
