# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of
spirit openings **Current focus:** Phase 1 Complete - Ready for Phase 2

## Current Position

Phase: 2 of 7 (Spirit Library)
Plan: 2 of 5 in current phase
Status: In progress
Last activity: 2026-01-25 - Completed 02-02-PLAN.md (Spirit Schema and Seed Data)

Progress: [████████░░] ~40%

## Performance Metrics

**Velocity:**

- Total plans completed: 8
- Average duration: 10.8 min
- Total execution time: 1.43 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 1     | 5 min  | 5 min    |

**Recent Trend:**

- Last 5 plans: 7 min, 8 min, 10 min, 1 min, 5 min
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
- Aspects stored as separate spirit documents with baseSpirit reference
- listSpirits returns flat array with isAspect flag for UI grouping
- getSpiritBySlug uses optional aspect param for aspect lookup

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

## Session Continuity

Last session: 2026-01-25
Stopped at: Completed 02-02-PLAN.md (Spirit Schema and Seed Data)
Resume file: None
