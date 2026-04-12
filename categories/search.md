# Search

> Free search-as-a-service and full-text search platforms.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Algolia** | Build plan (free) | 10K search requests/mo, 1M records, 10 indices; highest 3 record-count days excluded from billing | API rate limited; app deleted after 60 days inactivity | 2026-04 | [Pricing](https://www.algolia.com/pricing) |
| **Orama** | Free plan | 3 indexes, 100K docs/index, unlimited search queries (full-text, vector, hybrid), 5 user segments, 3 triggers/index | 150 index deployments/mo (global count); 60 days analytics retention | 2026-04 | [Docs](https://docs.orama.com/cloud/understanding-orama/pricing-limits) |
| **Trieve** | Free cloud tier | First 1 GB ingested free, first 1M searches and messages/mo free (5-year analytics retention); usage-based after that | Overages: $0.01/page (after first 100), $2/GB ingested, $0.0001/event | 2026-04 | [Pricing](https://www.trieve.ai/blog/usage-based-pricing) |
| **Typesense Cloud** | One-time free trial | 720 hours cluster time + 10 GB bandwidth (lifetime, non-recurring); no credit card required | ~30 days continuous use; no monthly replenishment | 2026-04 | [Pricing](https://cloud.typesense.org/pricing) |
| **ParadeDB** | Open-source (Apache 2.0) | Postgres extension for full-text, vector, and hybrid search; unlimited when self-hosted; deploy on Railway/Render/DigitalOcean | Managed: BYOC on AWS/GCP (paid); Ubicloud managed (paid); no permanent free cloud tier | 2026-04 | [GitHub](https://github.com/paradedb/paradedb) |
| **Meilisearch** | Open-source (MIT, self-hosted) | Unlimited searches, unlimited documents, all core features | Cloud: 14-day free trial only, then $30/mo (Build plan); no permanent free cloud tier | 2026-04 | [Pricing](https://www.meilisearch.com/pricing) |
| **ZincSearch** | Open-source (Apache 2.0) | Unlimited -- self-hosted, single binary | No managed cloud; self-host only | 2026-04 | [GitHub](https://github.com/zincsearch/zincsearch) |
| **Elasticsearch** | Open-source (self-hosted) | Unlimited with self-hosted OSS distribution | Elastic Cloud: 14-day trial only, no permanent free tier; paid starts ~$16.40/mo | 2026-04 | [Pricing](https://www.elastic.co/pricing) |
| **Tantivy** | Open-source (MIT) | Unlimited -- Rust full-text search library | Library only, no managed service; embed in your app | 2026-04 | [GitHub](https://github.com/quickwit-oss/tantivy) |

## Notes

- **Best managed free tier**: Algolia (10K searches/mo, 1M records) and Orama (unlimited searches, 3 indexes, 100K docs each).
- **Best usage-based free start**: Trieve offers 1 GB free ingestion and 1M free searches/mo on their cloud -- generous for small projects before any charges kick in.
- **Best self-hosted**: Meilisearch (developer-friendly, instant search) and ParadeDB (Postgres-native, no separate search infra needed).
- **Orama** includes all features (full-text, vector, hybrid, analytics) on the free plan -- unusually generous for a managed service.
- **Typesense Cloud** free allowance is one-time only (not monthly) -- good for evaluation, not permanent free usage.
- **ParadeDB** is notable for bringing Elastic-quality search directly into Postgres as an extension, eliminating the need for a separate search service. No permanent free managed tier exists yet.
- **Meilisearch Cloud** still has no free tier -- only a 14-day trial. Self-hosting remains the free option.
- **Tantivy** is a library (like Lucene), not a service -- requires embedding into your own application.

---

*Last verified: 2026-04*
