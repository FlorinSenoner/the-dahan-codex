---
phase: 05-text-opening-management
plan: 08
subsystem: database
tags: [convex, schema, openings, turns]

# Dependency graph
requires:
  - phase: 05-04
    provides: Opening editor with turn notes field
provides:
  - Simplified turn schema without notes field
  - Cleaner UI with just title and instructions per turn
affects: [05-06-e2e-tests]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - convex/schema.ts
    - convex/openings.ts
    - convex/seed.ts
    - app/components/admin/editable-opening.tsx
    - app/components/spirits/opening-section.tsx
    - app/components/spirits/turn-accordion.tsx

key-decisions:
  - "Opening-level description sufficient for strategy notes - turn-level notes add unnecessary complexity"

patterns-established: []

# Metrics
duration: 3min
completed: 2026-01-30
---

# Phase 5 Plan 08: Remove Turn Notes Field Summary

**Simplified turn data model by removing notes field - opening-level description handles strategy notes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-30T23:55:40Z
- **Completed:** 2026-01-30T23:58:13Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Removed notes field from openings turn schema in Convex
- Updated createOpening and updateOpening mutations to exclude notes
- Cleaned seed data to remove notes from turn objects
- Removed notes input from turn editor UI
- Removed notes display from turn accordion component

## Task Commits

Each task was committed atomically:

1. **Task 1-2: Remove notes from schema and UI** - `7f5aa5f` (refactor)

**Plan metadata:** Included in task commit

## Files Created/Modified
- `convex/schema.ts` - Removed notes field from turns array object
- `convex/openings.ts` - Removed notes from createOpening/updateOpening mutation args
- `convex/seed.ts` - Removed notes from seed data turn objects (2 occurrences)
- `app/components/admin/editable-opening.tsx` - Removed notes from Turn interface and editor
- `app/components/spirits/opening-section.tsx` - Removed notes from form data handling
- `app/components/spirits/turn-accordion.tsx` - Removed notes display block

## Decisions Made
- Opening-level description field is sufficient for strategy notes
- Turn-level notes added unnecessary complexity to data model and UI
- Simplified form reduces cognitive load for content authors

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Turn schema simplified and ready for E2E testing
- Opening editor streamlined for better UX
- No blockers for remaining gap closure plans

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-30*
