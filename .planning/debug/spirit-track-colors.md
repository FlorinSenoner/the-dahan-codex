---
status: diagnosed
trigger: "UAT Test 10: Spirit-Specific Presence Track Colors - nope. you might want to check the data in convex and verify it has the correct values"
created: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: Spirit slugs in Convex data don't match the keys used in spirit-colors.ts mapping
test: Compare spirit slugs from Convex schema/data against getSpiritTrackColors() keys
expecting: Mismatch between slug formats (e.g., hyphens vs underscores, different naming)
next_action: Read spirit-colors.ts and presence-track.tsx to understand color mapping

## Symptoms

expected: Presence tracks should show spirit-specific colors (unique per spirit)
actual: Colors not showing correctly (user says "nope")
errors: None reported
reproduction: View presence track for any spirit
started: Unknown

## Eliminated

## Evidence

- timestamp: 2026-01-27T12:05:00Z
  checked: spirit-colors.ts spiritTrackColors mapping
  found: |
    spiritTrackColors has 6 entries:
    - "river-surges-in-sunlight": { energy: "cyan", cardPlays: "amber" }
    - "lightnings-swift-strike": { energy: "orange", cardPlays: "violet" }
    - "fractured-days-split-the-sky": { energy: "indigo", cardPlays: "violet" }
    - "starlight-seeks-its-form": { energy: "indigo", cardPlays: "amber" }
    - "finder-of-paths-unseen": { energy: "violet", cardPlays: "emerald" }
    - "serpent-slumbering-beneath-the-island": { energy: "orange", cardPlays: "stone" }
  implication: Color mapping exists for the correct spirit slugs

- timestamp: 2026-01-27T12:06:00Z
  checked: convex/seed.ts presenceTracks data for each spirit
  found: |
    MISMATCH! Seed data has HARDCODED colors in presenceTracks that OVERRIDE the spirit-colors.ts mapping:

    River (seed): energy: "amber", cardPlays: "blue"
    River (spirit-colors): energy: "cyan", cardPlays: "amber"

    Lightning (seed): energy: "amber", cardPlays: "blue"
    Lightning (spirit-colors): energy: "orange", cardPlays: "violet"

    Fractured Days (seed): energy: "indigo", cardPlays: "violet" -- MATCHES!

    Starlight (seed): energy: "indigo", cardPlays: "amber" -- MATCHES!

    Finder (seed): energy: "violet", cardPlays: "emerald" -- MATCHES!

    Serpent (seed): energy: "orange", cardPlays: "stone" -- PARTIAL (absorbed/presenceLimit different)
  implication: The seed data has explicit `color` values that take precedence over getSpiritTrackColors()

- timestamp: 2026-01-27T12:07:00Z
  checked: presence-track.tsx getTrackColor logic (lines 58-71)
  found: |
    getTrackColor() priority order:
    1. track.color (explicit color in data) - TAKES PRECEDENCE
    2. spiritColors[track.type] (from getSpiritTrackColors)
    3. fallback by index

    The logic is correct, but the SEED DATA overrides it by providing explicit colors.
  implication: Fix must update seed data to remove hardcoded colors, not the component logic

## Resolution

root_cause: Seed data in convex/seed.ts has hardcoded `color` values in presenceTracks that override the spirit-specific colors from spirit-colors.ts. The base spirits (River, Lightning) have incorrect colors (amber/blue) instead of their spirit-specific colors. The presence-track.tsx component correctly gives precedence to track.color when present, but the seed data shouldn't specify colors for spirits that have mappings in spiritTrackColors.
fix: Remove the hardcoded `color` fields from presenceTracks in seed.ts for spirits that have entries in spiritTrackColors (River, Lightning, Fractured Days, Starlight, Finder, Serpent base tracks). Keep colors only for custom/special tracks that don't map to standard energy/cardPlays.
verification:
files_changed: []
