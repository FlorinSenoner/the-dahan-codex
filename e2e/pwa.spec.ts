import { expect, test } from "@playwright/test";

test.describe("PWA Offline Indicator", () => {
  test("shows offline indicator when network is offline", async ({
    page,
    context,
  }) => {
    // Navigate to app first while online
    await page.goto("/spirits");
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load (ensures page is fully hydrated)
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Verify offline indicator is NOT visible initially
    await expect(page.getByText("You're offline")).not.toBeVisible();

    // Simulate offline mode
    await context.setOffline(true);

    // Verify offline indicator appears
    await expect(page.getByText("You're offline")).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Verify offline indicator disappears
    await expect(page.getByText("You're offline")).not.toBeVisible();
  });
});

test.describe("PWA Manifest", () => {
  test("has valid manifest.json", async ({ page }) => {
    const response = await page.goto("/manifest.json");
    expect(response?.ok()).toBeTruthy();

    const manifest = await response?.json();
    expect(manifest.name).toBe("The Dahan Codex");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});
