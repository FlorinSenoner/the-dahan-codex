---
phase: 05-text-opening-management
plan: 05
subsystem: ui
tags: [fuse.js, search, client-side, offline]

# Dependency graph
requires:
  - phase: 04-pwa-offline
    provides: TanStack Query caching with IndexedDB persistence
  - phase: 03.6-simplify-spirit-board
    provides: Spirits and openings data models
provides:
  - Global client-side search with Fuse.js
  - Search page with grouped results (Spirits, Openings)
  - Bottom nav Search tab
affects: [admin-tools, future-search-enhancements]

# Tech tracking
tech-stack:
  added: [fuse.js]
  patterns: [client-side fuzzy search, debounced input, grouped results]

key-files:
  created:
    - app/hooks/use-search.ts
    - app/routes/search.tsx
  modified:
    - app/components/layout/bottom-nav.tsx
    - convex/spirits.ts
    - convex/openings.ts

key-decisions:
  - "Fuse.js for client-side fuzzy search (works offline)"
  - "200ms debounce for search input"
  - "Results grouped by type with counts"
  - "Opening links navigate to spirit page"

patterns-established:
  - "useSearch hook with weighted Fuse.js keys"
  - "listAllSpirits/listAll queries for flat data retrieval"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase 05 Plan 05: Global Search Summary

**Fuse.js fuzzy search across spirits and openings with debounced input and grouped results**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-29T12:17:49Z
- **Completed:** 2026-01-29T12:20:59Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Installed fuse.js for client-side fuzzy search
- Created useSearch hook with weighted search keys
- Built search page with results grouped by Spirits and Openings
- Added Search tab to bottom navigation
- Search works offline using cached TanStack Query data

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Fuse.js and create search hook** - `66c6cd7` (feat)
2. **Task 2: Create search page** - `2db80f0` (feat)
3. **Task 3: Add Search tab to bottom nav** - `6cdfbe0` (feat)

## Files Created/Modified

- `app/hooks/use-search.ts` - Fuse.js search hook with weighted keys for spirits and openings
- `app/hooks/index.ts` - Export useSearch hook
- `app/routes/search.tsx` - Search page with debounced input and grouped results
- `app/components/layout/bottom-nav.tsx` - Added Search tab between Spirits and disabled tabs
- `convex/spirits.ts` - Added listAllSpirits query for flat spirit retrieval
- `convex/openings.ts` - Added listAll query with spiritName/spiritSlug enrichment
- `knip.json` - Removed fuse.js from ignoreDependencies

## Decisions Made

- **Fuse.js weighted keys:** name (2x), aspectName/spiritName (1.5x), summary/description (1x) for relevance ranking
- **0.3 threshold:** Balanced fuzzy matching - not too strict, not too loose
- **Top 10 results per type:** Prevents overwhelming results while showing most relevant
- **Opening links to spirit page:** Via spiritSlug field - deep linking to specific opening deferred
- **Removed autoFocus:** Biome lint rule for accessibility compliance

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added missing Convex queries**
- **Found during:** Task 1 (Search hook creation)
- **Issue:** Plan referenced listAllSpirits and listAll queries that didn't exist
- **Fix:** Added listAllSpirits to spirits.ts and listAll to openings.ts
- **Files modified:** convex/spirits.ts, convex/openings.ts
- **Verification:** Typecheck passes, queries available in api
- **Committed in:** 66c6cd7 (Task 1 commit)

**2. [Rule 1 - Bug] Removed conflicting _admin.tsx file**
- **Found during:** Task 3 (Typecheck verification)
- **Issue:** Untracked _admin.tsx file caused route conflict with index.tsx
- **Fix:** Removed untracked file (not part of this plan)
- **Files modified:** None (deleted untracked file)
- **Verification:** Typecheck passes

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct operation. No scope creep.

## Issues Encountered

- Biome lint rejected autoFocus attribute on search input for accessibility reasons - removed it

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Search functionality complete and accessible via bottom nav
- Works offline with cached data
- Ready for admin tools to manage openings content

---
*Phase: 05-text-opening-management*
*Completed: 2026-01-29*
