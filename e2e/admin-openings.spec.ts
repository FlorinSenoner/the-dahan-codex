import { expect, test } from "@playwright/test";

test.describe("Admin Openings", () => {
  test.describe("Unauthenticated user", () => {
    test("redirects from admin openings route to home", async ({ page }) => {
      // Try to access admin page without auth
      // Note: pathless _admin layout means URL is /openings not /admin/openings
      await page.goto("/openings");

      // Should redirect to home (the _admin layout redirects non-admins to "/")
      await expect(page).toHaveURL("/");
    });

    test("redirects from admin new page to home", async ({ page }) => {
      await page.goto("/openings/new");
      await expect(page).toHaveURL("/");
    });

    test("redirects from admin edit page to home", async ({ page }) => {
      await page.goto("/openings/abc123/edit");
      await expect(page).toHaveURL("/");
    });
  });

  // Note: Testing authenticated admin flows requires:
  // 1. Clerk test user with isAdmin=true in publicMetadata
  // 2. Authentication setup in Playwright
  // These tests are marked as skipped until auth setup is configured
  test.describe
    .skip("Authenticated admin", () => {
      // These tests would run with admin authentication
      // See Playwright auth docs: https://playwright.dev/docs/auth

      test("can access openings list", async ({ page }) => {
        await page.goto("/openings");
        await expect(
          page.getByRole("heading", { name: /manage openings/i }),
        ).toBeVisible();
      });

      test("can navigate to new opening form", async ({ page }) => {
        await page.goto("/openings");
        await page.getByRole("link", { name: /new opening/i }).click();
        await expect(page).toHaveURL("/openings/new");
      });

      test("new opening form has required fields", async ({ page }) => {
        await page.goto("/openings/new");
        await expect(page.getByLabel(/spirit/i)).toBeVisible();
        await expect(page.getByLabel(/name/i)).toBeVisible();
        await expect(page.getByLabel(/slug/i)).toBeVisible();
      });
    });
});
