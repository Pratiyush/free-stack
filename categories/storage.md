# Storage & CDN

> Free file storage, image processing, and content delivery networks.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Cloudflare R2 | 10 GB storage, zero egress fees | 1M Class A (writes) + 10M Class B (reads) ops/mo | No per-request rate limit documented | 2026-04 | [Pricing](https://developers.cloudflare.com/r2/pricing/) |
| Backblaze B2 | 10 GB storage, free uploads | 1 GB download/day; 2,500 Class B + 2,500 Class C txns/day | Daily caps reset at midnight GMT | 2026-04 | [Pricing](https://www.backblaze.com/cloud-storage/transaction-pricing) |
| Supabase Storage | 1 GB file storage | 50 MB max file size; 10 GB bandwidth/mo (5 GB cached + 5 GB uncached) | Projects pause after 7 days inactivity | 2026-04 | [Pricing](https://supabase.com/pricing) |
| Firebase Storage | 5 GB stored (legacy buckets) | 1 GB downloaded/day; 20K uploads + 50K downloads per day | Requires Blaze plan (no-cost usage preserved on legacy buckets) | 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| Uploadthing | 2 GB storage | Unlimited uploads and downloads; shared across all apps | ~10 file upload burst limit | 2026-04 | [Pricing](https://uploadthing.com/) |
| Cloudinary | 25 credits/mo (~25 GB bandwidth or 25 GB storage) | 20K transformations/mo; 10 GB storage; 20 GB bandwidth | Per-account API rate limits apply | 2026-04 | [Pricing](https://cloudinary.com/pricing) |
| ImageKit | 20 GB bandwidth/mo, 3 GB storage | ~10K files; 500s SD / 250s HD video processing/mo | Functionality stops mid-month if limits exceeded | 2026-04 | [Pricing](https://imagekit.io/plans/) |
| jsDelivr | Unlimited bandwidth, fully free public CDN | Open-source npm/GitHub packages only; no private hosting | No documented rate limits; serves 150B+ requests/mo | 2026-04 | [Website](https://www.jsdelivr.com/) |
| AWS S3 | 5 GB Standard storage (12 months only) | 20K GET + 2K PUT requests/mo; 100 GB data transfer out/mo | Expires after 12 months -- NOT a permanent free tier | 2026-04 | [Free Tier](https://aws.amazon.com/free/) |
| Bunny CDN | 14-day free trial only | Pay-as-you-go from $0.002/GB after trial | No permanent free tier | 2026-04 | [Pricing](https://bunny.net/pricing/) |

## Notes

- **Permanent free tiers**: Cloudflare R2, Backblaze B2, Supabase Storage, Firebase Storage, Uploadthing, Cloudinary, ImageKit, and jsDelivr all offer permanent free tiers (no expiration).
- **AWS S3** is listed for reference but its free tier expires after 12 months -- plan accordingly.
- **Bunny CDN** is listed for reference but only offers a trial, not a permanent free tier.
- **Cloudflare R2** stands out with zero egress fees and generous operation limits, making it the strongest free object storage option.
- **jsDelivr** is ideal for serving open-source static assets with no limits whatsoever.
- **Cloudinary** and **ImageKit** are best for image/video transformation workloads with built-in CDN delivery.
