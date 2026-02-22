import { expect, type Page, test } from '@playwright/test'

const clerkTestEmail = process.env.CLERK_TEST_USER_EMAIL
const clerkTestPassword = process.env.CLERK_TEST_USER_PASSWORD

async function signInWithClerkTestUser(page: Page) {
  if (!clerkTestEmail || !clerkTestPassword) {
    throw new Error('Missing Clerk test credentials')
  }

  await page.goto('/sign-in')

  const emailInput = page.getByRole('textbox', { name: 'Email address' })
  const passwordInput = page.locator('input[name="password"]')

  await expect(emailInput).toBeEnabled()
  await expect(passwordInput).toBeEnabled()

  await emailInput.fill(clerkTestEmail)
  await passwordInput.fill(clerkTestPassword)
  await page
    .getByRole('button', { name: /continue|sign in/i })
    .first()
    .click()
  await expect(page).not.toHaveURL(/\/sign-in/)
}

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
    test.skip(!clerkTestEmail || !clerkTestPassword, 'requires Clerk test credentials')
    test('does not show sign-in prompt when reloading /games while signed in', async ({ page }) => {
      await signInWithClerkTestUser(page)
      await page.goto('/games')
      await page.reload()
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
    await expect(nav.getByText('Home')).toBeVisible()
    await expect(nav.getByText('Spirits')).toBeVisible()
    await expect(nav.getByText('Games')).toBeVisible()
    await expect(nav.getByText('Settings')).toBeVisible()
    await expect(nav.getByText('Notes')).toHaveCount(0)
  })

  test('home tab is first and navigates to home page', async ({ page }) => {
    await page.goto('/settings')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    const navLinks = page.locator('nav a')
    await expect(navLinks.first()).toContainText('Home')

    const homeLink = page.locator('nav a[href="/"]')
    await expect(homeLink).toBeVisible()
    await homeLink.click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: 'Explore Spirits' }).first()).toBeVisible()
  })
})
