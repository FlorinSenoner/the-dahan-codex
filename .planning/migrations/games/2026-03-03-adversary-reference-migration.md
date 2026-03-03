# Games Migration Spec: Adversary Reference Backfill

- Date: 2026-03-03
- Scope: `games` table adversary fields
- Type: Backward-compatible additive migration
- Status: Schema and read/write compatibility implemented; no bulk backfill mutation included

## Goal

Move `games` adversary linkage from name-only records to ID-backed references while preserving full compatibility with existing clients and existing exports in this release.

## Current vs Target

### Existing fields (kept in this release)

- `adversary?: { name: string; level: number }`
- `secondaryAdversary?: { name: string; level: number }`

### New additive fields

- `adversaryRef?: { adversaryId: Id<'adversaries'>; level: number; difficulty: number; nameSnapshot: string }`
- `secondaryAdversaryRef?: { adversaryId: Id<'adversaries'>; level: number; difficulty: number; nameSnapshot: string }`

No destructive field removal is performed in this release.

## Schema Changes

- Add `adversaries` reference table and seed data.
- Add `adversaryRef` and `secondaryAdversaryRef` as optional fields on `games`.
- Keep legacy adversary fields unchanged.

## Data Mapping Rules

1. Name matching:
- Normalize legacy adversary names with trim + lowercase.
- Match against canonical adversary `name` and `aliases`.

2. Level handling:
- Clamp legacy level into `0..6` before writing refs.

3. Difficulty:
- Resolve from canonical adversary level difficulty.
- For level `0`, use canonical adversary `baseDifficulty`.
- Fallback to level value only if canonical level difficulty is missing.

4. Snapshot name:
- `nameSnapshot` is copied from canonical adversary name at migration time.

## Runtime Compatibility Strategy

- Write path (`createGame`, `updateGame`, `importGames`):
  - Accept both legacy and `*Ref` adversary payloads.
  - Persist whichever representation the client provides (legacy, ref, or both).

- Read path:
  - Prefer `*Ref` fields when present.
  - Fallback to legacy fields when refs are absent.

- UI compatibility:
  - Game forms write ID-backed refs.
  - Existing records without refs still render via fallback.

## Backfill Procedure

No dedicated backfill mutation is included in this release. Existing rows continue to work via legacy-field fallback in read paths.

If bulk normalization is needed later, implement a separate admin migration mutation in a follow-up change.

## Rollout Steps

1. Deploy schema and adversary seed.
2. Deploy read/write compatibility code.
3. Monitor new writes to confirm `adversaryRef`/`secondaryAdversaryRef` are populated by updated clients.
4. If historical normalization is required, schedule a follow-up migration release.

## Validation Checklist

- New games created with adversary selection persist `adversaryRef`/`secondaryAdversaryRef`.
- Legacy games still readable/editable.
- Existing legacy records remain readable/editable without backfill.
- Difficulty shown for selected adversary level in game UI and adversary detail UI.

## Risk and Rollback

- Risk level: low (additive fields + compatibility fallback).
- Rollback: deploy previous app version; legacy fields remain intact.
- No destructive `games` rewrite or field removal in this release.

## Deferred Follow-up

- After one or more stable releases, evaluate removal of legacy name-only adversary fields in a separate approved migration.
