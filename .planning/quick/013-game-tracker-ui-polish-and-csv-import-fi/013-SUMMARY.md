---
quick: 013
completed: 2026-02-01
duration: 8 min
commits:
  - 8f970db
  - 0d14270
  - fd51b7b
files-modified:
  - app/lib/game-data.ts
  - app/components/games/game-form.tsx
  - app/routes/_authenticated/games/$id.tsx
  - app/lib/csv-import.ts
  - app/components/games/csv-preview.tsx
  - app/routes/_authenticated/games/import.tsx
---

# Quick Task 013: Game Tracker UI Polish and CSV Import Fix

**One-liner:** Fixed win/loss types to Spirit Island terminology, reorganized game detail layout, simplified delete, and added unchanged game detection in CSV import.

## Changes Made

### Task 1: Fix Win/Loss Types
- Updated `WIN_TYPES` in game-data.ts to correct Spirit Island victory types:
  - Fear Victory (emptying Fear Deck)
  - Terror Level 1 Victory (clearing ALL Invaders - rare)
  - Terror Level 2 Victory (clearing Towns/Cities at TL2)
  - Terror Level 3 Victory (clearing Cities at TL3)
- Removed incorrect "Blighted Island Victory" and "Complete Victory"
- Added `LOSS_TYPES` constant with official loss conditions:
  - Blighted Island (blight pool empty)
  - Spirit Destroyed (lost all presence)
  - Time Ran Out (invader deck empty)
  - Scenario/Adversary (specific condition)
- Added Loss Type dropdown in game form when result is "loss"
- Both win and loss types use the same `winType` field in schema

### Task 2: Game Detail Page Layout
- Removed Edit button from PageHeader
- Moved Result badge to top-left with win/loss type inline (e.g., "Victory - Fear Victory")
- Moved Invader Stage into Game Stats grid with Roman numerals (I, II, III)
- Removed separate Outcome section (consolidated into badge + stats)
- Changed stats grid from 3 to 4 columns to accommodate Stage
- Added Edit and Delete buttons side-by-side at bottom (flex-1 each)

### Task 3: Remove Undo Toast and Fix CSV Import
- Simplified delete: `toast.success("Game deleted")` instead of undo action
- Removed `restoreGameMutation` (no longer used)
- Updated AlertDialog description to "cannot be undone"
- Added `ExistingGame` interface for type-safe comparison
- Added `areGamesEqual()` helper comparing all fields:
  - Required: date, result
  - Spirits: name, variant, player for all 6 slots
  - Adversary/Secondary: name, level
  - Scenario: name, difficulty
  - Outcome: win_type, invader_stage
  - Stats: blight_count, dahan_count, cards_remaining, score
  - Notes
- Added `isUnchanged` field to `ValidatedGame` interface
- Updated csv-preview to show unchanged count with Check icon
- Individual rows show "Unchanged" badge (muted) instead of "Update"
- Import page passes full `existingGames` array instead of just IDs

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Store loss type in winType field | Schema already has optional winType string field; avoids schema migration |
| Roman numerals for Invader Stage | Matches Spirit Island board aesthetic (I, II, III stages) |
| Remove undo toast | Simpler UX; soft-delete still exists in DB but no undo button exposed |
| Compare all fields for unchanged detection | Ensures re-importing same CSV shows 0 updates, not N updates |

## Verification

- [x] `pnpm typecheck` passes
- [x] `pnpm lint:fix` passes
- [x] WIN_TYPES contains 4 correct victory types
- [x] LOSS_TYPES contains 4 loss conditions
- [x] Game form shows Loss Type dropdown when result="loss"
- [x] Game detail shows Invader Stage in stats with Roman numerals
- [x] Edit and Delete buttons side-by-side at bottom
- [x] Delete shows simple toast without undo
