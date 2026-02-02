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

**Completing a phase (MANDATORY - Never skip!):**

After `/gsd:execute-phase` or `/gsd:verify-work` completes, you MUST:

1. Push branch: `git push -u origin <branch>`
2. Create PR: `gh pr create --title "Phase X: Name" --body "..."`
3. Wait for CI: `gh pr checks <number> --watch`
4. **Ask user to verify changes work** - CI passing is not enough. Ask the user to test the affected functionality before merging. NEVER merge without user approval.
5. Merge PR (after user approval): `gh pr merge <number> --squash --delete-branch`
6. Verify on main: `git status` should show "On branch main" and "working tree clean"
7. Ready for next phase

**Do NOT stop after verify-work passes.** The phase is not complete until the PR is merged and you're back on main.

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
- Always use shadcn `Button` component instead of raw `<button>` elements
  - `Button variant="ghost" size="icon"` for icon-only buttons
  - `Button variant="ghost" size="sm"` for text links/actions
  - `Button variant="outline"` for secondary actions with borders

## Mobile-First with Desktop Support

This is a **mobile-first PWA** designed for use at game tables, but it must also work well on desktop browsers.

**Interactive elements MUST have:**
- `cursor-pointer` for hover cursor feedback on desktop
- Proper hover states (color changes, opacity, etc.)
- Minimum 44px touch targets for mobile accessibility

**Button component:** `cursor-pointer` is built into the shadcn Button component base styles. No need to add it manually.

**Non-Button interactive elements** (divs, Links, custom triggers) need `cursor-pointer` added:
```tsx
// Button - cursor-pointer is automatic
<Button>Click me</Button>

// Non-Button clickable elements - add cursor-pointer manually
<div onClick={handleClick} className="cursor-pointer">Clickable div</div>
<CollapsibleTrigger className="cursor-pointer">Toggle</CollapsibleTrigger>
<Label htmlFor="checkbox" className="cursor-pointer">Click to toggle</Label>
```

**Why this matters:** Desktop users expect the cursor to change to a pointer when hovering over clickable elements. Without this, the UI feels unresponsive and broken.

## Offline-First (CRITICAL)

This is an **offline-first app**. For every new feature, you MUST:

1. **Consider offline behavior during planning** - How does this feature work without internet?
2. **Define the offline strategy** - Does it use cached data? Degrade gracefully? Queue actions?
3. **Handle reconnection** - What happens when connectivity returns? Sync conflicts?

**Common patterns:**
- Static reference data (spirits, cards) → cached via service worker, always available
- User data (game history) → optimistic updates with Convex, queued when offline
- Auth-gated features → show cached data or appropriate offline state

**Never forget:** Users will use this app at game tables without reliable internet.



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
