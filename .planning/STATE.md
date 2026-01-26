# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of
spirit openings **Current focus:** Phase 3 - Spirit Detail & Board

## Current Position

Phase: 2.1 (Spirit Library Polish) - COMPLETE
Plan: 6 of 6 in current phase
Status: Phase verified and complete
Last activity: 2026-01-26 - Completed quick task 012: Fix Cloudflare CI auth error

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 20
- Average duration: 6.8 min
- Total execution time: 2.3 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 7     | 20 min | 2.9 min  |
| 02.1  | 6     | 28 min | 4.7 min  |

**Recent Trend:**

- Last 5 plans: 16 min, 1 min, 3 min, 3 min, 1 min
- Trend: Stable (fast execution)

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Recent decisions
affecting current work:

- Switched from TanStack Start SSR to pure client SPA (quick-010)
- Dev server runs on port 3000
- Build output: dist/ (static SPA)
- Deploy to Cloudflare Pages (not Workers)
- Use useSuspenseQuery with loader preloading for data fetching
- Convex cloud project: dependable-wolverine-235.convex.cloud
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
- View transition names: spirit-image-{slug} and spirit-name-{slug} for base spirits
- Aspect view transition names: spirit-image-{slug}-{aspect} and spirit-name-{slug}-{aspect}
- Aspect URLs: /spirits/{base-slug}/{aspect-name} (path-based, not query params)
- Filter bottom sheet: Drawer with pending state + Apply button
- URL search params for filter state (shareable filtered views)
- Client-side Convex queries: useSuspenseQuery with loader preloading
- aria-label on icon-only buttons for accessibility and E2E testing
- Aspects inherit base complexity (Low) - complexityModifier is display-only
- reseedSpirits mutation for refreshing database data
- Downloaded images as PNG from wiki instead of converting to WebP
- Spirit images stored locally in public/spirits/
- Aspect title display: aspect name as h1, "Aspect of [Base]" as subtitle
- Element colors match Spirit Island wiki icons (Air=violet, Fire=orange, Earth=grey)
- Complexity uses independent grayscale scheme (light=easy, dark=hard)
- Modifier colors (easier/harder) use complexity colors for visual consistency
- Typography components: Heading (h1-h4 variants), Text (body/muted/small variants)
- Spirit colors centralized in app/lib/spirit-colors.ts (badge colors, filter colors, PLACEHOLDER_GRADIENT)
- Cloudflare Pages deployment via wrangler-action@v3 (pages-action@v1 deprecated)

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
| 007 | Add typography and reusable UI components | 2026-01-26 | 187fc2a | [007-add-typography-and-reusable-ui-component](./quick/007-add-typography-and-reusable-ui-component/) |
| 009 | Rework element and complexity colors | 2026-01-26 | 8843491 | [009-rework-element-and-complexity-colors](./quick/009-rework-element-and-complexity-colors/) |
| 010 | Switch to client-only SPA | 2026-01-26 | 32bf3ed | [010-switch-to-client-only-spa](./quick/010-switch-to-client-only-spa/) |
| 011 | Fix view transitions and aspect URLs | 2026-01-26 | 5a25c3e | [011-fix-view-transitions-and-aspect-urls](./quick/011-fix-view-transitions-and-aspect-urls/) |
| 012 | Fix Cloudflare CI auth error | 2026-01-26 | 8b3f308 | [012-fix-cloudflare-ci-auth-error](./quick/012-fix-cloudflare-ci-auth-error/) |

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

- TanStack Router + Vite 7 + React 19 client-side SPA
- Convex backend with health check query
- Clerk authentication with protected routes
- PWA with Workbox service worker (hydration-safe registration)
- GitHub Actions CI/CD with Cloudflare Pages deployment
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

## Phase 2.1 Summary

Phase 2.1 (Spirit Library Polish) is now complete with:

- complexityModifier and description fields added to spirit schema
- Immense aspect added for Lightning's Swift Strike (all 7 aspects now have modifiers)
- Spirit images scraped from wiki and stored locally (River, Lightning)
- 44px touch targets and cursor-pointer on all interactive elements
- View transition CSS fixed with correct ::view-transition-group(*) syntax
- Aspect title display cleaned up (aspect name as h1, "Aspect of [Base]" subtitle)
- Description field displayed on spirit detail pages

## Phase 2.1 Progress

Phase 2.1 (Spirit Library Polish) complete:

- [x] 02.1-01: Schema and Seed Data Update
- [x] 02.1-02: Spirit Images
- [x] 02.1-03: Filter Fixes
- [x] 02.1-04: Accessibility and Polish
- [x] 02.1-05: View Transitions
- [x] 02.1-06: Aspect Title & Description

## Session Continuity

Last session: 2026-01-26
Stopped at: Quick task 011 complete, ready for Phase 3
Resume file: None
