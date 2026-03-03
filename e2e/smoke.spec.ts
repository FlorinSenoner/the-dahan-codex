import { expect, test } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('he Dahan Codex', { exact: true })).toBeVisible()
  })

  test('home page shows subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Know your spirit before the invaders land.')).toBeVisible()
  })

  test('home page shows adversary section and updated table-help content', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'The Adversaries of the Island' })).toBeVisible()
    const overviewLink = page.getByRole('link', { name: 'Explore all adversaries' }).first()
    await expect(overviewLink).toBeVisible()
    await expect(overviewLink).toHaveAttribute('href', '/adversaries')

    await expect(page.getByRole('heading', { name: 'How It Helps at the Table' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Common Questions' })).toBeVisible()
  })

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('games page loads', async ({ page }) => {
    await page.goto('/games')
    await expect(page).toHaveURL(/\/games/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})
