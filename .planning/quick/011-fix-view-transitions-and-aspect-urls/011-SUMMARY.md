---
phase: quick
plan: 011
subsystem: routing
tags: [view-transitions, routing, tanstack-router, url-structure]
depends_on: []
provides: [path-based-aspect-urls, view-transition-fixes]
affects: [03]
tech-stack:
  added: []
  patterns: [nested-route-layout, view-transition-naming]
key-files:
  created:
    - app/routes/spirits.$slug.$aspect.tsx
  modified:
    - app/routes/spirits.$slug.tsx
    - app/routes/spirits.index.tsx
    - app/components/spirits/spirit-row.tsx
decisions:
  - "Aspect URLs use path format: /spirits/{base-slug}/{aspect-name}"
  - "View transition names: spirit-image-{slug}-{aspect} and spirit-name-{slug}-{aspect} for aspects"
  - "spirits.$slug.tsx converted to layout that renders Outlet for aspect child routes"
metrics:
  duration: 4 min
  completed: 2026-01-26
---

# Quick Task 011: Fix View Transitions and Aspect URLs Summary

**One-liner:** Path-based aspect URLs with working view transitions for titles

## What Was Built

1. **New aspect route** (`spirits.$slug.$aspect.tsx`):
   - Handles `/spirits/{slug}/{aspect}` URLs
   - Fetches spirit data with aspect parameter
   - View transition names match list page for smooth animations
   - Back button navigates to base spirit page

2. **Layout pattern for nested routes** (`spirits.$slug.tsx`):
   - Converted to layout component using `useMatches()` to detect child routes
   - Renders `<Outlet>` when aspect route is matched
   - Renders own content when displaying base spirit

3. **Updated spirit row links** (`spirit-row.tsx`):
   - Aspect URLs now use path format: `/spirits/lightnings-swift-strike/immense`
   - View transition names updated to match detail pages
   - Both image and title transitions now work for aspects

4. **Clean URLs** (`spirits.index.tsx`):
   - Removed `returning` and `returningAspect` search params from schema
   - Back navigation no longer adds unnecessary URL parameters

## Verification

- `pnpm typecheck` - passes
- `pnpm lint:fix` - no issues
- `pnpm build` - successful

## URL Structure

Before:
- Base spirit: `/spirits/lightnings-swift-strike`
- Aspect: `/spirits/lightnings-swift-strike?aspect=immense`
- Back nav: `/spirits?returning=lightnings-swift-strike&returningAspect=immense`

After:
- Base spirit: `/spirits/lightnings-swift-strike`
- Aspect: `/spirits/lightnings-swift-strike/immense`
- Back nav: `/spirits` (clean)

## View Transition Names

| Context | Image Transition | Title Transition |
|---------|------------------|------------------|
| Base spirit | `spirit-image-{slug}` | `spirit-name-{slug}` |
| Aspect | `spirit-image-{slug}-{aspect}` | `spirit-name-{slug}-{aspect}` |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 5332e21 | feat | Add path-based aspect URLs and fix view transitions |
| 5a25c3e | chore | Remove returning search params from spirit list |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Ready for Phase 3 (Spirit Detail & Board). The routing structure now supports:
- Clean aspect URLs that can be bookmarked/shared
- Smooth view transitions between list and detail
- Nested route pattern that can be extended for future sub-pages
