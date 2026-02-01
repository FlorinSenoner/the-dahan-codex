---
status: complete
phase: 06-user-data
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md, 06-04-SUMMARY.md, 06-05-SUMMARY.md, 06-06-SUMMARY.md, 06-07-SUMMARY.md, 06-08-SUMMARY.md, 06-09-SUMMARY.md, 06-10-SUMMARY.md
started: 2026-02-01T16:00:00Z
updated: 2026-02-01T16:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Games Tab Navigation
expected: Tapping the Games tab in bottom navigation takes you to /games. The tab shows as active (highlighted).
result: pass

### 2. Empty State Display
expected: When no games exist, the games list shows an empty state with icon, heading "No games yet", and a "Log Your First Game" button.
result: pass

### 3. Create Game - Basic Fields
expected: Clicking "Log Your First Game" or "New Game" navigates to /games/new. Form shows date picker, result toggle (Win/Loss), and spirit slots.
result: pass

### 4. Spirit Picker Search
expected: Clicking a spirit slot opens a searchable dropdown. Typing filters spirits by name. Selecting a spirit fills the slot and shows the spirit name.
result: pass

### 5. Add/Remove Spirits
expected: Can add up to 6 spirits using "Add Spirit" button. Can remove spirits using the X button on each spirit slot. Minimum 1 spirit required.
result: pass

### 6. Adversary Selection
expected: Can select an adversary (e.g., Brandenburg-Prussia, England) and set level 0-6. Selected adversary shows name and level in the form.
result: pass

### 7. Save New Game
expected: Clicking "Save Game" with valid data creates the game, shows success toast, and navigates back to games list. New game appears in list.
result: pass

### 8. Game List Display
expected: Games list shows each game as a row with date, spirits (comma-separated), adversary name/level, and Win/Loss badge.
result: pass

### 9. Game Detail View
expected: Clicking a game row navigates to /games/:id showing full game details: date, result, all spirits, adversary, score, and notes.
result: pass

### 10. Edit Game
expected: Clicking Edit on game detail page shows the GameForm pre-filled with current values. Changing values and saving updates the game.
result: pass

### 11. Delete Game
expected: Clicking Delete shows confirmation dialog. Confirming deletes the game (soft delete) and navigates to list. Game no longer appears in list.
result: pass

### 12. CSV Export
expected: Clicking "Export CSV" on games list downloads a file named spirit-island-games-YYYY-MM-DD.csv. File contains all games with proper columns.
result: pass

### 13. CSV Import Preview
expected: Clicking "Import CSV" navigates to import page. Selecting a CSV file shows preview table with status badges (New/Update) for each row.
result: pass

### 14. CSV Import Execution
expected: Clicking "Import" after preview imports all valid games. Toast shows success count. Games appear in list.
result: pass

### 15. Score Calculation
expected: After saving a game with win/loss and outcome details, the score field is automatically calculated using Spirit Island scoring formula.
result: pass

## Summary

total: 15
passed: 15
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
