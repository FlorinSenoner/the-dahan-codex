# The Dahan Codex

Spirit Island companion PWA with offline-first reference library and graphical
opening scrubber. The scrubber lets users visualize spirit openings turn-by-turn
with interactive board state.

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
app/lib/             # Shared utilities (sw-register.ts, spirit-colors.ts)
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

## Key Patterns

- Use `useConvexAuth()` for auth state (not Clerk's `useAuth()`)
- Service worker registration is hydration-safe (checks `document.readyState`)
- Pre-commit hooks run Biome + typecheck automatically
- Convex types flow from `schema.ts` → `_generated/` → app

## Context

See `.planning/PROJECT.md` for full requirements and constraints.
See `.planning/ROADMAP.md` for development phases and progress.
