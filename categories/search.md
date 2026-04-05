# Search

> Free search-as-a-service and full-text search platforms.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Algolia** | Build plan (free) | 10K search requests/mo, 1M records, 10 indices | API rate limited; app deleted after 60 days inactivity | ✅ 2026-04 | [Pricing](https://www.algolia.com/pricing) |
| **Orama** | Free plan | 3 indexes, 100K docs/index, unlimited search queries (full-text, vector, hybrid) | 150 index updates/mo; 60 days analytics retention | ✅ 2026-04 | [Docs](https://docs.orama.com/cloud/understanding-orama/pricing-limits) |
| **Typesense Cloud** | One-time free trial | 720 hours cluster time + 10 GB bandwidth (lifetime, non-recurring) | No monthly replenishment; ~30 days continuous use | ✅ 2026-04 | [Pricing](https://cloud.typesense.org/pricing) |
| **Meilisearch** | Open-source (self-hosted) | Unlimited searches, unlimited documents, all core features | No cloud free tier; Cloud starts at $30/mo | ✅ 2026-04 | [Pricing](https://www.meilisearch.com/pricing) |
| **ZincSearch** | Open-source (Apache 2.0) | Unlimited — self-hosted, single binary | No managed cloud; self-host only | ✅ 2026-04 | [GitHub](https://github.com/zincsearch/zincsearch) |
| **Elasticsearch** | Open-source (self-hosted) | Unlimited with self-hosted OSS distribution | Elastic Cloud: 14-day trial only, no permanent free tier; paid starts ~$16.40/mo | ✅ 2026-04 | [Pricing](https://www.elastic.co/pricing) |
| **Tantivy** | Open-source (MIT) | Unlimited — Rust full-text search library | Library only, no managed service; embed in your app | ✅ 2026-04 | [GitHub](https://github.com/quickwit-oss/tantivy) |

## Notes

- **Best managed free tier**: Algolia (10K searches/mo) and Orama (unlimited searches, 3 indexes).
- **Best self-hosted**: Meilisearch and ZincSearch offer full functionality with zero cost if you host them yourself.
- **Orama** consolidated its former Pro plan into the free tier, making it unusually generous for a managed service.
- **Typesense Cloud** free allowance is one-time only (not monthly) — good for evaluation, not permanent free usage.
- **Tantivy** is a library (like Lucene), not a service — requires embedding into your own application.
