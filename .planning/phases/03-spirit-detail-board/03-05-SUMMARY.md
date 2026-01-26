---
phase: 03-spirit-detail-board
plan: 05
subsystem: ui
tags: [react, accordion, collapsible, spirit-island, innate-powers, power-cards]

# Dependency graph
requires:
  - phase: 03-01
    provides: Schema with innates, specialRules, uniquePowers fields
  - phase: 03-02
    provides: Accordion and Collapsible shadcn/ui components
  - phase: 03-04
    provides: Spirit detail page structure with board sections
provides:
  - InnatePowers accordion component with element thresholds
  - SpecialRules collapsible component
  - CardHand horizontal scroll component for unique powers
  - Complete board visualization on spirit detail page
affects: [03-06, future-board-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Element threshold badges with ELEMENT_ORDER constant"
    - "Unique key generation from element counts"
    - "Collapsible sections with controlled state"
    - "Horizontal scroll container with negative margin trick"

key-files:
  created:
    - app/components/spirits/innate-powers.tsx
    - app/components/spirits/special-rules.tsx
    - app/components/spirits/card-hand.tsx
  modified:
    - app/routes/spirits.$slug.tsx

key-decisions:
  - "Fast/Slow badges use amber/blue colors matching innate powers and presence tracks"
  - "Element threshold key generated from element-count pairs to avoid array index keys"
  - "SpecialRules returns null if no rules (section hidden entirely)"
  - "CardHand uses negative margin (-mx-4 px-4) for edge-to-edge scroll on mobile"

patterns-established:
  - "ElementThreshold pattern: ELEMENT_ORDER constant for consistent element display"
  - "Unique key generation: getThresholdKey() for complex object arrays"
  - "Conditional section rendering: Return null for empty data instead of empty section"

# Metrics
duration: 5min
completed: 2026-01-26
---

# Phase 3 Plan 05: Innate and Power Components Summary

**Accordion innate powers with element thresholds, collapsible special rules, and horizontal scroll card hand for spirit board completion**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-26T00:00:00Z
- **Completed:** 2026-01-26T00:05:00Z
- **Tasks:** 3
- **Files created:** 3
- **Files modified:** 1

## Accomplishments

- InnatePowers component with accordion-based display of innate powers and element thresholds
- SpecialRules component with collapsible section (only shown if spirit has rules)
- CardHand component with horizontal scrolling row of unique power cards
- Complete board visualization: Overview > SpecialRules > Growth > Presence > Innates > Cards

## Task Commits

Each task was committed atomically:

1. **Task 1: Create InnatePowers component** - `7280df0` (feat)
2. **Task 2: Create SpecialRules and CardHand components** - `0cbf87c` (feat)
3. **Task 3: Integrate remaining sections into spirit detail** - `6de140f` (feat)

## Files Created/Modified

- `app/components/spirits/innate-powers.tsx` (139 lines) - Accordion of innate power thresholds with element badges
- `app/components/spirits/special-rules.tsx` (57 lines) - Collapsible special rules section
- `app/components/spirits/card-hand.tsx` (85 lines) - Row of unique power cards with horizontal scroll
- `app/routes/spirits.$slug.tsx` - Integrated all new board sections

## Decisions Made

- **Fast/Slow badge colors:** Consistent amber/blue scheme across all power displays (innates, cards)
- **Element threshold keys:** Created getThresholdKey() function to generate unique keys from element-count pairs, avoiding array index keys that Biome warns against
- **SpecialRules visibility:** Component returns null when no rules exist rather than showing empty section header
- **CardHand scroll:** Used -mx-4 px-4 trick to allow cards to scroll edge-to-edge while maintaining page padding

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Biome lint warning for using array index as key in threshold mapping - resolved by creating getThresholdKey() function that generates unique keys from element-count pairs

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Board visualization complete with all sections rendered
- Ready for E2E tests in 03-06
- River has empty specialRules array, so Special Rules section correctly hidden
- Lightning has single innate power, River has two - both display correctly

---
*Phase: 03-spirit-detail-board*
*Completed: 2026-01-26*
