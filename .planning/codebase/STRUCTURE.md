# Codebase Structure

**Analysis Date:** 2026-02-13

## Directory Layout

```
the-dahan-codex/
├── src/
│   ├── routes/               # TanStack Router file-based routes
│   ├── components/           # React components (domain + UI)
│   ├── hooks/                # Custom React hooks
│   ├── contexts/             # React contexts (theme, edit mode)
│   ├── lib/                  # Utilities (sync, CSV, offline, colors)
│   ├── styles/               # Global CSS
│   ├── main.tsx              # Client entry point
│   ├── router.tsx            # Router factory + cache setup
│   ├── sw.ts                 # Service worker (Workbox)
│   └── routeTree.gen.ts      # Auto-generated route tree
├── convex/
│   ├── _generated/           # Convex codegen (types, API)
│   ├── lib/                  # Convex utilities (auth, validators)
│   ├── seedData/             # Seed data for spirits/openings
│   ├── schema.ts             # Database schema (source of truth)
│   ├── games.ts              # Game CRUD mutations/queries
│   ├── spirits.ts            # Spirit queries
│   ├── openings.ts           # Opening guides CRUD
│   └── seed.ts               # Seed script
├── e2e/                      # Playwright E2E tests
├── scripts/                  # Data scraping scripts
├── public/                   # Static assets (images, icons, manifest)
├── .planning/                # Project docs, roadmap, research
├── .claude/                  # Claude Code config, GSD workflows
├── vite.config.ts            # Vite build config + PWA plugin
├── package.json              # Dependencies + scripts
└── index.html                # App entry HTML
```

## Directory Purposes

**`src/routes/`:**
- Purpose: TanStack Router file-based routes (pages)
- Contains: Route components (`.tsx`), route tree auto-generates
- Key files: `__root.tsx` (root layout), `index.tsx` (home), `spirits.$slug.tsx` (spirit detail)

**`src/components/`:**
- Purpose: Reusable React components
- Contains: Domain-specific components (`spirits/`, `games/`, `admin/`), UI primitives (`ui/`), PWA components (`pwa/`), layout (`layout/`)
- Key subdirectories:
  - `spirits/`: Spirit-specific UI (list, row, filters, opening section, variant tabs)
  - `games/`: Game form, game row, CSV import, pickers (adversary, scenario, spirit)
  - `admin/`: Edit mode UI (edit FAB, editable text, editable opening)
  - `ui/`: shadcn components (button, badge, input, dialog, etc.)
  - `pwa/`: PWA UI (install prompt, offline indicator, update banner)
  - `layout/`: Bottom navigation

**`src/hooks/`:**
- Purpose: Custom React hooks for data, state, and side effects
- Contains: Data hooks (`use-offline-games`), sync hooks (`use-background-sync`, `use-outbox-sync`), PWA hooks (`use-service-worker`, `use-install-prompt`), utility hooks (`use-online-status`, `use-page-meta`, `use-structured-data`)
- Key files:
  - `use-background-sync.ts`: Auto-sync spirits/openings/games for offline use
  - `use-outbox-sync.ts`: Flush offline writes when online
  - `use-page-meta.ts`: Dynamic meta tags for SEO
  - `use-service-worker.ts`: Service worker lifecycle management

**`src/contexts/`:**
- Purpose: React contexts for global state
- Contains: `edit-mode-context.tsx` (admin edit mode toggle), `theme-context.tsx` (dark mode)

**`src/lib/`:**
- Purpose: Shared utilities and business logic
- Contains: Sync orchestration (`sync.ts`), CSV import/export (`csv-import.ts`, `csv-export.ts`), offline games outbox (`offline-games.ts`), spirit colors (`spirit-colors.ts`), URL slugs (`slug.ts`)
- Key files:
  - `sync.ts`: Batched prefetching for spirits/openings/games
  - `offline-games.ts`: IndexedDB outbox for pending games + offline operations
  - `csv-import.ts`: CSV parsing and game import logic
  - `spirit-colors.ts`: Element/complexity badge color mappings

**`convex/`:**
- Purpose: Backend functions and database schema
- Contains: Domain functions (`games.ts`, `spirits.ts`, `openings.ts`), schema (`schema.ts`), utilities (`lib/`), seed data (`seedData/`)
- Key files:
  - `schema.ts`: Convex database schema (source of truth for types)
  - `games.ts`: Game CRUD mutations with validation
  - `spirits.ts`: Spirit queries (by slug, with aspects, list)
  - `openings.ts`: Opening guide CRUD
  - `lib/auth.ts`: Auth helpers (`requireAuth`, `requireAdmin`)
  - `lib/validators.ts`: Reusable input validators

**`e2e/`:**
- Purpose: Playwright end-to-end tests
- Contains: Test specs (`*.spec.ts`), test utilities, fixtures
- Key files: `smoke.spec.ts`, `spirits.spec.ts`, `games.spec.ts`, `pwa.spec.ts`

**`scripts/`:**
- Purpose: Data scraping and migration scripts
- Contains: Spirit data scraping, CSV utilities, data transformation

**`public/`:**
- Purpose: Static assets served at root
- Contains: Spirit images (`spirits/`), card images (`cards/`), PWA icons (`icons/`)

**`.planning/`:**
- Purpose: Project documentation and planning
- Contains: `PROJECT.md`, `ROADMAP.md`, phase plans, research notes

