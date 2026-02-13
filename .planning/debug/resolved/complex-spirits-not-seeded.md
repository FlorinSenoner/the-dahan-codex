---
status: diagnosed
trigger: "Test 15-18: Complex Spirits Data Not Seeded - can't be tested as there is no data"
created: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:10:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED - Complex spirits seed data exists in code but the idempotent seed was never re-run
test: Check database contents and seed.ts code
expecting: Database has only old spirits, seed.ts has all 6 spirits
next_action: Return diagnosis - reseedSpirits mutation needs to be executed

## Symptoms

expected: Complex spirits (Fractured Days, Starlight, Finder, Serpent) should have seed data available for UAT testing
actual: "can't be tested as there is no data"
errors: N/A - data simply missing
reproduction: Attempt to use complex spirits in the app
started: Data was never seeded after complex spirits were added to seed.ts

## Eliminated

## Evidence

- timestamp: 2026-01-27T12:05:00Z
  checked: convex/seed.ts contents
  found: All 6 base spirits present in code (River, Lightning, Fractured Days, Starlight, Finder, Serpent)
  implication: Seed data is complete in code

- timestamp: 2026-01-27T12:06:00Z
  checked: Schema (convex/schema.ts)
  found: Schema supports all complex patterns (orActions, connectsTo, presenceCap, layout: branching/multiple, etc.)
  implication: No schema changes needed

- timestamp: 2026-01-27T12:07:00Z
  checked: seedSpirits mutation execution
  found: Returns "Data already seeded" - idempotent check prevents re-running
  implication: Seed ran once with old data, now refuses to run with new data

- timestamp: 2026-01-27T12:08:00Z
  checked: Database contents via spirits:listSpirits
  found: Only 2 base spirits + 7 aspects (River x4, Lightning x5) = 9 total spirits
  implication: Complex spirits (Fractured Days, Starlight, Finder, Serpent) never seeded

- timestamp: 2026-01-27T12:09:00Z
  checked: reseedSpirits mutation in seed.ts
  found: Exists at line 1287 - deletes all data and re-inserts including all complex spirits
  implication: Running reseedSpirits will fix the issue

## Resolution

root_cause: Complex spirits were added to seed.ts AFTER the initial seed ran. The seedSpirits mutation is idempotent (skips if data exists), so the new spirits were never inserted. The reseedSpirits mutation exists but was never executed.
fix: Run `npx convex run seed:reseedSpirits` to delete existing data and reseed with all spirits
verification: After running reseedSpirits, spirits:listSpirits should return 6 base spirits + aspects
files_changed: []
