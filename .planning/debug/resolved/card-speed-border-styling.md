---
status: diagnosed
trigger: "Card Speed Border-Only Indicator / Innate Powers Border-Only Speed - needs re-work for consistent styling"
created: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:00:00Z
---

## Current Focus

hypothesis: Both card-hand.tsx and innate-powers.tsx use left-border-only speed indicators that are inconsistent and need unified styling with full border, hover effects, and collapsibility for innate powers
test: Visual inspection of current implementation
expecting: Confirm styling differences and missing features
next_action: Return diagnosis

## Symptoms

expected: Cards and Innate Powers should have consistent styling with thin modern border all around, hover effects that enhance border color and add slight blue/red background based on speed, and innate powers should be collapsible (collapsed by default)
actual: Both components use left-border-only (border-l-4) with different implementations. No hover effects. Innate powers are not collapsible.
errors: N/A (UX/styling issue)
reproduction: View any spirit detail page
started: Current implementation

## Evidence

- timestamp: 2026-01-27T12:00:00Z
  checked: card-hand.tsx PowerCard component (lines 19-63)
  found: Uses border-l-4 with amber-500 (Fast) or blue-500 (Slow), bg-muted/30, rounded-lg, p-3
  implication: Left-border-only design, no hover effects

- timestamp: 2026-01-27T12:00:00Z
  checked: innate-powers.tsx innate card (lines 111-144)
  found: Uses border-l-4, pl-3 py-2, rounded-r-lg (not full rounded), bg-muted/20
  implication: Similar left-border-only but slightly different styling (different padding, different border-radius, different bg opacity)

- timestamp: 2026-01-27T12:00:00Z
  checked: innate-powers.tsx structure
  found: No Collapsible component imported or used. Cards are always expanded.
  implication: Missing collapsible functionality entirely

- timestamp: 2026-01-27T12:00:00Z
  checked: Styling differences between components
  found: |
    PowerCard: p-3, rounded-lg, bg-muted/30
    Innate: pl-3 py-2, rounded-r-lg, bg-muted/20
  implication: Inconsistent styling that should be unified

## Resolution

root_cause: Both components use inconsistent left-border-only speed indicators instead of a unified thin border all around with hover effects. Innate powers lack collapsibility.
fix: Not applied (diagnosis only)
verification: N/A
files_changed: []