**`.claude/`:**
- Purpose: Claude Code configuration
- Contains: GSD workflows, custom commands, skills

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Client entry (router init, React render)
- `src/router.tsx`: Router factory (Convex + TanStack Query setup, cache restore)
- `src/routes/__root.tsx`: Root layout (providers, global sync, PWA UI)
- `src/sw.ts`: Service worker (Workbox precaching, offline fallback)

**Configuration:**
- `vite.config.ts`: Vite build config, vite-plugin-pwa setup
- `convex/schema.ts`: Database schema
- `convex/auth.config.ts`: Clerk JWT integration
- `package.json`: Dependencies, scripts
- `biome.json`: Linter/formatter config
- `tsconfig.json`: TypeScript config
- `playwright.config.ts`: E2E test config

**Core Logic:**
- `src/lib/sync.ts`: Background sync orchestration
- `src/lib/offline-games.ts`: Offline write outbox
- `src/hooks/use-background-sync.ts`: Auto-sync hook
- `src/hooks/use-outbox-sync.ts`: Outbox flush hook
- `convex/games.ts`: Game CRUD backend
- `convex/lib/auth.ts`: Backend auth helpers

**Testing:**
- `e2e/*.spec.ts`: E2E test specs
- Playwright config: `playwright.config.ts`

## Naming Conventions

**Files:**
- Routes: `kebab-case.tsx` or `$param.tsx` (TanStack Router convention)
- Components: `kebab-case.tsx` (e.g., `spirit-row.tsx`, `game-form.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-background-sync.ts`)
- Utils: `kebab-case.ts` (e.g., `spirit-colors.ts`, `csv-import.ts`)
- Convex functions: `camelCase.ts` (e.g., `games.ts`, `spirits.ts`)

**Directories:**
- All directories: `kebab-case` (e.g., `src/routes/`, `convex/lib/`)

**Components:**
- React components: `PascalCase` (e.g., `SpiritRow`, `GameForm`)
- Exported component matches filename (e.g., `spirit-row.tsx` exports `SpiritRow`)

**Functions:**
- React hooks: `useCamelCase` (e.g., `useBackgroundSync`, `useOutboxSync`)
- Convex queries: `camelCase` (e.g., `listGames`, `getSpiritBySlug`)
- Convex mutations: `camelCase` (e.g., `createGame`, `updateGame`)
- Utility functions: `camelCase` (e.g., `syncGames`, `savePendingGame`)

**Types:**
- Interfaces: `PascalCase` (e.g., `RouterContext`, `GameFormData`)
- Type aliases: `PascalCase` (e.g., `SpiritEntry`, `OfflineOperation`)

## Where to Add New Code

**New Route:**
- Primary code: `src/routes/<route-name>.tsx` (TanStack Router auto-detects)
- Protected routes: `src/routes/_authenticated/<route-name>.tsx` (requires auth)
- Nested routes: `src/routes/<parent>/<child>.tsx`
- Run `pnpm dev` to auto-generate route tree

**New Component:**
- Domain component (spirits): `src/components/spirits/<component-name>.tsx`
- Domain component (games): `src/components/games/<component-name>.tsx`
- UI primitive: `src/components/ui/<component-name>.tsx` (shadcn pattern)
- Layout component: `src/components/layout/<component-name>.tsx`
- PWA component: `src/components/pwa/<component-name>.tsx`

**New Hook:**
- Implementation: `src/hooks/use-<hook-name>.ts`
- Export: Add to `src/hooks/index.ts` for cleaner imports

**New Convex Function:**
- Implementation: `convex/<domain>.ts` (e.g., `convex/spirits.ts`)
- Query: Export as `export const queryName = query({ ... })`
- Mutation: Export as `export const mutationName = mutation({ ... })`
- Import in frontend: `import { api } from 'convex/_generated/api'`, use `api.<domain>.<functionName>`

**New Utility:**
- Shared helpers: `src/lib/<util-name>.ts`
- Convex helpers: `convex/lib/<util-name>.ts`

**New E2E Test:**
- Test spec: `e2e/<feature>.spec.ts`
- Test utilities: `e2e/utils/` (if reusable)

## Special Directories

**`convex/_generated/`:**
- Purpose: Convex auto-generated types and API
- Generated: Yes (via `npx convex dev` or `npx convex codegen`)
- Committed: Yes (ensures type safety without running Convex)

**`src/routeTree.gen.ts`:**
- Purpose: TanStack Router auto-generated route tree
- Generated: Yes (via TanStack Router plugin during `pnpm dev` or `pnpm build`)
- Committed: Yes (avoids build-time codegen in CI)

**`dist/`:**
- Purpose: Production build output
- Generated: Yes (via `pnpm build`)
- Committed: No

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via `pnpm install`)
- Committed: No

**`.tanstack/`:**
- Purpose: TanStack Router cache
- Generated: Yes (development-time cache)
- Committed: No

**`public/spirits/`:**
- Purpose: Spirit panel images (large PNGs)
- Generated: No (manually added or scraped)
- Committed: Yes (but excluded from service worker precaching via `globIgnores`)

**`test-results/` and `playwright-report/`:**
- Purpose: Playwright test output
- Generated: Yes (via `pnpm test:e2e`)
- Committed: No

---

*Structure analysis: 2026-02-13*
