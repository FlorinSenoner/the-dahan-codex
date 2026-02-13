# External Integrations

**Analysis Date:** 2026-02-13

## APIs & External Services

**Convex (Backend/Database):**
- Real-time serverless backend
  - SDK/Client: `convex` npm package
  - Auth: `CONVEX_DEPLOY_KEY` (secret, deployment only)
  - Runtime URL: `VITE_CONVEX_URL` (public variable)
  - Connection: WebSocket for real-time sync, HTTPS for queries
  - Queries cached via TanStack Query + IndexedDB (`idb-keyval`)

**Clerk (Authentication):**
- User authentication and session management
  - SDK/Client: `@clerk/clerk-react`
  - Auth: `VITE_CLERK_PUBLISHABLE_KEY` (public variable)
  - Integration: JWT issuer domain configured in `convex/auth.config.ts`
  - Flows: Sign in (`/sign-in`), Sign up (`/sign-up`), user settings
  - Session management: `useAuth()` hook, `ConvexProviderWithClerk` wrapper

**GitHub Actions API:**
- Workflow dispatch for auto-publish pipeline
  - SDK/Client: `fetch()` (native, no SDK)
  - Auth: `GITHUB_PUBLISH_TOKEN` (Convex env var, GitHub PAT)
  - Endpoint: `https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow}/dispatches`
  - Triggered by: Convex scheduled function (`convex/publishAuto.ts`)
  - Purpose: Rebuild public site when content changes (5-minute debounce)

## Data Storage

**Databases:**
- Convex Cloud (primary database)
  - Connection: WebSocket (`VITE_CONVEX_URL`)
  - Client: `convex` SDK with React hooks (`useQuery`, `useMutation`)
  - Schema: `convex/schema.ts` (single source of truth)
  - Tables: `healthCheck`, `expansions`, `spirits`, `openings`, `games`, `sitePublishStates`
  - Auth: Integrated with Clerk via `convex/auth.config.ts`

**File Storage:**
- Local filesystem only (static assets in `public/`)
  - Spirit images: `public/spirits/` (precached by service worker, except `*.png` excluded)
  - Icons: `public/icons/` (PWA manifest icons)
  - No cloud storage integration

**Caching:**
- Service Worker (Workbox)
  - Precache: All build assets (JS, CSS, HTML, fonts, images)
  - Runtime caches:
    - `fonts` cache - CacheFirst, 1 year, max 30 entries
    - `images` cache - StaleWhileRevalidate, 30 days, max 60 entries
  - App-shell fallback: `/app-shell.html` for offline navigation
- IndexedDB (TanStack Query Persistence)
  - Convex query results persisted via `@tanstack/query-persist-client-core`
  - Storage: `idb-keyval` wrapper for IndexedDB
  - Sync strategies: `src/lib/sync.ts` (games, spirits, openings)
  - Rehydrated on app load for offline-first experience

## Authentication & Identity

**Auth Provider:**
- Clerk
  - Implementation: `ClerkProvider` wraps app root (`src/routes/__root.tsx`)
  - Integration: `ConvexProviderWithClerk` bridges Clerk + Convex auth
  - Protected routes: Under `src/routes/_authenticated/` directory
  - User data: `useUser()` hook (Clerk), `userId` stored as `tokenIdentifier` in Convex
  - Sign-in UI: Clerk hosted components (`<SignIn />`, `<SignUp />`)

## Monitoring & Observability

**Error Tracking:**
- None (native browser console only)

**Logs:**
- Development: Console logs
- Production: No centralized logging service
- Convex logs: Available in Convex dashboard (deployment logs, function logs)

**Analytics:**
- None detected (no Google Analytics, Plausible, etc.)

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages
  - Project name: `the-dahan-codex`
  - Production branch: `main`
  - Preview deployments: Per PR (branch name slugified, max 28 chars)
  - Preview URL format: `https://{branch}.the-dahan-codex.pages.dev`
  - Auth: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (secrets)
  - Deploy command: `wrangler pages deploy dist --project-name=the-dahan-codex`

