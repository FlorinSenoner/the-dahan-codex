import { expect, test } from "@playwright/test";

test.describe("Settings Page", () => {
  test("navigates to settings from bottom nav", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Click Settings tab
    await page.getByRole("link", { name: "Settings" }).click();

    // Verify settings page loads
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("displays offline access section with download button", async ({
    page,
  }) => {
    await page.goto("/settings");

    // Verify offline access section exists (PWA-04)
    await expect(
      page.getByRole("heading", { name: /offline access/i }),
    ).toBeVisible();

    // Verify Download for Offline button is present
    await expect(
      page.getByRole("button", { name: /download for offline/i }),
    ).toBeVisible();
  });

  test("displays cache management section", async ({ page }) => {
    await page.goto("/settings");

    // Verify cache management section exists
    await expect(
      page.getByRole("heading", { name: /cache management/i }),
    ).toBeVisible();

    // Verify buttons are present
    await expect(
      page.getByRole("button", { name: /refresh data/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /clear cache/i }),
    ).toBeVisible();
  });

  test("settings is accessible via URL", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });
});
