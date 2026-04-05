# Maps & Geolocation

> Maps, geocoding, and location services with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Mapbox | 50K web map loads/mo; 100K geocoding requests/mo; 25K mobile MAUs | Maps, geocoding, navigation, search; pay-as-you-go beyond free tier | 1,000 geocoding requests/min (adjustable) | 2026-04 | [Pricing](https://www.mapbox.com/pricing) |
| Google Maps Platform | Per-SKU free thresholds; e.g. 10K geocoding/mo, 100K map tile calls/mo | Maps Embed API + mobile SDKs unlimited free; Essentials/Pro/Enterprise SKUs | Volume discounts above 5M events/mo | 2026-04 | [Pricing](https://mapsplatform.google.com/pricing/) |
| HERE | 1,000 requests/day (Limited plan); 30K requests/mo (Base plan with payment info) | Maps, geocoding, routing, places; 250K transactions/mo on Freemium tier | 5 req/sec on Limited plan; higher on Base | 2026-04 | [Pricing](https://www.here.com/get-started/pricing) |
| Nominatim (OpenStreetMap) | Fully free and open source; self-hostable | Public instance for light use only; no bulk/systematic queries; no autocomplete use | 1 request/sec on public instance | 2026-04 | [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) |
| Stadia Maps | 2,500 free credits/mo | Maps, geocoding, routing; credit-based billing across all APIs; non-commercial use on free tier | No documented per-second limits | 2026-04 | [Pricing](https://stadiamaps.com/pricing/) |
| Geoapify | 3,000 credits/day (~90K/mo) | Geocoding, maps, routing, isoline, places APIs; 1 credit = 1 simple request; batch = 0.5 credit | Daily credit cap resets at midnight | 2026-04 | [Pricing](https://www.geoapify.com/pricing/) |
| LocationIQ | 5,000 requests/day (~150K/mo) | Geocoding, reverse geocoding, autocomplete, maps; commercial use allowed with attribution | 2 requests/sec; 48-hr cache allowed | 2026-04 | [Pricing](https://locationiq.com/pricing) |

## Notes

- **Permanent free tiers**: All seven services offer permanent free tiers or are fully open source.
- **Best for prototyping**: Mapbox and Geoapify offer the most developer-friendly free tiers with generous limits and no credit card required.
- **Google Maps Platform** changed its pricing model in March 2025 -- the old $200/mo credit is replaced by per-SKU free usage thresholds.
- **Nominatim** is the only fully free option with no account required, but the public instance is strictly for light use. Self-hosting removes all limits.
- **LocationIQ** has the most generous free tier for geocoding at 5,000 requests/day with commercial use permitted (attribution required).
- **Stadia Maps** free tier is limited to non-commercial and academic use -- commercial projects require a paid plan.
- **HERE** offers up to 250K free transactions/mo on Freemium, making it competitive with Google Maps for higher-volume use cases.
