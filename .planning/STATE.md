# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of
spirit openings **Current focus:** Phase 2.1 - Spirit Library Polish (UAT fixes)

## Current Position

Phase: 2.1 (Spirit Library Polish) - IN PROGRESS
Plan: 1 of 6 in current phase
Status: In progress
Last activity: 2026-01-25 - Completed 02.1-01-PLAN.md (Schema and Seed Data Update)

Progress: [█████████░] ~52%

## Performance Metrics

**Velocity:**

- Total plans completed: 15
- Average duration: 7.3 min
- Total execution time: 1.75 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 7     | 20 min | 2.9 min  |
| 02.1  | 1     | 4 min  | 4.0 min  |

**Recent Trend:**

- Last 5 plans: 2 min, 2 min, 2 min, 4 min, 4 min
- Trend: Stable (fast execution)

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Recent decisions
affecting current work:

- Used Vite 7 directly instead of vinxi (TanStack Start 1.140.5 compatibility)
- Dev server runs on port 5173 (Vite default)
- Server entry exports { fetch } object for TanStack Start SSR
- @cloudflare/vite-plugin handles SSR preset automatically (no manual
  cloudflare-module config)
- Build output: dist/server/ (worker), dist/client/ (static assets)
- Preview/deploy scripts reference generated dist/server/wrangler.json
- Convex cloud project: REDACTED_CONVEX_DEPLOYMENT.convex.cloud
- VITE_CONVEX_URL in .env.local (gitignored)
- Convex queries imported via api from convex/\_generated/api
- Used pathless \_authenticated layout instead of (authenticated) route group
  (TanStack Router constraint)
- Use useConvexAuth() hook for auth state sync instead of Clerk's useAuth()
- Admin role via Clerk JWT custom claim: user.public_metadata.isAdmin
- ClerkProvider > ConvexProviderWithClerk > QueryClientProvider hierarchy
- Manual Workbox generation via scripts/generate-sw.ts (vite-plugin-pwa
  incompatible with Vite 7)
- skipWaiting: false for service worker updates (prevents broken state during
  user sessions)
- Service worker registration in root layout useEffect
- Check document.readyState before adding load listeners (hydration-safe pattern)
- Playwright with Chromium-only for smoke tests (faster CI)
- Deploy job gated on CI success and main branch push
- Tailwind v4 CSS-first configuration (no tailwind.config.js)
- Dark mode by default for Spirit Island aesthetic
- oklch color space for theme colors
- UI components as knip entry points for library pattern
- Zod for URL search param validation in TanStack Router
- View transition names: spirit-image-{slug} and spirit-name-{slug}
- Aspect URLs: /spirits/{base-slug}?aspect={aspect-name}
- Filter bottom sheet: Drawer with pending state + Apply button
- URL search params for filter state (shareable filtered views)
- SSR-safe Convex queries: useQuery with "skip" param when isClient is false
- aria-label on icon-only buttons for accessibility and E2E testing
- Aspects inherit base complexity (Low) - complexityModifier is display-only
- reseedSpirits mutation for refreshing database data

### Pending Todos

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Add knip and dependabot for git workflows | 2026-01-25 | 04652f7 | [001-add-knip-and-dependabot-for-git-workflow](./quick/001-add-knip-and-dependabot-for-git-workflow/) |
| 002 | Fix deprecated afterSignOutUrl property | 2026-01-25 | e1c7a8c | [002-fix-deprecated-aftersignouturl-property-](./quick/002-fix-deprecated-aftersignouturl-property-/) |
| 003 | Wire Clerk routing env vars | 2026-01-25 | b00528b | [003-wire-clerk-routing-env-vars](./quick/003-wire-clerk-routing-env-vars/) |
| 004 | Improve deployment workflow | 2026-01-25 | 23c1c3e | [004-improve-deployment-workflow](./quick/004-improve-deployment-workflow/) |
| 005 | Fix Clerk sign-in e2e test selector | 2026-01-25 | 8a054ec | [005-fix-clerk-sign-in-e2e-test-selector](./quick/005-fix-clerk-sign-in-e2e-test-selector/) |
| 006 | Create README.md and update CLAUDE.md | 2026-01-25 | 8bf08bd | [006-create-readme-and-update-claude-md](./quick/006-create-readme-and-update-claude-md/) |

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Spirit Library Polish (URGENT) - addresses 9 UAT gaps

### Blockers/Concerns

**From Research:**

- iOS PWA testing needed (cache purging behavior)

**From Plan 01-05:**

- Placeholder icons need replacement with branded artwork (low priority)

**From Plan 01-06 (updated by quick-004):**

- GitHub configuration required for CI/CD:
  - **Secrets:** CONVEX_DEPLOY_KEY, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
  - **Variables:** VITE_CONVEX_URL, VITE_CLERK_PUBLISHABLE_KEY
- See `.planning/quick/004-improve-deployment-workflow/004-SUMMARY.md` for setup guide

**From Plan 01-04:**

- User must configure Clerk and set CLERK_JWT_ISSUER_DOMAIN in Convex dashboard

## Phase 1 Summary

Phase 1 (Foundation & Authentication) is now complete with:

- TanStack Start + Vite 7 + React 19 application
- Convex backend with health check query
- Clerk authentication with protected routes
- PWA with Workbox service worker (hydration-safe registration)
- GitHub Actions CI/CD with Cloudflare Workers deployment
- Pre-commit hooks (biome lint/format, typecheck)
- Playwright smoke tests
- UAT gaps addressed (01-07: SW registration timing fix)

## Phase 2 Summary

Phase 2 (Spirit Library) is now complete with:

- Tailwind v4 + shadcn/ui design system with Spirit Island theme
- Convex spirit schema with base spirits and aspects
- Spirit list UI with filtering (complexity, elements) and URL persistence
- Spirit detail page with view transitions
- Bottom navigation (Spirits active, future tabs disabled)
- Credits page with legal disclaimer and attribution
- 5 E2E tests covering spirit library functionality

## Phase 2 Progress

Phase 2 (Spirit Library) complete:

- [x] 02-01: Tailwind + shadcn/ui Setup (design system foundation)
- [x] 02-02: Spirit Schema and Seed Data
- [x] 02-03: Spirit List UI
- [x] 02-04: Filter and Search
- [x] 02-05: Spirit Detail & View Transitions
- [x] 02-06: Bottom Navigation & E2E Tests

## Phase 2.1 Progress

Phase 2.1 (Spirit Library Polish) in progress:

- [x] 02.1-01: Schema and Seed Data Update
- [ ] 02.1-02: Aspect Details UI
- [ ] 02.1-03: Filter Fixes
- [ ] 02.1-04: Accessibility and Polish
- [ ] 02.1-05: View Transitions
- [ ] 02.1-06: E2E Tests

## Session Continuity

Last session: 2026-01-25
Stopped at: Completed 02.1-01-PLAN.md (Schema and Seed Data Update)
Resume file: .planning/phases/02.1-spirit-library-polish/02.1-01-SUMMARY.md
