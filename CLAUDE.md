# The Dahan Codex

Spirit Island companion PWA with offline-first reference library and game tracker.
Includes text-based turn-by-turn opening guides for spirits.

## Tech Stack

- **TanStack Router** (React 19, TypeScript, file-based routing, client-side SPA)
- **Convex** (real-time backend, cloud-first)
- **Clerk** (authentication)
- **Cloudflare Pages** (deployment)
- **Workbox** (PWA service worker, manual generation)
- **Biome** (linting/formatting - never use Claude for lint work)

## Project Map

```
app/routes/          # File-based routes (TanStack Router)
app/lib/             # Shared utilities (spirit-colors.ts, utils.ts)
convex/              # Backend functions organized by domain
convex/schema.ts     # Database schema (source of truth for types)
e2e/                 # Playwright E2E tests
scripts/             # Build scripts (generate-sw.ts)
public/              # Static assets, PWA manifest
.planning/           # Project docs, roadmap, research
```

## Commands

```bash
pnpm dev              # Dev server (port 3000)
npx convex dev        # Convex dev server (run in parallel)
pnpm build            # Production build (includes SW generation)
pnpm preview          # Preview production build locally
pnpm lint:fix         # Fix lint issues with Biome
pnpm typecheck        # TypeScript check
pnpm test:e2e         # Run Playwright tests
pnpm ci               # Full CI: lint, typecheck, build, test
```

## Workflows

**Adding a new route:**

1. Create file in `app/routes/` following TanStack Router conventions
2. Run `pnpm dev` - route tree auto-generates
3. Protected routes go under `_authenticated/` directory

**Adding a Convex function:**

1. Create/edit file in `convex/` (e.g., `convex/spirits.ts`)
2. Import from `convex/_generated/api` in frontend
3. Use `useQuery`/`useMutation` from Convex React

**Running E2E tests locally:**

1. Build app: `pnpm build`
2. Run tests: `pnpm test:e2e`
3. Debug with UI: `pnpm test:e2e:ui`

**Starting a new phase (CRITICAL: Branch First!):**

GSD commands (`/gsd:plan-phase`, `/gsd:execute-phase`) commit to git automatically.
**Never run these on main** — always create a feature branch first.

1. **Create branch from main BEFORE planning:**
   ```bash
   git checkout main && git pull
   git checkout -b feat/phase-<number>-<name>
   ```
   Example: `git checkout -b feat/phase-06-user-data`

2. Plan the phase: `/gsd:plan-phase <number>`
3. Execute the phase: `/gsd:execute-phase <number>`
4. After phase complete, verify all checks pass: `pnpm ci`
5. Push and create PR: `git push -u origin <branch> && gh pr create`
6. Wait for CI to pass, then merge
7. Return to main: `git checkout main && git pull`
8. Ready for next phase

**If you accidentally commit to main:**
```bash
# Create feature branch with your commits
git checkout -b feat/phase-<N>-<name>
# Reset main to origin
git checkout main && git reset --hard origin/main
# Continue work on feature branch
git checkout feat/phase-<N>-<name>
```

## Key Patterns

- Use `useConvexAuth()` for auth state (not Clerk's `useAuth()`)
- Service worker registration is hydration-safe (checks `document.readyState`)
- Pre-commit hooks run Biome + typecheck automatically
- Convex types flow from `schema.ts` → `_generated/` → app

## Client-Only SPA Architecture

This app is a pure client-side SPA (switched from TanStack Start SSR in quick-010).

**Implications:**
- No server rendering - all code runs in browser
- Route loaders run client-side (use for prefetching, not data requirements)
- "use client" directives have no effect (Vite + React, not Next.js)
- useSyncExternalStore still needs getServerSnapshot for React 18+ concurrency

**PWA Notes:**
- Service worker manages static asset caching
- Convex data cached via TanStack Query + IndexedDB (not SW - WebSocket protocol)
- typeof window checks in PWA hooks are defensive programming, not SSR handling

## Context

See `.planning/PROJECT.md` for full requirements and constraints.
See `.planning/ROADMAP.md` for development phases and progress.
