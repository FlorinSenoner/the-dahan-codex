---
phase: 02-spirit-library
plan: 03
subsystem: ui
tags: [react, tanstack-router, convex, view-transitions, zod]

# Dependency graph
requires:
  - phase: 02-01
    provides: Tailwind v4 with shadcn/ui components (Badge)
  - phase: 02-02
    provides: Convex spirits schema and listSpirits query
provides:
  - /spirits route with browsable spirit list
  - SpiritList component with Convex query integration
  - SpiritRow component with view transition names
  - Filter URL param validation (prepared for Plan 04)
affects: [02-04-spirit-detail, 02-05-filter-search]

# Tech tracking
tech-stack:
  added: [zod]
  patterns:
    - Zod search param validation in TanStack Router
    - View transition names for spirit images and names
    - Animated loading placeholders (no spinners)

key-files:
  created:
    - app/routes/spirits.tsx
    - app/components/spirits/spirit-list.tsx
    - app/components/spirits/spirit-row.tsx
  modified:
    - package.json
    - app/routeTree.gen.ts

key-decisions:
  - "Use Zod for URL search param validation (prepared for filtering in Plan 04)"
  - "View transition names applied to spirit images and names for smooth navigation"
  - "Aspects share base spirit slug with ?aspect= query param"
  - "Loading state uses animated placeholders instead of spinners"

patterns-established:
  - "Spirit list route pattern: query + filter props passed to list component"
  - "View transition naming: spirit-image-{slug} and spirit-name-{slug}"
  - "Aspect URL pattern: /spirits/{base-slug}?aspect={aspect-name}"

# Metrics
duration: 2min
completed: 2026-01-25
---

# Phase 2 Plan 3: Spirit List UI Summary

**Spirit list page with browsable spirits and aspects, showing images, names, summaries, and complexity badges with view transitions for smooth detail navigation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-25T18:35:22Z
- **Completed:** 2026-01-25T18:36:56Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created /spirits route that displays all spirits from Convex
- Spirits show with image, name, summary, and color-coded complexity badge
- Aspects appear indented under their base spirit with smaller images and "A" indicator
- View transition names applied for smooth navigation animations

## Task Commits

Each task was committed atomically:

1. **Task 1: Create spirit list route with query integration** - `97fda87` (feat)
2. **Task 2: Create SpiritRow component with view transition names** - `9d09c72` (feat)

## Files Created/Modified

- `app/routes/spirits.tsx` - Spirit list route with Zod search param validation
- `app/components/spirits/spirit-list.tsx` - List container with Convex query and loading/empty states
- `app/components/spirits/spirit-row.tsx` - Individual spirit row with image, badges, and view transitions
- `package.json` - Added zod dependency
- `app/routeTree.gen.ts` - Auto-generated route tree update

## Decisions Made

- Used `font-headline` class (Fraunces font) for spirit names to match Spirit Island aesthetic
- Applied element colors for complexity badges (plant=Low, sun=Moderate, fire=High, destructive=Very High)
- Aspects use same slug as base spirit with `?aspect=` query param for URL navigation
- View transition names follow pattern `spirit-image-{slug}` and `spirit-name-{slug}`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Spirit list UI complete and ready for spirit detail page (Plan 04)
- Filter params validated but UI not yet built (Plan 05)
- View transition names in place, ready for detail page to animate images/names

---
*Phase: 02-spirit-library*
*Completed: 2026-01-25*
