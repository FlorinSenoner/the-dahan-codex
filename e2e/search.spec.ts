import { expect, test } from "@playwright/test";

test.describe("Spirit Search", () => {
  test("search input is visible on spirits page", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load from Convex (may take a moment)
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Search input should be visible
    await expect(page.getByPlaceholder("Search spirits...")).toBeVisible();
  });

  test("search filters spirits by name", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder("Search spirits...");

    // Type search term
    await searchInput.fill("River");

    // Should show River spirit
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible();

    // Should filter out non-matching spirits (Lightning should be hidden)
    // Use count assertion since not.toBeVisible requires single element and aspects match the pattern
    await expect(
      page.getByRole("link", { name: /lightning's swift strike/i }),
    ).toHaveCount(0);
  });

  test("search term persists in URL", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder("Search spirits...");

    await searchInput.fill("Lightning");

    // URL should contain search param
    await expect(page).toHaveURL(/search=Lightning/i);
  });

  test("search from URL shows filtered results", async ({ page }) => {
    // Navigate directly with search param
    await page.goto("/spirits?search=River");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Search input should have value
    const searchInput = page.getByPlaceholder("Search spirits...");
    await expect(searchInput).toHaveValue("River", { timeout: 15000 });

    // Results should be filtered - wait for page to load
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Lightning should be hidden (use count since aspects also match the pattern)
    await expect(
      page.getByRole("link", { name: /lightning's swift strike/i }),
    ).toHaveCount(0);
  });

  test("clearing search shows all spirits", async ({ page }) => {
    await page.goto("/spirits?search=River");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder("Search spirits...");

    // Clear the search
    await searchInput.clear();

    // URL should not have search param (wait for navigation)
    await expect(page).not.toHaveURL(/search=/);

    // Multiple spirits should be visible
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /lightning's swift strike/i }).first(),
    ).toBeVisible();
  });
});
