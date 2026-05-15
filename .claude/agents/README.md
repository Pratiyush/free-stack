# free-stack scrum-team agents

Project-scoped agents that turn the free-stack maintenance work into a structured Scrum flow. Adapted from a generic 9-role prompt pack into 6 free-stack-shaped roles: one orchestrator, one BA, one designer, one tech-lead, two implementers, one verifier.

## Roles at a glance

| File | Role | Model | Spawns | Spawned by |
|---|---|---|---|---|
| `sprint-orchestrator.md` | Scrum Master / PO interface | opus | all 5 others | the human user (default session role) |
| `catalog-editor.md` | Business Analyst | sonnet | — | sprint-orchestrator |
| `editorial-designer.md` | UI/UX Designer | sonnet | — | sprint-orchestrator |
| `astro-tech-lead.md` | Frontend Tech Lead | sonnet | astro-implementer + catalog-implementer | sprint-orchestrator |
| `astro-implementer.md` | Astro pages/components implementer | sonnet | — | astro-tech-lead |
| `catalog-implementer.md` | YAML + logos + scripts implementer | sonnet | — | astro-tech-lead, sprint-orchestrator |
| `site-verifier.md` | QA + pricing-drift verifier | sonnet | — | sprint-orchestrator |

## Flow for a typical story

```
user (PO)
  ↓ "I want to add service X"
sprint-orchestrator
  ↓ Foreground spawn
catalog-editor → returns Gherkin AC + estimate
  ↓
sprint-orchestrator splits:
  ├─ editorial-designer  (parallel — when visual)
  └─ astro-tech-lead
       ↓ Parallel spawn
       ├─ astro-implementer    (parallel)
       └─ catalog-implementer  (parallel)
       ↓ Review consolidation
       astro-tech-lead returns "ready for verification"
  ↓
sprint-orchestrator
  ↓ Foreground spawn
site-verifier → returns ship/no-ship recommendation
  ↓
sprint-orchestrator presents to user
  ↓
user approves → sprint-orchestrator hands `git tag` / `gh release` commands to user
```

## Adaptation notes (raw pack → free-stack)

Source: 9-role "Agentic Scrum Team Prompt Pack" provided by user.

Key adaptations:

- **9 → 6.** The raw pack's 3 identical "Frontend Devs" collapse to 2 specialists: `astro-implementer` (pages/components) and `catalog-implementer` (YAML/logos/scripts). QA and Playwright merge into `site-verifier` (both produce the same triage doc).
- **"Mock API contract" → "Zod content schema + facets/sources blocks."** free-stack is build-time static — there's no API. Data is YAML.
- **Figma → `ref/design-experiments/`.** The v3 brief (`v3-design-brief.html`) and screenshots are the design source. The v4 pass is external (Claude Design).
- **Editorial almanac voice constraints** added to every agent: sponsor purple confined to `/sponsors` + footer, coral for selection state, paper-cream background, no SaaS-isms.
- **"Frontend-only" framing retained** — Astro is genuinely backend-free (static output), so the raw pack's structure fits.
- **Git tagging is a handoff** — every agent's CONSTRAINTS section forbids autonomous tags / pushes (memory rule `feedback_git_workflow.md`).

## Tools whitelist per role

| Agent | Tools |
|---|---|
| sprint-orchestrator | all (it's the main session) |
| catalog-editor | Read, Write, Edit, Bash, Agent |
| editorial-designer | Read, Write, Bash |
| astro-tech-lead | Read, Edit, Write, Bash, Agent |
| astro-implementer | Read, Edit, Write, Bash |
| catalog-implementer | Read, Edit, Write, Bash |
| site-verifier | Read, Bash, WebFetch |

Leaf-node agents (implementers + verifier) do not have the Agent tool — no nested delegation, keeps the call graph shallow.

## Project context every agent reads

- `CLAUDE.md` — project law.
- `src/content.config.ts` — Zod schema, the data contract.
- `docs/sprints/sprint-3.md` — current sprint plan.
- `ref/design-experiments/v3-design-brief.html` — design source for visual stories.

## See also

- `/Users/deepshikhasingh/.claude/plans/and-get-ignore-and-cozy-frog.md` — the plan that produced this pack.
