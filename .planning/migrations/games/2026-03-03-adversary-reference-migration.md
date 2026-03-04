# Games Migration Spec: Adversary Reference Cutover

- Date: 2026-03-03
- Scope: `games` table adversary fields
- Type: Latest-only schema cutover
- Status: Completed (including post-migration cleanup)

## Goal

Use canonical adversary references only for all game writes and reads.

## Final Shape

- `adversaryRef?: { adversaryId: Id<'adversaries'>; level: number }`
- `secondaryAdversaryRef?: { adversaryId: Id<'adversaries'>; level: number }`

Legacy name-only adversary fields are removed from schema and runtime payload handling.

## Runtime Rules

- Write path (`createGame`, `updateGame`, `importGames`): accepts only `adversaryRef` and `secondaryAdversaryRef`.
- Read path (`listGames`, `getGame`): consumers read only canonical ref fields.
- UI: game list/detail/edit and score breakdown use canonical ref fields only.
- CSV import: resolves adversary names to canonical refs via public snapshot.

## Mapping Rules

- Name matching: normalize by existing selector behavior (`name` + `aliases`).
- Level: parsed from CSV as `0..6`.
- Difficulty and display name are resolved from canonical adversary data at read time.
- Persisted game shape stores no adversary snapshots; only `{ adversaryId, level }` is stored.

## Canonical Data Assumption

- Canonical adversary names and level difficulties are treated as stable application data.
- Historical game rendering intentionally uses current canonical adversary data + stored level.

## Rollout Assumption

This cutover assumes active clients are on the latest app version and data written going forward follows the canonical ref shape.

## Production Rollout Record

Executed on 2026-03-04.

- Baseline preflight: `primaryWithLegacyOnly = 8`, `secondaryWithLegacyOnly = 5`.
- Backfill applied with zero unresolved matches.
- Cleanup applied with `skippedLegacyOnly = 0`.
- Final preflight: `primaryWithLegacyOnly = 0`, `secondaryWithLegacyOnly = 0`.
- Raw data verification showed no legacy top-level adversary fields.

### Revalidation Run (Production)

Re-executed on 2026-03-04 (Europe/Rome) to confirm rollout state and reproducibility.

- Backup export captured: `backups/prod-20260304-101641-pre-migration.zip`.
- Preflight before run: `primaryWithLegacyOnly = 0`, `secondaryWithLegacyOnly = 0`, `totalGames = 24`.
- Dry runs:
  - `games:backfillLegacyAdversaryRefs` -> `updatedGames = 0`, `unresolvedPrimary = 0`, `unresolvedSecondary = 0`
  - `games:normalizeAdversaryRefShape` -> `normalized = 0`
  - `games:cleanupLegacyAdversaryFields` -> `cleaned = 0`, `skippedLegacyOnly = 0`
- Live runs (non-dry-run) were no-op with the same zero-change results.
- Adversary seed sync run: `seed:seedSpirits` -> `"Spirits already seeded. Upserted 8 adversaries."`
- Post-run verification:
  - `games:preflightAdversaryRefCoverage` unchanged (`0/0`, `totalGames = 24`)
  - Raw `games` scan: no `adversary`/`secondaryAdversary` fields and no extra keys in `adversaryRef` / `secondaryAdversaryRef` beyond `{ adversaryId, level }`.

## Post-Migration Cleanup

- Temporary migration functions were removed from `convex/games.ts` after successful rollout.
- Temporary schema bridge fields (`games.adversary`, `games.secondaryAdversary`) were removed from `convex/schema.ts`.
- Runtime shape is now strictly canonical ref-only.

## Validation Checklist

- New and edited games persist only `adversaryRef` / `secondaryAdversaryRef`.
- Game list/detail/edit render adversary data from refs only.
- Score difficulty is resolved from canonical adversary data + stored level.
- CSV import correctly maps adversary names to canonical refs.
