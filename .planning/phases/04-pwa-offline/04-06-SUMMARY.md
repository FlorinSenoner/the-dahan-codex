---
phase: 04-pwa-offline
plan: 06
subsystem: ui
tags: [pwa, offline, accessibility, tailwind]

# Dependency graph
requires:
  - phase: 04-01
    provides: useOnlineStatus hook
  - phase: 04-02
    provides: OfflineIndicator component
provides:
  - Subtle bottom-right offline indicator pill
affects: [04-pwa-offline, future-ui-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bottom-right pill indicators for status (not top banners)"
    - "Muted zinc styling for non-critical status indicators"

key-files:
  created: []
  modified:
    - app/components/pwa/offline-indicator.tsx

key-decisions:
  - "bottom-20 right-4 positioning to clear BottomNav"
  - "z-40 (below modals, above content)"
  - "Muted bg-zinc-800/90 instead of prominent amber"
  - "Simplified text 'Offline' instead of 'You're offline'"

patterns-established:
  - "Status indicator pill pattern: rounded-full, inline-flex, gap-1.5, px-3 py-1.5"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 04 Plan 06: Subtle Offline Indicator Summary

**Redesigned offline indicator from prominent top banner to subtle bottom-right pill with muted zinc styling**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T10:00:00Z
- **Completed:** 2026-01-28T10:02:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Changed positioning from full-width top banner to bottom-right pill
- Applied muted zinc-800/90 styling instead of prominent amber
- Reduced z-index from z-50 to z-40 for proper layering
- Simplified text content from "You're offline" to "Offline"

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign offline indicator to subtle bottom-right pill** - `db9d2ce` (fix)

## Files Created/Modified

- `app/components/pwa/offline-indicator.tsx` - Redesigned to bottom-right pill with muted styling

## Decisions Made

- **Position bottom-20:** Ensures indicator clears the BottomNav component at bottom-0
- **z-index 40:** Below modals (z-50) but above regular content
- **Muted zinc styling:** Matches dark app aesthetic without visual disruption
- **Concise "Offline" text:** More appropriate for compact pill shape

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Offline indicator now provides subtle, non-intrusive status feedback
- Visual consistency maintained with app aesthetic
- Ready for remaining gap closure plans (04-07 through 04-09)

---
*Phase: 04-pwa-offline*
*Completed: 2026-01-28*
