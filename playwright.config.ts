import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: isCI ? 'http://localhost:4227' : 'http://localhost:4127',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? 'pnpm exec vite preview' : 'pnpm dev',
    url: isCI ? 'http://localhost:4227' : 'http://localhost:4127',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
})
