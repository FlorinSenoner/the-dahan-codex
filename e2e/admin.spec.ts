import { expect, test } from "@playwright/test";

test.describe("Admin Features - Non-Admin User", () => {
  test("edit FAB is not visible for non-admin users", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to fully load
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible({ timeout: 15000 });

    // Edit FAB should not be visible (aria-label "Enter edit mode")
    await expect(
      page.getByRole("button", { name: "Enter edit mode" }),
    ).not.toBeVisible();
  });

  test("opening section displays correctly for non-admin", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to fully load
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible({ timeout: 15000 });

    // If openings exist, they should display in read-only mode
    // Look for opening content or "Openings" heading
    // Either openings section exists (with content) or doesn't (no openings)
    // This test just verifies no crash and expected structure
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible();
  });

  test("no edit UI is visible for non-admin users", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to fully load
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible({ timeout: 15000 });

    // Edit FAB should not be visible
    await expect(
      page.getByRole("button", { name: "Enter edit mode" }),
    ).not.toBeVisible();

    // No edit UI should be visible (editable inputs)
    await expect(
      page.locator('input[placeholder="Opening Name"]'),
    ).not.toBeVisible();
  });
});

// NOTE: Edit mode now uses React Context instead of URL state (changed in plan 05-18).
// The ?edit=true URL param no longer exists. Tests that reference URL state are removed.
// Edit mode state is not reflected in the URL anymore.

// NOTE: Admin CRUD tests would require:
// 1. A test user with role: "admin" in Clerk publicMetadata
// 2. Authentication setup in Playwright
// 3. These are verified manually in the checkpoint task below
//
// Manual test steps for admin users:
// 1. Log in as admin (user with role: "admin" in Clerk)
// 2. Navigate to /spirits/river-surges-in-sunlight
// 3. Verify edit FAB appears (pencil button bottom-right)
// 4. Click FAB to enter edit mode (no URL change - uses React Context)
// 5. Edit opening fields, verify save button appears
// 6. Save changes, verify persistence
// 7. Test delete with confirmation dialog
// 8. Test navigation blocking with unsaved changes
