---
status: diagnosed
trigger: "tabs still scroll on top of the header with the spirit name. make it scroll behind. e.g. position: relative with z-index 0 would do the trick"
created: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:00:00Z
---

## Current Focus

hypothesis: Both header and tabs have z-index: 10, causing tabs to appear on same layer as header during scroll
test: Compare z-index values between header and tabs
expecting: Header needs higher z-index than tabs, or tabs need position:relative with z-index:0
next_action: Report diagnosis

## Symptoms

expected: When scrolling, the variant tabs should scroll BEHIND the sticky header
actual: Tabs scroll ON TOP of the header, overlapping it visually
errors: None (visual issue only)
reproduction: Scroll down on a spirit detail page with aspects (e.g., spirits with variant tabs)
started: Current implementation

## Eliminated

(none)

## Evidence

- timestamp: 2026-01-27T12:00:00Z
  checked: variant-tabs.tsx TabsList className
  found: `sticky top-[57px] z-10` - tabs have z-index: 10
  implication: Tabs are on same z-index layer as header

- timestamp: 2026-01-27T12:00:00Z
  checked: spirits.$slug.tsx header className
  found: `sticky top-0 z-10` - header also has z-index: 10
  implication: Same z-index means tabs appear on top when scrolling due to DOM order (tabs come after header)

## Resolution

root_cause: Both header (z-10) and tabs (z-10) have the same z-index. Since tabs appear after header in DOM, they stack on top during scroll overlap.
fix: Either increase header z-index to z-20, or decrease tabs z-index to z-0 with position: relative (user suggested the latter)
verification: (pending)
files_changed: []
