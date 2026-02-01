---
phase: 06-user-data
plan: 04
subsystem: ui
tags: [react, forms, shadcn-ui, radix, cmdk, game-tracking]

# Dependency graph
requires:
  - phase: 06-01
    provides: Games table schema
  - phase: 06-02
    provides: Game CRUD mutations
provides:
  - GameForm component for create/edit games
  - SpiritPicker with searchable dropdown
  - AdversaryPicker with level selection
  - Reference data constants (ADVERSARIES, SCENARIOS, WIN_TYPES)
affects: [06-05, game-history]

# Tech tracking
tech-stack:
  added:
    - "@radix-ui/react-popover"
    - "@radix-ui/react-select"
    - "@radix-ui/react-radio-group"
    - "@radix-ui/react-label"
  patterns:
    - Searchable dropdown via cmdk + Popover
    - Composite key pattern for dynamic list items

key-files:
  created:
    - app/components/games/game-form.tsx
    - app/components/games/spirit-picker.tsx
    - app/components/games/adversary-picker.tsx
    - app/lib/game-data.ts
    - app/components/ui/popover.tsx
    - app/components/ui/select.tsx
    - app/components/ui/radio-group.tsx
    - app/components/ui/input.tsx
    - app/components/ui/textarea.tsx
    - app/components/ui/label.tsx
  modified:
    - knip.json

key-decisions:
  - "Composite key pattern: Use spiritId when selected, otherwise slot-{index} for stable React keys"
  - "Reference data as constants: Hardcoded adversaries/scenarios for v1, can move to Convex later"

patterns-established:
  - "Searchable dropdown: Popover + Command pattern for spirit selection"
  - "Form validation: isValid useMemo for submit button state"

# Metrics
duration: 9min
completed: 2026-01-31
---

# Phase 6 Plan 4: Game Form UI Summary

**Reusable game form components with searchable spirit picker, adversary selector with levels 0-6, and reference data constants**

## Performance

- **Duration:** 9 min
- **Started:** 2026-01-31T18:49:21Z
- **Completed:** 2026-01-31T18:58:09Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- GameForm component supports 1-6 spirits with add/remove functionality
- SpiritPicker uses cmdk Command for searchable dropdown
- AdversaryPicker allows selecting adversary name and level 0-6
- Six new shadcn/ui components created (popover, select, radio-group, input, textarea, label)
- Reference data constants exported for adversaries, scenarios, and win types

## Task Commits

Each task was committed atomically:

1. **Task 1: Create reference data constants** - `e70e7fa` (feat)
2. **Task 2: Create UI components and SpiritPicker** - `92d829c` (feat)
3. **Task 3: Create AdversaryPicker and GameForm** - `14781ea` (feat)

## Files Created/Modified
- `app/lib/game-data.ts` - Adversary, scenario, and win type reference data
- `app/components/games/game-form.tsx` - Main form with all fields and validation
- `app/components/games/spirit-picker.tsx` - Searchable spirit dropdown via cmdk
- `app/components/games/adversary-picker.tsx` - Adversary select with level 0-6
- `app/components/ui/popover.tsx` - Radix popover wrapper
- `app/components/ui/select.tsx` - Radix select wrapper
- `app/components/ui/radio-group.tsx` - Radix radio group wrapper
- `app/components/ui/input.tsx` - Text input component
- `app/components/ui/textarea.tsx` - Textarea component
- `app/components/ui/label.tsx` - Radix label wrapper
- `knip.json` - Added games components as entry points

## Decisions Made
- Used composite key pattern (`spiritId ?? slot-{index}`) for stable React keys in spirit list
- Created reference data as hardcoded constants (ADVERSARIES, SCENARIOS) for v1 - can migrate to Convex later if needed
- Added games components directory to knip entry points to treat as library pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added games components to knip entry points**
- **Found during:** Task 2 (SpiritPicker creation)
- **Issue:** Knip flagged spirit-picker.tsx as unused since nothing imports it yet
- **Fix:** Added `app/components/games/*.tsx` to knip.json entry array
- **Files modified:** knip.json
- **Verification:** `pnpm knip` passes without issues
- **Committed in:** 92d829c (Task 2 commit)

**2. [Rule 1 - Bug] Fixed array index key lint error**
- **Found during:** Task 3 (GameForm creation)
- **Issue:** Biome flagged `key={index}` as problematic for dynamic lists
- **Fix:** Changed to composite key `key={spirit.spiritId ?? slot-${index}}`
- **Files modified:** app/components/games/game-form.tsx
- **Verification:** Biome lint passes
- **Committed in:** 14781ea (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for lint compliance. No scope creep.

## Issues Encountered
- Earlier commit 63d2d3b incorrectly included planning files from previous session - resolved by recommitting with correct files

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- GameForm ready for integration in create/edit game routes
- SpiritPicker requires Convex backend with spirits data
- All form components follow shadcn/ui patterns for consistency

---
*Phase: 06-user-data*
*Completed: 2026-01-31*
