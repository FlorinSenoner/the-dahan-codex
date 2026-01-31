---
phase: 05-text-opening-management
plan: 18
subsystem: ui
tags: [react-context, edit-mode, scroll-fix, tanstack-router]

# Dependency graph
requires:
  - phase: 05-text-opening-management
    provides: useEditMode hook, EditFab component
provides:
  - EditModeContext for session-scoped edit state
  - Scroll-safe edit mode toggling
  - React Context pattern for edit mode
affects: [future-admin-features, edit-mode-consumers]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - React Context for cross-component state that shouldn't trigger navigation
    - Separate context for edit mode vs URL params for openings selection

key-files:
  created:
    - app/contexts/edit-mode-context.tsx
  modified:
    - app/hooks/use-edit-mode.ts
    - app/routes/__root.tsx
    - app/routes/spirits.$slug.tsx
    - app/routes/spirits.$slug.$aspect.tsx

key-decisions:
  - "Edit mode uses React Context instead of URL state to avoid TanStack Router scroll restoration"
  - "EditModeProvider placed inside ConvexProviderWithClerk to maintain provider hierarchy"
  - "useEditModeContext throws helpful error if used outside provider"

patterns-established:
  - "Edit mode via React Context: URL changes trigger scroll, context changes don't"

# Metrics
duration: 4min
completed: 2026-01-31
---

# Phase 05 Plan 18: Edit Mode Scroll Fix Summary

**Convert edit mode from URL state to React Context to prevent scroll jump on toggle**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-31T14:33:00Z
- **Completed:** 2026-01-31T14:37:24Z
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments

- Created EditModeContext with session-scoped state management
- Updated useEditMode hook to use context instead of URL navigation
- Added EditModeProvider to root layout
- Removed edit param from route validateSearch, fixing scroll jump

## Task Commits

Each task was committed atomically:

1. **All tasks: Convert edit mode to React Context** - `589b968` (feat)

Note: Tasks 1-4 were committed together as they form a single interdependent change (context, hook, provider, and route validation).

**Plan metadata:** See below

## Files Created/Modified

- `app/contexts/edit-mode-context.tsx` - New EditModeContext provider and useEditModeContext hook
- `app/hooks/use-edit-mode.ts` - Updated to use context instead of URL navigation
- `app/routes/__root.tsx` - Added EditModeProvider wrapper inside ConvexProviderWithClerk
- `app/routes/spirits.$slug.tsx` - Removed edit param from validateSearch
- `app/routes/spirits.$slug.$aspect.tsx` - Removed edit param from Link search prop

## Decisions Made

- **Context placement:** EditModeProvider placed inside ConvexProviderWithClerk but wrapping UI content, ensuring it's available to all routes
- **Error handling:** useEditModeContext throws descriptive error if used outside provider for better DX
- **Interface preservation:** useEditMode hook interface unchanged (isEditing, toggleEdit, setEditing) - consumers need no updates

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed aspect route edit reference**
- **Found during:** Task 4 (Remove edit param)
- **Issue:** spirits.$slug.$aspect.tsx had `search={{ edit: false, opening: undefined }}` which TypeScript rejected after removing edit from parent route
- **Fix:** Removed edit from search object, leaving only `opening: undefined`
- **Files modified:** app/routes/spirits.$slug.$aspect.tsx
- **Verification:** TypeScript compilation passes
- **Committed in:** 589b968 (part of main commit)

---

**Total deviations:** 1 auto-fixed (blocking)
**Impact on plan:** Minor scope expansion to fix aspect route reference. No scope creep.

## Issues Encountered

None - plan executed smoothly after fixing the aspect route reference.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Edit mode scroll fix complete
- Ready for UAT verification of scroll behavior
- All gap closure plans (05-15 through 05-18) now complete

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-31*
