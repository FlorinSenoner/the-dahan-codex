---
phase: quick-002
plan: 01
subsystem: auth
tags: [clerk, react, deprecation-fix]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: ClerkProvider and UserButton setup
provides:
  - Non-deprecated ClerkProvider afterSignOutUrl configuration
  - Clean UserButton components
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Global auth redirect configuration via ClerkProvider props"

key-files:
  created: []
  modified:
    - app/routes/__root.tsx
    - app/routes/index.tsx
    - app/routes/_authenticated/profile.tsx

key-decisions:
  - "Configured afterSignOutUrl at ClerkProvider level per Clerk v5.x best practice"

patterns-established:
  - "Auth redirect configuration: use ClerkProvider props, not individual component props"

# Metrics
duration: 2min
completed: 2026-01-25
---

# Quick Task 002: Fix Deprecated afterSignOutUrl Property Summary

**Migrated afterSignOutUrl from deprecated UserButton prop to global ClerkProvider configuration**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-25
- **Completed:** 2026-01-25
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Moved afterSignOutUrl to ClerkProvider global configuration
- Removed deprecated afterSignOutUrl prop from all UserButton components
- Sign out still correctly redirects to home page

## Task Commits

Each task was committed atomically:

1. **Task 1: Move afterSignOutUrl to ClerkProvider** - `368cc0c` (fix)
2. **Task 2: Remove deprecated prop from UserButton usages** - `e1c7a8c` (fix)

## Files Created/Modified

- `app/routes/__root.tsx` - Added afterSignOutUrl prop to ClerkProvider
- `app/routes/index.tsx` - Removed deprecated afterSignOutUrl from UserButton
- `app/routes/_authenticated/profile.tsx` - Removed deprecated afterSignOutUrl from UserButton

## Decisions Made

- Configured afterSignOutUrl at ClerkProvider level per Clerk v5.x deprecation notice

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Clerk deprecation warning resolved
- Ready for Phase 2 development

---
*Phase: quick-002*
*Completed: 2026-01-25*
