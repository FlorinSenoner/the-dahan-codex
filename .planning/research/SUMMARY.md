# Project Research Summary

**Project:** The Dahan Codex - Spirit Island Companion PWA **Domain:**
Offline-first game reference/companion application **Researched:** 2026-01-24
**Confidence:** MEDIUM-HIGH

## Executive Summary

The Dahan Codex is an offline-first PWA companion app for Spirit Island, a
cooperative board game. Based on research, the recommended approach is to build
with TanStack Start (full-stack React framework), Convex (reactive backend), and
Clerk (authentication), deployed to Cloudflare Workers. This stack provides SSR,
type safety, and real-time reactivity, but requires custom PWA implementation
due to known incompatibilities between vite-plugin-pwa and TanStack Start.

The key architectural challenge is implementing true offline-first
functionality. Convex does not natively support offline persistence, requiring a
custom IndexedDB layer (using Dexie.js) for caching reference data. The app
should adopt a two-tier strategy: precache static Spirit/game data via service
worker, and queue user mutations in IndexedDB for sync when online. This
approach differentiates from existing tools (Spirit Guide, SICK) which lack
robust offline support.

Critical risks include PWA service worker generation failures in production
builds, SSR authentication token handling, and iOS cache purging. These must be
validated in the foundation phase through CI testing of production builds,
actual device testing (not just DevTools), and explicit handling of Clerk JWT
tokens in route loaders. The opening scrubber feature (turn-by-turn
visualization) represents the highest complexity and should be deferred until
core reference functionality proves valuable.

## Key Findings

### Recommended Stack

TanStack Start provides the foundation for SSR, file-based routing, and server
functions with official Cloudflare Workers support. The stack is modern but
contains beta/RC components requiring version pinning and careful testing.

**Core technologies:**

- **TanStack Start + Router + Query**: Full-stack React framework with type-safe
  routing and reactive data subscriptions via Convex adapter
- **Convex + @convex-dev/react-query**: Reactive serverless backend with
  automatic real-time updates over WebSocket
- **Clerk**: Authentication with first-party Convex integration via JWT
  templates
- **Workbox (manual setup)**: Service worker toolkit for PWA caching, replacing
  incompatible vite-plugin-pwa
- **Dexie.js**: IndexedDB wrapper for offline data storage with schema
  migrations
- **Radix UI + Tailwind CSS**: Headless accessible components with utility-first
  styling
- **Framer Motion (Motion)**: Animations and gestures for opening scrubber
  interactions

**Critical version compatibility note:** vite-plugin-pwa and Serwist are
incompatible with TanStack Start production builds due to Vite 6 environment API
issues. Manual Workbox configuration required, adding 1-2 days of implementation
effort.

### Expected Features

The companion app market has well-established expectations. Missing table stakes
features makes the product feel incomplete, while differentiators create
competitive advantage.

**Must have (table stakes):**

- Spirit reference library with all 37+ spirits and 31 aspects
- Expansion filtering to show only owned content
- Complexity ratings (Low/Moderate/High/Very High)
- Element tracking with innate power threshold notifications
- Adversary and scenario reference data
- Mobile-responsive design and basic PWA offline support
- Search and filter capabilities

**Should have (competitive differentiators):**

- **Opening scrubber** (graphical turn-by-turn visualization) — NO existing tool
  provides this; unique value proposition
- **Spirit aspects as first-class entities** — Wiki documents 31 aspects but no
  tool makes them browsable alongside spirits
- **Presence track visualization** — Spirit Guide explicitly lacks this; users
  have requested it
- **Power ratings radar chart** — Visualize spirit strengths (offensive,
  defensive, control, fear, support)
- **Full offline PWA** — Handelabra app has offline issues; no companion is
  truly offline-first
- **Multi-spirit game tracker** — Track energy, elements, cards, presence for
  1-6 spirits during play

**Defer (v2+):**

- Real-time multiplayer sync (massive complexity, connectivity issues at game
  tables)
- Notes with backlinks (unique but not core)
- Full game automation (competes with official Handelabra app)
- CSV export/import for game history (power user feature)
- Spirit synergy/pairing recommendations (requires community data integration)

### Architecture Approach

The architecture follows a layered pattern separating reference data (spirits,
game components) from user data (games, notes). This distinction drives caching
strategy and access control.

**Major components:**

1. **Client Layer (TanStack Start PWA)** — React components with TanStack Router
   for file-based routing, TanStack Query for data fetching via Convex adapter,
   Service Worker (Workbox) for precaching and runtime caching
2. **Backend Layer (Convex)** — Query functions (read-only), mutations (writes),
   scheduled actions (background tasks), database with reference data (spirits,
   aspects, adversaries) and user data (games, notes)
