#!/usr/bin/env node
/**
 * v3.0 — generate 5 launch-day infographic PNGs (1080×1350, LinkedIn portrait).
 *
 * One per day of the launch arc: Confession · Pain · Designs · Engine · Ask.
 * Same aesthetic as the OG cards (paper-warm cream, italic Fraunces, coral
 * accent, JetBrains Mono masts).
 *
 * Output: marketing/drafts/images/day-N-<slug>.png (gitignored — marketing/
 * is in the root .gitignore).
 *
 * Usage:
 *   node scripts/generate-launch-infographics.mjs
 *   node scripts/generate-launch-infographics.mjs --only=1
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const OUT_DIR = path.resolve('marketing/drafts/images');
const FRAUNCES = path.resolve(
  'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2',
);
const INTER = path.resolve(
  'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
);

const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

const PAPER = '#fdfaf2';
const PAPER_WARM = '#f5efe1';
const INK = '#1a1a1a';
const INK_SOFT = '#4a443e';
const INK_FAINT = '#6b6460';
const RULE = '#d8d3c6';
const CORAL = '#b73d22';

const W = 1080;
const H = 1350;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function shell(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      .title { font-family: 'Fraunces', Georgia, serif; font-weight: 400; }
      .italic { font-style: italic; }
      .body { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 400; }
      .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 400; letter-spacing: 0.08em; }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="${PAPER}" />
  <rect x="0" y="0" width="${W}" height="16" fill="${CORAL}" />
  ${content}
  <!-- Footer mast -->
  <line x1="80" x2="${W - 80}" y1="${H - 110}" y2="${H - 110}" stroke="${RULE}" stroke-width="1" />
  <text x="80" y="${H - 70}" class="title" font-size="40" fill="${INK}">
    <tspan fill="${CORAL}">∗</tspan> opentier
  </text>
  <text x="${W - 80}" y="${H - 70}" class="mono" font-size="22" fill="${INK_FAINT}" text-anchor="end">
    opentier.dev
  </text>
</svg>`;
}

// ─── Day 1 — Confession ────────────────────────────────────────────────────
function day1() {
  return shell(`
    <text x="80" y="100" class="mono" font-size="22" fill="${INK_FAINT}">
      DAY 1 / 5 · MAY 16, 2026 · THE CONFESSION
    </text>
    <line x1="80" x2="${W - 80}" y1="120" y2="120" stroke="${RULE}" stroke-width="1" />

    <text x="80" y="240" class="title italic" font-size="92" fill="${INK}">I shipped</text>
    <text x="80" y="356" class="title italic" font-size="92" fill="${INK}">19 projects.</text>
    <text x="80" y="490" class="title italic" font-size="92" fill="${INK}">I finished</text>
    <text x="80" y="606" class="title italic" font-size="156" fill="${CORAL}">zero.</text>

    <line x1="80" x2="280" y1="680" y2="680" stroke="${INK}" stroke-width="2" />

    <text x="80" y="770" class="body" font-size="40" fill="${INK_SOFT}">This is the 20th.</text>
    <text x="80" y="830" class="body" font-size="40" fill="${INK_SOFT}">It took 5 days.</text>
    <text x="80" y="890" class="body" font-size="40" fill="${INK_SOFT}">300 free tiers, kept honest.</text>

    <rect x="80" y="970" width="${W - 160}" height="120" fill="${PAPER_WARM}" rx="8" />
    <text x="120" y="1020" class="mono" font-size="20" fill="${INK_FAINT}">WHAT'S DIFFERENT</text>
    <text x="120" y="1062" class="body" font-size="28" fill="${INK}">Pre-written marketing. Public deadline. Small surface.</text>
  `);
}

// ─── Day 2 — Pain ──────────────────────────────────────────────────────────
function day2() {
  const rugs = [
    ['Heroku free dynos', 'Nov 2022', 'killed'],
    ['Mixpanel events', 'Feb 2026', '-95% (20M → 1M / mo)'],
    ['Cloudflare R2', 'Feb 2026', 'egress fees added'],
    ['PlanetScale free', 'Apr 2024', 'removed'],
    ['Postman teams', 'Mar 2026', 'eliminated'],
    ['POEditor strings', '2026', '-96% (30k → 1k)'],
  ];
  let body = '';
  rugs.forEach((r, i) => {
    const y = 400 + i * 92;
    body += `<text x="80" y="${y}" class="title italic" font-size="40" fill="${INK}">${esc(r[0])}</text>`;
    body += `<text x="80" y="${y + 32}" class="mono" font-size="18" fill="${INK_FAINT}">${esc(r[1].toUpperCase())} · ${esc(r[2].toUpperCase())}</text>`;
    body += `<line x1="${W - 80}" x2="${W - 200}" y1="${y - 14}" y2="${y - 14}" stroke="${CORAL}" stroke-width="3" />`;
  });
  return shell(`
    <text x="80" y="100" class="mono" font-size="22" fill="${INK_FAINT}">
      DAY 2 / 5 · THE FREE-TIER GRAVEYARD
    </text>
    <line x1="80" x2="${W - 80}" y1="120" y2="120" stroke="${RULE}" stroke-width="1" />

    <text x="80" y="200" class="title italic" font-size="64" fill="${INK}">Free tiers</text>
    <text x="80" y="265" class="title italic" font-size="64" fill="${CORAL}">don't die loud.</text>

    ${body}

    <rect x="80" y="1010" width="${W - 160}" height="100" fill="${PAPER_WARM}" rx="8" />
    <text x="120" y="1050" class="mono" font-size="18" fill="${INK_FAINT}">CAUGHT BY OUR MONTHLY CRON</text>
    <text x="120" y="1088" class="body" font-size="26" fill="${INK}">300 services. Re-verified every 30 days. Publicly logged.</text>
  `);
}

// ─── Day 3 — Designs ───────────────────────────────────────────────────────
function day3() {
  const designs = [
    ['Almanac', 'Cream paper · Fraunces italic · periodic table grid', true],
    ['Newspaper Modernism', 'Hairline rules · multi-column · sharper hierarchy', false],
    ['Terminal', 'Dark BG · JBM mono · ASCII banner · table-first', false],
    ['Dashboard SaaS', 'Linear-style sidebar · ⌘K search · card grid', false],
    ['Clean white', 'Pure white · italic-highlight hero · search prominence', false],
  ];
  let body = '';
  designs.forEach((d, i) => {
    const y = 380 + i * 124;
    const fill = d[2] ? PAPER_WARM : PAPER;
    const ringStroke = d[2] ? CORAL : RULE;
    body += `<rect x="80" y="${y}" width="${W - 160}" height="104" fill="${fill}" stroke="${ringStroke}" stroke-width="${d[2] ? 3 : 1}" rx="8" />`;
    body += `<text x="120" y="${y + 50}" class="title italic" font-size="36" fill="${INK}">${esc(d[0])}</text>`;
    body += `<text x="120" y="${y + 88}" class="body" font-size="22" fill="${INK_SOFT}">${esc(d[1])}</text>`;
    if (d[2]) {
      body += `<text x="${W - 100}" y="${y + 60}" class="mono" font-size="22" fill="${CORAL}" text-anchor="end">SHIPPED ✓</text>`;
    }
  });
  return shell(`
    <text x="80" y="100" class="mono" font-size="22" fill="${INK_FAINT}">
      DAY 3 / 5 · DESIGN EXPLORATION
    </text>
    <line x1="80" x2="${W - 80}" y1="120" y2="120" stroke="${RULE}" stroke-width="1" />

    <text x="80" y="220" class="title italic" font-size="64" fill="${INK}">I asked Claude</text>
    <text x="80" y="290" class="title italic" font-size="64" fill="${INK}">for <tspan fill="${CORAL}">5 directions.</tspan></text>

    ${body}

    <text x="80" y="1080" class="body" font-size="28" fill="${INK_SOFT}">
      The boring almanac won because directories live or die on trust.
    </text>
    <text x="80" y="1120" class="body" font-size="28" fill="${INK_SOFT}">
      Trust looks like a printed record, not a SaaS landing.
    </text>
  `);
}

// ─── Day 4 — Engine ────────────────────────────────────────────────────────
function day4() {
  const layers = [
    ['1', '300 typed YAMLs', 'src/content/services/*.yml · Zod-validated'],
    ['2', 'Monthly verification cron', '> 60-day stale → auto-issue · GitHub Actions'],
    ['3', 'Playwright drift verifier', 'Weekly · bot-blocked pricing pages · auto-labelled issue'],
    [
      '4',
      '10 capture-everything blocks',
      'signup_friction · tos_red_flags · inactive_account_policy …',
    ],
    ['5', 'CC0 data export', 'index.json + services.md attached to every release'],
  ];
  let body = '';
  layers.forEach((l, i) => {
    const y = 360 + i * 122;
    body += `<circle cx="120" cy="${y + 36}" r="38" fill="${CORAL}" />`;
    body += `<text x="120" y="${y + 48}" class="title" font-size="42" fill="${PAPER}" text-anchor="middle">${esc(l[0])}</text>`;
    body += `<text x="190" y="${y + 30}" class="title italic" font-size="34" fill="${INK}">${esc(l[1])}</text>`;
    body += `<text x="190" y="${y + 68}" class="mono" font-size="18" fill="${INK_FAINT}">${esc(l[2].toUpperCase())}</text>`;
    if (i < layers.length - 1) {
      body += `<line x1="120" x2="120" y1="${y + 80}" y2="${y + 122}" stroke="${RULE}" stroke-width="2" stroke-dasharray="4 6" />`;
    }
  });
  return shell(`
    <text x="80" y="100" class="mono" font-size="22" fill="${INK_FAINT}">
      DAY 4 / 5 · UNDER THE HOOD
    </text>
    <line x1="80" x2="${W - 80}" y1="120" y2="120" stroke="${RULE}" stroke-width="1" />

    <text x="80" y="210" class="title italic" font-size="64" fill="${INK}">Anyone can write</text>
    <text x="80" y="280" class="title italic" font-size="64" fill="${CORAL}">a list.</text>
    <text x="80" y="330" class="body" font-size="30" fill="${INK_SOFT}">Keeping it true in 2027 is the work.</text>

    ${body}

    <text x="80" y="1090" class="mono" font-size="22" fill="${INK_FAINT}">MIT CODE · CC0 DATA · OPEN PRs</text>
    <text x="80" y="1130" class="body" font-size="26" fill="${INK_SOFT}">github.com/Pratiyush/opentier</text>
  `);
}

// ─── Day 5 — Ask ───────────────────────────────────────────────────────────
function day5() {
  const tiers = [
    ['$5', '/mo', 'Name in CHANGELOG', '20 × $5 = covered'],
    ['$20', '/mo', 'Link from /sponsors', '5 × $20 = covered'],
    ['$50', '/mo', 'Logo on /sponsors', '2 × $50 = covered'],
    ['$100', '/mo', 'Sponsor of the month', '1 × $100 = covered alone'],
  ];
  let body = '';
  tiers.forEach((t, i) => {
    const x = 80 + (i % 2) * 460;
    const y = 600 + Math.floor(i / 2) * 200;
    const isTop = i === 3;
    body += `<rect x="${x}" y="${y}" width="440" height="170" fill="${isTop ? PAPER_WARM : PAPER}" stroke="${isTop ? CORAL : RULE}" stroke-width="${isTop ? 3 : 1}" rx="8" />`;
    body += `<text x="${x + 30}" y="${y + 60}" class="title" font-size="56" fill="${INK}">${esc(t[0])}<tspan class="mono" font-size="24" fill="${INK_FAINT}">${esc(t[1])}</tspan></text>`;
    body += `<text x="${x + 30}" y="${y + 100}" class="body" font-size="20" fill="${INK_SOFT}">${esc(t[2])}</text>`;
    body += `<text x="${x + 30}" y="${y + 140}" class="mono" font-size="16" fill="${INK_FAINT}">${esc(t[3].toUpperCase())}</text>`;
  });
  return shell(`
    <text x="80" y="100" class="mono" font-size="22" fill="${INK_FAINT}">
      DAY 5 / 5 · THE ASK
    </text>
    <line x1="80" x2="${W - 80}" y1="120" y2="120" stroke="${RULE}" stroke-width="1" />

    <text x="80" y="240" class="title italic" font-size="100" fill="${INK}">$100</text>
    <text x="80" y="320" class="title italic" font-size="56" fill="${INK_SOFT}">a month.</text>

    <text x="80" y="420" class="body" font-size="30" fill="${INK_SOFT}">Domain · email · verifier compute · 1 hr/week human checking.</text>
    <text x="80" y="460" class="body" font-size="30" fill="${INK_SOFT}">No ads. No affiliate. Public ledger.</text>

    <line x1="80" x2="280" y1="510" y2="510" stroke="${CORAL}" stroke-width="3" />

    <text x="80" y="565" class="mono" font-size="22" fill="${INK_FAINT}">FOUR WAYS TO MAKE THE MONTH</text>

    ${body}

    <rect x="80" y="1010" width="${W - 160}" height="86" fill="${PAPER_WARM}" rx="8" />
    <text x="120" y="1050" class="mono" font-size="20" fill="${INK_FAINT}">THE HONESTY CLAUSE</text>
    <text x="120" y="1082" class="body" font-size="22" fill="${INK}">If we don't hit $50/mo by Sep, verifier moves to monthly.</text>
  `);
}

const DESIGNS = [
  { day: 1, slug: 'confession', svg: day1 },
  { day: 2, slug: 'pain', svg: day2 },
  { day: 3, slug: 'designs', svg: day3 },
  { day: 4, slug: 'engine', svg: day4 },
  { day: 5, slug: 'ask', svg: day5 },
];

async function loadFonts() {
  const fonts = [];
  if (existsSync(FRAUNCES)) fonts.push(await readFile(FRAUNCES));
  if (existsSync(INTER)) fonts.push(await readFile(INTER));
  return fonts;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const fontBuffers = await loadFonts();
  const selected = ONLY ? DESIGNS.filter((d) => String(d.day) === ONLY) : DESIGNS;

  for (const d of selected) {
    const svg = d.svg();
    const resvg = new Resvg(svg, {
      font: { fontBuffers, loadSystemFonts: true, defaultFontFamily: 'Georgia' },
      fitTo: { mode: 'width', value: W },
    });
    const png = resvg.render().asPng();
    const out = path.join(OUT_DIR, `day-${d.day}-${d.slug}.png`);
    await writeFile(out, png);
    console.log(
      `✓ day ${d.day} → ${path.relative(process.cwd(), out)} (${(png.length / 1024).toFixed(0)} KB)`,
    );
  }
  console.log(
    `\nGenerated ${selected.length} infographic${selected.length === 1 ? '' : 's'} in ${path.relative(process.cwd(), OUT_DIR)}/`,
  );
}

main().catch((err) => {
  console.error('generate-launch-infographics crashed:', err);
  process.exit(1);
});
