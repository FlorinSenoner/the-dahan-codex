---
status: diagnosed
trigger: "Serpent Slumbering Beneath the Island has a Deep Slumber mechanic that was incorrectly modeled as a 3rd presence track row"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:18:00Z
---

## Current Focus

hypothesis: ROOT CAUSE IDENTIFIED - Serpent incorrectly models "Absorbed Essence" as presence track row 1 when it should be "Card Plays", and Deep Slumber should be a separate top-level field (not row 2)
test: Verify against issue description for exact values and layout
expecting: Issue description matches - Energy row (8 slots), Card Plays row (7 slots), Deep Slumber separate (7 values: 5,7,8,10,11,12,13)
next_action: Confirm root cause and design schema change

## Symptoms

expected: Serpent has 2 presence tracks (Energy/Card Plays) plus separate Deep Slumber circular track
actual: Deep Slumber likely modeled as 3rd presence track row
errors: None yet
reproduction: Check Serpent's data structure
started: Initial implementation - architectural issue

## Eliminated

## Evidence

- timestamp: 2026-01-27T00:05:00Z
  checked: convex/schema.ts and convex/seed.ts
  found: Deep Slumber is modeled as row 2 in a 3-row presenceTracks grid (rows: 3, cols: 9). It has values 5,6,7,8,9,10,11,12,13 in trackType "special" with presenceCap field.
  implication: Confirms hypothesis - Deep Slumber is being rendered as a 3rd presence track row when it should be separate

- timestamp: 2026-01-27T00:06:00Z
  checked: Issue description - actual spirit panel layout
  found: Energy row has 8 slots (1, Fire, Any, Reclaim One, covered, 6, Any, 12). Card Plays row has 7 slots (1, Moon, 2, Water, Earth w/ special condition, 4, 5+Reclaim). Deep Slumber is CIRCULAR AREA separate from tracks with 7 values (5,7,8,10,11,12,13 - NOT sequential)
  implication: Current seed data has wrong values (5-13 sequential) AND wrong structure (row 2 vs separate)

- timestamp: 2026-01-27T00:08:00Z
  checked: app/components/spirits/graph-presence-track.tsx renderer
  found: Renderer groups nodes by row, creates one gradient box per row with label based on trackType (energy="Energy/Turn", cardPlays="Card Plays", special="Special"). Row 2 with trackType "special" would render as "Special" track.
  implication: Deep Slumber will render as a 3rd horizontal track labeled "Special" - NOT as a separate circular area as it appears on the panel

- timestamp: 2026-01-27T00:10:00Z
  checked: Current seed data structure for Serpent
  found: Row 0 labeled "Energy track" (7 nodes, values 1-7), Row 1 labeled "Absorbed Essence track" (6 nodes with elements), Row 2 labeled "Deep Slumber track" (9 nodes, values 5-13 sequential)
  implication: MAJOR confusion - Row 1 is labeled "Absorbed Essence" but actual panel has "Card Plays" row. Current data has 3 custom tracks, none matching standard spirit layout

- timestamp: 2026-01-27T00:12:00Z
  checked: Spirit Island Wiki and forum sources
  found: Serpent has standard presence tracks (Energy/Card Plays) plus separate Deep Slumber mechanic. Deep Slumber is a circular track for presence limit, not part of presence tracks. Wiki confirms: "Presence on its Deep Slumber track is not 'on the Island' and does not count against the limit."
  implication: Confirms Deep Slumber should be completely separate from presenceTracks - it's a different mechanism entirely

- timestamp: 2026-01-27T00:14:00Z
  checked: Issue description against current data
  found: Issue says Energy row should be "1, Fire, Any, Reclaim One, (covered), 6, Any, 12" (8 slots). Current data has "1,2,3,4(Fire),5,6(Fire),7" (7 slots, wrong values). Issue says Card Plays "1, Moon, 2, Water, Earth (special), 4, 5+Reclaim". Current data has "Absorbed Essence" row with just elements. Issue says Deep Slumber is "5,7,8,10,11,12,13" (7 values, NOT sequential). Current data has "5,6,7,8,9,10,11,12,13" (9 values, sequential).
  implication: Every track is wrong. This is a complete data error, not just structural.

- timestamp: 2026-01-27T00:16:00Z
  checked: Special rules and power descriptions in seed
  found: Special rule says "Absorb Essence" is a power card that advances the "Absorbed Essence track" which "increases your presence limit". Power card says "Push your Absorbed Essence track 1 step." Wiki says "Each use covers the lowest revealed number; your limit is the lowest uncovered number."
  implication: "Absorbed Essence track" and "Deep Slumber track" might be THE SAME THING - you cover numbers on Deep Slumber by advancing Absorbed Essence. The current row 1 "Absorbed Essence" is incorrectly modeled - it should be the Card Plays track.

## Resolution

root_cause: Serpent's presence tracks are fundamentally wrong due to confusion between presence tracks and the Deep Slumber mechanic:

**Current (WRONG):**
- Row 0: Energy track (7 nodes, values 1-7)
- Row 1: "Absorbed Essence track" (elements only, no card plays)
- Row 2: "Deep Slumber track" (9 nodes, values 5-13 sequential)

**Actual panel layout:**
- Row 0: Energy/Turn track (8 nodes: 1, Fire, Any, Reclaim One, (covered), 6, Any, 12)
- Row 1: Card Plays track (7 nodes: 1, Moon, 2, Water, Earth[special], 4, 5+Reclaim)
- Separate circular area: Deep Slumber (7 values: 5, 7, 8, 10, 11, 12, 13)

**Key insight:** "Absorbed Essence" is a POWER CARD that covers numbers on the Deep Slumber circular track to raise the limit. There is NO "Absorbed Essence presence track" - that's a misunderstanding. Row 1 should be standard Card Plays.

SCHEMA DESIGN NEEDED:
1. Deep Slumber should be a separate top-level field (NOT part of presenceTracks grid)
2. It's a circular/covering mechanic, different from linear presence tracks
3. Suggested schema: `deepSlumber: v.optional(v.array(v.number()))` for Serpent only
4. Renderer needs new component to display circular track separately

fix:
verification:
files_changed: []
