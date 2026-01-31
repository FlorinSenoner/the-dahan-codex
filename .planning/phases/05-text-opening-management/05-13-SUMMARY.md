---
phase: 05-text-opening-management
plan: 13
subsystem: ui
tags: [react, scroll, edit-mode, ux]

# Dependency graph
requires:
  - phase: 05-04
    provides: EditableOpening component and edit mode toggle
provides:
  - Stable scroll behavior during edit mode transitions
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single wrapper component with swapped content pattern"

key-files:
  created: []
  modified:
    - app/components/spirits/opening-section.tsx

key-decisions:
  - "Render single section wrapper with conditional content inside to prevent layout shifts"

patterns-established:
  - "Content swap pattern: Keep outer container mounted, swap only inner content to preserve scroll position"

# Metrics
duration: 2min
completed: 2026-01-31
---

# Phase 5 Plan 13: Fix Scroll Behavior on Edit Toggle Summary

**Refactored OpeningSection to use single wrapper pattern preventing scroll jumps when toggling edit mode**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-30T23:59:40Z
- **Completed:** 2026-01-31T00:01:50Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Fixed scroll jump issue when entering/exiting edit mode
- Refactored OpeningSection to use single stable section wrapper
- Content now swaps inside the wrapper instead of entire section remounting

## Task Commits

Both tasks were addressed in a single commit since the fix was localized:

1. **Task 1: Investigate scroll cause in opening-section** - `27e3e0d` (fix)
2. **Task 2: Fix scroll behavior in spirit detail page** - `27e3e0d` (fix)

Root cause: Multiple return statements with different JSX trees caused React to unmount/remount components during reconciliation, triggering layout reflow and scroll jumps.

Solution: Use a single section wrapper that stays mounted, with a `renderContent()` function that returns only the inner content based on state.

## Files Created/Modified

- `app/components/spirits/opening-section.tsx` - Refactored to use single wrapper pattern with conditional inner content

## Decisions Made

- Used `renderContent()` function pattern to conditionally render inner content while keeping outer section stable
- Kept null return for read-only mode with no openings (section not needed when nothing to display)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - the root cause was correctly identified in the plan and the fix worked as expected.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Scroll behavior now stable during all edit mode transitions
- Ready for E2E testing of edit mode functionality

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-31*
