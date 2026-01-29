---
phase: 05-text-opening-management
plan: 04
subsystem: admin
tags: [tanstack-router, convex, forms, crud, opening-management]

# Dependency graph
requires:
  - phase: 05-02
    provides: OpeningForm component with Zod validation
  - phase: 05-03
    provides: Admin openings list page with navigation
provides:
  - Create opening page at /openings/new
  - Edit opening page at /openings/$id/edit with live preview
  - getById query for loading opening by ID
affects: [05-future-plans, admin-tools]

# Tech tracking
tech-stack:
  added: []
  patterns: [convex-useMutation-pattern, slug-auto-generation]

key-files:
  created:
    - app/routes/_admin/openings/new.tsx
    - app/routes/_admin/openings/$id.edit.tsx
  modified:
    - convex/openings.ts
    - app/components/admin/opening-form.tsx
    - app/routes/_admin/openings.tsx

key-decisions:
  - "Pathless _admin layout means URLs are /openings/* not /admin/openings/*"
  - "onSlugGenerate prop on OpeningForm for slug auto-generation"
  - "TurnAccordion used for live preview in edit page"

patterns-established:
  - "useMutation from convex/react with manual isSubmitting state for form submission"
  - "Slug auto-generation via onBlur handler when slug field is empty"

# Metrics
duration: 5min
completed: 2026-01-29
---

# Phase 5 Plan 4: Create/Edit Opening Routes Summary

**Admin routes for creating and editing openings with slug auto-generation and live TurnAccordion preview**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-29T13:34:00Z
- **Completed:** 2026-01-29T13:39:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- getById query for loading opening data in edit form
- Create opening page with OpeningForm and slug auto-generation on name blur
- Edit opening page with two-column layout: form + live TurnAccordion preview
- Fixed URL paths for pathless _admin layout convention

## Task Commits

Each task was committed atomically:

1. **Task 1: Add getById query** - `f9cbfa5` (feat)
2. **Task 2: Create new opening page** - `47a0a33` (feat)
3. **Task 3: Create edit opening page** - `2aaf44a` (feat)

## Files Created/Modified

- `convex/openings.ts` - Added getById query for fetching opening by ID
- `app/components/admin/opening-form.tsx` - Added onSlugGenerate prop, watch, setValue, handleNameBlur
- `app/routes/_admin/openings/new.tsx` - Create opening page with form and slug generation
- `app/routes/_admin/openings/$id.edit.tsx` - Edit opening page with form and TurnAccordion preview
- `app/routes/_admin/openings.tsx` - Fixed URL paths from /admin/openings/* to /openings/*

## Decisions Made

- **Pathless layout URL pattern:** The `_admin` layout is pathless, so URLs are `/openings/*` not `/admin/openings/*`. Updated all navigation paths accordingly.
- **Manual isSubmitting state:** Used `useMutation` from `convex/react` (not `useConvexMutation`) which requires manual isPending tracking via useState.
- **Slug auto-generation on blur:** onSlugGenerate prop passed to OpeningForm, triggered on name field blur only when slug is empty (preserves manual edits).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] URL paths for pathless _admin layout**
- **Found during:** Task 2 (Create new opening page)
- **Issue:** TanStack Router typecheck failed - `/admin/openings` is not a valid route path
- **Fix:** Changed all URLs from `/admin/openings/*` to `/openings/*` to match pathless layout convention
- **Files modified:** app/routes/_admin/openings.tsx, app/routes/_admin/openings/new.tsx
- **Verification:** pnpm typecheck passes
- **Committed in:** 47a0a33 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** URL path fix was necessary for TypeScript correctness. No scope creep.

## Issues Encountered

- **Convex mutation API difference:** Plan referenced `useConvexMutation` with `.mutateAsync()` but the codebase pattern uses `useMutation` from `convex/react` which returns a callable function directly. Followed existing codebase pattern.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Admin CRUD for openings is complete (list, create, edit, delete)
- Ready for additional admin features or opening improvements
- Search functionality already integrated (05-05)

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-29*