3. **Auth Layer (Clerk)** — Wraps app with ClerkProvider >
   ConvexProviderWithClerk for JWT token flow to Convex
4. **Offline Layer (IndexedDB + Dexie)** — Cache for reference data synced from
   Convex, sync queue for offline mutations awaiting retry

**Key patterns:**

- **Reference vs User Data Separation:** Reference data (spirits) is public,
  precached, and sync'd to IndexedDB; user data (games) requires auth, sync'd
  via mutation queue
- **Two-Tier Offline Architecture:** Service worker precaches static assets and
  reference data; IndexedDB stores user data that syncs when online
- **Provider Hierarchy:** Strict nesting (ClerkProvider >
  ConvexProviderWithClerk > QueryClientProvider) required for SSR auth to work
- **Component Composition:** Complex UI (opening scrubber) broken into Timeline,
  GrowthPanel, PresenceTracks, CardPreview with Motion for drag interactions

### Critical Pitfalls

Research identified 11 pitfalls spanning foundation setup, integration
complexity, and performance traps.

1. **vite-plugin-pwa incompatibility with TanStack Start** — Service worker
   generation fails in production builds. Use manual Workbox configuration,
   validate SW generation in CI. MUST address in Foundation phase.

2. **Cloudflare Workers platform import failures** — Production builds fail when
   middleware imports `cloudflare:workers`. Pin to
   @tanstack/react-start@1.140.5, isolate platform code to server-only modules.
   MUST address in Foundation phase.

3. **Convex + Clerk token not available in SSR loaders** — Authenticated queries
   fail during SSR. Explicitly get token with
   `await auth.getToken({ template: "convex" })` in route `beforeLoad` and set
   on server client. MUST address in Authentication phase.

4. **SSR hydration mismatches with browser-only APIs** — React hydration errors
   cause flickering/broken UI. Wrap browser-dependent UI in `<ClientOnly>`, use
   `ssr: false` for routes requiring browser APIs. MUST validate in Foundation
   and all feature phases.

5. **skipWaiting() causing "half-old, half-new" application state** — Users
   experience broken functionality after SW updates. Never call `skipWaiting()`
   automatically; require user consent via update prompt. MUST address in PWA
   Infrastructure phase.

6. **Opaque responses bloating cache storage (7MB per image)** — Cross-origin
   images without CORS add 7MB padding per cached item. Add
   `crossorigin="anonymous"` to external images, verify CORS support, proxy if
   needed. MUST address in Card Image Loading phase.

## Implications for Roadmap

Based on research, the roadmap should prioritize foundation validation, then
build reference functionality before attempting complex interactive features.
Offline architecture must be proven early.

### Phase 1: Foundation & Authentication

**Rationale:** Critical integrations have known pitfalls requiring immediate
validation. PWA service worker generation, Cloudflare deployment, and SSR
authentication must work before building features.

**Delivers:**

- TanStack Start project with Clerk authentication
- Convex backend connection with JWT tokens in SSR loaders
- Manual Workbox PWA setup (validated SW generation)
- Cloudflare Workers deployment (tested in CI)
- Provider hierarchy (ClerkProvider > ConvexProviderWithClerk >
  QueryClientProvider)

**Addresses pitfalls:**

- Pitfall 1 (vite-plugin-pwa incompatibility) — Manual Workbox setup
- Pitfall 2 (Cloudflare imports) — Version pinning, server-only isolation
- Pitfall 3 (SSR auth tokens) — Explicit token handling in beforeLoad
- Pitfall 4 (hydration mismatches) — ClientOnly wrapper setup

**Avoids technical debt:** Foundation must be stable before features pile on.

### Phase 2: Reference Data Core

**Rationale:** Spirit reference library is table stakes. All existing tools
provide this. Without reference data, no other features make sense. This phase
also establishes the data model for offline caching.

**Delivers:**

- Convex schema for spirits, aspects, adversaries, scenarios
- Spirit list view with filters (expansion, complexity)
- Spirit detail pages (basic info, special rules, innate powers)
- Search functionality
- Initial seed data (all 37+ spirits, 31 aspects)

**Uses:**

- TanStack Query with convexQuery adapter for reactive subscriptions
- Convex queries with indexed filtering (not in-code .filter())
- Radix UI components + Tailwind CSS styling

**Implements:** Reference data separation (public read) in schema design

**Addresses pitfalls:**

- Avoid unbounded arrays (Pitfall from architecture research)
- Use indexes for queries, not client-side filtering

### Phase 3: Offline Foundation

**Rationale:** True offline-first is a key differentiator. Convex does not
natively support offline persistence (Pitfall 8), requiring custom IndexedDB
layer. This must be built before advanced features depend on it.

