---
phase: 08-spirit-aspect-data-scraping
plan: 04
subsystem: database-seeding
tags: [convex, seed-data, spirits, aspects, expansions]
depends_on:
  requires: [08-01, 08-02, 08-03]
  provides: [seed-data-module, spirit-ids-by-slug-map]
  affects: [08-05]
tech_stack:
  added: []
  patterns: [data-module-extraction, slug-based-id-mapping]
files:
  created:
    - convex/seedData/spirits.ts
  modified:
    - convex/seed.ts
decisions:
  - id: rename-seed-data-dir
    choice: "seedData (camelCase)"
    reason: "Convex module paths cannot contain hyphens"
metrics:
  duration: "10 min"
  completed: "2026-02-02"
---

# Phase 08 Plan 04: Update Seed Data Summary

Updated Convex seed data with all scraped spirit and aspect information from 08-01, 08-02, and 08-03.

## One-liner

Created seedData module with 7 expansions, 37 spirits, and 31 aspects; refactored seed.ts to use imported data and return spiritIdsBySlug map for opening preservation.

## What Was Built

### Task 1: Create seed-data module with spirit definitions
- Created `convex/seedData/spirits.ts` with complete spirit data
- Defined EXPANSIONS constant with all 7 game expansions:
  - Base Game (2017)
  - Branch & Claw (2017)
  - Jagged Earth (2020)
  - Promo Pack 2 (2021)
  - Feather and Flame (2022)
  - Horizons of Spirit Island (2022)
  - Nature Incarnate (2023)
- Defined SpiritData interface matching schema fields
- Exported SPIRITS array with all 37 base spirits including:
  - Complete metadata (name, slug, complexity, summary, description)
  - Elements arrays
  - Power ratings (offense, defense, control, fear, utility)
  - Image URLs pointing to .webp files
  - Wiki URLs

**Commit:** `6fa5896`

### Task 2: Add aspect definitions to seed-data
- Defined AspectData interface with baseSpiritSlug reference
- Exported ASPECTS array with all 31 aspects grouped by base spirit:
  - Lightning's Swift Strike: 4 aspects
  - River Surges in Sunlight: 3 aspects
  - Shadows Flicker Like Flame: 5 aspects
  - Vital Strength of the Earth: 3 aspects
  - A Spread of Rampant Green: 2 aspects
  - Bringer of Dreams and Nightmares: 2 aspects
  - Heart of the Wildfire: 1 aspect
  - Keeper of the Forbidden Wilds: 1 aspect
  - Lure of the Deep Wilderness: 1 aspect
  - Ocean's Hungry Grasp: 1 aspect
  - Serpent Slumbering: 1 aspect
  - Sharp Fangs: 2 aspects
  - Shifting Memory: 2 aspects
  - Shroud of Silent Mist: 1 aspect
  - Thunderspeaker: 2 aspects

**Commit:** `bbe4cdb`

### Task 3: Update seed.ts to use new seedData module
- Imported EXPANSIONS, SPIRITS, ASPECTS from `./seedData/spirits`
- Refactored seedExpansions to iterate over imported EXPANSIONS array
- Refactored seedSpiritsData to:
  - Create all 37 base spirits from SPIRITS array
  - Build spiritIdsBySlug Map as spirits are created
  - Create all 31 aspects from ASPECTS array
  - Look up base spirit IDs from map when creating aspects
- Updated seedOpenings to use spiritIdsBySlug map
- insertSeedData now returns spiritIdsBySlug map for opening preservation (Plan 08-05)
- Renamed `seed-data/` to `seedData/` for Convex path compatibility

**Commit:** `93386f9`

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Directory naming | `seedData` (camelCase) | Convex module paths cannot contain hyphens; `seed-data` caused deployment errors |
| Image format | `.webp` in imageUrl | Matches downloaded images from 08-03 |
| Aspect inheritance | Copy base spirit name, slug, complexity, elements | Aspects are the same spirit with modified rules, not separate entities |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Convex path validation**
- **Found during:** Task 3
- **Issue:** Convex rejected `seed-data` directory name (hyphens not allowed)
- **Fix:** Renamed to `seedData` (camelCase)
- **Files modified:** convex/seedData/spirits.ts, convex/seed.ts
- **Commit:** `93386f9`

## Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `convex/seedData/spirits.ts` | Created | Spirit and aspect data definitions |
| `convex/seed.ts` | Modified | Import from seedData module, return spiritIdsBySlug |

## Technical Notes

### Key Exports from seedData/spirits.ts

```typescript
export const EXPANSIONS = [/* 7 expansions */] as const;
export type ExpansionSlug = (typeof EXPANSIONS)[number]["slug"];
export interface SpiritData { /* ... */ }
export const SPIRITS: SpiritData[] = [/* 37 spirits */];
export interface AspectData { /* ... */ }
export const ASPECTS: AspectData[] = [/* 31 aspects */];
```

### spiritIdsBySlug Map Usage

The `insertSeedData` function now returns:
```typescript
interface InsertSeedResult {
  spiritIdsBySlug: Map<string, Id<"spirits">>;
  stats: { expansions: number; spirits: number; aspects: number };
}
```

This map is critical for Plan 08-05 (opening preservation) to restore openings after reseed by looking up new spirit IDs by slug.

## Next Phase Readiness

**Ready for Plan 08-05:**
- [ ] seedData module exports all spirit/aspect data
- [ ] insertSeedData returns spiritIdsBySlug map
- [ ] reseedSpirits mutation uses backup/restore pattern
- [ ] Can run `npx convex run seed:reseedSpirits` to populate database

**Blockers:** None

## Verification Results

| Check | Status |
|-------|--------|
| TypeScript compiles | PASS |
| Convex compiles | PASS |
| EXPANSIONS count (7) | PASS |
| SPIRITS count (37) | PASS |
| ASPECTS count (31) | PASS |
| spiritIdsBySlug returned | PASS |
