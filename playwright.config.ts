import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the pricing-drift verifier (story 5.8).
 *
 * The verifier hits live external pricing pages for the ~20 services whose
 * pricing is JS-rendered or bot-blocked, so the curl-based audit
 * (`scripts/audit-services.mjs`) can't detect content drift. No baseURL —
 * each test navigates directly to the YAML's `pricing_url`.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 free-stack-pricing-drift/1.0',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
