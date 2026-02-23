# Convex Public Call Budget Runbook

## Goal

Keep `build:public` within `<= 10` Convex function completions.

## Command

```bash
# Use `--deployment dev` for local dev URLs, `--deployment prod` for production URLs.
pnpm measure:convex-calls -- --deployment prod --budget 10 -- pnpm build:public
```

## Expected Output

- Total completions count
- Per-function completion counts
- Non-zero exit code if budget exceeded

## Notes

- Requires `VITE_CONVEX_URL` and Convex auth context to be configured.
- CI sets `VITE_DISABLE_BACKGROUND_SYNC=1` to prevent background sync noise.
- If budget fails, inspect:
  - Public spirit routes for accidental Convex queries
  - Route loaders for Convex prefetch calls
  - `use-background-sync` for any spirits/openings fanout logic
