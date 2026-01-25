---
phase: quick
plan: 003
subsystem: auth
tags: [clerk, env-vars, github-actions, routing]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: ClerkProvider setup with Convex integration
provides:
  - ClerkProvider configured with routing environment variables
  - GitHub Actions CI/CD with Clerk routing vars
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - VITE_ prefix for browser-accessible env vars

key-files:
  created: []
  modified:
    - app/routes/__root.tsx
    - .github/workflows/ci.yml
    - mise.local.toml (local only, gitignored)

key-decisions:
  - "Hardcode routing paths in GitHub Actions (not secrets, same across environments)"

patterns-established:
  - "Clerk routing env vars use VITE_ prefix for browser access"

# Metrics
duration: 1min
completed: 2026-01-25
---

# Quick Task 003: Wire Clerk Routing Env Vars Summary

**ClerkProvider configured with signInUrl, signUpUrl, and fallback redirect URLs via VITE_CLERK_* environment variables**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-25T14:54:18Z
- **Completed:** 2026-01-25T14:55:17Z
- **Tasks:** 2
- **Files modified:** 3 (2 committed, 1 local-only)

## Accomplishments
- Renamed Clerk routing env vars to VITE_CLERK_* prefix for browser access
- Wired ClerkProvider with signInUrl, signUpUrl, signInFallbackRedirectUrl, signUpFallbackRedirectUrl props
- Added routing vars to GitHub Actions global env and deploy job build step

## Task Commits

Each task was committed atomically:

1. **Task 1: Update env vars and wire ClerkProvider** - `80b7f86` (feat)
2. **Task 2: Add routing vars to GitHub Actions** - `b00528b` (feat)

## Files Created/Modified
- `app/routes/__root.tsx` - Added routing props to ClerkProvider
- `.github/workflows/ci.yml` - Added VITE_CLERK_SIGN_* env vars to global and deploy job
- `mise.local.toml` - Renamed env vars to VITE_ prefix (local only, gitignored)

## Decisions Made
- Hardcoded routing paths in GitHub Actions (not secrets, values are identical across environments)
- mise.local.toml changes not committed (file is gitignored for secrets protection)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Clerk routing fully configured
- Ready for Phase 2 development

---
*Phase: quick-003*
*Completed: 2026-01-25*
