/**
 * Manual slug aliases — map a opentier service slug to the canonical
 * simple-icons slug.
 *
 * Used by scripts/bulk-fetch-logos.mjs as a last-step lookup after the
 * automatic derivation strategies fail. Keep this list short — only add
 * an entry when the auto-derivation will never find the icon on its own.
 *
 * simple-icons slugs are lowercase, alphanumeric only (no hyphens). Look
 * up the canonical slug at https://simpleicons.org/?q=<vendor>.
 *
 * Every value below was verified against simple-icons@16 — keep this
 * file in sync if the dep bumps and any aliased slug gets renamed.
 */
export const aliases = {
  // Cloudflare family — simpleicons has only "cloudflare", "cloudflarepages",
  // "cloudflareworkers". Sub-products inherit the parent brand color.
  'cloudflare-1-1-1-1-warp': 'cloudflare',
  'cloudflare-d1': 'cloudflare',
  'cloudflare-dns': 'cloudflare',
  'cloudflare-ssl': 'cloudflare',
  'cloudflare-r2': 'cloudflare',
  'cloudflare-workers-ai': 'cloudflareworkers',
  'partykit-cloudflare': 'cloudflare',
  'cloudflare-pages': 'cloudflarepages',

  // Firebase family — only "firebase" exists, no per-product icons.
  'firebase-app-distribution': 'firebase',
  'firebase-auth': 'firebase',
  'firebase-crashlytics': 'firebase',
  'firebase-fcm': 'firebase',
  'firebase-hosting': 'firebase',
  'firebase-realtime-db': 'firebase',
  'firebase-remote-config': 'firebase',
  'firebase-storage': 'firebase',
  'cloud-firestore': 'firebase',

  // Supabase family — only the base icon.
  'supabase-auth': 'supabase',
  'supabase-storage': 'supabase',

  // GitHub family.
  'github-actions': 'githubactions',
  'github-codespaces': 'github',
  'github-container-registry': 'github',
  'github-copilot': 'githubcopilot',
  'github-pages': 'github',
  'dependabot-github': 'dependabot',

  // GitLab family.
  'gitlab-ci': 'gitlab',
  'gitlab-container-registry': 'gitlab',

  // Google family.
  'google-analytics-4': 'googleanalytics',
  'google-artifact-registry': 'googlecloud',
  'google-gemini': 'googlegemini',
  'google-maps-platform': 'googlemaps',
  'gcp-always-free': 'googlecloud',

  // Bunny.net family — simpleicons uses "bunnydotnet".
  'bunny-cdn': 'bunnydotnet',
  'bunny-dns': 'bunnydotnet',

  // Brevo (formerly Sendinblue).
  'brevo-sendinblue': 'brevo',

  // Anthropic / Claude — both exist; prefer the product brand.
  'anthropic-claude': 'claude',

  // JetBrains family.
  'jetbrains-intellij-idea': 'intellijidea',
  'qodana-jetbrains': 'jetbrains',

  // 1Password.
  'passage-by-1password': '1password',

  // SonarCloud renamed to SonarQube Cloud.
  'sonarcloud-sonarqube-cloud': 'sonarqubecloud',
  'qlty-formerly-codeclimate': 'qlty',

  // Docs + GH Pages bundles.
  'docusaurus-github-pages': 'docusaurus',
  'docsify-github-pages': 'docsify',

  // Percy is owned by BrowserStack — use Percy's own icon.
  'percy-browserstack': 'percy',

  // Misc product variants — most map to the parent vendor.
  'better-stack-logtail': 'betterstack',
  'meta-llama-api': 'meta',
  'upstash-redis': 'upstash',
  'expo-eas': 'expo',
  'ory-kratos': 'ory',
  'lets-encrypt': 'letsencrypt',
  'hugging-face-inference': 'huggingface',
  'nominatim-openstreetmap': 'openstreetmap',
  'harbor-self-hosted': 'harbor',
  'trivy-aqua-security': 'aqua',

  // xAI / Grok — simpleicons has neither right now; map to "x" (the rename).
  'xai-grok': 'x',

  // Plausible — simpleicons uses "plausibleanalytics" not "plausible".
  plausible: 'plausibleanalytics',

  // Daily.co — slug uses "daily-co" but the icon ships under "dailydotdev"? No,
  // simpleicons has no entry; leave to story 3.7. Tested.

  // WorkOS family — no icon in v15/16; left out.

  // No simpleicons match — left out intentionally, will fall through to
  // story 3.7 manual handling:
  //   val-town, oracle-cloud-always-free, linode-akamai, fireworks-ai,
  //   together-ai, launchdarkly-observability, vector-open-source, seq-self-hosted,
  //   azure-12-month-free, azure-always-free, browserstack (no icon as of v16).
};
