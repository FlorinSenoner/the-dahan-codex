# Testing Patterns

**Analysis Date:** 2026-02-13

## Test Framework

**Runner:**
- Playwright v1.58.2
- Config: `playwright.config.ts`

**Assertion Library:**
- Playwright built-in assertions (`expect`)

**Run Commands:**
```bash
pnpm test:e2e           # Run all tests
pnpm test:e2e:ui        # Debug mode with UI
pnpm ci                 # Full CI: lint, typecheck, build, test
```

**Additional Testing:**
- Vitest v4.0.18 configured but no unit tests present (E2E-only strategy)

## Test File Organization

**Location:**
- All E2E tests in `e2e/` directory (separate from `src/`)

**Naming:**
- `*.spec.ts` pattern (`smoke.spec.ts`, `spirits.spec.ts`, `games.spec.ts`)
- Domain-based organization (spirits, games, pwa, settings, admin, search)

**Structure:**
```
e2e/
├── smoke.spec.ts       # Basic smoke tests
├── spirits.spec.ts     # Spirit library features
├── games.spec.ts       # Game tracker features
├── pwa.spec.ts         # PWA offline behavior
├── settings.spec.ts    # Settings page
├── admin.spec.ts       # Admin features
└── search.spec.ts      # Search functionality
```

## Test Structure

**Suite Organization:**
```typescript
import { expect, test } from '@playwright/test'

test.describe('Feature Name', () => {
  test('specific behavior', async ({ page }) => {
    // Arrange
    await page.goto('/path')

    // Act
    await page.getByRole('button', { name: 'Filter' }).click()

    // Assert
    await expect(page.getByRole('heading', { name: /filter spirits/i })).toBeVisible()
  })
})
```

**Patterns:**
- One `test.describe` per major feature area
- Nested `test.describe` for auth states (unauthenticated vs authenticated)
- Each test is self-contained (no shared state between tests)
- Use `async/await` for all Playwright operations

## Mocking

**Framework:** None (E2E tests use real backend)

**Patterns:**
- Tests use live Convex backend (no mocking)
- Authenticated tests use real Clerk test user:
  ```typescript
  const clerkTestEmail = process.env.CLERK_TEST_USER_EMAIL
  const clerkTestPassword = process.env.CLERK_TEST_USER_PASSWORD
  ```
- Offline behavior tested via Playwright context:
  ```typescript
  await context.setOffline(true)  // Simulate offline
  await context.setOffline(false) // Back online
  ```

**What to Mock:**
- Network state (via `context.setOffline()`)
- Nothing else (E2E philosophy: test real behavior)

**What NOT to Mock:**
- Backend API calls (use real Convex)
- Authentication (use real Clerk test user)
- Service workers (test real PWA behavior)

## Fixtures and Factories

**Test Data:**
- No factories (tests use production data from Convex)
- Known spirits used for assertions: "River Surges in Sunlight", "Lightning's Swift Strike"
- Test user credentials via environment variables

**Location:**
- Helper functions in test files (e.g., `signInWithClerkTestUser` in `games.spec.ts`)
- No separate fixtures directory

**Example:**
```typescript
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
  await page.getByRole('button', { name: /continue|sign in/i }).first().click()
  await expect(page).not.toHaveURL(/\/sign-in/)
}
```

## Coverage

**Requirements:** None enforced (E2E-focused, no unit test coverage)

**View Coverage:**
- Not configured (Playwright E2E only)

## Test Types

**Unit Tests:**
- None present (codebase uses E2E-only strategy)

**Integration Tests:**
- None (E2E tests cover integration scenarios)

**E2E Tests:**
- **Framework:** Playwright
- **Scope:** Full user flows (navigation, authentication, data fetching, offline behavior)
- **Browser:** Chromium only (Desktop Chrome device)
- **Parallelization:** Full parallel (CI uses 1 worker, local uses default)
- **Retries:** 2 retries in CI, 0 locally

## Common Patterns

**Waiting for Data:**
```typescript
// Wait for page load
await expect(page.getByRole('heading', { name: /spirits/i })).toBeVisible()

// Wait for Convex data (with extended timeout)
await expect(page.getByRole('link', { name: /river surges in sunlight/i }).first()).toBeVisible({
  timeout: 15000,
})
```

**Handling Multiple Matches:**
```typescript
// Use .first() to avoid Playwright strict mode violations
await page.getByRole('link', { name: /river surges in sunlight/i }).first().click()
```

