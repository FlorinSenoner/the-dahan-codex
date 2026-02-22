# Agent Working Guide

This file is the canonical working guide for agents in this repository.

## Project Snapshot

Spirit Island companion PWA with an offline-first spirit/aspect reference, setup/openings content,
and game tracking.

## Core Stack

- Frontend: React 19, TanStack Router, TypeScript
- Backend: Convex
- Auth: Clerk
- Styling: Tailwind CSS 4 + Radix/shadcn patterns
- PWA: vite-plugin-pwa + Workbox (`injectManifest`)
- Deployment: Cloudflare Pages
- Tooling: pnpm, Biome, Prettier, Playwright, knip, jscpd

## Commit and PR Conventions

- Use Conventional Commits for every commit message.
- Use a Conventional Commit title for every pull request title.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`.
- Formats:
  - Commit: `<type>(optional-scope): <description>`
  - PR title: `<type>(optional-scope): <description>`
- Do not use custom prefixes like `[codex]` in PR titles.

Examples:

- `feat(nav): replace Notes tab with Home`
- `fix(hooks): add non-mise fallback for pre-push ci-parity`

## Safety and Artifact Rules

- Never commit screenshots captured during testing (manual, Playwright, or headless).
- Keep testing screenshots in temporary/untracked paths only.
- Keep raw scraped opening source datasets; do not delete them.
- Canonical seed JSON lives in `scripts/data` and is consumed by `convex/seed.ts`.

## Project Map

```text
src/routes/          # TanStack Router file-based routes
src/lib/             # Shared frontend utilities
src/components/      # UI components
convex/              # Backend schema and functions by domain
convex/schema.ts     # Convex schema (source of truth)
scripts/data/        # Canonical seed JSON + raw opening source archives
scripts/             # Data and maintenance scripts
public/              # Static assets
.planning/           # Requirements, roadmap, state, automation docs
```

## Key Commands

```bash
pnpm dev
npx convex dev
pnpm build
pnpm preview
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm typecheck:convex
pnpm check
```

## Daily Audit Docs

- Runbook: `.planning/DAILY_AUDIT_AUTOMATION.md`
- Memory: `.planning/automation-memory/daily-audit.md`
- Keep both files present and updated when workflow expectations change.

## Working Workflows

### Add a Route

1. Add file under `src/routes/` following TanStack Router conventions.
2. Run `pnpm dev` and verify route generation.
3. Put protected screens under authenticated layout patterns already used in the app.

### Add/Change Convex Function

1. Edit/add function under `convex/` by domain (`spirits.ts`, `games.ts`, `openings.ts`, etc.).
2. Validate `args` and `returns` explicitly.
3. Use Convex-generated API/types in frontend callsites.
4. Run `pnpm typecheck:convex`.

### E2E Changes

1. Run targeted test first.
2. Then run full suite `pnpm test:e2e` to catch regressions from shared helpers.
3. Prefer deterministic waits over arbitrary timeouts.

## Quality Gates

Before shipping substantial changes, run:

1. `pnpm check`
2. `pnpm build`
3. `pnpm test` (and `pnpm test:e2e` when UI flows changed)

## Convex and Data Rules

- Treat `convex/schema.ts` as data-shape truth.
- Prefer indexed queries; avoid broad `collect()` + in-memory filters for lookups.
- Use `ConvexError` for user-facing errors.
- Keep public function exposure intentional; sensitive operations should be internal/admin-gated.
- Infer frontend payload/result types from Convex function types; avoid duplicate hand-written types
  when possible.

## Production Data Safety Rules

- Production spirit reseed operations must be scoped to `expansions`, `spirits`, and `openings`.
- Before any production reseed, run the preflight checks in
  `.planning/runbooks/production-spirit-reseed.md`.
- Abort reseed if preflight indicates any `games` table touch risk.

## Games Migration Governance

- Any production `games` table schema/data change requires a backward-compatible migration plan.
- Every `games` production migration is handled case-by-case and requires explicit approval before
  rollout.
- Do not combine destructive `games` changes (remove/rename/repurpose fields or destructive data
  rewrites) in the same release where new `games` fields/shape are introduced.
- Required migration spec path: `.planning/migrations/games/YYYY-MM-DD-<slug>.md`

## Seed and Scraped Data Rules

- Canonical runtime seed inputs:
  - `scripts/data/spirits.json`
  - `scripts/data/aspects.json`
  - `scripts/data/openings.json`
- Raw opening sources must remain available for future lookup.
- Consolidated raw archive:
  - `scripts/data/openings-raw-by-source.json`
- Rebuild consolidated raw archive:
  - `node scripts/build-openings-raw-archive.mjs`

## UI/UX Rules

- Mobile-first, but desktop quality matters.
- Small interactive controls should use pointer affordance and clear hover/focus states.
- Preserve existing design language unless explicitly asked to redesign.
- Respect accessibility basics: touch target size, contrast, semantic labels.

## Offline-First Rules

For new features, explicitly reason about:

1. Offline behavior
2. Reconnection/sync behavior
3. Failure states for unavailable network/auth

Patterns used in this app:

- Reference data cached for offline reading.
- User game writes use offline/outbox patterns.
- PWA update flow is user-prompted, not silent replacement.

## Auth and Access Patterns

- Game routes use Clerk auth for cache-first UX.
- Convex-backed privileged actions must enforce authz in backend.
- Never trust client ownership claims without server-side checks.

## Testing Guidance

- Prefer stable selectors (`role`, label, semantic text) over brittle structural selectors.
- Investigate flakiness via race/timing causes before adding waits.
- When changing shared test utilities, assess blast radius first.

## Reference Docs

- Product requirements: `.planning/PROJECT.md`
- Scope and constraints: `.planning/REQUIREMENTS.md`
- Delivery plan: `.planning/ROADMAP.md`
- Current status: `.planning/STATE.md`
