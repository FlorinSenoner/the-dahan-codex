---
status: diagnosed
trigger: "Element/Energy Icon Rendering in Presence Slots"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:00:15Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED - Schema and rendering logic missing support for energy icons, "Any" element, and "Star" element (with permanent marker) types
test: Examined schema, rendering components, and Spirit Island game rules
expecting: Complete understanding of missing features
next_action: Documented root cause and recommendations

## Symptoms

expected:
- Energy slots should render energy icon (not just number)
- Multiple elements per slot should display clearly (e.g., "Moon, Earth")
- "Any" element should have special indicator + tooltip explaining user picks any element each turn
- "Star" element should have special indicator + tooltip explaining user picks once at game start

actual:
- Current rendering unclear for these cases
- No visual distinction between Any/Star/regular elements
- Energy likely renders as number instead of icon

errors: None reported

reproduction:
- View Serpent spirit (has "Any" element slots and multi-element slots)
- View Starlight spirit (has "Star" element)
- View any spirit with energy slots

started: Current implementation doesn't handle these cases

## Eliminated

## Evidence

- timestamp: 2026-01-27T00:00:01Z
  checked: convex/schema.ts lines 131-164
  found: presenceTracks.nodes.elements is defined as `v.optional(v.array(v.string()))`
  implication: Schema supports multiple elements per slot (e.g., ["Moon", "Earth"]) but no way to distinguish "Any" or "Star" types

- timestamp: 2026-01-27T00:00:02Z
  checked: app/components/spirits/presence-node.tsx lines 79-149
  found: Energy slots render value directly (line 148), no icon rendering logic exists
  implication: Energy displayed as number like "3" instead of energy icon

- timestamp: 2026-01-27T00:00:03Z
  checked: app/components/spirits/presence-node.tsx lines 124-127
  found: Multiple elements joined as text: `+${elements.join(", ")}`
  implication: Multiple elements work but render as plain text, no special handling for Any/Star

- timestamp: 2026-01-27T00:00:04Z
  checked: Spirit Island FAQ - Serpent presence track rules
  found: "Any" element = user chooses which element at threshold resolution time (flexible, changes per turn)
  implication: "Any" needs dynamic indicator showing it's user-selected each turn

- timestamp: 2026-01-27T00:00:05Z
  checked: Spirit Island FAQ - Starlight "Slowly Coalescing Nature" special rule
  found: Star symbol = user places permanent element marker once (fixed after chosen)
  implication: "Star" needs different indicator - shows it's a one-time choice that persists

- timestamp: 2026-01-27T00:00:06Z
  checked: convex/seed.ts - Serpent presence tracks (lines 1243-1387)
  found: Current seed data has regular elements like `elements: ["Fire"]`, no "Any" slots seeded
  implication: Seed data doesn't include "Any" element slots yet (needs data migration)

- timestamp: 2026-01-27T00:00:07Z
  checked: convex/seed.ts - Starlight presence tracks (lines 713-897)
  found: Starlight has elements like `elements: ["Fire"]`, `elements: ["Air"]` etc., no "Star" marker
  implication: Starlight seed data missing "Star" symbol slots (needs data migration)

## Resolution

root_cause:
**THREE MISSING FEATURES for proper element/energy rendering:**

1. **Energy Icon Rendering**: Energy slots (trackType: "energy") render numeric value directly instead of energy icon. Users expect to see an energy symbol, not just "3".

2. **"Any" Element Type**: Serpent has "Any" element slots where user picks any element each turn during threshold resolution (per Spirit Island rules). Schema has no way to represent this - currently limited to array of specific element names. Needs:
   - Schema: New way to mark element as "Any" type
   - UI: Special indicator (e.g., "?" icon or "Any" badge)
   - Tooltip: Explain "Choose any element when checking thresholds"

3. **"Star" Element Type**: Starlight has "Star" symbol slots (Slowly Coalescing Nature rule) where user permanently places one element marker at game start, then keeps that element for the entire game. Schema has no way to represent this. Needs:
   - Schema: New way to mark element slot as "Star" type (permanent marker)
   - UI: Special indicator (e.g., "★" icon with empty state)
   - Tooltip: Explain "Place one element marker here at game start (permanent)"

**Current State**:
- Schema: `elements: v.optional(v.array(v.string()))` only supports specific element names
- Rendering: Text-only display, no icons, no special types
- Seed Data: Missing "Any" and "Star" slots (not seeded yet)

fix: N/A (diagnosis only mode)

verification: N/A (diagnosis only mode)

files_changed: []