**URL Assertions:**
```typescript
// Regex for flexible matching
await expect(page).toHaveURL(/\/spirits\/river-surges-in-sunlight/)
await expect(page).toHaveURL(/\/games$/)
```

**Conditional Visibility:**
```typescript
// Handle mobile vs desktop layouts
const overviewTrigger = page.getByRole('button', { name: 'Overview' })
const hasOverviewTrigger = await overviewTrigger.isVisible()
if (hasOverviewTrigger) {
  await overviewTrigger.click() // Mobile: expand collapsible
}
// Desktop: already visible
await expect(page.getByText('Offense', { exact: true })).toBeVisible()
```

**Auth-Gated Tests:**
```typescript
test.describe('authenticated', () => {
  test.skip(!clerkTestEmail || !clerkTestPassword, 'requires Clerk test credentials')

  test('behavior when signed in', async ({ page }) => {
    await signInWithClerkTestUser(page)
    // Test authenticated behavior
  })
})
```

**External Link Validation:**
```typescript
const wikiLink = page.getByRole('link', { name: /Spirit Island Wiki/i })
await expect(wikiLink).toBeVisible()
await expect(wikiLink).toHaveAttribute('target', '_blank')
```

## E2E-Specific Patterns

**Playwright Selectors:**
- Prefer `getByRole()` with accessible roles:
  ```typescript
  page.getByRole('button', { name: 'Filter' })
  page.getByRole('heading', { name: /spirits/i })
  page.getByRole('link', { name: /river surges in sunlight/i })
  ```
- Use `getByText()` for unique text content
- Use `locator()` for complex selectors (CSS, XPath)
- Avoid brittle selectors (test IDs, CSS classes)

**Timeouts:**
- Default timeout: not specified (Playwright default: 30s)
- Extended timeout for data loading: `{ timeout: 15000 }` (Convex queries)
- Extended timeout for Clerk sign-in: `{ timeout: 10000 }`

**Page Navigation:**
```typescript
await page.goto('/spirits')
await page.goto('/sign-in')
await page.reload() // Test cached behavior
```

**Configuration:**
- `fullyParallel: true` (all tests run in parallel)
- `forbidOnly: isCI` (prevent `.only` in CI)
- `retries: isCI ? 2 : 0` (retry flaky tests in CI)
- `workers: isCI ? 1 : undefined` (single worker in CI, default locally)
- `baseURL` varies by environment (4127 dev, 4227 CI preview)
- `webServer` auto-starts dev/preview server

## CI Configuration

**Pipeline:**
```bash
pnpm ci  # Runs: check (lint, typecheck, knip, jscpd) + build + test:e2e
```

**Pre-commit Hooks:**
- Biome check + auto-fix (staged files only)
- Prettier format (Markdown/YAML)
- TypeScript typecheck (all files)
- **Location:** `lefthook.yml`

**Pre-push Hooks:**
- Knip (unused exports)
- jscpd (duplicate code detection)
- Vitest unit tests (currently no tests)

## Test Debugging

**UI Mode:**
```bash
pnpm test:e2e:ui  # Opens Playwright UI for interactive debugging
```

**Trace Viewer:**
- Traces captured on first retry (`trace: 'on-first-retry'`)
- View via Playwright HTML report

**Common Issues:**
- **Strict mode violations:** Multiple elements match selector → use `.first()` or more specific selector
- **Flaky data loading:** Convex queries need wait → use explicit waits with 15s timeout
- **Hydration timing:** Wait for data before interacting with dynamic content

## Known Test Utilities

**Helper Functions:**
- `signInWithClerkTestUser(page)` - Authenticate with Clerk test user (in `games.spec.ts`)

**Environment Variables:**
- `CLERK_TEST_USER_EMAIL` - Email for test user
- `CLERK_TEST_USER_PASSWORD` - Password for test user
- `CI` - CI environment flag (affects retries, workers, base URL)

## Regression Prevention

**Best Practices:**
- Always run full suite after fixing tests (`pnpm test:e2e`)
- Grep for shared helper call sites before modifying (`Grep` for function name)
- Prefer explicit waits over `networkidle` (more reliable)
- Use specific selectors to avoid strict mode violations
- Investigate timing/race conditions before adding arbitrary timeouts

**Memory:**
- Shared test helpers are high-blast-radius (changes cascade across tests)
- After fixing individual tests, always run full suite to catch cross-test regressions
- See `.claude/projects/.../memory/MEMORY.md` for lessons learned

---

*Testing analysis: 2026-02-13*
