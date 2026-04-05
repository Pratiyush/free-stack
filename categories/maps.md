# Maps & Geolocation

> Maps, geocoding, and location services with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Mapbox | 50K web map loads/mo; 100K geocoding requests/mo; 25K mobile MAUs | Maps, geocoding, navigation, search; pay-as-you-go beyond free tier | 1,000 geocoding requests/min (adjustable) | 2026-04 | [Pricing](https://www.mapbox.com/pricing) |
| Google Maps Platform | Per-SKU free thresholds: Essentials 10K/mo, Pro 5K/mo, Enterprise 1K/mo; Map Tiles 100K/mo | Maps Embed API + mobile SDKs unlimited free; volume discounts above 5M events/mo | Per-SKU rate limits apply | 2026-04 | [Pricing](https://mapsplatform.google.com/pricing/) |
| HERE | 1,000 requests/day (Limited plan, no card); 30K requests/mo (Base plan with card); 250K/mo (Freemium) | Maps, geocoding, routing, places; transaction-based pricing beyond free | 5 req/sec on Limited; higher on Base/Freemium | 2026-04 | [Pricing](https://www.here.com/get-started/pricing) |
| Nominatim (OpenStreetMap) | Fully free and open source; self-hostable | Public instance for light use only; no bulk/systematic queries; no autocomplete use | 1 request/sec on public instance | 2026-04 | [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) |
| Stadia Maps | 2,500 free credits/mo | Maps, geocoding, routing; credit-based billing across all APIs; free tier limited to non-commercial/academic use | No documented per-second limits | 2026-04 | [Pricing](https://stadiamaps.com/pricing/) |
| Geoapify | 3,000 credits/day (~90K/mo) | Geocoding, maps, routing, isoline, places APIs; 1 credit = 1 simple request; no credit card required | Daily credit cap resets at midnight | 2026-04 | [Pricing](https://www.geoapify.com/pricing/) |
| LocationIQ | 5,000 requests/day (~150K/mo) | Geocoding, reverse geocoding, autocomplete, maps; commercial use allowed with attribution | 2 requests/sec; 48-hr cache allowed | 2026-04 | [Pricing](https://locationiq.com/pricing) |
| MapTiler | Free cloud plan for non-commercial/R&D use | Maps, geocoding, routing; maps pause if monthly session/request limit exceeded; MapTiler Engine free for all use | No documented per-second limits | 2026-04 | [Pricing](https://www.maptiler.com/cloud/pricing/) |
| Protomaps | Fully free and open source (BSD/CC-BY); self-hosted | PMTiles format: single-file map archives; host on S3/R2/any static storage; OpenStreetMap basemap; no vendor lock-in | N/A -- self-hosted; limited by your CDN | 2026-04 | [Website](https://protomaps.com/) |
| OpenCage | Free trial: 2,500 requests/day for testing | Forward + reverse geocoding; 170+ countries; uses OpenStreetMap + other open data | 1 request/sec on free trial | 2026-04 | [Pricing](https://opencagedata.com/pricing) |

## Notes

- **Permanent free tiers**: Mapbox, Google Maps, HERE, Nominatim, Stadia Maps, Geoapify, LocationIQ, and MapTiler all offer permanent free tiers.
- **Fully open source**: Nominatim and Protomaps are entirely free with no account required when self-hosted.
- **Best for prototyping**: Mapbox and Geoapify offer the most developer-friendly free tiers with generous limits and no credit card required.
- **Google Maps Platform** changed its pricing model in March 2025 -- the old $200/mo credit is replaced by per-SKU free usage thresholds (Essentials/Pro/Enterprise).
- **Nominatim** is the only fully free option with no account required, but the public instance is strictly for light use. Self-hosting removes all limits.
- **LocationIQ** has the most generous free tier for geocoding at 5,000 requests/day with commercial use permitted (attribution required).
- **Stadia Maps** and **MapTiler** free tiers are limited to non-commercial and academic use -- commercial projects require a paid plan.
- **HERE** offers up to 250K free transactions/mo on Freemium, making it competitive with Google Maps for higher-volume use cases.
- **Protomaps** is a paradigm shift: a single PMTiles file on Cloudflare R2 can serve 10M tile requests/mo for ~$11, compared to ~$3,600 on Google Maps. Best for teams wanting full data sovereignty and zero vendor lock-in.
- **MapTiler** also provides MapTiler Engine (free for all use) for on-premise tile generation, separate from the cloud tier.
- **OpenCage** offers a free trial (2,500 req/day) for testing only -- it is not a permanent free tier. Paid plans start at $50/mo. Included here because the trial is useful for prototyping.
