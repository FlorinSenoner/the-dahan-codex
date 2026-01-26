---
phase: quick
plan: 010
subsystem: infra
tags: [vite, tanstack-router, cloudflare-pages, spa]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: TanStack Start SSR setup, Cloudflare Workers deployment
provides:
  - Client-only SPA architecture
  - Cloudflare Pages deployment config
  - Simplified routing (no SSR hydration)
affects: [deployment, ci-cd]

# Tech tracking
tech-stack:
  added: [@tanstack/router-plugin]
  removed: [@tanstack/react-start, @clerk/tanstack-react-start, @cloudflare/vite-plugin, wrangler]
  patterns: [useSuspenseQuery with loader preloading, client-side routing]

key-files:
  created:
    - index.html
    - public/_redirects
  modified:
    - vite.config.ts
    - app/client.tsx
    - app/router.tsx
    - app/routes/__root.tsx
    - package.json
    - .github/workflows/deploy.yml
    - .github/workflows/ci.yml
  deleted:
    - app/start.ts
    - app/server.tsx
    - app/lib/convex.ts
    - wrangler.jsonc

key-decisions:
  - "Switch from TanStack Start SSR to pure client SPA"
  - "Deploy to Cloudflare Pages instead of Workers"
  - "Use useSuspenseQuery with loader preloading for data fetching"

patterns-established:
  - "Route loaders use convexQuery for preloading"
  - "SPA catch-all via _redirects file"

# Metrics
duration: 7min
completed: 2026-01-26
---

# Quick Task 010: Switch to Client-Only SPA Summary

**Pure client-side SPA with Cloudflare Pages deployment, removing SSR complexity and Clerk/Convex hydration issues**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-26T09:53:25Z
- **Completed:** 2026-01-26T10:00:36Z
- **Tasks:** 3
- **Files modified:** 17

## Accomplishments

- Converted from TanStack Start SSR to pure client-side SPA
- Simplified data fetching with useSuspenseQuery and loader preloading
- Updated CI/CD for Cloudflare Pages deployment
- Removed 58 npm packages (SSR-related dependencies)

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert to Pure Client SPA** - `eaf96f5` (feat)
2. **Task 2: Update CI/CD for Cloudflare Pages** - `0fad170` (chore)
3. **Task 3: Final Verification and Cleanup** - `32bf3ed` (chore)

## Files Created/Modified

**Created:**
- `index.html` - SPA entry point for Vite
- `public/_redirects` - Cloudflare Pages SPA catch-all routing

**Modified:**
- `vite.config.ts` - Removed cloudflare/tanstackStart plugins, added TanStackRouterVite
- `app/client.tsx` - Changed from hydrateRoot to createRoot
- `app/router.tsx` - Removed routerWithQueryClient wrapper
- `app/routes/__root.tsx` - Removed server auth fetching, simplified structure
- `app/routes/spirits.index.tsx` - Added loader with useSuspenseQuery
- `app/routes/spirits.$slug.tsx` - Added loader with useSuspenseQuery
- `app/components/spirits/spirit-list.tsx` - Simplified to receive spirits as prop
- `package.json` - Removed SSR deps, added @tanstack/router-plugin
- `.github/workflows/deploy.yml` - Changed to cloudflare/pages-action@v1
- `.github/workflows/ci.yml` - Updated sw.js path check
- `scripts/generate-sw.ts` - Changed output dir from dist/client to dist
- `knip.json` - Removed app/server.tsx entry point
- `CLAUDE.md` - Updated tech stack documentation

**Deleted:**
- `app/start.ts` - SSR server entry point
- `app/server.tsx` - SSR request handler
- `app/lib/convex.ts` - SSR Convex helper (already deleted)
- `wrangler.jsonc` - Workers config (no longer needed)

## Decisions Made

- **Client-only rendering:** Removes SSR hydration complexity, simpler mental model
- **useSuspenseQuery with loader:** Preloads data before rendering, no loading skeletons needed
- **Cloudflare Pages:** Simpler deployment than Workers for static SPA, automatic preview URLs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Deleted app/server.tsx**
- **Found during:** Task 1 (Convert to Pure Client SPA)
- **Issue:** TypeScript error referencing @tanstack/react-start/server
- **Fix:** Deleted the SSR server handler file
- **Files modified:** app/server.tsx (deleted)
- **Verification:** pnpm typecheck passes
- **Committed in:** eaf96f5 (Task 1 commit)

**2. [Rule 1 - Bug] Updated spirit routes for client-side data fetching**
- **Found during:** Task 1 (Convert to Pure Client SPA)
- **Issue:** Routes used isClient state hack for SSR workaround
- **Fix:** Migrated to useSuspenseQuery with loader preloading
- **Files modified:** app/routes/spirits.index.tsx, app/routes/spirits.$slug.tsx, app/components/spirits/spirit-list.tsx
- **Verification:** E2E tests pass, spirits load correctly
- **Committed in:** eaf96f5 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct operation. No scope creep.

## Issues Encountered

- Port conflicts during E2E tests from lingering vite processes - resolved by killing processes
- routeTree.gen.ts keeps SSR module declarations but has @ts-nocheck so it doesn't affect builds

## User Setup Required

**Cloudflare Pages project needs to be created:**
1. Create project "the-dahan-codex" in Cloudflare Pages dashboard
2. Connect to GitHub repository
3. Set build command: `pnpm build`
4. Set output directory: `dist`

Existing GitHub secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID) should work with Pages.

## Next Phase Readiness

- App runs as pure client-side SPA
- All E2E tests pass
- Ready for Phase 3 (Spirit Detail & Board)
- Deployment pipeline updated for Cloudflare Pages

---
*Quick Task: 010*
*Completed: 2026-01-26*
