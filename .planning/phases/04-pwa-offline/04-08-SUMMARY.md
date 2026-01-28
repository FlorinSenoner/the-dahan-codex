---
phase: 04-pwa-offline
plan: 08
subsystem: pwa
tags: [tanstack-query, indexeddb, idb-keyval, offline, cache-persistence]

# Dependency graph
requires:
  - phase: 04-01
    provides: PWA hooks and service worker configuration
provides:
  - IndexedDB persistence for TanStack Query cache
  - 7-day offline data retention
  - Cross-session query data survival
affects: [offline-first, data-sync]

# Tech tracking
tech-stack:
  added: []
  patterns: [IDB persister pattern for query caching]

key-files:
  created: []
  modified:
    - app/router.tsx

key-decisions:
  - "staleTime 5 minutes for fresh data balance"
  - "gcTime 7 days matching persistence maxAge"
  - "Only persist successful queries to avoid caching errors"

patterns-established:
  - "createIDBPersister: Factory function returning Persister interface for idb-keyval"

# Metrics
duration: 4min
completed: 2026-01-28
---

# Phase 04 Plan 08: Query Persistence Summary

**IndexedDB persistence for TanStack Query cache with 7-day retention via idb-keyval**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-28T18:50:00Z
- **Completed:** 2026-01-28T18:54:00Z
- **Tasks:** 2 (Task 1 was pre-completed)
- **Files modified:** 1

## Accomplishments

- Created IDB persister function using idb-keyval for simple key-value storage
- Configured QueryClient with 5-minute staleTime and 7-day gcTime
- Setup persistQueryClient with shouldDehydrateQuery to only persist successful queries
- Query data now survives browser restarts and tab closes

## Task Commits

Each task was committed atomically:

1. **Task 1: Install persistence dependencies** - (pre-completed, packages already installed)
2. **Task 2: Create IndexedDB persister and configure QueryClient** - `58a8055` (feat)

**Plan metadata:** Pending

## Files Created/Modified

- `app/router.tsx` - Added IDB persister, staleTime/gcTime config, persistQueryClient setup

## Decisions Made

- **staleTime 5 minutes:** Balance between fresh data and reducing unnecessary refetches
- **gcTime 7 days:** Long enough for offline use, short enough to not accumulate stale data indefinitely
- **Only persist successful queries:** Prevents caching error states that would persist across sessions

## Deviations from Plan

None - plan executed exactly as written.

Note: Task 1 (install dependencies) was already completed prior to this execution - packages were already in package.json. This is not a deviation, just prior work.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Query persistence is now active
- Data synced via "Download for Offline" will persist in IndexedDB
- Users can close browser and reopen with cached data available

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
