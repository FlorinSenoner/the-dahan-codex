---
phase: 04-pwa-offline
plan: 01
subsystem: pwa
tags: [workbox, service-worker, pwa, offline, react-hooks]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Manual Workbox service worker generation via scripts/generate-sw.ts
provides:
  - workbox-window integration for service worker coordination
  - useOnlineStatus hook for online/offline detection
  - useServiceWorker hook for update detection and triggering
  - useInstallPrompt hook for PWA installation prompts
  - SPA navigateFallback for client-side routing support
affects: [04-02, 04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: [workbox-window]
  patterns: [useSyncExternalStore for external state, workbox-window for SW lifecycle]

key-files:
  created:
    - app/hooks/use-online-status.ts
    - app/hooks/use-service-worker.ts
    - app/hooks/use-install-prompt.ts
    - app/hooks/index.ts
  modified:
    - scripts/generate-sw.ts
    - package.json
    - knip.json

key-decisions:
  - "useSyncExternalStore for online status (concurrency-safe)"
  - "workbox-window Workbox class for SW lifecycle management"
  - "navigateFallbackDenylist excludes /api/ and file extensions"
  - "hooks directory as library entry point in knip.json"

patterns-established:
  - "PWA hooks exported via app/hooks/index.ts barrel"
  - "useSyncExternalStore pattern for browser API state"

# Metrics
duration: 8min
completed: 2026-01-28
---

# Phase 04 Plan 01: PWA Hooks & SW Configuration Summary

**workbox-window integration with three PWA hooks (online status, SW updates, install prompts) and SPA navigateFallback**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-28T12:00:00Z
- **Completed:** 2026-01-28T12:08:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Installed workbox-window for service worker coordination
- Added navigateFallback: "/index.html" for SPA client-side routing
- Created useOnlineStatus hook using useSyncExternalStore pattern
- Created useServiceWorker hook with workbox-window Workbox class
- Created useInstallPrompt hook with beforeinstallprompt and iOS detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Add workbox-window and enhance generate-sw.ts** - `a2d78a5` (feat)
2. **Task 2: Create PWA hooks** - `c97d32f` (feat)

## Files Created/Modified

- `app/hooks/use-online-status.ts` - Online/offline detection with useSyncExternalStore
- `app/hooks/use-service-worker.ts` - SW update detection and triggerUpdate function
- `app/hooks/use-install-prompt.ts` - PWA install prompt handling with iOS detection
- `app/hooks/index.ts` - Barrel export for all hooks
- `scripts/generate-sw.ts` - Added navigateFallback and denylist configuration
- `package.json` - Added workbox-window dependency
- `knip.json` - Added hooks entry point, removed stale ignoreDependencies

## Decisions Made

- Used useSyncExternalStore for useOnlineStatus (concurrency-safe, React 18+ best practice)
- workbox-window Workbox class for SW lifecycle instead of raw navigator.serviceWorker
- navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/] excludes API calls and static files
- Added app/hooks/*.ts to knip entry points for library pattern consistency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Task 1 commit initially failed knip check (workbox-window detected as unused)
- Resolution: Created hooks in Task 2 first, then both tasks committed successfully

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Three PWA hooks ready for consumption by UI components
- navigateFallback enables offline navigation to any SPA route
- Ready for 04-02: Offline Banner UI Component

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
