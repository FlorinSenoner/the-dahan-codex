# Games Migration Spec: Adversary Reference Cutover

- Date: 2026-03-03
- Scope: `games` table adversary fields
- Type: Latest-only schema cutover
- Status: Implemented

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

## Deployment Preflight

Run:

`npx convex run games:preflightAdversaryRefCoverage`

Safe cutover requires:

- `primaryWithLegacyOnly = 0`
- `secondaryWithLegacyOnly = 0`

## Reproducible Production Procedure

This sequence is intentionally copy/paste friendly and should be run in order.

1. Deploy backend code (includes migration utilities and latest schema/functions):

`pnpm exec convex deploy --yes`

2. Ensure canonical adversary data is present/up-to-date:

`pnpm exec convex run --prod seed:seedSpirits`

3. Capture baseline preflight:

`pnpm exec convex run --prod games:preflightAdversaryRefCoverage`

4. Dry-run backfill (no writes):

`pnpm exec convex run --prod games:backfillLegacyAdversaryRefs '{"dryRun": true}'`

5. Apply backfill:

`pnpm exec convex run --prod games:backfillLegacyAdversaryRefs '{"dryRun": false}'`

6. Dry-run ref-shape normalization (no writes):

`pnpm exec convex run --prod games:normalizeAdversaryRefShape '{"dryRun": true}'`

7. Apply ref-shape normalization:

`pnpm exec convex run --prod games:normalizeAdversaryRefShape '{"dryRun": false}'`

8. Dry-run cleanup (no writes):

`pnpm exec convex run --prod games:cleanupLegacyAdversaryFields '{"dryRun": true}'`

9. Apply cleanup:

`pnpm exec convex run --prod games:cleanupLegacyAdversaryFields '{"dryRun": false}'`

10. Final preflight (must be zero):

`pnpm exec convex run --prod games:preflightAdversaryRefCoverage`

Safe completion criteria:

- `primaryWithLegacyOnly = 0`
- `secondaryWithLegacyOnly = 0`

Optional raw verification:

`pnpm exec convex data games --prod --format jsonLines | rg '"adversary":|"secondaryAdversary":'`

Expected: no matches.

## Stop Conditions

Stop and investigate before proceeding if any apply:

- `unresolvedPrimary > 0` or `unresolvedSecondary > 0` in backfill result.
- `normalized = 0` while legacy rows still contain derived ref fields.
- `skippedLegacyOnly > 0` after cleanup.
- Final preflight has non-zero legacy-only counts.

## Validation Checklist

- New and edited games persist only `adversaryRef` / `secondaryAdversaryRef`.
- Game list/detail/edit render adversary data from refs only.
- Score difficulty is resolved from canonical adversary data + stored level.
- CSV import correctly maps adversary names to canonical refs.
