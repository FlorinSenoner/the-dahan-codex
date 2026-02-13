# Architecture

**Analysis Date:** 2026-02-13

## Pattern Overview

**Overall:** Offline-first client-side SPA with real-time backend sync

**Key Characteristics:**
- Pure client-side rendering (TanStack Router SPA, no SSR)
- Real-time backend via Convex WebSocket with optimistic updates
- Offline-first caching via TanStack Query + IndexedDB persistence
- Service worker handles static assets, not data (Convex uses WebSocket)
- Outbox pattern for offline writes (pending games + operations queue)

## Layers

**Presentation Layer (React Components):**
- Purpose: UI rendering and user interaction
- Location: `src/routes/` (page-level) and `src/components/` (reusable)
- Contains: Route components, domain-specific components (spirits, games), UI primitives (shadcn)
- Depends on: Hooks layer, contexts, Convex queries/mutations
- Used by: Router (entry point)

**Data Access Layer (Convex Functions):**
- Purpose: Server-side business logic, database operations, authentication
- Location: `convex/` (functions organized by domain)
- Contains: Queries, mutations, validators, auth helpers
- Depends on: Convex schema (`convex/schema.ts`), auth configuration
- Used by: Presentation layer via React hooks (`useQuery`, `useMutation`)

**State Management Layer (Hooks + Contexts):**
- Purpose: Client-side state, side effects, and cross-cutting concerns
- Location: `src/hooks/` and `src/contexts/`
- Contains: Custom hooks for data fetching, offline sync, PWA features, React contexts for global state
- Depends on: Data access layer (Convex), browser APIs (IndexedDB, service worker)
- Used by: Presentation layer

**Caching & Persistence Layer (IndexedDB + TanStack Query):**
- Purpose: Offline data availability and optimistic updates
- Location: `src/router.tsx` (cache setup), `src/lib/offline-games.ts` (outbox), `src/lib/sync.ts` (sync orchestration)
- Contains: Query cache persistence, pending operations outbox, cache hydration/dehydration
- Depends on: TanStack Query, idb-keyval library
- Used by: Router initialization, background sync hooks

**Service Worker Layer (Static Asset Caching):**
- Purpose: Offline availability for static resources (JS, CSS, images, fonts)
- Location: `src/sw.ts`
- Contains: Workbox precaching, navigation fallback (app-shell.html), font/image caching strategies
- Depends on: Workbox, vite-plugin-pwa build output
- Used by: Browser runtime (independent of React)

## Data Flow

**Initial App Load (Online):**

1. Browser loads `index.html`, executes `src/main.tsx`
2. `createRouter()` initializes Convex client and TanStack Query client
3. Router restores cached queries from IndexedDB (hydration) before first render
4. React renders, routes prefetch data via loaders (non-blocking)
5. Background sync hooks (`useBackgroundSync`) eagerly fetch fresh spirits/openings/games
6. Fresh data persists to IndexedDB automatically via persistQueryClient

**Initial App Load (Offline):**

1. Service worker intercepts navigation, serves `app-shell.html` if offline
2. Router restores cached queries from IndexedDB (app works with stale data)
3. React renders using cached data
4. Convex WebSocket fails silently, no network errors shown
5. Offline indicator appears in UI (`useOnlineStatus` hook)

**User Creates Game (Online):**

1. User submits form → `createGame` mutation via Convex
2. TanStack Query invalidates `listGames` query automatically
3. Games list re-fetches, shows new game immediately
4. Query cache persists to IndexedDB

**User Creates Game (Offline):**

1. User submits form → `savePendingGame()` writes to IndexedDB outbox
2. Toast confirms "Game saved offline. Will sync when you reconnect."
3. Navigate to `/games`, shows pending game from IndexedDB
4. When online, `useOutboxSync` detects pending games and flushes to Convex
5. Toast confirms "Synced N offline games"

**Spirit Detail Page (Offline-First):**

1. Route loader prefetches `getSpiritBySlug` and `getSpiritWithAspects` (non-blocking)
2. Component `useSuspenseQuery` reads from cache instantly (offline works)
3. If online, stale-while-revalidate pattern refetches in background
4. No loading spinners or blank pages when cached data exists

**State Management:**

- **Server State:** Managed by TanStack Query (Convex queries cached, auto-invalidation)
- **Auth State:** Managed by Clerk + Convex (`useConvexAuth`, `useAuth` from Clerk)
- **UI State:** Local component state (React `useState`) or contexts (`EditModeContext`, `ThemeContext`)
- **Offline Writes:** Persisted to IndexedDB outbox, synced when online via `useOutboxSync`

