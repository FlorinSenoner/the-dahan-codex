---
phase: 05-text-opening-management
plan: 01
subsystem: auth
tags: [clerk, convex, admin, role-guard, crud, mutations]

# Dependency graph
requires:
  - phase: 04-pwa-offline
    provides: "PWA infrastructure and routes"
  - phase: 03.6-simplify-spirit-board
    provides: "Openings schema and queries"
provides:
  - Admin layout route with Clerk role guard
  - Convex CRUD mutations for openings (create, update, remove)
  - Form dependencies (react-hook-form, @hookform/resolvers)
affects: [05-02, 05-03, 05-04]

# Tech tracking
tech-stack:
  added: [react-hook-form, @hookform/resolvers]
  patterns: [publicMetadata.isAdmin role check, requireAdmin mutation guard]

key-files:
  created:
    - app/routes/_admin.tsx
    - app/routes/_admin/openings.tsx
  modified:
    - convex/openings.ts
    - knip.json

key-decisions:
  - "useUser() for publicMetadata access (not useAuth())"
  - "requireAdmin() as first line in every mutation handler"
  - "Placeholder admin route for route tree generation"

patterns-established:
  - "Admin layout pattern: _admin.tsx with Clerk publicMetadata.isAdmin check"
  - "Admin mutation pattern: await requireAdmin(ctx) as first line"
  - "Slug uniqueness validation in create/update mutations"

# Metrics
duration: 8min
completed: 2026-01-29
---

# Phase 05 Plan 01: Admin Foundation Summary

**Admin layout with Clerk publicMetadata.isAdmin guard and Convex CRUD mutations (create/update/remove) with requireAdmin validation**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-29T12:19:00Z
- **Completed:** 2026-01-29T12:27:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Admin layout route checks Clerk publicMetadata.isAdmin and redirects non-admins to home
- Convex create mutation with slug uniqueness validation
- Convex update mutation with slug uniqueness check (excludes self)
- Convex remove mutation for deleting openings
- All mutations enforce admin role server-side via requireAdmin()

## Task Commits

Each task was committed atomically:

1. **Task 1: Install form dependencies** - `66c6cd7` (chore) - Already completed in previous plan
2. **Task 2: Create admin layout route** - `8988b93` (feat)
3. **Task 3: Add Convex opening mutations** - `bc5dc5b` (feat)

## Files Created/Modified

- `app/routes/_admin.tsx` - Admin layout with Clerk role guard
- `app/routes/_admin/openings.tsx` - Placeholder admin openings page
- `convex/openings.ts` - Added create, update, remove mutations with requireAdmin
- `knip.json` - Added form dependencies to ignoreDependencies

## Decisions Made

- **useUser() over useAuth():** Need publicMetadata for isAdmin claim, useAuth() only provides auth state
- **Placeholder admin route:** TanStack Router requires at least one child route for pathless layouts to function correctly
- **requireAdmin() first:** Server-side validation prevents API bypass attacks

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] knip pre-commit failing for unused form dependencies**
- **Found during:** Task 1 (Install form dependencies)
- **Issue:** react-hook-form and @hookform/resolvers flagged as unused by knip since no code uses them yet
- **Fix:** Added packages to knip.json ignoreDependencies (will be used in Plan 05-02)
- **Files modified:** knip.json
- **Verification:** Pre-commit hooks pass
- **Committed in:** 66c6cd7 (already part of previous 05-05 plan commit)

**2. [Rule 3 - Blocking] TanStack Router conflict between _admin.tsx and index.tsx**
- **Found during:** Task 2 (Create admin layout route)
- **Issue:** Pathless layout without children caused route conflict error
- **Fix:** Created _admin/openings.tsx placeholder route to establish proper layout structure
- **Files modified:** app/routes/_admin/openings.tsx
- **Verification:** Route tree generates correctly, typecheck passes
- **Committed in:** 8988b93 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both blocking issues)
**Impact on plan:** Both fixes necessary for CI to pass. No scope creep.

## Issues Encountered

- TypeScript narrowing issue with optional slug in update mutation - fixed by extracting to const before use in query

## User Setup Required

None - admin role must already be configured in Clerk for the user (publicMetadata.isAdmin: true).

## Next Phase Readiness

- Admin layout ready for child routes (Plan 05-02 will add opening form)
- CRUD mutations ready for frontend integration
- Form libraries installed for opening editor components

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-29*
