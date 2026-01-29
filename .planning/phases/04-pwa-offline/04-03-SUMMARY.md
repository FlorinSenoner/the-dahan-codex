---
phase: 04-pwa-offline
plan: 03
subsystem: ui
tags: [pwa, settings, cache, offline, convex]

# Dependency graph
requires:
  - phase: 04-01
    provides: PWA hooks foundation (useOnlineStatus, useServiceWorker)
provides:
  - Settings page at /settings route
  - Download for Offline button to precache all spirit data
  - Cache management (Refresh Data, Clear Cache buttons)
affects: [04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useConvex().query for programmatic Convex queries outside React hooks
    - caches API for cache management
    - navigator.serviceWorker.getRegistration for SW lifecycle control

key-files:
  created:
    - app/routes/settings.tsx
  modified: []

key-decisions:
  - "Adapted openings download to use listBySpirit per spirit (no openings.list exists)"
  - "Used lucide-react icons (Download, RefreshCw, Trash2) for button affordances"
  - "Loading states disable all buttons to prevent concurrent operations"

patterns-established:
  - "Settings page pattern: sections with Heading h3, descriptive Text muted, full-width Buttons"
  - "Cache clear pattern: delete all caches + unregister SW + reload"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 04 Plan 03: Settings Page Summary

**Settings page with Download for Offline, Refresh Data, and Clear Cache buttons using Convex queries and Cache API**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T15:34:39Z
- **Completed:** 2026-01-28T15:36:19Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Settings page renders at /settings route with PageHeader component
- Download for Offline button fetches all spirits via listSpirits, then each spirit detail via getSpiritBySlug, then openings via listBySpirit
- Refresh Data button clears convex-api-cache and reloads page
- Clear Cache button clears all caches, unregisters service worker, and reloads
- Loading states prevent double-clicks during async operations
- Progress feedback shows download progress (e.g., "Loading spirit details (3/12)...")

## Task Commits

Each task was committed atomically:

1. **Task 1: Create settings route** - `c067871` (feat)

**Plan metadata:** To be committed separately

## Files Created/Modified
- `app/routes/settings.tsx` - Settings page with offline download and cache management functionality

## Decisions Made
- **Adapted download logic:** Plan specified `api.openings.list` but the actual API only has `listBySpirit`, so adapted to iterate through spirits and fetch openings per spirit
- **Used existing UI components:** PageHeader, Button, Heading, Text for consistent styling
- **Lucide icons:** Download, RefreshCw, Trash2 for clear button affordances

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected Convex query names**
- **Found during:** Task 1 (Create settings route)
- **Issue:** Plan specified `api.spirits.list` and `api.spirits.getBySlug` but actual API uses `listSpirits` and `getSpiritBySlug`
- **Fix:** Updated query calls to use correct API method names
- **Files modified:** app/routes/settings.tsx
- **Verification:** `pnpm typecheck` passes
- **Committed in:** c067871 (part of task commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** API name correction necessary for compilation. No scope creep.

## Issues Encountered
None - straightforward implementation after API name correction.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Settings page complete and ready for integration
- /settings route available for linking from navigation
- Future plans can add more settings sections as needed

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
