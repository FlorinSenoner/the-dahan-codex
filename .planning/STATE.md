# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of
spirit openings **Current focus:** Phase 1 Complete - Ready for Phase 2

## Current Position

Phase: 1 of 7 (Foundation & Authentication) - COMPLETE Plan: 6 of 6 in current
phase Status: Phase 1 complete Last activity: 2026-01-25 - Completed quick task 002: fix deprecated afterSignOutUrl property

Progress: [██████░░░░] ~29%

## Performance Metrics

**Velocity:**

- Total plans completed: 6
- Average duration: 13.3 min
- Total execution time: 1.33 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 6     | 80 min | 13.3 min |

**Recent Trend:**

- Last 5 plans: 5 min, 5 min, 7 min, 8 min, 10 min
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
- Playwright with Chromium-only for smoke tests (faster CI)
- Deploy job gated on CI success and main branch push

### Pending Todos

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Add knip and dependabot for git workflows | 2026-01-25 | 04652f7 | [001-add-knip-and-dependabot-for-git-workflow](./quick/001-add-knip-and-dependabot-for-git-workflow/) |
| 002 | Fix deprecated afterSignOutUrl property | 2026-01-25 | e1c7a8c | [002-fix-deprecated-aftersignouturl-property-](./quick/002-fix-deprecated-aftersignouturl-property-/) |

### Blockers/Concerns

**From Research:**

- iOS PWA testing needed (cache purging behavior)

**From Plan 01-05:**

- Placeholder icons need replacement with branded artwork (low priority)

**From Plan 01-06:**

- GitHub Secrets must be configured for CI to pass (VITE_CONVEX_URL,
  VITE_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID)

**From Plan 01-04:**

- User must configure Clerk and set CLERK_JWT_ISSUER_DOMAIN in Convex dashboard

## Phase 1 Summary

Phase 1 (Foundation & Authentication) is now complete with:

- TanStack Start + Vite 7 + React 19 application
- Convex backend with health check query
- Clerk authentication with protected routes
- PWA with Workbox service worker
- GitHub Actions CI/CD with Cloudflare Workers deployment
- Pre-commit hooks (biome lint/format, typecheck)
- Playwright smoke tests

## Session Continuity

Last session: 2026-01-25 Stopped at: Completed quick task 002: fix deprecated afterSignOutUrl property
Resume file: None
