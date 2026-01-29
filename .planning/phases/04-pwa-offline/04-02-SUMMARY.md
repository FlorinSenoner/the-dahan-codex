---
phase: 04-pwa-offline
plan: 02
subsystem: ui
tags: [pwa, offline, react, tailwind, accessibility]

# Dependency graph
requires:
  - phase: 04-01
    provides: PWA hooks (useOnlineStatus, useServiceWorker, useInstallPrompt)
provides:
  - OfflineIndicator component (visible only when offline)
  - UpdateBanner component (non-dismissible with Reload button)
  - InstallPrompt component (Chromium + iOS support with 7-day dismissal)
affects: [04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Semantic HTML (<output> for status instead of div with role)
    - Platform detection (isInstallable for Chromium, isIOS for Safari)
    - localStorage persistence with expiry (7-day dismissal)

key-files:
  created:
    - app/components/pwa/offline-indicator.tsx
    - app/components/pwa/update-banner.tsx
    - app/components/pwa/install-prompt.tsx
  modified:
    - knip.json

key-decisions:
  - "Use <output> element with aria-live instead of div with role='status' (Biome lint rule)"
  - "z-50 for top banners (offline/update), z-40 for bottom install prompt"
  - "2-second delay before showing install prompt to avoid flash on load"
  - "7-day localStorage persistence for install prompt dismissal"

patterns-established:
  - "PWA components in app/components/pwa/ directory"
  - "Knip entry point for pwa components: app/components/pwa/*.tsx"

# Metrics
duration: 4min
completed: 2026-01-28
---

# Phase 04 Plan 02: PWA UI Components Summary

**Three PWA UI components consuming hooks from 04-01: offline indicator, update banner, and install prompt with platform-specific UI**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-28T16:34:00Z
- **Completed:** 2026-01-28T16:38:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- OfflineIndicator component shows amber banner with WifiOff icon when offline
- UpdateBanner component with non-dismissible design and Reload button
- InstallPrompt with Chromium native prompt and iOS manual instructions
- All components use proper z-index layering and accessibility attributes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create OfflineIndicator component** - `c067871` (feat)
2. **Task 2: Create UpdateBanner component** - `9102c04` (feat)
3. **Task 3: Create InstallPrompt component** - `5021252` (feat)

_Note: Task 1 was combined with a settings page commit in a prior session._

## Files Created/Modified

- `app/components/pwa/offline-indicator.tsx` - Offline status banner (z-50, amber-600, WifiOff icon)
- `app/components/pwa/update-banner.tsx` - Update available banner (z-50, primary bg, Reload button)
- `app/components/pwa/install-prompt.tsx` - Install prompt (z-40, bottom-20, platform-specific UI)
- `knip.json` - Added pwa components to entry points

## Decisions Made

1. **Semantic <output> element** - Biome lint prefers semantic HTML over div with role="status"
2. **7-day dismissal persistence** - Balanced between user convenience and re-engagement
3. **2-second delay** - Prevents jarring install prompt flash on page load
4. **z-index strategy** - z-50 for top banners (won't show simultaneously), z-40 for bottom prompt

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed import alias from ~/hooks to @/hooks**
- **Found during:** Task 1
- **Issue:** Project uses @/* alias, not ~/*
- **Fix:** Changed import path
- **Files modified:** app/components/pwa/offline-indicator.tsx
- **Committed in:** c067871

**2. [Rule 1 - Bug] Changed div with role="status" to semantic <output> element**
- **Found during:** Task 1
- **Issue:** Biome lint requires semantic HTML elements over ARIA roles
- **Fix:** Used <output> element which has implicit role="status"
- **Files modified:** app/components/pwa/offline-indicator.tsx
- **Committed in:** c067871

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Improved accessibility and fixed project conventions. No scope creep.

## Issues Encountered

None - all tasks completed as planned.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three PWA UI components ready for integration
- Components consume hooks from 04-01 (useOnlineStatus, useServiceWorker, useInstallPrompt)
- Ready for 04-03/04-04 integration into app layout

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
