# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of spirit openings
**Current focus:** Phase 1 - Foundation & Authentication

## Current Position

Phase: 1 of 7 (Foundation & Authentication)
Plan: 4 of 6 in current phase
Status: In progress
Last activity: 2026-01-25 - Completed 01-04-PLAN.md (Clerk Authentication)

Progress: [████░░░░░░] ~20%

## Performance Metrics

**Velocity:**
- Total plans completed: 4
- Average duration: 16 min
- Total execution time: 1.03 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 62 min | 15.5 min |

**Recent Trend:**
- Last 5 plans: 45 min, 5 min, 5 min, 7 min
- Trend: Improving

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Used Vite 7 directly instead of vinxi (TanStack Start 1.140.5 compatibility)
- Dev server runs on port 5173 (Vite default)
- Server entry exports { fetch } object for TanStack Start SSR
- @cloudflare/vite-plugin handles SSR preset automatically (no manual cloudflare-module config)
- Build output: dist/server/ (worker), dist/client/ (static assets)
- Preview/deploy scripts reference generated dist/server/wrangler.json
- Convex cloud project: dependable-wolverine-235.convex.cloud
- VITE_CONVEX_URL in .env.local (gitignored)
- Convex queries imported via api from convex/_generated/api
- Used pathless _authenticated layout instead of (authenticated) route group (TanStack Router constraint)
- Use useConvexAuth() hook for auth state sync instead of Clerk's useAuth()
- Admin role via Clerk JWT custom claim: user.public_metadata.isAdmin
- ClerkProvider > ConvexProviderWithClerk > QueryClientProvider hierarchy

### Pending Todos

None yet.

### Blockers/Concerns

**From Research:**
- PWA service worker generation requires manual Workbox (vite-plugin-pwa incompatible)
- Cloudflare Workers needs pinned TanStack Start version (1.140.5) - CONFIRMED WORKING
- SSR auth tokens need explicit handling in route beforeLoad - IMPLEMENTED
- iOS PWA testing needed (cache purging behavior)

**From Plan 01-01:**
- Vite dev server port is 5173, not 3000 (may need to configure for consistency)

**From Plan 01-02:**
- Wrangler preview runs on port 8787 (Cloudflare default)

**From Plan 01-04:**
- User must configure Clerk and set CLERK_JWT_ISSUER_DOMAIN in Convex dashboard

## Session Continuity

Last session: 2026-01-25
Stopped at: Completed 01-04-PLAN.md
Resume file: None
