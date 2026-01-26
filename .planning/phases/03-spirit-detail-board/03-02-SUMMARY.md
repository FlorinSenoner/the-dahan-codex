---
phase: 03-spirit-detail-board
plan: 02
subsystem: ui
tags: [recharts, shadcn-ui, tabs, tanstack-router, view-transitions]

# Dependency graph
requires:
  - phase: 03-01
    provides: getSpiritWithAspects query for fetching base + aspects
provides:
  - Recharts library for radar charts (future use)
  - shadcn/ui Tabs, Accordion, Collapsible, Tooltip components
  - VariantTabs component for spirit aspect switching
  - Refactored spirit detail routes with shared layout
affects: [03-03, 03-04, 03-05, 03-06]

# Tech tracking
tech-stack:
  added: [recharts@3.7.0, @radix-ui/react-tabs, @radix-ui/react-accordion, @radix-ui/react-collapsible, @radix-ui/react-tooltip]
  patterns: [shared-layout-with-outlet, url-controlled-tabs]

key-files:
  created:
    - app/components/ui/tabs.tsx
    - app/components/ui/accordion.tsx
    - app/components/ui/collapsible.tsx
    - app/components/ui/tooltip.tsx
    - app/components/spirits/variant-tabs.tsx
  modified:
    - app/routes/spirits.$slug.tsx
    - app/routes/spirits.$slug.$aspect.tsx
    - package.json
    - knip.json

key-decisions:
  - "URL as single source of truth for variant selection (no local state)"
  - "Base spirit name in header (not aspect name) for consistent navigation context"
  - "VariantTabs only shown when spirit has aspects"
  - "Shared SpiritDetailContent component exported for reuse in aspect route"
  - "Parallel query preloading in loader (getSpiritBySlug + getSpiritWithAspects)"

patterns-established:
  - "Spirit component directory: app/components/spirits/ for spirit-specific components"
  - "URL-controlled tabs: use Tabs value + onValueChange with navigate()"

# Metrics
duration: 4min
completed: 2026-01-26
---

# Phase 03 Plan 02: Variant Tabs Component Summary

**URL-synced horizontal tabs for spirit variant switching with recharts and shadcn/ui components installed**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-26T13:28:25Z
- **Completed:** 2026-01-26T13:32:45Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- Installed recharts for future radar charts and 4 shadcn/ui components
- Built VariantTabs component with URL-based state management
- Refactored spirit detail routes to use shared layout with tabs

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies** - `e1c167b` (chore)
2. **Task 2: Create VariantTabs component** - `d09c5ad` (feat)
3. **Task 3: Refactor spirit detail routes** - `4fad04f` (feat)
4. **Fix: Remove unused variable** - `5a494ac` (fix)

## Files Created/Modified

- `app/components/ui/tabs.tsx` - shadcn/ui Tabs component (Radix-based)
- `app/components/ui/accordion.tsx` - shadcn/ui Accordion component
- `app/components/ui/collapsible.tsx` - shadcn/ui Collapsible component
- `app/components/ui/tooltip.tsx` - shadcn/ui Tooltip component
- `app/components/spirits/variant-tabs.tsx` - URL-synced variant selector (49 lines)
- `app/routes/spirits.$slug.tsx` - Layout with tabs and shared content component
- `app/routes/spirits.$slug.$aspect.tsx` - Simplified aspect route using shared content
- `package.json` - Added recharts dependency
- `knip.json` - Added recharts to ignored deps, spirits components to entry points

## Decisions Made

- **URL as single source of truth:** Tab selection derived from URL params, no local React state. Enables shareable links and browser history.
- **Base spirit name in header:** Always show base spirit name regardless of active aspect. Provides consistent navigation context.
- **Parallel query preloading:** Loader fetches both getSpiritBySlug and getSpiritWithAspects in parallel for optimal performance.
- **Shared content component:** SpiritDetailContent exported for reuse, reducing code duplication between base and aspect routes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added recharts to knip ignored dependencies**
- **Found during:** Task 1 (dependency installation)
- **Issue:** knip flagged recharts as unused since it's installed for future Phase 3 plans
- **Fix:** Added recharts to ignoreDependencies in knip.json
- **Files modified:** knip.json
- **Verification:** Pre-commit hooks pass
- **Committed in:** e1c167b (Task 1 commit)

**2. [Rule 3 - Blocking] Added spirits components directory to knip entry points**
- **Found during:** Task 2 (VariantTabs creation)
- **Issue:** knip flagged new component as unused file
- **Fix:** Added app/components/spirits/*.tsx to entry points
- **Files modified:** knip.json
- **Verification:** Pre-commit hooks pass
- **Committed in:** d09c5ad (Task 2 commit)

**3. [Rule 1 - Bug] Removed unused headerName variable**
- **Found during:** Task 3 commit (biome lint)
- **Issue:** headerName was computed but never used after refactoring
- **Fix:** Removed dead code
- **Files modified:** app/routes/spirits.$slug.tsx
- **Verification:** Pre-commit hooks pass
- **Committed in:** 5a494ac (separate fix commit)

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 bug)
**Impact on plan:** All fixes necessary for clean commits. No scope creep.

## Issues Encountered

None - all verification passed on first attempt after fixes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Variant tabs are functional and URL-synced
- Ready for Plan 03-03: Board Layout Components
- Accordion, Collapsible, and Tooltip components available for section UI
- Recharts ready for radar chart implementation

---
*Phase: 03-spirit-detail-board*
*Completed: 2026-01-26*
