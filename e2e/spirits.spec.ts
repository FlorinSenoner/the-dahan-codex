import { expect, test } from "@playwright/test";

test.describe("Spirit Library", () => {
  test("spirit list renders with spirits", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load from Convex (may take a moment)
    // Use first() because aspects also match the pattern
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Verify Lightning is also present (first match is the base spirit)
    await expect(
      page.getByRole("link", { name: /lightning's swift strike/i }).first(),
    ).toBeVisible();
  });

  test("filter button opens bottom sheet", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Wait for spirits to load (ensures page is fully hydrated)
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Click filter button (has aria-label="Filter")
    await page.getByRole("button", { name: "Filter" }).click();

    // Verify drawer opens with filter options
    await expect(
      page.getByRole("heading", { name: /filter spirits/i }),
    ).toBeVisible();

    // Verify complexity options are present (filter buttons in the drawer)
    await expect(page.getByRole("button", { name: "Low" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
  });

  test("clicking spirit navigates to detail page", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for spirits to load
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i }).first(),
    ).toBeVisible({ timeout: 15000 });

    // Click on River (first match is the base spirit, not an aspect)
    await page
      .getByRole("link", { name: /river surges in sunlight/i })
      .first()
      .click();

    // Verify URL changed
    await expect(page).toHaveURL(/\/spirits\/river-surges-in-sunlight/);

    // Verify detail page content - wait for data to load
    await expect(
      page.getByRole("heading", { name: /river surges in sunlight/i }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("bottom navigation is visible", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for page to load
    await expect(page.getByRole("heading", { name: /spirits/i })).toBeVisible();

    // Verify bottom nav is present
    await expect(page.getByRole("navigation")).toBeVisible();

    // Verify Spirits tab is present (use first() since there may be multiple links)
    await expect(
      page.getByRole("link", { name: /spirits/i }).first(),
    ).toBeVisible();
  });

  test("credits page shows disclaimer", async ({ page }) => {
    await page.goto("/credits");

    // Verify page loads
    await expect(page.getByRole("heading", { name: /credits/i })).toBeVisible();

    // Verify legal disclaimer is present
    await expect(
      page.getByText(/not affiliated with greater than games/i),
    ).toBeVisible();

    // Verify external links are present
    await expect(
      page.getByRole("link", { name: /spirit island wiki/i }),
    ).toBeVisible();
  });
});
