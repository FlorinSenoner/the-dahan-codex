---
phase: 03-spirit-detail-board
plan: 01
subsystem: database
tags: [convex, schema, spirit-board, presence-tracks, innates]

# Dependency graph
requires:
  - phase: 02-spirit-library
    provides: Initial spirit schema with base fields
provides:
  - Extended spirit schema with board data fields
  - Complete seed data for River and Lightning spirits
  - New getSpiritWithAspects query for variant selector
affects: [03-02, 03-03, spirit-detail-page, variant-selector]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Presence track objects with value/elements/reclaim"
    - "Innate thresholds with element requirements"
    - "Power ratings 0-5 scale"

key-files:
  created: []
  modified:
    - convex/schema.ts
    - convex/seed.ts
    - convex/spirits.ts

key-decisions:
  - "Power ratings use 0-5 scale (0=None, 5=Extreme)"
  - "All board fields optional to preserve backward compatibility"
  - "Aspects do not include board data - inherit from base spirit"

patterns-established:
  - "Board data structure: strengths, weaknesses, powerRatings, growth, presenceTracks, innates, uniquePowers"
  - "Query pattern: getSpiritWithAspects returns base + sorted aspects in single call"

# Metrics
duration: 4min
completed: 2026-01-26
---

# Phase 03 Plan 01: Schema and Seed Data Summary

**Extended Convex spirit schema with board data fields (strengths, weaknesses, powerRatings, growth, presenceTracks, innates, uniquePowers) and complete seed data for River and Lightning**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-26T14:22:00Z
- **Completed:** 2026-01-26T14:26:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extended spirit schema with 9 new optional board data fields
- Added complete board data for River Surges in Sunlight (growth, presence tracks, 2 innates, 4 unique powers)
- Added complete board data for Lightning's Swift Strike (growth, presence tracks, 1 innate, 4 unique powers)
- New getSpiritWithAspects query for efficient variant selector data fetching

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend spirit schema with board data fields** - `968e642` (feat)
2. **Task 2: Add complete board data to seed file** - `b174593` (feat)
3. **Task 3: Add query for spirit with aspects** - `7a0eab6` (feat)

## Files Created/Modified

- `convex/schema.ts` - Extended spirits table with strengths, weaknesses, powerRatings, specialRules, growth, presenceTracks, innates, uniquePowers, wikiUrl
- `convex/seed.ts` - Updated seedSpirits and reseedSpirits with complete board data for River and Lightning
- `convex/spirits.ts` - Added getSpiritWithAspects query returning base spirit with all aspects

## Decisions Made

- Power ratings use 0-5 numeric scale (0=None, 1=Low, 2=Medium, 3=High, 4=Very High, 5=Extreme)
- All new board fields are optional (v.optional) to avoid breaking existing data
- Presence track values can be number or string (for special values like "Reclaim")
- Aspects inherit board data from base spirit - no duplication needed
- getSpiritWithAspects sorts aspects alphabetically by aspectName

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Schema foundation complete for spirit board UI components
- River and Lightning have complete data for all board sections
- Ready for Plan 02 (Variant Tabs component) and Plan 03 (Board layout components)

---
*Phase: 03-spirit-detail-board*
*Completed: 2026-01-26*