**CI Pipeline:**
- GitHub Actions
  - Workflows:
    - `.github/workflows/ci.yml` - PR checks (lint, typecheck, build, E2E tests)
    - `.github/workflows/deploy.yml` - Production + preview deployments
    - `.github/workflows/publish-public.yml` - Public site rebuild (workflow_dispatch)
    - `.github/workflows/pr-title.yml` - Conventional commit validation
    - `.github/workflows/cleanup-preview.yml` - Delete preview deployments on PR close
    - `.github/workflows/dependabot-merge.yml` - Auto-merge Dependabot PRs
  - Test environment: Uses test Clerk credentials (`CLERK_TEST_USER_EMAIL`, `CLERK_TEST_USER_PASSWORD`)
  - Convex deployment: `pnpm exec convex deploy --cmd-url-env-var-name VITE_CONVEX_URL`
  - Build: `pnpm build:public` (generates routes, prebuilds, prerenders public pages)

**Pre-commit Hooks (Lefthook):**
- Branch protection: Blocks direct commits to `main`
- Code quality: Biome (staged files), Prettier (Markdown/YAML), TypeScript typecheck
- Commit validation: Commitlint (conventional commits)
- Pre-push: Knip (unused code), jscpd (duplication), Vitest unit tests

## Environment Configuration

**Required env vars (production):**
- `VITE_CONVEX_URL` - Convex backend URL (GitHub Actions variable)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key (GitHub Actions variable)
- `CONVEX_DEPLOY_KEY` - Convex deployment key (GitHub Actions secret)
- `CLOUDFLARE_API_TOKEN` - Cloudflare Pages deploy token (GitHub Actions secret)
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID (GitHub Actions secret)

**Convex backend env vars:**
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer (configured in Convex dashboard)
- `GITHUB_PUBLISH_TOKEN` - GitHub PAT for workflow dispatch (optional, for auto-publish)
- `GITHUB_REPO_OWNER` - Repository owner (optional, for auto-publish)
- `GITHUB_REPO_NAME` - Repository name (optional, for auto-publish)
- `GITHUB_PUBLISH_WORKFLOW` - Workflow filename (defaults to `publish-public.yml`)

**Secrets location:**
- GitHub Actions: Settings > Secrets and variables > Actions
- Convex: Dashboard > Environment Variables
- Local development: `.env.local` (gitignored, contains `VITE_CONVEX_URL` and `VITE_CLERK_PUBLISHABLE_KEY`)

## Webhooks & Callbacks

**Incoming:**
- None (no webhook endpoints exposed)

**Outgoing:**
- GitHub Actions workflow dispatch
  - Endpoint: `https://api.github.com/repos/{owner}/{repo}/actions/workflows/publish-public.yml/dispatches`
  - Method: POST
  - Auth: Bearer token (`GITHUB_PUBLISH_TOKEN`)
  - Payload: `{ ref: "main", inputs: { source: "convex-auto", scheduled_for: "{timestamp}" } }`
  - Trigger: Convex scheduled function (`convex/publishAuto.ts`)
  - Debounce: 5 minutes (batches rapid content changes)
  - Retry: 5 minutes on failure

## Data Scraping (Development Only)

**Scripts (not production integrations):**
- `scripts/scrape-spirits.ts` - Scrape spirit data from Spirit Island wiki
- `scripts/scrape-aspects.ts` - Scrape aspect data from wiki
- `scripts/scrape-openings.ts` - Scrape opening guides from community sources
- `scripts/download-images.ts` - Download spirit panel images
- Uses: `cheerio` for HTML parsing, `papaparse` for CSV export

**No production data fetching:** All reference data seeded via `convex/seed.ts`, no runtime scraping.

---

*Integration audit: 2026-02-13*
