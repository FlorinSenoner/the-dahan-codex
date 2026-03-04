import { expect, test } from '@playwright/test'

test.describe('Adversaries', () => {
  async function gotoList(page: import('@playwright/test').Page) {
    await page.goto('/adversaries')
    await expect(page.getByRole('heading', { name: 'Adversaries' })).toBeVisible()
  }

  async function requireAdversaryRows(page: import('@playwright/test').Page) {
    const rows = page.locator('a[id^="adversary-"]')
    const count = await rows.count()
    test.skip(count === 0, 'No adversaries available in the current public snapshot')
    return rows
  }

  test('list page renders canonical adversaries', async ({ page }) => {
    await gotoList(page)

    const rows = await requireAdversaryRows(page)
    await expect(rows.first()).toBeVisible()
  })

  test('list row navigates to detail page', async ({ page }) => {
    await gotoList(page)
    const rows = await requireAdversaryRows(page)
    const row = rows.first()
    await expect(row).toBeVisible()
    await row.click()

    await expect(page).toHaveURL(/\/adversaries\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Additional Loss Condition' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Escalation' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Rules' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Strategy' })).toBeVisible()
  })

  test('rules level selector always shows selected level difficulty', async ({ page }) => {
    await gotoList(page)
    const rows = await requireAdversaryRows(page)
    await rows.first().click()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Level \d+ • Difficulty \d+/i)).toBeVisible()

    const levelButtons = page.getByRole('button', { name: /^L\d$/ })
    const levelCount = await levelButtons.count()
    if (levelCount > 1) {
      await levelButtons.last().click()
      await expect(page.getByText(/Level \d+ • Difficulty \d+/i)).toBeVisible()
    }
  })

  test('strategy sources expose external links', async ({ page }) => {
    await gotoList(page)
    const rows = await requireAdversaryRows(page)
    await rows.first().click()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })

    const sourceLink = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: 'Strategy' }) })
      .getByRole('link')
      .first()

    await expect(sourceLink).toBeVisible()
    await expect(sourceLink).toHaveAttribute('target', '_blank')
    await expect(sourceLink).toHaveAttribute('href', /^https?:\/\//)
  })
})
