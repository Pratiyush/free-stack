# Release Notes

Per-tag release notes for free-stack. Source of truth for GitHub Releases.

## How this works

1. **Before tagging `vX.Y.Z`** — copy `_TEMPLATE.md` to `vX.Y.Z.md` and fill it in.
2. **Update `CHANGELOG.md`** — roll the `[Unreleased]` block to `[X.Y.Z] - <date>`.
3. **Cut the annotated git tag** — `git tag -a vX.Y.Z -m "<one-line summary>"`.
4. **Create the GitHub Release** — `gh release create vX.Y.Z --notes-file release-notes/vX.Y.Z.md`.
5. **Verify the deploy is green** before publishing — no tags on red builds.

## Versioning

- **MAJOR** (`vX.0.0`) — restructure, schema break, framework migration
- **MINOR** (`v1.X.0`) — new category, new automation, new top-level section
- **PATCH** (`v1.0.X`) — individual service add/update/remove, link fix, doc tweak

## Conventions for the first line

The first line is what visitors see in the GitHub Release card and in our marketing posts. Make it user-facing — not the commit title.

Bad: `feat: scaffold Astro project`
Good: `free-stack rebuilt on Astro 6 — now live on Cloudflare Pages.`
