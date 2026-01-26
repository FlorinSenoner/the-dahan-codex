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

  test("spirit detail shows variant tabs", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for tabs to load (River has base + 3 aspects)
    await expect(page.getByRole("tab", { name: /River/ })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole("tab", { name: "Sunshine" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Travel" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Haven" })).toBeVisible();
  });

  test("variant tabs navigate to correct URL", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for tabs to load
    await expect(page.getByRole("tab", { name: /River/ })).toBeVisible({
      timeout: 15000,
    });

    // Click on Sunshine tab
    await page.getByRole("tab", { name: "Sunshine" }).click();

    // URL should update
    await expect(page).toHaveURL(/river-surges-in-sunlight\/sunshine/);

    // Content should update (subtitle shows "Aspect of")
    await expect(
      page.getByText("Aspect of River Surges in Sunlight"),
    ).toBeVisible();
  });

  test("spirit detail shows overview section", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to load
    await expect(
      page.getByRole("heading", { name: /river surges in sunlight/i }),
    ).toBeVisible({ timeout: 15000 });

    // Check for strengths and weaknesses headings
    await expect(
      page.getByRole("heading", { name: "Strengths" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Weaknesses" }),
    ).toBeVisible();
  });

  test("spirit detail shows board sections", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to load
    await expect(
      page.getByRole("heading", { name: /river surges in sunlight/i }),
    ).toBeVisible({ timeout: 15000 });

    // Check for board section headings
    await expect(page.getByRole("heading", { name: "Growth" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Presence Tracks" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Innate Powers" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Starting Cards" }),
    ).toBeVisible();
  });

  test("spirit detail shows external links", async ({ page }) => {
    await page.goto("/spirits/river-surges-in-sunlight");

    // Wait for page to load
    await expect(
      page.getByRole("heading", { name: /river surges in sunlight/i }),
    ).toBeVisible({ timeout: 15000 });

    // Check for Resources section
    await expect(
      page.getByRole("heading", { name: "Resources" }),
    ).toBeVisible();

    // Check for external link to wiki
    const wikiLink = page.getByRole("link", { name: /Spirit Island Wiki/i });
    await expect(wikiLink).toBeVisible();
    await expect(wikiLink).toHaveAttribute("target", "_blank");
  });
});
