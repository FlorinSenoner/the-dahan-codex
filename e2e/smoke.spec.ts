import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("The Dahan Codex");
  });

  test("home page shows Convex connection status", async ({ page }) => {
    await page.goto("/");
    // Wait for Convex to connect (may take a moment)
    await expect(page.locator("text=connected")).toBeVisible({
      timeout: 10000,
    });
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    // Clerk sign-in component should render
    await expect(page.locator('[data-clerk-component="sign-in"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("protected route redirects to sign-in when not authenticated", async ({
    page,
  }) => {
    await page.goto("/profile");
    // Should redirect to sign-in
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
