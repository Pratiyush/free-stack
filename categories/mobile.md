# Mobile Services

> Free mobile development, push notifications, CI/CD, crash reporting, and distribution tools.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Firebase (FCM)** | Free (Spark plan) | Unlimited push notifications -- no subscriber or message caps | No usage limits on FCM; fully free on Spark and Blaze plans | ✅ 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| **Firebase (Crashlytics)** | Free (Spark plan) | Unlimited crash reporting; custom logging capped at 64 KB | No usage limits; free on all plans | ✅ 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| **Firebase (Remote Config)** | Free (Spark plan) | Full feature access at no cost | No usage limits; free on all plans | ✅ 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| **Firebase (App Distribution)** | Free | Unlimited test build distribution to testers | No usage limits; free service for beta distribution | ✅ 2026-04 | [Pricing](https://firebase.google.com/pricing) |
| **Expo (EAS)** | Free plan | 30 builds/mo (max 15 iOS, max 15 Android), 1K MAU for EAS Update, 100 GiB global edge bandwidth | Lower-priority builds on free tier; resets monthly | ✅ 2026-04 | [Pricing](https://expo.dev/pricing) |
| **OneSignal** | Free plan | Unlimited mobile push sends, 10K emails/mo, basic analytics, A/B testing | 1 Journey (2 steps), 6 segments, 2 data tags; 18-month inactive subscriber retention | ✅ 2026-04 | [Pricing](https://onesignal.com/pricing) |
| **RevenueCat** | Free under $2.5K MTR | Full SDK access, receipt validation, webhooks, REST API, charts & analytics | Free until $2,500/mo tracked revenue (gross, before store cut); then 1% of MTR | ✅ 2026-04 | [Pricing](https://www.revenuecat.com/pricing/) |
| **Codemagic** | Free (500 min/mo) | 500 build minutes/mo on macOS M2, unlimited apps | Single user; no free Linux/Windows minutes; resets monthly; $0.10/min overage on Mac | ✅ 2026-04 | [Pricing](https://codemagic.io/pricing/) |
| **Bitrise** | Hobby plan (free) | 300 credits/mo, 1 private app, 5 concurrent builds, 120 min device testing | 90-min build timeout; 1 credit = 1 min Linux or 30 sec macOS; no credit card required | ✅ 2026-04 | [Pricing](https://bitrise.io/pricing) |
| **Fastlane** | Open-source (MIT) | Unlimited -- automate building, testing, signing, and deployment | Self-hosted; integrates with any CI (GitHub Actions, etc.) | ✅ 2026-04 | [Site](https://fastlane.tools/) |
| **TestFlight** | Free (Apple) | 10K external testers, 100 internal testers, up to 100 builds, 30 devices/tester | Builds expire after 90 days; requires Apple Developer Program ($99/yr) | ✅ 2026-04 | [TestFlight](https://developer.apple.com/testflight/) |

## Notes

- **Firebase** is the standout: FCM, Crashlytics, Remote Config, and App Distribution are all fully free with no usage limits. Note: Cloud Storage now requires the Blaze plan (as of Feb 2026), but these mobile services remain on Spark.
- **OneSignal** offers unlimited mobile push sends on the free plan -- the most generous push notification free tier available.
- **RevenueCat** is effectively free for early-stage apps (under $2,500/mo gross revenue) with full feature access. Fees are calculated on gross revenue before the app store's cut.
- **Expo EAS** free tier is stable with 30 builds/mo -- sufficient for solo/small team React Native development. Builds are lower-priority (longer queue times).
- **Codemagic** gives 500 free macOS M2 build minutes -- best free CI for Flutter/iOS.
- **Bitrise** credits map differently per platform: 1 credit = 1 min on Linux, but only 30 sec on macOS.
- **TestFlight** is free but requires an active Apple Developer Program membership ($99/year).
- **Fastlane** is a local tool, not a service -- pair it with free CI (GitHub Actions) for a zero-cost mobile CI/CD pipeline.

## Evaluated but Excluded

- **Microsoft AppCenter** -- retired March 31, 2025. Analytics/Diagnostics only remain until June 30, 2026, then full shutdown. Do not use for new projects.
- **Instabug (now Luciq)** -- rebranded to Luciq.ai in Sep 2025. No meaningful free tier; paid plans start at ~$124/mo. Pricing based on DAU, not sessions.
