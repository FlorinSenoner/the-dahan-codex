---
id: "005"
type: quick
title: Fix Clerk sign-in e2e test selector
subsystem: testing
tags: [playwright, clerk, e2e]

key-files:
  modified:
    - e2e/smoke.spec.ts

duration: 2min
completed: 2026-01-25
---

# Quick Task 005: Fix Clerk sign-in e2e test selector

**Updated Clerk sign-in e2e test to use role-based heading selector compatible with Clerk v5**

## Performance

- **Duration:** 2 min
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Replaced outdated `[data-clerk-component="sign-in"]` selector with Playwright role-based selector
- All 4 smoke tests now pass
- Test is more resilient to future Clerk version changes

## Task Commits

1. **Task 1: Update sign-in test selector** - `8a054ec` (fix)

## Files Modified

- `e2e/smoke.spec.ts` - Updated sign-in page test to use `getByRole("heading", { name: /sign in/i })` instead of data attribute selector

## Decisions Made

- Used Playwright's `getByRole` selector instead of another data attribute - more resilient to Clerk internal changes and follows Playwright best practices for accessible selectors

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Verification

- `pnpm exec playwright test e2e/smoke.spec.ts` - 4 passed (2.4s)
- `pnpm typecheck` - No errors

---
*Quick Task: 005*
*Completed: 2026-01-25*