**Delivers:**

- Dexie.js IndexedDB wrapper with schema
- Reference data sync from Convex to IndexedDB
- Offline detection hooks (useOnlineStatus)
- Service worker runtime caching for Convex API
- Offline fallback UI (shows cached data with "offline mode" indicator)

**Addresses:**

- Pitfall 8 (Convex offline persistence) — IndexedDB cache layer
- Pitfall 10 (IndexedDB schema versioning) — Dexie migration support from start
- Pitfall 11 (iOS cache purging) — Design for graceful re-sync, prompt for
  homescreen install

**Features enabled:** All table stakes features now work offline

### Phase 4: Spirit Details & Visualization

**Rationale:** Power ratings radar chart and presence track visualization
differentiate from competitors. These are medium complexity and build on
reference data core.

**Delivers:**

- Power ratings radar chart (Recharts)
- Presence track visualization (energy/card play tracks)
- Spirit strengths/weaknesses display
- Aspects as first-class browsable entities

**Uses:**

- Recharts for radar visualization
- Structured presence track data from schema
- Component composition pattern

**Differentiators addressed:**

- Aspects as first-class entities
- Power ratings visualization
- Presence track visualization (Spirit Guide lacks this)

### Phase 5: Game Tracker & History

**Rationale:** Game logging and score calculation are table stakes in existing
tools (Spirit Guide has this). Multi-spirit tracker is a differentiator but
requires stable user data mutations.

**Delivers:**

- Game schema and mutations (authenticated writes to Convex)
- Game creation form (TanStack Form)
- Score calculator (victory/defeat type, difficulty, invader progress)
- Game history list and detail views
- Offline mutation queue (writes queued in IndexedDB, sync on reconnect)

**Addresses:**

- Pitfall 7 (Clerk token expiration) — Graceful token refresh on reconnection
- User data separation in schema (auth required)

**Features:** Basic game tracker (foundation for multi-spirit in future)

### Phase 6: Opening Scrubber (Deferred MVP)

**Rationale:** Opening scrubber is the highest-value differentiator (NO existing
tool has this) but also highest complexity (HIGH in features research). Should
be validated only after reference functionality proves users engage with the
app.

**Delivers:**

- Opening data model (turn sequence, growth choices, presence moves)
- Timeline scrubber with drag interaction (Motion)
- Growth panel visualization
- Turn-by-turn state computation
- Card preview for played cards

**Addresses:**

- Pitfall 9 (Framer Motion jank) — Only animate transform/opacity, test with CPU
  throttling

**Complexity:** HIGH — Complex state management, animation performance critical

**Note:** Start with 1-2 spirits to validate concept before implementing all 37+
spirits.

### Phase Ordering Rationale

- **Foundation first:** Known integration pitfalls (PWA generation, Cloudflare
  imports, SSR auth) must be resolved before features build on them. Attempting
  features without stable foundation leads to cascading failures.

- **Reference before user data:** Reference data (spirits) is read-only, simpler
  schema, and required for all features. User data (games) requires auth,
  mutation queue, and offline sync complexity.

- **Offline architecture early:** Offline support is a key differentiator but
  requires IndexedDB layer design (schema, migrations). Building features that
  depend on data access before offline architecture is defined creates rework.

- **Simple features before complex:** Power ratings chart and presence tracks
  are medium complexity. Opening scrubber is high complexity with animation
  performance concerns. Validate simpler differentiators before highest-risk
  feature.

- **Authentication after foundation:** Auth integration has SSR token pitfall
  but depends on stable routing and Convex connection.

### Research Flags

**Phases likely needing `/gsd:research-phase` during planning:**

- **Phase 6 (Opening Scrubber):** Complex domain-specific logic (growth options,
  presence track state computation). Sparse documentation on how Spirit Island
  openings work mechanically. Will need detailed research on spirit growth
  mechanics and turn progression rules.

- **Phase 5 (Game Tracker - multi-spirit variant):** If expanding to full 1-6
  spirit tracking, complex state management patterns need research for
  performance at scale.

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Foundation):** Well-documented stack integration patterns. Pitfalls
  are known and documented with solutions.

- **Phase 2 (Reference Data):** Standard CRUD with Convex. Official docs cover
  this extensively.

- **Phase 3 (Offline Foundation):** PWA patterns are well-established. Dexie has
  excellent documentation.

