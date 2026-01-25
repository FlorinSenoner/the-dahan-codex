---
type: quick
plan: 001
subsystem: infra
tags: [knip, dependabot, pre-commit, lefthook, biome]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: lefthook pre-commit hooks, package.json scripts
provides:
  - Knip configuration for unused dependency/export detection
  - Pre-commit hook running knip on code changes
  - Dependabot configuration for automated dependency updates
affects: []

# Tech tracking
tech-stack:
  added: [knip]
  patterns: [pre-commit dead code detection]

key-files:
  created: [knip.json, .github/dependabot.yml]
  modified: [package.json, lefthook.yml, biome.json]

key-decisions:
  - "Ignore generated files (routeTree.gen.ts, convex/_generated) from knip analysis"
  - "Ignore workbox-* runtime dependencies (used in scripts/generate-sw.ts)"
  - "Group minor/patch dependabot updates to reduce PR noise"
  - "Ignore major updates for React/TanStack (require manual review)"

patterns-established:
  - "Knip runs in pre-commit to prevent unused code"
  - "Dependabot opens weekly PRs for dependency updates"

# Metrics
duration: 8min
completed: 2025-01-25
---

# Quick Task 001: Add Knip and Dependabot for Git Workflow

**Knip for unused dependency/export detection with pre-commit integration, plus weekly Dependabot updates for npm and GitHub Actions**

## Performance

- **Duration:** 8 min
- **Started:** 2025-01-25
- **Completed:** 2025-01-25
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Knip installed and configured for project structure (entry points, generated file ignores)
- Pre-commit hook runs knip alongside biome and typecheck
- Dependabot configured for weekly npm and GitHub Actions updates with smart grouping

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Knip with configuration and pre-commit hook** - `c00abe3` (feat)
2. **Task 2: Add Dependabot configuration** - `df95125` (feat)
3. **Task 3: Run initial Knip check and fix any issues** - No commit needed (already clean)

## Files Created/Modified

- `knip.json` - Knip configuration with entry points and ignore patterns
- `.github/dependabot.yml` - Dependabot config for npm and GitHub Actions
- `package.json` - Added knip and knip:fix scripts
- `lefthook.yml` - Added knip to pre-commit hooks
- `biome.json` - Migrated to schema 2.3.12 (required for pre-commit)

## Decisions Made

- **Ignore generated files:** `routeTree.gen.ts` and `convex/_generated/**` are auto-generated and should not be analyzed
- **Ignore workbox dependencies:** Used in `scripts/generate-sw.ts` but knip can't trace script imports
- **Group minor/patch updates:** Reduces Dependabot PR noise while staying current
- **Ignore major framework updates:** React and TanStack major versions require manual review

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migrated biome.json to schema 2.3.12**

- **Found during:** Task 1 (pre-commit hook execution)
- **Issue:** biome.json used schema 1.9.4, incompatible with biome CLI 2.3.12
- **Fix:** Ran `pnpm biome migrate --write` to update config
- **Files modified:** biome.json
- **Verification:** Pre-commit hook passes
- **Committed in:** c00abe3 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required to unblock pre-commit. No scope creep.

## Issues Encountered

- `workspaces: false` is invalid in knip.json (expects object or omit) - removed the key

## Next Phase Readiness

- Pre-commit now validates unused code in addition to formatting and types
- Dependabot will create weekly PRs starting next Monday

---

*Quick Task: 001*
*Completed: 2025-01-25*
