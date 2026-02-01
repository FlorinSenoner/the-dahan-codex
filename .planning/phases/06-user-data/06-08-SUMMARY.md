---
phase: 06-user-data
plan: 08
subsystem: ui
tags: [csv, papaparse, import, validation, preview]

# Dependency graph
requires:
  - phase: 06-05
    provides: Game CRUD operations
  - phase: 06-06
    provides: Game detail page with edit
  - phase: 06-07
    provides: CSV export functionality
provides:
  - CSV import utility with PapaParse parsing
  - CSV validation with error messages
  - Import preview component showing new/update badges
  - importGames mutation for bulk upsert
  - Import page with file upload workflow
affects: [06-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSV import with preview before confirmation
    - ID-based sync (full replacement for existing)

key-files:
  created:
    - app/lib/csv-import.ts
    - app/components/games/csv-preview.tsx
    - app/routes/_authenticated/games/import.tsx
  modified:
    - convex/games.ts
    - app/routes/_authenticated/games/index.tsx

key-decisions:
  - "Full replacement on import matches - missing fields removed from existing records"
  - "Import doesn't resolve spirit IDs - uses name only (CSV limitation)"
  - "Composite key for preview list items uses id or date+spirit1+index"

patterns-established:
  - "File upload with preview step before action"
  - "Validation with array of error messages per row"

# Metrics
duration: 4min
completed: 2026-01-31
---

# Phase 06 Plan 08: CSV Import Summary

**CSV import with preview showing valid/invalid/new/update status and bulk upsert via importGames mutation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-31T19:11:03Z
- **Completed:** 2026-01-31T19:14:53Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- CSV parsing using PapaParse with validation
- Preview component showing game status badges
- Import page with file upload and confirmation workflow
- Bulk upsert mutation with ID-based matching

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CSV import utility** - `f799d16` (feat)
2. **Task 2: Add importGames mutation** - `2e0700b` (feat)
3. **Task 3: Create CSVPreview and import page** - `4160714` (feat)

## Files Created/Modified
- `app/lib/csv-import.ts` - CSV parsing, validation, and row-to-data conversion
- `app/components/games/csv-preview.tsx` - Preview table with status badges
- `app/routes/_authenticated/games/import.tsx` - Import page with upload flow
- `convex/games.ts` - Added importGames mutation for bulk upsert
- `app/routes/_authenticated/games/index.tsx` - Added Import CSV button

## Decisions Made
- Full replacement strategy for existing games (per CONTEXT.md)
- Import doesn't resolve spirit IDs - stores name only (CSV doesn't contain IDs)
- Used Number.isNaN instead of global isNaN per Biome lint rule

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Biome lint warning for array index key - fixed by using composite key from row data
- Type inference for mutation result - refactored to get result from mutateAsync

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- CSV import/export roundtrip complete
- Ready for stats page (06-09)
- No blockers

---
*Phase: 06-user-data*
*Completed: 2026-01-31*
