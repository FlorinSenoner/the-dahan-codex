---
quick: 013
type: execute
autonomous: true
files_modified:
  - app/lib/game-data.ts
  - app/routes/_authenticated/games/$id.tsx
  - app/components/games/game-form.tsx
  - app/lib/csv-import.ts
  - app/components/games/csv-preview.tsx
---

<objective>
Polish the game tracker feature: Fix win/loss types to match official Spirit Island terminology, reorganize game detail page layout, remove undo toast on delete, and fix CSV import to detect unchanged games.

Purpose: Improve accuracy (correct win types), UX (cleaner layout), and data integrity (no spurious "updates" on re-import).
Output: Updated game-data.ts, game detail page, game form, and CSV import logic.
</objective>

<context>
@app/lib/game-data.ts
@app/routes/_authenticated/games/$id.tsx
@app/components/games/game-form.tsx
@app/lib/csv-import.ts
@app/components/games/csv-preview.tsx
@convex/schema.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Win/Loss Types</name>
  <files>app/lib/game-data.ts, app/components/games/game-form.tsx</files>
  <action>
Update WIN_TYPES in game-data.ts to the correct Spirit Island victory types:
- "Fear Victory" (emptying the Fear Deck)
- "Terror Level 1 Victory" (clearing ALL Invaders from island - rare/hard)
- "Terror Level 2 Victory" (clearing all Towns and Cities when at Terror Level 2)
- "Terror Level 3 Victory" (clearing all Cities when at Terror Level 3)

Remove the incorrect "Blighted Island Victory" and "Complete Victory" types.

Add LOSS_TYPES constant with official loss conditions:
- "Blighted Island" (blight pool ran out)
- "Spirit Destroyed" (a spirit lost all presence)
- "Time Ran Out" (invader deck empty)
- "Scenario/Adversary" (specific scenario/adversary loss condition)

Export LossType type alias.

Update game-form.tsx:
- Import LOSS_TYPES from game-data.ts
- Add Loss Type select dropdown (similar to Win Type) that shows when result is "loss"
- Update GameFormData interface to include lossType: string field
- Note: Schema already has optional winType string field. For now, store lossType in the same winType field since the backend schema allows any string. Later we can add a dedicated lossType field if needed.
  </action>
  <verify>
- `pnpm typecheck` passes
- WIN_TYPES contains the 4 correct victory types
- LOSS_TYPES contains the 4 loss types
- Game form shows Loss Type dropdown when result="loss"
  </verify>
  <done>
Win types match official Spirit Island terminology. Loss types can be recorded for defeats.
  </done>
</task>

<task type="auto">
  <name>Task 2: Game Detail Page Layout Changes</name>
  <files>app/routes/_authenticated/games/$id.tsx</files>
  <action>
1. Move "Invader stage" from Outcome section into Game Stats grid:
   - Add it as a fourth item in the stats grid (alongside Blight, Dahan, Cards Left)
   - Style like other stats: big number (text-2xl font-bold) with label below
   - Display as "I", "II", or "III" (Roman numerals) for the stage value

2. Remove the Edit button from PageHeader children.

3. Move Victory/Defeat badge from top-right corner into a more logical position:
   - Place it at the top, left-aligned, above the Spirits section
   - Keep the same Badge styling

4. Move the bottom fixed Delete button area to include both Edit and Delete:
   - Add Edit button next to Delete button
   - Edit button: outline variant, with Pencil icon
   - Both buttons on the same row, each taking half width (flex gap-2, each flex-1)
   - Edit button calls setIsEditing(true)

5. Remove the Outcome section entirely since:
   - invaderStage moved to Game Stats
   - winType can be displayed inline with the result badge (e.g., "Victory - Fear Victory" or just the badge if no winType)
  </action>
  <verify>
