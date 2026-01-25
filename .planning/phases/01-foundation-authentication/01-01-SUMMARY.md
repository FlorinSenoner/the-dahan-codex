---
phase: 01-foundation-authentication
plan: 01
subsystem: infra
tags: [tanstack-start, tanstack-router, vite, biome, lefthook, mise, typescript]

# Dependency graph
requires:
  - phase: none
    provides: Initial project setup
provides:
  - TanStack Start application scaffold with SSR
  - Development toolchain (biome, lefthook, mise)
  - TypeScript configuration with strict mode
  - Pre-commit hooks for code quality
affects: [02-database, 03-auth, all-future-phases]

# Tech tracking
tech-stack:
  added:
    - "@tanstack/react-start@1.140.5"
    - "@tanstack/react-router@1.140.5"
    - "@tanstack/react-query@5"
    - "react@19"
    - "vite@7"
    - "@biomejs/biome@1.9"
    - "lefthook@1"
  patterns:
    - "TanStack Start file-based routing"
    - "SSR with server.tsx fetch export"
    - "Biome for lint/format"
    - "Lefthook pre-commit hooks"

key-files:
  created:
    - "vite.config.ts"
    - "app/router.tsx"
    - "app/routes/__root.tsx"
    - "app/routes/index.tsx"
    - "app/client.tsx"
    - "app/server.tsx"
    - "biome.json"
    - "lefthook.yml"
    - "mise.toml"
    - "tsconfig.json"
  modified:
    - "package.json"
    - ".gitignore"

key-decisions:
  - "Used vite dev instead of vinxi - TanStack Start 1.140.5 works directly with
    Vite 7"
  - "Upgraded to Vite 7 - required peer dependency for TanStack Start 1.140.5"
  - "Server entry exports { fetch } object - required by TanStack Start plugin"
  - "StartClient takes no props - uses internal hydrateStart()"
  - "Added routeTree.gen.ts to biome ignore - auto-generated file"

patterns-established:
  - "Pattern: srcDirectory=app for TanStack Start"
  - "Pattern: app/routes for file-based routing"
  - "Pattern: __root.tsx for root layout"
  - "Pattern: server.tsx exports { fetch } for SSR"

# Metrics
duration: 45min
completed: 2026-01-25
---

# Phase 1 Plan 01: Project Scaffold Summary

**TanStack Start 1.140.5 with Vite 7, biome linting, lefthook pre-commit hooks,
and mise Node.js 22 toolchain**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-01-25T07:33:00Z
- **Completed:** 2026-01-25T08:18:00Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- TanStack Start application with SSR rendering home page
- Development toolchain with biome lint/format, lefthook pre-commit hooks
- TypeScript strict mode with bundler module resolution
- Pre-commit hooks running biome and typecheck

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize TanStack Start project with dependencies** - `5c45d21`
   (feat)
2. **Task 2: Configure development toolchain** - `20eee2e` (chore)
3. **Task 3: Create TanStack Start application scaffold** - `83727da` (feat)

## Files Created/Modified

- `package.json` - Project dependencies and scripts (vite dev/build)
- `tsconfig.json` - TypeScript strict mode, @/ path alias
- `vite.config.ts` - TanStack Start plugin with srcDirectory=app
- `mise.toml` - Node.js 22 version management
- `biome.json` - Linting and formatting rules
- `lefthook.yml` - Pre-commit hooks (biome, typecheck)
- `app/router.tsx` - Router configuration with getRouter export
- `app/routes/__root.tsx` - Root layout with HTML document structure
- `app/routes/index.tsx` - Home page component
- `app/client.tsx` - Client-side hydration entry
- `app/server.tsx` - SSR request handler with fetch export
- `.gitignore` - Build artifacts (.vinxi, .output)

## Decisions Made

1. **Used Vite 7 instead of Vite 6** - TanStack Start 1.140.5 has peer
   dependency on vite>=7.0.0. Upgraded to meet requirement.

2. **Used vite dev instead of vinxi** - Discovered that TanStack Start 1.140.5
   works directly with Vite's native environment API. Vinxi was not properly
   integrating with TanStack Start's plugin.

3. **Server exports { fetch } object** - TanStack Start's dev server plugin
   expects `serverEntry.default.fetch` to be a function. Updated server.tsx
   accordingly.

4. **StartClient takes no props** - The component uses internal `hydrateStart()`
   to get the router from virtual modules. Removed router prop.

5. **Added routeTree.gen.ts to biome ignore** - Auto-generated file with
   different code style that shouldn't be formatted.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added .claude to biome ignore**

- **Found during:** Task 2
- **Issue:** Biome was checking .claude/hooks files which have different style
- **Fix:** Added .claude to ignore list in biome.json
- **Files modified:** biome.json
- **Committed in:** 20eee2e (Task 2)

**2. [Rule 3 - Blocking] Upgraded Vite to v7**

- **Found during:** Task 3
- **Issue:** TanStack Start 1.140.5 requires vite>=7.0.0 peer dependency
- **Fix:** Changed vite from ^6 to ^7 in package.json
- **Files modified:** package.json, pnpm-lock.yaml
- **Committed in:** 83727da (Task 3)

**3. [Rule 3 - Blocking] Switched from vinxi to vite**

- **Found during:** Task 3
- **Issue:** Vinxi wasn't properly integrating with TanStack Start plugin,
  routes returned 404
- **Fix:** Changed npm scripts to use vite dev/build/preview instead of vinxi
- **Files modified:** package.json
- **Committed in:** 83727da (Task 3)

**4. [Rule 1 - Bug] Fixed server.tsx export format**

- **Found during:** Task 3
- **Issue:** Server wasn't exporting { fetch } object, causing "fetch is not a
  function" error
- **Fix:** Changed export to `export default { fetch: handler }`
- **Files modified:** app/server.tsx
- **Committed in:** 83727da (Task 3)

**5. [Rule 1 - Bug] Fixed client.tsx StartClient props**

- **Found during:** Task 3
- **Issue:** StartClient doesn't accept router prop, was causing TypeScript
  error
- **Fix:** Removed router prop from StartClient
- **Files modified:** app/client.tsx
- **Committed in:** 83727da (Task 3)

---

**Total deviations:** 5 auto-fixed (2 bugs, 3 blocking) **Impact on plan:** All
fixes were necessary for the application to work. Vite upgrade and vinxi removal
were significant changes but were required due to TanStack Start 1.140.5
compatibility.

## Issues Encountered

- **TanStack Start + Vinxi incompatibility:** Vinxi wasn't properly setting up
  Vite environments for TanStack Start. Switched to using Vite directly.
- **Server entry format:** Documentation wasn't clear on server.tsx export
  format. Discovered through error messages that it needs `{ fetch }` object.
- **Port 5173 instead of 3000:** Vite dev server defaults to 5173. This is
  different from the plan's localhost:3000 expectation but functionally
  equivalent.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next plans:**

- Project scaffold complete and verified
- Development workflow established (dev, lint, typecheck)
- Pre-commit hooks enforcing code quality

**Notes for future plans:**

- Use vite dev/build instead of vinxi
- Server port is 5173 (Vite default)
- TanStack Start version pinned to 1.140.5 for Cloudflare compatibility (per
  RESEARCH.md)

---

_Phase: 01-foundation-authentication_ _Completed: 2026-01-25_
