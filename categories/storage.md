# Storage & CDN

> Free file storage, image processing, and content delivery networks.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Cloudflare R2 | 10 GB storage, zero egress fees | 1M Class A (writes) + 10M Class B (reads) ops/mo | No per-request rate limit documented | 2026-04 | [Pricing](https://developers.cloudflare.com/r2/pricing/) |
| Backblaze B2 | 10 GB storage, free uploads | 1 GB download/day; 2,500 Class B + 2,500 Class C txns/day; Class A free | Daily caps reset at midnight UTC | 2026-04 | [Pricing](https://www.backblaze.com/cloud-storage/pricing) |
| Supabase Storage | 1 GB file storage | 50 MB max file size; 5 GB storage egress/mo | Projects pause after 7 days inactivity on free plan | 2026-04 | [Pricing](https://supabase.com/pricing) |
| Firebase Storage | 5 GB stored (Blaze plan required since Feb 2026) | 1 GB downloaded/day; 20K uploads + 50K downloads per day | Blaze plan mandatory; no-cost usage preserved on *.appspot.com buckets | 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| Uploadthing | 2 GB storage | Unlimited uploads and downloads; shared across all apps; 7-day audit log | ~10 file upload burst limit | 2026-04 | [Pricing](https://uploadthing.com/) |
| Cloudinary | 25 credits/mo (~25 GB bandwidth or 25 GB storage) | 20K transformations/mo; 10 GB storage; 20 GB bandwidth; 300K total assets | Per-account API rate limits apply | 2026-04 | [Pricing](https://cloudinary.com/pricing) |
| ImageKit | 20 GB bandwidth/mo | 3 GB DAM storage (permanent, not monthly); unlimited transformations | Functionality pauses mid-month if limits exceeded | 2026-04 | [Pricing](https://imagekit.io/plans/) |
| Tigris | 5 GB storage, zero egress fees | 10K Class A + 100K Class B requests/mo free; S3-compatible | No per-request rate limit documented | 2026-04 | [Pricing](https://www.tigrisdata.com/pricing/) |
| Tebi | 25 GB storage, 250 GB outbound transfer | S3-compatible; additional storage $0.02/GB, transfer $0.01/GB | No documented rate limits | 2026-04 | [Pricing](https://www.tebi.com/pricing) |
| jsDelivr | Unlimited bandwidth, fully free public CDN | Open-source npm/GitHub packages only; no private hosting | No documented rate limits; serves 150B+ requests/mo | 2026-04 | [Website](https://www.jsdelivr.com/) |
| AWS S3 | 5 GB Standard storage (12 months only) | 20K GET + 2K PUT requests/mo; 100 GB data transfer out/mo | Expires after 12 months -- NOT a permanent free tier | 2026-04 | [Free Tier](https://aws.amazon.com/free/) |
| Bunny CDN | 14-day free trial only | Pay-as-you-go from $0.002/GB after trial | No permanent free tier | 2026-04 | [Pricing](https://bunny.net/pricing/) |

## Notes

- **Permanent free tiers**: Cloudflare R2, Backblaze B2, Supabase Storage, Firebase Storage (on Blaze), Uploadthing, Cloudinary, ImageKit, Tigris, Tebi, and jsDelivr all offer permanent free tiers (no expiration).
- **Firebase Storage** now requires the Blaze (pay-as-you-go) plan as of Feb 2026. Legacy *.appspot.com buckets retain no-cost usage within the Google Cloud Always Free quotas (5 GB stored, 1 GB/day downloaded).
- **Tigris** (new) is an S3-compatible object store with zero egress fees and a 5 GB free tier, built for globally distributed workloads. Runs on Fly.io infrastructure.
- **Tebi** (new) offers the most generous raw storage on the free tier (25 GB) with 250 GB transfer. EU-based, S3-compatible.
- **AWS S3** is listed for reference but its free tier expires after 12 months -- plan accordingly. As of mid-2025, new accounts receive $200 in credits valid for 12 months.
- **Bunny CDN** is listed for reference but only offers a trial, not a permanent free tier.
- **Cloudflare R2** stands out with zero egress fees and generous operation limits, making it the strongest free object storage option.
- **jsDelivr** is ideal for serving open-source static assets with no limits whatsoever.
- **Cloudinary** and **ImageKit** are best for image/video transformation workloads with built-in CDN delivery.
- **MinIO** was researched but excluded -- it is a self-hosted open-source object store (AIStor Free), not a managed cloud service with a free tier. Excellent if you have your own server.
- **Uploadcare** was researched but excluded -- its free tier (1,000 ops/mo, 1 GB storage, 5 GB traffic) is too restrictive for most use cases and suspends on overage.

---

*Last verified: 2026-04*