- `pnpm typecheck` passes
- Game detail page shows Invader Stage in Game Stats grid with Roman numeral format
- Edit and Delete buttons are side-by-side at the bottom
- No Edit icon in PageHeader
- Victory/Defeat badge at top with optional win type inline
  </verify>
  <done>
Game detail page has cleaner layout: stats consolidated, buttons grouped at bottom.
  </done>
</task>

<task type="auto">
  <name>Task 3: Remove Undo Toast and Fix CSV Import</name>
  <files>app/routes/_authenticated/games/$id.tsx, app/lib/csv-import.ts, app/components/games/csv-preview.tsx</files>
  <action>
**Remove undo toast** in games/$id.tsx:
- In handleDelete, replace the toast with undo action with simple: `toast.success("Game deleted");`
- Remove the restoreGameMutation since it's no longer used
- Update the AlertDialog description to remove the "undo" mention

**Fix CSV import to detect unchanged games:**

In csv-import.ts, update validateParsedGame to accept the full existing games array (not just IDs):
```typescript
export function validateParsedGame(
  row: ParsedGameRow,
  existingGames: Array<{ _id: string; date: string; result: string; spirits: Array<{ name: string; variant?: string; player?: string }>; adversary?: { name: string; level: number }; secondaryAdversary?: { name: string; level: number }; scenario?: { name: string; difficulty?: number }; winType?: string; invaderStage?: number; blightCount?: number; dahanCount?: number; cardsRemaining?: number; score?: number; notes?: string }>,
): ValidatedGame
```

Add logic to detect unchanged games:
1. If row.id exists, find matching game in existingGames
2. If found, compare all fields between row and existing game
3. If all fields match, mark as `isUnchanged: true` (new field on ValidatedGame)
4. isNew is still true if no matching ID found

Add helper function `areGamesEqual(row: ParsedGameRow, existing: ExistingGame): boolean` that compares:
- date, result (required)
- All spirit fields (spirit1-6, variants, players)
- adversary name/level, secondary_adversary name/level
- scenario name/difficulty
- win_type, invader_stage, blight_count, dahan_count, cards_remaining, score, notes

In csv-preview.tsx:
- Add `unchangedCount = games.filter(g => g.isValid && !g.isNew && g.isUnchanged).length`
- Update `updateCount` to exclude unchanged: `games.filter(g => g.isValid && !g.isNew && !g.isUnchanged).length`
- Add "unchanged" badge display in summary (similar to new/updates) with Check icon
- For individual rows, show "Unchanged" badge instead of "Update" when isUnchanged is true

Update import.tsx:
- Pass full existingGames array to validateParsedGame instead of just existingIds
  </action>
  <verify>
- `pnpm typecheck` passes
- Delete game shows simple "Game deleted" toast without undo option
- Exporting games then immediately re-importing same CSV shows all games as "Unchanged" (not "Update")
- Modified games in CSV correctly show as "Update"
- New games in CSV correctly show as "New"
  </verify>
  <done>
Delete is simpler (no undo). CSV import correctly distinguishes between unchanged games and actual updates.
  </done>
</task>

</tasks>

<verification>
- `pnpm typecheck` passes
- `pnpm lint:fix` passes
- Manual test: Create a new game with win, verify Terror Level victory types available
- Manual test: Create a new game with loss, verify loss types available
- Manual test: View game detail, verify Invader Stage in stats grid with Roman numerals
- Manual test: Edit and Delete buttons are side-by-side at bottom
- Manual test: Delete game shows simple toast without undo
- Manual test: Export games, re-import same CSV, verify "Unchanged" count matches total
</verification>

<success_criteria>
- Win types match official Spirit Island terminology (4 terror-based victories)
- Loss types can be selected for defeats (4 loss conditions)
- Game detail page has consolidated layout
- Delete toast is simple without undo
- CSV import correctly detects unchanged vs actual updates
</success_criteria>

<output>
After completion, create `.planning/quick/013-game-tracker-ui-polish-and-csv-import-fi/013-SUMMARY.md`
</output>
