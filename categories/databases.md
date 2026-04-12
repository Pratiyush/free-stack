# Databases

> Free managed database services -- SQL, NoSQL, key-value, and edge databases.

| Service | Free Tier | Limits | Rate Limits | Credit Card | Verified | Link |
|---------|-----------|--------|-------------|-------------|----------|------|
| Supabase | Free plan (Postgres) | 500MB database, 1GB file storage, 5GB egress/mo, 50K MAUs, 2 projects | Unlimited API requests; pauses after 7 days inactivity | No | Apr 2026 | [supabase.com/pricing](https://supabase.com/pricing) |
| Neon | Free plan (serverless Postgres) | 100 projects, 0.5GB storage/branch, 100 CU-hours/project/mo, 5GB egress/mo | Scale-to-zero after 5 min idle, auto-scale up to 2 CU | No | Apr 2026 | [neon.com/pricing](https://neon.com/pricing) |
| MongoDB Atlas | M0 free cluster (forever free) | 512MB storage, shared RAM/vCPU, 1 free cluster per project | 100 ops/sec, 32MB sort memory, no backups | No | Apr 2026 | [mongodb.com/pricing](https://www.mongodb.com/pricing) |
| Firebase Realtime DB | Spark plan (free) | 1GB stored, 10GB downloaded/mo | 100 simultaneous connections, hard cap (no overage) | No | Apr 2026 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Cloud Firestore | Spark plan (free) | 1 GiB stored, 10 GiB egress/mo | 50K reads/day, 20K writes/day, 20K deletes/day, resets midnight PT | No | Apr 2026 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Cloudflare D1 | Workers Free plan (SQLite at edge) | 5GB total storage, 10GB max per database, 50K databases/account | 5M rows read/day, 100K rows written/day, resets midnight UTC | No | Apr 2026 | [developers.cloudflare.com/d1/platform/pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| Turso | Free plan (libSQL/SQLite) | 100 databases, 5GB storage | 500M rows read/mo, 10M rows written/mo; no scale-to-zero (always-on since Jan 2026) | No | Apr 2026 | [turso.tech/pricing](https://turso.tech/pricing) |
| Upstash Redis | Free plan (serverless Redis) | 256MB data size, 10 databases | 500K commands/mo, 200GB bandwidth/mo | No | Apr 2026 | [upstash.com/pricing/redis](https://upstash.com/pricing/redis) |
| TiDB Cloud Starter | Free quota (MySQL-compatible) | 5 clusters free, each: 5 GiB row storage + 5 GiB columnar storage + 50M RUs/mo | Denies new connections when quota exhausted; resets monthly | No (for first 5 clusters) | Apr 2026 | [pingcap.com/pricing](https://www.pingcap.com/pricing/) |
| Convex | Free plan (reactive backend DB) | 0.5GB database storage, 1GB file storage, 1M function calls/mo, 20 GB-hours action compute | Mutations fail when storage full on free plan; no inactivity pausing | No | Apr 2026 | [convex.dev/pricing](https://www.convex.dev/pricing) |
| Xata | Free plan (Postgres) | 15GB storage, 10 branches | 75 req/sec, 15 parallel connections; no cold starts, no inactivity pausing | No | Apr 2026 | [xata.io/pricing](https://xata.io/pricing) |
| MotherDuck | Free plan (cloud DuckDB) | 10GB storage, 10 hours Pulse compute/mo | Hard cap on storage and compute; no overage on free plan | No | Apr 2026 | [motherduck.com/product/pricing](https://motherduck.com/product/pricing/) |
| Deno KV | Free with Deno Deploy (key-value) | 1 GiB KV storage, 100K requests/day, 100 GiB egress/mo | Shared with Deno Deploy free tier (15 CPU-hours/mo) | No | Apr 2026 | [deno.com/deploy/pricing](https://deno.com/deploy/pricing) |
| CockroachDB | Free monthly allowance (Postgres-compatible) | 10 GiB storage, 50M Request Units/mo (~$15/mo credit), starts with $400 trial credits | Clusters throttled after credits expire without payment method | No (initially; payment method needed before credits expire) | Apr 2026 | [cockroachlabs.com/pricing](https://www.cockroachlabs.com/pricing/) |
| Aiven | Free plan (Postgres + Kafka) | Postgres: 1GB storage, 1 CPU, 1GB RAM, 20 connections; Kafka: 5 topics, 3-day retention | Kafka: 250 kb/s throughput (in+out); powers off after 24h inactivity (both Postgres and Kafka) | No | Apr 2026 | [aiven.io/pricing](https://aiven.io/pricing) |

## Notes

- **Fauna** was evaluated but excluded: the service shut down entirely on May 30, 2025.
- **PlanetScale** was evaluated but excluded: free tier (Hobby plan) removed April 8, 2024. Minimum plan is now $5/mo.
- **ElephantSQL** was evaluated but excluded: service shut down January 2025.
- **Neon** doubled free compute from 50 to 100 CU-hours/project in October 2025 and expanded from 10 to 100 free projects. Snapshot storage billing ($0.09/GB-month) begins May 1, 2026.
- **Turso** deprecated scale-to-zero for new users in January 2026; free databases on AWS are now always-on with no cold starts.
- **Cloudflare D1** increased database limits significantly: up to 10GB per database and 50K databases per account (up from 500MB/10 databases).
- **CockroachDB** now offers $400 in trial credits to new signups. No credit card needed to start, but payment method required before credits expire to avoid throttling.
- **Xata** removed search APIs and files APIs from the free tier as of January 10, 2025. pgvector-based vector search still available on free plan.
- **Upstash** updated pricing in March 2025: free bandwidth increased to 200GB/mo (previously capped), 500K commands/mo remains.
- **Supabase**, **Aiven** (both Postgres and Kafka), and **CockroachDB** pause or power off on inactivity. All others listed here remain always-on or scale-to-zero without data loss.
- Standout options for generous free hosting: **Xata** (15GB Postgres), **Neon** (100 projects, branching), **Turso** (100 databases, always-on), **TiDB Cloud** (25 GiB total across 5 clusters).
