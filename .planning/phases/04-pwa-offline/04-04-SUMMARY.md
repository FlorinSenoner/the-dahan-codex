---
phase: 04-pwa-offline
plan: 04
subsystem: pwa
tags: [pwa, service-worker, workbox-window, offline, bottom-nav]

# Dependency graph
requires:
  - phase: 04-01
    provides: useServiceWorker hook with workbox-window
  - phase: 04-02
    provides: PWA UI components (OfflineIndicator, UpdateBanner, InstallPrompt)
  - phase: 04-03
    provides: Settings page at /settings route
provides:
  - PWA components integrated into root layout
  - Settings tab enabled in bottom navigation
  - SW registration via useServiceWorker hook (not deprecated registerSW)
affects: [04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PWA components at app root level for global visibility"
    - "useServiceWorker hook manages SW lifecycle in root component"

key-files:
  created: []
  modified:
    - app/routes/__root.tsx
    - app/components/layout/bottom-nav.tsx
    - app/lib/sw-register.ts

key-decisions:
  - "PWA components placed before Outlet for consistent top/bottom positioning"
  - "sw-register.ts marked deprecated but kept for potential fallback"

patterns-established:
  - "Root layout owns PWA component rendering"
  - "Bottom nav link types explicitly list enabled routes"

# Metrics
duration: 4min
completed: 2026-01-28
---

# Phase 4 Plan 4: PWA Integration Summary

**PWA components integrated into root layout with offline indicator, update banner, and install prompt; Settings tab enabled in navigation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-28T18:00:00Z
- **Completed:** 2026-01-28T18:04:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- OfflineIndicator, UpdateBanner, InstallPrompt integrated into root layout
- SW registration moved from registerSW useEffect to useServiceWorker hook
- Settings tab enabled and navigable in bottom navigation
- sw-register.ts marked as deprecated

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate PWA components into root layout** - `b7eefb3` (feat)
2. **Task 2: Enable Settings tab in bottom navigation** - `cf7c3b8` (feat)

## Files Created/Modified
- `app/routes/__root.tsx` - Added PWA component imports and rendering, replaced registerSW with useServiceWorker
- `app/components/layout/bottom-nav.tsx` - Enabled Settings tab (disabled: false), updated Link to type
- `app/lib/sw-register.ts` - Added deprecation comment

## Decisions Made
- PWA components placed before Outlet to ensure they render at top of viewport
- UpdateBanner conditionally rendered based on isUpdateAvailable state
- sw-register.ts kept but marked deprecated (may be useful for debugging or fallback)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all changes applied cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- PWA integration complete, ready for E2E testing in 04-05
- OfflineIndicator visible when browser goes offline
- UpdateBanner triggers when new SW is waiting
- InstallPrompt shows after 2-second delay (respects 7-day dismissal)
- Settings tab navigates to cache management page

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