- **Phase 4 (Visualization):** Recharts and component composition are standard
  React patterns.

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                    |
| ------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | MEDIUM      | TanStack Start is RC (API-stable but not v1.0). PWA integration requires custom solution. Convex + Clerk integration is well-documented. |
| Features     | HIGH        | Analyzed 10+ existing tools and community resources. Table stakes are clear. Differentiators validated by user requests on BGG/Reddit.   |
| Architecture | MEDIUM-HIGH | Patterns are well-documented for individual pieces. Integration complexity (offline + SSR + auth) requires careful implementation.       |
| Pitfalls     | HIGH        | Verified with official sources and GitHub issues. Solutions are documented and tested by community.                                      |

**Overall confidence:** MEDIUM-HIGH

Confidence is high for domain understanding (features, pitfalls) but medium for
stack integration due to beta/RC components and known incompatibilities
requiring custom solutions.

### Gaps to Address

**PWA service worker generation approach:** Research identified vite-plugin-pwa
incompatibility but multiple workarounds exist (manual Workbox, Serwist with
custom build step, community plugins). Phase 1 should validate chosen approach
in CI immediately.

**Opening scrubber data model:** Research covered general architecture but
specific data structures for Spirit Island growth options, presence track
reveals, and turn sequencing need domain expertise. Phase 6 research should
consult Spirit Island Wiki, community guides, and potentially Spirit Island Hub
source code for turn progression logic.

**Card image hosting/caching:** SICK (sick.oberien.de) is referenced for card
lookup but CORS support is unknown. Opaque response bloat (Pitfall 6) requires
either CORS verification or proxy implementation. Validate CORS headers early if
card images are critical.

**iOS PWA testing:** iOS Safari has different PWA behavior (cache purging after
2 weeks, limited storage). Actual device testing required; DevTools PWA audit
insufficient. Plan for iOS test device access in Phase 3.

**Convex offline sync strategy:** Research identified curvilinear (Convex
offline sync engine) as alpha. Decision needed: build custom IndexedDB queue
(recommended for MVP) or wait for curvilinear maturity. Defer sync queue to
Phase 5; read-only offline sufficient for Phases 2-4.

## Sources

### Primary (HIGH confidence)

- [Convex TanStack Start Quickstart](https://docs.convex.dev/quickstart/tanstack-start)
  — Full stack setup
- [Convex + Clerk Integration](https://docs.convex.dev/auth/clerk) — Auth
  configuration
- [Clerk Convex Integration](https://clerk.com/docs/guides/development/integrations/databases/convex)
  — JWT templates
- [TanStack Start Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
  — Deployment
- [TanStack Start Hydration Errors](https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors)
  — SSR patterns
- [Convex Database Schemas](https://docs.convex.dev/database/schemas) — Data
  modeling
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/)
  — Query patterns
- [Spirit Island Wiki - List of Spirits](https://spiritislandwiki.com/index.php?title=List_of_Spirits)
  — Reference data
- [Spirit Island Wiki - Aspect Cards](https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards)
  — 31 aspects
- [SICK - Spirit Island Card Katalog](https://sick.oberien.de/) — Card search
  reference

### Secondary (MEDIUM confidence)

- [TanStack Router Issue #4988](https://github.com/TanStack/router/issues/4988)
  — vite-plugin-pwa incompatibility confirmed
- [TanStack Router Issue #6185](https://github.com/TanStack/router/issues/6185)
  — Cloudflare platform imports
- [Convex Backend Issue #95](https://github.com/get-convex/convex-backend/issues/95)
  — Offline caching concerns
- [Rich Harris Service Workers Gist](https://gist.github.com/Rich-Harris/fd6c3c73e6e707e312d7c5d7d0f3b2f9)
  — skipWaiting pitfalls
- [Cloud Four: When 7 KB Equals 7 MB](https://cloudfour.com/thinks/when-7-kb-equals-7-mb/)
  — Opaque response bloat
- [Motion.dev: Web Animation Performance](https://motion.dev/blog/web-animation-performance-tier-list)
  — Animation best practices
- [Spirit Guide App Store](https://apps.apple.com/us/app/spirit-guide/id1452929632)
  — Competitor feature analysis
- [Spirit Island Hub](https://latentoctopus.github.io/) — Opening guides,
  community resources
- [BGG Spirit Island Pairing Tiers](https://boardgamegeek.com/thread/3135353/spirit-island-pairing-tiers-v10)
  — Synergy data
- [web.dev: PWA Update](https://web.dev/learn/pwa/update) — Service worker
  update patterns
- [web.dev: Offline Data](https://web.dev/learn/pwa/offline-data) — IndexedDB
  patterns

### Tertiary (LOW confidence)

- Convex curvilinear offline sync engine (alpha, not production-ready) —
  Mentioned in Convex discussions but no official release
- TanStack Start PWA community workarounds — May break with updates, require
  ongoing validation

---

_Research completed: 2026-01-24_ _Ready for roadmap: yes_
