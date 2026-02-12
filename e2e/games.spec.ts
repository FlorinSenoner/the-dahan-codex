import { expect, test } from '@playwright/test'

test.describe('Game Tracker', () => {
  test.describe('unauthenticated', () => {
    test('shows sign-in prompt when accessing /games', async ({ page }) => {
      await page.goto('/games')
      // Should stay on /games and show sign-in prompt
      await expect(page).toHaveURL(/\/games/)
      await expect(page.getByText('Track your games')).toBeVisible()
      await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
    })

    test('redirects to /games when accessing /games/new', async ({ page }) => {
      await page.goto('/games/new')
      // Should redirect to /games (sign-in prompt)
      await expect(page).toHaveURL(/\/games$/)
    })

    test('redirects to /games when accessing /games/import', async ({ page }) => {
      await page.goto('/games/import')
      // Should redirect to /games (sign-in prompt)
      await expect(page).toHaveURL(/\/games$/)
    })
  })

  test.describe('authenticated', () => {
    test.skip('does not flash sign-in prompt on /games reload (requires authenticated storage state)', async ({
      page,
    }) => {
      // Enable this assertion once we have an authenticated Playwright fixture.
      await page.goto('/games')
      await expect(page.getByText('Track your games')).not.toBeVisible()
      await expect(page.getByRole('link', { name: /sign in/i })).not.toBeVisible()
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

    // Should navigate to /games and show sign-in prompt (since not authenticated)
    await expect(page).toHaveURL(/\/games/)
    await expect(page.getByText('Track your games')).toBeVisible()
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
