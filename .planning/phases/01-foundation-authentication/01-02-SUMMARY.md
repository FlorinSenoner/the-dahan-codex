---
phase: 01-foundation-authentication
plan: 02
subsystem: infra
tags: [cloudflare-workers, wrangler, vite, deployment]

# Dependency graph
requires:
  - phase: 01-01
    provides: TanStack Start application scaffold with Vite 7
provides:
  - Cloudflare Workers deployment configuration
  - Local Workers preview via wrangler dev
  - Production deployment script via wrangler deploy
affects: [01-06-cicd, deployment, production]

# Tech tracking
tech-stack:
  added: [@cloudflare/vite-plugin, wrangler]
  patterns: [cloudflare-module SSR preset]

key-files:
  created: [wrangler.jsonc]
  modified: [vite.config.ts, package.json, .gitignore]

key-decisions:
  - "Used @cloudflare/vite-plugin for automatic SSR environment configuration"
  - "Build outputs to dist/server (worker) and dist/client (static assets)"
  - "Wrangler config generated at build time in dist/server/wrangler.json"

patterns-established:
  - "Build then preview: pnpm build && pnpm preview"
  - "Deploy workflow: pnpm deploy (build + wrangler deploy)"

# Metrics
duration: 5min
completed: 2026-01-25
---

# Phase 01 Plan 02: Cloudflare Workers Deployment Summary

**Cloudflare Workers deployment configured with @cloudflare/vite-plugin, wrangler dev preview on localhost:8787**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-25T07:54:35Z
- **Completed:** 2026-01-25T07:59:30Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Cloudflare Workers dependencies installed (@cloudflare/vite-plugin, wrangler)
- TanStack Start configured with cloudflare-module SSR preset
- Local preview via wrangler dev serves application on port 8787
- Deploy script ready for production deployment (requires auth tokens)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Cloudflare deployment dependencies** - `e66d732` (chore)
2. **Task 2: Configure TanStack Start for Cloudflare Workers** - `a060243` (feat)
3. **Task 3: Add deployment scripts and verify local preview** - `3ad184c` (feat)

## Files Created/Modified
- `wrangler.jsonc` - Cloudflare Workers configuration (name, compatibility, main entry)
- `vite.config.ts` - Added @cloudflare/vite-plugin with ssr environment
- `package.json` - Added preview and deploy scripts, new devDependencies
- `.gitignore` - Added .wrangler/ directory

## Decisions Made
- **@cloudflare/vite-plugin handles SSR preset:** The Cloudflare Vite plugin automatically configures cloudflare-module preset, no manual server preset needed in TanStack config
- **Build output structure:** dist/server/index.js (worker entry), dist/client/ (static assets) - different from plan's expected .output/ path
- **Generated wrangler.json:** Build produces dist/server/wrangler.json with all config, preview/deploy scripts reference this generated config

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript error with server preset config**
- **Found during:** Task 2 (Configure TanStack Start)
- **Issue:** Plan specified `server: { preset: "cloudflare-module" }` in TanStack config, but this property doesn't exist in the type
- **Fix:** Removed preset config; @cloudflare/vite-plugin handles this automatically via viteEnvironment
- **Files modified:** vite.config.ts
- **Verification:** TypeScript compiles, build succeeds
- **Committed in:** a060243 (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed build output path mismatch**
- **Found during:** Task 2 (Configure TanStack Start)
- **Issue:** Plan expected .output/server/index.mjs but actual output is dist/server/index.js
- **Fix:** Updated wrangler.jsonc to use `@tanstack/react-start/server-entry` as main, which the plugin resolves correctly
- **Files modified:** wrangler.jsonc
- **Verification:** Build produces proper worker entry at dist/server/index.js
- **Committed in:** a060243 (Task 2 commit)

**3. [Rule 3 - Blocking] Fixed wrangler dev 404 errors**
- **Found during:** Task 3 (Verify local preview)
- **Issue:** wrangler dev was returning 404 for all routes
- **Fix:** Updated preview/deploy scripts to use --config dist/server/wrangler.json (generated config)
- **Files modified:** package.json
- **Verification:** curl http://localhost:8787 returns full HTML page
- **Committed in:** 3ad184c (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All fixes were necessary to make the build and preview work. The plan's configuration was based on older documentation; current @cloudflare/vite-plugin handles configuration differently.

## Issues Encountered
- Initial build failed because wrangler.jsonc specified .output/server/index.mjs which doesn't exist at build time - resolved by using @tanstack/react-start/server-entry virtual import
- Wrangler dev was generating wrangler.json in dist/client/ instead of dist/server/ initially - resolved with proper main entry configuration

## User Setup Required

None - no external service configuration required for local development.

Note: Production deployment to Cloudflare will require:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

These will be configured in the CI/CD plan (01-06).

## Next Phase Readiness
- Build and preview infrastructure complete
- Ready for Convex + Clerk integration (01-03, 01-04)
- PWA manifest and service worker can be added (01-05)
- CI/CD can use `pnpm deploy` command (01-06)

---
*Phase: 01-foundation-authentication*
*Completed: 2026-01-25*
