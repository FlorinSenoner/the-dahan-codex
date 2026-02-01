---
phase: 06-user-data
plan: 02
subsystem: database
tags: [convex, mutations, queries, scoring, crud]

# Dependency graph
requires:
  - phase: 06-01
    provides: games table schema with indexes
provides:
  - Game CRUD mutations (createGame, updateGame, deleteGame, restoreGame)
  - Game queries (listGames, getGame)
  - Score calculation utility (calculateScore, calculateDifficulty)
affects: [06-03, 06-04, 06-05, 06-06, 06-07, 06-08]

# Tech tracking
tech-stack:
  added: []
  patterns: [user-scoped queries, soft-delete, ownership validation]

key-files:
  created:
    - convex/games.ts
    - convex/lib/scoring.ts
  modified:
    - convex/_generated/api.d.ts

key-decisions:
  - "Soft delete with deletedAt timestamp for undo capability"
  - "Spirit count validation (1-6) in mutations"
  - "Ownership check via identity.tokenIdentifier"

patterns-established:
  - "User scoping: filter by userId from requireAuth identity"
  - "Soft delete: set deletedAt timestamp, filter with eq(deletedAt, undefined)"
  - "Ownership check: throw Error if game.userId !== identity.tokenIdentifier"

# Metrics
duration: 3min
completed: 2026-01-31
---

# Phase 06 Plan 02: Game CRUD Summary

**Convex mutations and queries for game history with user scoping, soft delete, and Spirit Island score calculation**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-31T18:42:21Z
- **Completed:** 2026-01-31T18:45:42Z
- **Tasks:** 2
- **Files modified:** 2 (+ 1 generated)

## Accomplishments

- Score calculation utility with official Spirit Island formulas
- Full CRUD operations for games with user ownership validation
- Soft delete pattern with restore capability for undo

## Task Commits

Each task was committed atomically:

1. **Task 1: Create score calculation utility** - `0f1d9aa` (feat - committed as part of 06-01)
2. **Task 2: Create game CRUD mutations and queries** - `892cb55` (feat)

## Files Created/Modified

- `convex/lib/scoring.ts` - Score calculation with Victory/Defeat formulas
- `convex/games.ts` - Full CRUD with listGames, getGame, createGame, updateGame, deleteGame, restoreGame
- `convex/_generated/api.d.ts` - Auto-generated API types updated

## Decisions Made

- **Soft delete pattern**: Using `deletedAt` timestamp rather than hard delete enables undo functionality
- **Spirit validation**: Enforce 1-6 spirit count in both create and update mutations
- **Ownership via tokenIdentifier**: Using Clerk's tokenIdentifier as userId for secure user scoping

## Deviations from Plan

None - plan executed exactly as written.

Note: Task 1 (scoring.ts) was already committed in a prior 06-01 execution run that included UI components. The file existed with correct content, so Task 1 was verified complete.

## Issues Encountered

- Knip pre-commit hook was failing due to unused dependencies (cmdk, papaparse) pre-installed for later Phase 6 plans. These were already added to knip ignoreDependencies in the prior 06-01 commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Game CRUD backend complete, ready for UI components (06-03)
- Score calculation available for automatic score computation in form
- Queries ready for game list and detail views

---
*Phase: 06-user-data*
*Completed: 2026-01-31*
