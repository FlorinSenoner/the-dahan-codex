import { expect, test } from "@playwright/test";

test.describe("Search Page", () => {
  test("shows search input on load", async ({ page }) => {
    await page.goto("/search");

    // Search input should be visible
    const searchInput = page.getByRole("searchbox");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", /search/i);
  });

  test("shows initial empty state", async ({ page }) => {
    await page.goto("/search");

    // Should show instruction text when no query
    await expect(page.getByText(/enter a search term/i)).toBeVisible();
  });

  test("finds spirit by name", async ({ page }) => {
    // First load spirits page to ensure Convex data is fetched
    await page.goto("/spirits");
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Navigate to search page
    await page.goto("/search");
    await expect(page.getByRole("searchbox")).toBeVisible();

    // Type spirit name
    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("River");

    // Wait for debounce and results - use Playwright's auto-waiting
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible({
      timeout: 15000,
    });
    // Use first() because aspects also contain "River Surges in Sunlight"
    await expect(
      page.getByText("River Surges in Sunlight").first(),
    ).toBeVisible();
  });

  test("shows no results for gibberish", async ({ page }) => {
    // First load spirits page to ensure Convex data is fetched
    await page.goto("/spirits");
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Navigate to search page
    await page.goto("/search");
    await expect(page.getByRole("searchbox")).toBeVisible();

    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("xyznonexistent123");

    // Wait for debounce
    await page.waitForTimeout(300);

    // Should show no results message
    await expect(page.getByText(/no results found/i)).toBeVisible();
  });

  test("clicking result navigates to spirit", async ({ page }) => {
    // First load spirits page to ensure Convex data is fetched
    await page.goto("/spirits");
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Navigate to search page
    await page.goto("/search");
    await expect(page.getByRole("searchbox")).toBeVisible();

    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("River");

    // Wait for results to appear - use first() because aspects also match
    await expect(
      page.getByText("River Surges in Sunlight").first(),
    ).toBeVisible({
      timeout: 15000,
    });

    // Click the first result (base spirit)
    await page.getByText("River Surges in Sunlight").first().click();

    // Should navigate to spirit page
    await expect(page).toHaveURL(/\/spirits\/river/);
  });

  test("search tab in bottom nav works", async ({ page }) => {
    // Go to spirits page first
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Click search tab in bottom nav
    await page.getByRole("link", { name: "Search" }).click();

    // Should be on search page
    await expect(page).toHaveURL("/search");
    await expect(page.getByRole("searchbox")).toBeVisible();
  });
});
