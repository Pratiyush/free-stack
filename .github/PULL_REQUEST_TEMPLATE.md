## Closes

<!-- Link to the GitHub issue this PR addresses. Use `Part of #N` for multi-PR work. -->
Closes #

## What changed

<!-- 1–3 sentences summarising the diff. -->

## Type of change

- [ ] `content:` — add / update / remove a service YAML in `src/content/services/`
- [ ] `feat:` — schema change, new capability, or new tooling
- [ ] `fix:` — bug fix (site rendering, build, data correctness)
- [ ] `docs:` — documentation only
- [ ] `chore:` — tooling, deps, infra
- [ ] Other (describe below)

## Verification checklist (content PRs)

<!-- Delete this section for docs/feat/fix/chore PRs that don't touch a service YAML. -->

- [ ] YAML at `src/content/services/<slug>.yml` validates (`pnpm validate` passes)
- [ ] `pricing_url` points to the official pricing page (not the homepage)
- [ ] `date_verified` is set to the current month/year (today, for new entries)
- [ ] `free_tier` bullets include concrete quotas and rate limits where the service publishes them
- [ ] `brand_color` matches the service's simpleicons.org hex (or the fallback is logged in `docs/logo-coverage.md`)
- [ ] Logo file exists at `public/logos/<slug>.svg` (`pnpm check-logos` passes)
- [ ] `notes` updated if the entry has caveats (auto-pause, CC-required, trial-only, etc.)

## Local gate

- [ ] `pnpm lint` — green
- [ ] `pnpm validate` — green
- [ ] `pnpm check-logos` — green
- [ ] `pnpm audit-services --no-http` — green
- [ ] `pnpm build` — green

## Other

- [ ] References a GitHub issue (`Closes #123` or `Part of #123`)
- [ ] PR title follows Conventional Commits (`content:` / `feat:` / `fix:` / `docs:` / `chore:`)
- [ ] Branch follows naming convention (`add/`, `update/`, `expand/`, `fix/`, `docs/`, `cleanup/`)
