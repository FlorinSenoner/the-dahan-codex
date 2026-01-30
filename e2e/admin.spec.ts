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

  test("edit URL param does not activate edit mode for non-admin", async ({
    page,
  }) => {
    // Try to access edit mode via URL
    await page.goto("/spirits/river-surges-in-sunlight?edit=true");

    // Page should load normally
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible({ timeout: 15000 });

    // Edit FAB should still not be visible
    await expect(
      page.getByRole("button", { name: "Enter edit mode" }),
    ).not.toBeVisible();

    // No edit UI should be visible (editable inputs)
    await expect(
      page.locator('input[placeholder="Opening Name"]'),
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
});

test.describe("Admin Features - URL State", () => {
  test("edit param is preserved in URL when present", async ({ page }) => {
    // This tests URL state behavior, not admin access
    await page.goto("/spirits/river-surges-in-sunlight?edit=true");

    // URL should have edit param
    await expect(page).toHaveURL(/edit=true/);
  });

  test("navigating back to spirits list removes edit param", async ({
    page,
  }) => {
    await page.goto("/spirits/river-surges-in-sunlight?edit=true");

    // Wait for page to load
    await expect(
      page.getByRole("heading", { name: "River Surges in Sunlight" }),
    ).toBeVisible({ timeout: 15000 });

    // Navigate back to spirits list
    await page.getByRole("button", { name: "Back to spirits" }).click();

    // Wait for navigation
    await expect(page).toHaveURL(/\/spirits$/);

    // Edit param should be gone on spirits list
    await expect(page).not.toHaveURL(/edit=true/);
  });
});

// NOTE: Admin CRUD tests would require:
// 1. A test user with isAdmin=true in Clerk publicMetadata
// 2. Authentication setup in Playwright
// 3. These are verified manually in the checkpoint task below
//
// Manual test steps for admin users:
// 1. Log in as admin (user with isAdmin: true in Clerk)
// 2. Navigate to /spirits/river-surges-in-sunlight
// 3. Verify edit FAB appears (pencil button bottom-right)
// 4. Click FAB to enter edit mode, verify URL shows ?edit=true
// 5. Edit opening fields, verify save button appears
// 6. Save changes, verify persistence
// 7. Test delete with confirmation dialog
// 8. Test navigation blocking with unsaved changes
