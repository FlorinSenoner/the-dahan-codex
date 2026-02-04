import { expect, test } from '@playwright/test'

test.describe('Game Tracker', () => {
  // Note: These tests require authentication
  // They will be skipped if not authenticated

  test.describe('unauthenticated', () => {
    test('redirects to sign-in when accessing /games', async ({ page }) => {
      await page.goto('/games')
      // Should redirect to Clerk sign-in
      await expect(page).toHaveURL(/sign-in/)
    })

    test('redirects to sign-in when accessing /games/new', async ({ page }) => {
      await page.goto('/games/new')
      // Should redirect to Clerk sign-in
      await expect(page).toHaveURL(/sign-in/)
    })

    test('redirects to sign-in when accessing /games/import', async ({ page }) => {
      await page.goto('/games/import')
      // Should redirect to Clerk sign-in
      await expect(page).toHaveURL(/sign-in/)
    })
  })
})

test.describe('Game Tracker Navigation', () => {
  test('games tab visible in bottom navigation', async ({ page }) => {
    // Use settings page which loads faster than spirits (no Convex data fetch)
    await page.goto('/settings')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Games tab should be visible in bottom nav
    const gamesLink = page.locator('nav a[href="/games"]')
    await expect(gamesLink).toBeVisible()
  })

  test('can navigate to games from settings page', async ({ page }) => {
    await page.goto('/settings')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Click on Games in bottom nav
    const gamesLink = page.locator('nav a[href="/games"]')
    await gamesLink.click()

    // Should redirect to sign-in (since not authenticated)
    await expect(page).toHaveURL(/sign-in/)
  })

  test('bottom nav shows four tabs', async ({ page }) => {
    await page.goto('/settings')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Verify all four tabs are present in the navigation
    const nav = page.locator('nav')
    await expect(nav.getByText('Spirits')).toBeVisible()
    await expect(nav.getByText('Games')).toBeVisible()
    await expect(nav.getByText('Notes')).toBeVisible()
    await expect(nav.getByText('Settings')).toBeVisible()
  })

  test('notes tab is disabled', async ({ page }) => {
    await page.goto('/settings')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Notes tab should be a div (disabled), not a link
    const notesTab = page.locator('nav').getByText('Notes')
    await expect(notesTab).toBeVisible()

    // It should have reduced opacity (disabled styling)
    const parent = notesTab.locator('..')
    await expect(parent).toHaveClass(/opacity-40/)
  })
})
