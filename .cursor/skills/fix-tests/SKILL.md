---
name: fix-tests
description:
  Fix failing E2E tests systematically — analyzes blast radius of shared helpers, runs the full
  suite after each fix, and iterates until zero failures. Use when E2E tests are failing in CI or
  locally.
---

Fix failing Playwright E2E tests using a systematic approach that avoids cascading regressions.

## Process

1. **Identify all failures.** Run `pnpm test:e2e` and capture the full output. Create a checklist of
   every failing test with its file path and failure reason.

2. **Analyze blast radius before changing shared code.** Before modifying any shared test helper or
   utility function, Grep for all files that use it. List every affected test. Only proceed with the
   change after understanding the full impact.

3. **Fix one test at a time.** For each failing test:
   - Read the test file and the source code it exercises
   - Diagnose the root cause
   - Apply the minimal fix
   - Re-run ONLY that test to confirm it passes

4. **Use proper wait strategies.** Prefer explicit wait conditions over `networkidle` or arbitrary
   timeouts:
   - `page.locator('.element').waitFor()` for element appearance
   - `page.waitForResponse()` for API calls
   - `page.waitForSelector()` for dynamic content
   - Never use `page.waitForTimeout()` unless absolutely necessary

5. **Use specific selectors.** Address strict mode violations with precise selectors:
   - `getByRole('button', { name: 'Submit' })` over `getByRole('button')`
   - `locator('.class').nth(0)` when multiple matches are expected
   - Scope locators to parent containers to narrow matches

6. **Run full suite after all individual fixes.** Once all individual tests pass, run the FULL suite
   (`pnpm test:e2e`) to catch any regressions introduced by the fixes.

7. **Iterate if regressions appear.** If the full suite reveals new failures caused by the fixes,
   repeat the diagnose-fix-verify cycle. Continue until the entire suite is green.

8. **Report results.** Summarize all changes made, grouped by root cause, and prepare a commit.

## Rules

- NEVER consider done until zero test failures
- NEVER skip the full suite run after individual fixes
- NEVER modify shared helpers without listing all affected tests first
- Prefer fixing the test's approach over adding waits/retries as bandaids
