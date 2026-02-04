---
phase: 08-spirit-aspect-data-scraping
plan: 05
type: summary
subsystem: seed-data
tags: [convex, mutations, data-preservation, reseed]

dependency-graph:
  requires:
    - "08-04 (partial - spiritIdsBySlug map requirement)"
  provides:
    - "Opening preservation during reseed"
    - "spiritIdsBySlug map from insertSeedData"
  affects:
    - "All future reseeds preserve user openings"

tech-stack:
  patterns:
    - "Backup by slug (stable) not ID (changes)"
    - "Idempotent restore via slug check"
    - "Graceful orphan handling with logging"

file-tracking:
  key-files:
    created: []
    modified:
      - "convex/seed.ts"

decisions:
  - id: "opening-backup-by-slug"
    choice: "Store spirit slug in backup instead of ID"
    reason: "Spirit IDs change during reseed (old deleted, new created)"

metrics:
  duration: "3 min"
  completed: "2026-02-02"
---

# Phase 8 Plan 5: Opening Preservation During Reseed Summary

**One-liner:** Backup/restore openings by spirit slug during reseed, with idempotency and orphan handling.

## What Was Built

1. **backupOpenings function** - Queries all openings before clear, maps each to spirit slug
2. **restoreOpenings function** - Re-inserts openings with new spirit IDs after seed
3. **Updated insertSeedData** - Returns spiritIdsBySlug map for restoration
4. **Updated reseedSpirits** - Full backup/clear/seed/restore flow with detailed stats

## Key Technical Decisions

### Why Slug Instead of ID?

Spirit IDs change during reseed because old records are deleted and new ones created with fresh IDs. Using the spirit's slug (a stable, human-readable identifier) allows us to:
- Backup openings before clearing data
- Look up the new spirit ID by slug after seeding
- Restore openings with correct references

### Idempotency via Slug Check

Before restoring an opening, we check if one with the same slug already exists. This prevents:
- Duplicate openings if reseed is run multiple times
- Conflicts between seed openings and restored openings

### Graceful Orphan Handling

If a spirit is removed from seed data, any openings that referenced it become "orphaned":
- Logged with a warning (`console.warn`)
- Skipped (not restored)
- Counted in return message

## Files Changed

| File | Changes |
|------|---------|
| convex/seed.ts | +218 lines - backup/restore functions, spiritIdsBySlug tracking |

## Verification

- [x] TypeScript compiles without errors (`npx convex dev --once`)
- [x] All type checks pass (`pnpm typecheck`)
- [x] Pre-commit hooks pass (Biome, jscpd, knip)
- [x] Logic review confirms correct backup/restore flow

## Return Message Format

After reseed, the mutation returns a detailed message:

```
Created 3 expansions, 6 base spirits, 7 aspects. Openings: 1 restored, 0 skipped (duplicates), 0 orphaned (missing spirit)
```

## Deviations from Plan

### Blocking Fix - Added spiritIdsBySlug to insertSeedData

**Found during:** Task 2
**Issue:** Plan 08-05 depends on 08-04 providing spiritIdsBySlug from insertSeedData, but 08-04 wasn't complete
**Fix:** Added spiritIdsBySlug tracking to seedSpiritsData and return from insertSeedData as part of this plan
**Files modified:** convex/seed.ts
**Commit:** 45487d4

This was a [Rule 3 - Blocking] deviation since the plan couldn't complete without this functionality. The change is compatible with 08-04's requirements.

## Next Phase Readiness

Ready for 08-04 to complete with full spirit/aspect data. The spiritIdsBySlug map infrastructure is now in place and will work with any number of spirits.
