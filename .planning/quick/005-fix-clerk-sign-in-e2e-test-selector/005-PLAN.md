---
id: "005"
type: quick
title: Fix Clerk sign-in e2e test selector
status: planned
files_modified:
  - e2e/smoke.spec.ts
autonomous: true
---

<objective>
Fix the failing e2e test for the sign-in page by replacing the outdated Clerk v4 selector with one that works with Clerk v5.

Purpose: The test uses `[data-clerk-component="sign-in"]` which doesn't exist in Clerk v5. The sign-in page renders correctly (showing heading "Sign in to The Dahan Codex"), but the selector fails.

Output: Passing e2e smoke test for sign-in page
</objective>

<context>
@e2e/smoke.spec.ts
@app/routes/sign-in.$.tsx

The Clerk SignIn component in v5 doesn't emit the `data-clerk-component` attribute. Instead, we should verify the sign-in page by checking for visible content that Clerk renders, such as the heading.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update sign-in test selector</name>
  <files>e2e/smoke.spec.ts</files>
  <action>
    Update the "sign-in page loads" test (line 17-23) to use a selector that matches Clerk v5 rendered content.

    Replace:
    ```typescript
    await expect(page.locator('[data-clerk-component="sign-in"]')).toBeVisible({
      timeout: 10000,
    });
    ```

    With:
    ```typescript
    // Clerk v5 renders a heading with the app name in the sign-in form
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible({
      timeout: 10000,
    });
    ```

    This uses Playwright's recommended role-based selector which is more resilient to Clerk version changes. The heading "Sign in to The Dahan Codex" is rendered by Clerk when the component loads.
  </action>
  <verify>Run `pnpm exec playwright test e2e/smoke.spec.ts` - all 4 tests should pass</verify>
  <done>The sign-in page test passes using a Clerk v5 compatible selector</done>
</task>

</tasks>

<verification>
- `pnpm exec playwright test` passes all smoke tests
- No TypeScript errors: `pnpm typecheck`
</verification>

<success_criteria>
- All 4 smoke tests pass
- Test correctly verifies sign-in page loads with Clerk component
</success_criteria>

<output>
After completion, create `.planning/quick/005-fix-clerk-sign-in-e2e-test-selector/005-SUMMARY.md`
</output>