## Key Abstractions

**ConvexQueryClient (Data Bridge):**
- Purpose: Connects Convex WebSocket to TanStack Query
- Examples: `src/router.tsx` (initialization)
- Pattern: Adapter pattern wrapping Convex client as TanStack queryFn/hashFn

**Route Context:**
- Purpose: Share queryClient, convexClient, convexQueryClient across all routes
- Examples: `src/routes/__root.tsx` (provider), route loaders (consumer)
- Pattern: Dependency injection via TanStack Router context

**Offline Outbox:**
- Purpose: Queue writes (create/update/delete) when offline, flush when online
- Examples: `src/lib/offline-games.ts` (pending games, offline ops)
- Pattern: Outbox pattern with IndexedDB storage, owner isolation

**Auth-Cache Isolation:**
- Purpose: Prevent data leaks between users by clearing cache on auth identity change
- Examples: `src/routes/__root.tsx` (`AuthCacheIsolation` component)
- Pattern: useEffect watching `userId`, calls `clearPersistedQueryCache` on change

**Background Sync:**
- Purpose: Eagerly fetch and cache all spirits/openings/games for offline use
- Examples: `src/hooks/use-background-sync.ts`, `src/lib/sync.ts`
- Pattern: Batch prefetching via Promise.all, deferred to idle time via `requestIdleCallback`

## Entry Points

**Client Entry:**
- Location: `src/main.tsx`
- Triggers: Browser page load
- Responsibilities: Async router initialization (cache restore), root React render, error boundary

**Router Factory:**
- Location: `src/router.tsx` (`createRouter` function)
- Triggers: Called by `src/main.tsx`
- Responsibilities: Convex client setup, TanStack Query client setup, IndexedDB cache restoration, route tree configuration

**Root Layout:**
- Location: `src/routes/__root.tsx`
- Triggers: Router render
- Responsibilities: Auth providers (Clerk, Convex), theme provider, global sync hooks, PWA UI (update banner, offline indicator, install prompt), bottom nav, toast notifications

**Service Worker:**
- Location: `src/sw.ts`
- Triggers: Browser runtime (registered via vite-plugin-pwa)
- Responsibilities: Precache static assets, app-shell fallback for offline navigation, font/image caching strategies

**Convex Schema:**
- Location: `convex/schema.ts`
- Triggers: Convex backend initialization
- Responsibilities: Database table definitions, type generation for frontend/backend

## Error Handling

**Strategy:** Layer-specific boundaries with graceful degradation

**Patterns:**
- Route-level error boundaries: `__root.tsx` (`RootErrorComponent`) catches router/render errors
- Component-level error boundaries: `src/components/error-boundary.tsx` wraps root layout
- Mutation error handling: `onError` callbacks in `useMutation` → toast notifications
- Network errors: Silent fallback to cached data (offline-first), no intrusive error screens
- Validation errors: Thrown from Convex validators → caught by mutation `onError` → toast
- Auth errors: `requireAuth()` throws "Not authenticated" → caught by mutation → redirects to sign-in

## Cross-Cutting Concerns

**Logging:** Console-based (dev: verbose, prod: minimal)
- Service worker logs: Always logged to console (user can inspect via DevTools)
- Background sync errors: Logged as warnings (`console.warn`)
- Router errors: Logged in dev mode, shown in error boundary UI

**Validation:** Convex validators (runtime schema checks)
- Input validation: `convex/lib/validators.ts` (reusable helpers like `validateRequiredString`)
- Schema validation: Convex `v` validators in mutation args (e.g., `v.string()`, `v.number()`)
- Client-side validation: HTML5 form validation + React state (e.g., `isValid` state in forms)

**Authentication:** Clerk (client) + Convex JWT integration (server)
- Client auth: `useAuth()` from Clerk, `useConvexAuth()` for Convex-specific state
- Server auth: `requireAuth()`, `requireAdmin()` helpers in `convex/lib/auth.ts`
- Auth flow: Clerk sign-in → JWT token → Convex validates via `auth.config.ts`
- Cache isolation: `AuthCacheIsolation` component clears cache on user ID change

**Offline Support:** Service worker (static assets) + IndexedDB (data) + outbox pattern (writes)
- Static assets: Workbox precaching + stale-while-revalidate
- Data reads: TanStack Query cache persisted to IndexedDB, restored on load
- Data writes: Outbox pattern queues mutations, flushes when online
- Sync orchestration: `useBackgroundSync` (reads), `useOutboxSync` (writes)

---

*Architecture analysis: 2026-02-13*
