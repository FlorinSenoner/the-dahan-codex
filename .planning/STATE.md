# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** Text-based opening guides for Spirit Island spirits
**Current focus:** Phase 5 - Text Opening Management

## Current Position

Phase: 5 (Text Opening Management)
Plan: 5 of 6 (opening CRUD)
Status: In progress
Last activity: 2026-01-30 - Completed 05-05-PLAN.md (Opening CRUD Operations)

Progress: [##################################      ] 70% (Plan 05-05 complete)

## Performance Metrics

**Velocity:**

- Total plans completed: 63
- Average duration: 4.4 min
- Total execution time: 4.71 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 7     | 20 min | 2.9 min  |
| 02.1  | 6     | 28 min | 4.7 min  |
| 03    | 5     | 20 min | 4.0 min  |
| 03.1  | 5     | 38 min | 7.6 min  |
| 03.2  | 6     | 18 min | 3.0 min  |
| 03.3  | 2     | 4 min  | 2.0 min  |
| 03.4  | 7     | 22 min | 3.1 min  |
| 03.6  | 8     | 23 min | 2.9 min |
| 04    | 9     | 26 min | 2.9 min  |
| 05    | 6     | 21 min | 3.5 min  |

**Recent Trend:**

- Last 5 plans: 3 min, 5 min, 8 min, 2 min, 3 min
- Trend: Phase 5 wave 3 in progress (05-05 complete)

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Recent decisions
affecting current work:

- Switched from TanStack Start SSR to pure client SPA (quick-010)
- Dev server runs on port 3000
- Build output: dist/ (static SPA)
- Deploy to Cloudflare Pages (not Workers)
- Use useSuspenseQuery with loader preloading for data fetching
- Convex cloud project: dependable-wolverine-235.convex.cloud
- VITE_CONVEX_URL in .env.local (gitignored)
- Convex queries imported via api from convex/\_generated/api
- Used pathless \_authenticated layout instead of (authenticated) route group
  (TanStack Router constraint)
- Use useConvexAuth() hook for auth state sync instead of Clerk's useAuth()
- Admin role via Clerk JWT custom claim: user.public_metadata.isAdmin
- ClerkProvider > ConvexProviderWithClerk > QueryClientProvider hierarchy
- Manual Workbox generation via scripts/generate-sw.ts (vite-plugin-pwa
  incompatible with Vite 7)
- skipWaiting: false for service worker updates (prevents broken state during
  user sessions)
- Service worker registration in root layout useEffect
- Check document.readyState before adding load listeners (hydration-safe pattern)
- Playwright with Chromium-only for smoke tests (faster CI)
- Deploy job gated on CI success and main branch push
- Tailwind v4 CSS-first configuration (no tailwind.config.js)
- Dark mode by default for Spirit Island aesthetic
- oklch color space for theme colors
- UI components as knip entry points for library pattern
- Zod for URL search param validation in TanStack Router
- View transition names: spirit-image-{slug} and spirit-name-{slug} for base spirits
- Aspect view transition names: spirit-image-{slug}-{aspect} and spirit-name-{slug}-{aspect}
- Aspect URLs: /spirits/{base-slug}/{aspect-name} (path-based, not query params)
- Filter bottom sheet: Drawer with pending state + Apply button
- URL search params for filter state (shareable filtered views)
- Client-side Convex queries: useSuspenseQuery with loader preloading
- aria-label on icon-only buttons for accessibility and E2E testing
- Aspects inherit base complexity (Low) - complexityModifier is display-only
- reseedSpirits mutation for refreshing database data
- Downloaded images as PNG from wiki instead of converting to WebP
- Spirit images stored locally in public/spirits/
- Aspect title display: aspect name as h1, "Aspect of [Base]" as subtitle
- Element colors match Spirit Island wiki icons (Air=violet, Fire=orange, Earth=grey)
- Complexity uses independent grayscale scheme (light=easy, dark=hard)
- Modifier colors (easier/harder) use complexity colors for visual consistency
- Typography components: Heading (h1-h4 variants), Text (body/muted/small variants)
- Spirit colors centralized in app/lib/spirit-colors.ts (badge colors, filter colors, PLACEHOLDER_GRADIENT)
- Cloudflare Pages deployment via wrangler-action@v3 (pages-action@v1 deprecated)
- Power ratings use 0-5 scale (0=None, 5=Extreme)
- All board fields optional to preserve backward compatibility
- Aspects inherit board data from base spirit (no duplication)
- getSpiritWithAspects query returns base + sorted aspects in single call
- URL as single source of truth for variant tab selection (no local state)
- Parallel query preloading in route loaders (getSpiritBySlug + getSpiritWithAspects)
- Spirit components directory: app/components/spirits/ for spirit-specific components
- Recharts ResponsiveContainer requires parent div with min-height for proper sizing
- Spirit section components receive Doc<"spirits"> prop and handle missing data gracefully
- Radar chart 300px max-width for mobile-friendly display
- Presence slot touch targets: 44px (11 tailwind units) for WCAG compliance
- Tooltip delay: 100ms for quick hover feedback
- Reclaim slots show "R" with amber styling to match Spirit Island aesthetic
- Fast/Slow badges use amber/blue colors consistently across all power displays
- Element threshold keys generated from element-count pairs to avoid array index keys
- SpecialRules returns null when no rules exist (section hidden entirely)
- CardHand uses negative margin (-mx-4 px-4) for edge-to-edge scroll on mobile
- Use oklch color space for radar chart dark mode visibility
- Radar chart: gridType="polygon" with polarRadius for spider web appearance
- Tab styling: gradient highlight (from-primary/20 to transparent) + border-b-2
- Element icons: aria-hidden="true" for decorative SVGs, 20px default size
- ElementIcon Record enables dynamic rendering: ElementIcon["Sun"]
- Power DSL: discriminated union for GrowthAction types
- Growth schema: flat G1/G2/G3 with typed action objects
- Presence tracks: flexible array of track objects (not hardcoded energy/cardPlays)
- UniquesPowers require range and target strings for display
- Track colors: amber/blue/purple/emerald palette for consistent presence track theming
- Slot receives full slot object instead of individual props for cleaner API
- Track gradient pattern: from-{color}-500/15 via-{color}-500/5 to-transparent
- Element icons render as number + icon pairs (e.g., "2 Sun" becomes "2 <SunIcon>")
- Cards use div with border-2 instead of shadcn Card for simpler speed-based styling
- Range/Target abbreviated format (R: / T:) for cards, full format for innate headers
- GrowthIcon Record pattern matching ElementIcon for dynamic icon rendering
- Type guard pattern (isNewGrowthFormat) for schema format detection
- G1/G2/G3 labels hidden by default, revealed on hover via Tailwind group-hover pattern
- Spirit track colors derived from primary/secondary elements (e.g., River: Water/Sun = cyan/amber)
- getSpiritTrackColors(slug) with amber/blue fallback for unknown spirits
- orActions pattern for choose-from-multiple growth options
- Schema extensions (orActions, repeat, layout, connectsTo, connectionPoint, unlocksGrowth, presenceCap) are optional for backward compatibility
- Innate powers use border-l-4 for speed (amber=Fast, blue=Slow) - consistent with cards
- Innate powers always visible (no accordion) - reduces clicks
- Extended trackColor type to support spirit-specific colors (cyan, orange, violet, indigo, stone)
- Collapsible Hand section with card count badge for cards organization
- Grid layout (1-col mobile, 2-col desktop) for cards instead of horizontal scroll
- GitBranch icon for connectsTo tracks, Sprout icon for unlocksGrowth tracks
- Flat border-b-2 tab indicator instead of gradient background for cleaner tabs
- rootMargin -57px for header height offset in scroll detection
- Pills always visible below name, description inside collapsible overview
- Fractured Days uses orActions with empty actions array (all options are OR choices)
- Starlight has 6 tracks with 4 marked as unlocksGrowth: true
- Finder's energy track connectsTo cardPlays at connectionPoint 3
- Serpent's Deep Slumber track uses presenceCap values 5-13
- z-0 for tabs so they scroll behind sticky header (not z-10 which causes overlap)
- TrackColor union type in presence-track.tsx for all 9 supported colors
- Type assertion at getSpiritTrackColors return boundary (not at component prop)
- Full border (not border-l-4) for cards and innates with speed-based colors (amber=Fast, blue=Slow)
- Hover effects: border-{color}-400 + bg-{color}-500/10 for interactive feedback
- Innate powers collapsed by default (defaultOpen={false}) to reduce visual clutter
- Matching accordion trigger styling between Hand and Overview (bg-muted/30, chevron right)
- Radix Tooltip for track indicators with cursor-help styling
- connectionPoint displayed as 1-indexed in tooltip (user-friendly)
- presenceCap slots use stone/gray styling to differentiate from energy/cardPlays tracks
- presenceCap takes visual precedence in slot display value
- presenceTracks uses nodes + edges instead of tracks + slots (Node-Edge Graph DSL)
- trackType is per-node, not per-track (enables mixed-type rows)
- Grid dimensions (rows, cols) stored for CSS Grid layout
- edges array supports bidirectional flag for Finder's track traversal
- GraphPresenceTrack uses row grouping with CSS Grid for column positioning
- PresenceNode adapted from PresenceSlot with grid-aware style prop
- Grid column positioning via style={{ gridColumn: col + 1 }}
- EdgeOverlay uses SVG viewBox 0 0 100 100 for percentage-based responsive positioning
- Adjacent edges (same row, col diff 1) are filtered out as implicit in grid layout
- globalBidirectional defaults to true (most presence track edges are bidirectional)
- PresenceTrack is thin wrapper delegating to GraphPresenceTrack (public API stability)
- PresenceSlot replaced by PresenceNode (graph-aware interface)
- Simple spirits use empty edges array (linear tracks need no explicit edges - implicit left-to-right)
- trackLabel field on presence nodes overrides derived label from trackType (custom row labels)
- Serpent Deep Slumber nodes use trackLabel: "Deep Slumber" for custom row label
- specialAbility on first Deep Slumber node shows "Requires Both Preceding Spaces" condition
- elementValidator union type at top of schema.ts for explicit element values (Sun, Moon, Fire, Air, Water, Earth, Plant, Animal, Any, Star)
- Any icon uses multicolor gradient with question mark to represent wildcard element
- Star icon uses gold gradient 5-pointed star design
- Element icons render below main value in presence slots at 12px size
- Type guard isGraphFormat for narrowing presenceTracks union type
- Finder presence tracks use 3-row diamond/web structure with junction nodes at row 1 (col 2 and 4)
- Finder edges form X/diamond pattern with bidirectional traversal from both starting positions
- VariantTabs shows "Base" for base spirit tab instead of spirit name (simplified UI)
- Openings table with spiritId reference for text-based turn-by-turn guides
- Openings difficulty uses Beginner/Intermediate/Advanced literals
- Openings turns array structure: turn number, optional title, instructions (notes field removed in 05-08)
- listBySpirit and getBySlug queries for openings table
- Opening seed data includes attribution (author, sourceUrl)
- reseedSpirits deletes openings before spirits (foreign key order)
- TurnAccordion component with all turns expanded by default via defaultValue
- OpeningSection queries openings by spiritId, handles loading/empty states gracefully
- Aspect openings isolation: Each spirit (base or aspect) queries openings by its own _id, never inherits from base
- SpecialRules component and specialRules schema field removed (simplified spirit detail page)
- useSyncExternalStore for useOnlineStatus hook (concurrency-safe online/offline detection)
- workbox-window Workbox class for SW lifecycle management in useServiceWorker hook
- navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/] excludes API calls and static files
- PWA hooks exported via app/hooks/index.ts barrel (library pattern)
- Settings page pattern: sections with Heading h3, descriptive Text muted, full-width Buttons
- Cache clear pattern: delete all caches + unregister SW + reload
- useConvex().query for programmatic Convex queries outside React hooks
- PWA components in app/components/pwa/ directory with knip entry point
- Semantic <output> element for status indicators (Biome lint prefers over div with role="status")
- z-50 for top PWA banners (update), z-40 for offline indicator pill and bottom install prompt
- Offline indicator: bottom-right pill with muted zinc styling (non-intrusive)
- 7-day localStorage persistence for install prompt dismissal (pwa-install-dismissed key)
- 2-second delay before showing install prompt to avoid flash on page load
- PWA components placed before Outlet in root layout for global visibility
- useServiceWorker hook manages SW lifecycle in root component (replaces registerSW useEffect)
- sw-register.ts marked deprecated, kept for potential fallback
- Bottom nav link types explicitly list enabled routes ("/spirits" | "/settings")
- Playwright context.setOffline() for network simulation in PWA tests
- Manual test checklist for cold-start offline (cross-session state complex to automate)
- Settings page simplified: single Cache Management section with Sync Data and Clear Cache buttons
- Sync Data uses getSpiritWithAspects to fetch all spirit data including aspects
- Clear Cache clears both SW caches AND IndexedDB "tanstack-query-cache" via idb-keyval del()
- Outline variant for cache management buttons (subtle, non-alarming styling)
- TanStack Query staleTime 5 minutes for fresh data balance
- TanStack Query gcTime 7 days for offline data retention
- persistQueryClient only persists successful queries (shouldDehydrateQuery filter)
- createIDBPersister factory function for idb-keyval integration with TanStack Query
- Convex data cached via TanStack Query/IndexedDB, not service worker (WebSocket protocol)
- JSDoc comments on route components documenting offline behavior expectations
- Client-side search filtering with useDeferredValue for smooth typing
- URL ?search= parameter for shareable filtered spirit lists
- Search applies after backend filters (complexity/elements) for composable filtering
- useAdmin hook checks Clerk publicMetadata.role === "admin" for frontend admin status (role-based for future RBAC expansion)
- Opening mutations (createOpening, updateOpening, deleteOpening) protected by requireAdmin(ctx)
- Opening timestamps (createdAt, updatedAt) optional in schema for backward compatibility
- Opening slug auto-generated from name: lowercase, remove special chars, replace spaces with dashes
- Difficulty field deprecated in openings schema but kept optional for existing production data
- useEditMode hook uses URL ?edit=true for state persistence across refreshes
- Edit mode defense-in-depth: isEditing = isAdmin && search.edit === true (non-admins cannot activate even with URL param)
- EditFab positioned bottom-20 to stay above bottom nav (which uses bottom-16)
- Admin components directory: app/components/admin/ with knip entry point
- biome-ignore for TanStack Router search typing with strict: false (necessary for route-agnostic hooks)
- EditableText pattern: isEditing prop controls span vs input/textarea rendering
- OpeningFormData exported interface for parent component integration
- Turn renumbering automatic on delete to maintain sequential order
- hasChanges calculated via deep comparison in useMemo
- Form data change propagation: child calls onChange, parent tracks hasChanges
- Edit mode section pattern: show editor when isEditing, show display otherwise
- Save handler exposed via callback pattern (onSaveHandlerReady prop)
- useBlocker with shouldBlockFn API for navigation warning (TanStack Router v1.40+)
- isSaving tracked in parent for unified loading state across save button
- Single wrapper pattern for edit mode components: Keep outer container mounted, swap only inner content to preserve scroll position

### Pending Todos

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Add knip and dependabot for git workflows | 2026-01-25 | 04652f7 | [001-add-knip-and-dependabot-for-git-workflow](./quick/001-add-knip-and-dependabot-for-git-workflow/) |
| 002 | Fix deprecated afterSignOutUrl property | 2026-01-25 | e1c7a8c | [002-fix-deprecated-aftersignouturl-property-](./quick/002-fix-deprecated-aftersignouturl-property-/) |
| 003 | Wire Clerk routing env vars | 2026-01-25 | b00528b | [003-wire-clerk-routing-env-vars](./quick/003-wire-clerk-routing-env-vars/) |
| 004 | Improve deployment workflow | 2026-01-25 | 23c1c3e | [004-improve-deployment-workflow](./quick/004-improve-deployment-workflow/) |
| 005 | Fix Clerk sign-in e2e test selector | 2026-01-25 | 8a054ec | [005-fix-clerk-sign-in-e2e-test-selector](./quick/005-fix-clerk-sign-in-e2e-test-selector/) |
| 006 | Create README.md and update CLAUDE.md | 2026-01-25 | 8bf08bd | [006-create-readme-and-update-claude-md](./quick/006-create-readme-and-update-claude-md/) |
| 007 | Add typography and reusable UI components | 2026-01-26 | 187fc2a | [007-add-typography-and-reusable-ui-component](./quick/007-add-typography-and-reusable-ui-component/) |
| 009 | Rework element and complexity colors | 2026-01-26 | 8843491 | [009-rework-element-and-complexity-colors](./quick/009-rework-element-and-complexity-colors/) |
| 010 | Switch to client-only SPA | 2026-01-26 | 32bf3ed | [010-switch-to-client-only-spa](./quick/010-switch-to-client-only-spa/) |
| 011 | Fix view transitions and aspect URLs | 2026-01-26 | 5a25c3e | [011-fix-view-transitions-and-aspect-urls](./quick/011-fix-view-transitions-and-aspect-urls/) |
| 012 | Fix Cloudflare CI auth error | 2026-01-26 | 8b3f308 | [012-fix-cloudflare-ci-auth-error](./quick/012-fix-cloudflare-ci-auth-error/) |

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Spirit Library Polish (URGENT) - addresses 9 UAT gaps
- Phase 3.1 inserted after Phase 3: Spirit Board Polish (URGENT) - addresses 8 UAT gaps (DSL system, element icons, schema corrections, visual polish)
- Phase 3.2 inserted after Phase 3.1: Spirit Board Refinements (URGENT) - addresses 13 UAT gaps (minimalist tabs, scroll behavior, growth icons, complex spirits support)
- Phase 3.3 inserted after Phase 3.2: Spirit Board Final Polish - addresses cosmetic G1/G2/G3 hover labels + presence track branching DSL for complex spirits
- Phase 3.4 ABANDONED: Graph DSL approach too complex, entire board visualization strategy abandoned
- Phase 3.6 inserted after Phase 3.4: Simplify Spirit Board + Text Openings - removes growth/presence/innate/cards, adds simple text-based openings (PIVOT)
- Phase 5 changed: "Opening Scrubber" → "Text Opening Management" (admin tools for text openings)
- Phase 7 changed: "Admin Tools" → "Seed Data Management" (simplified scope)

### Blockers/Concerns

**From Research:**

- iOS PWA testing needed (cache purging behavior)

**From Plan 01-05:**

- Placeholder icons need replacement with branded artwork (low priority)

**From Plan 01-06 (updated by quick-004):**

- GitHub configuration required for CI/CD:
  - **Secrets:** CONVEX_DEPLOY_KEY, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
  - **Variables:** VITE_CONVEX_URL, VITE_CLERK_PUBLISHABLE_KEY
- See `.planning/quick/004-improve-deployment-workflow/004-SUMMARY.md` for setup guide

**From Plan 01-04:**

- User must configure Clerk and set CLERK_JWT_ISSUER_DOMAIN in Convex dashboard

## Phase 1 Summary

Phase 1 (Foundation & Authentication) is now complete with:

- TanStack Router + Vite 7 + React 19 client-side SPA
- Convex backend with health check query
- Clerk authentication with protected routes
- PWA with Workbox service worker (hydration-safe registration)
- GitHub Actions CI/CD with Cloudflare Pages deployment
- Pre-commit hooks (biome lint/format, typecheck)
- Playwright smoke tests
- UAT gaps addressed (01-07: SW registration timing fix)

## Phase 2 Summary

Phase 2 (Spirit Library) is now complete with:

- Tailwind v4 + shadcn/ui design system with Spirit Island theme
- Convex spirit schema with base spirits and aspects
- Spirit list UI with filtering (complexity, elements) and URL persistence
- Spirit detail page with view transitions
- Bottom navigation (Spirits active, future tabs disabled)
- Credits page with legal disclaimer and attribution
- 5 E2E tests covering spirit library functionality

## Phase 2 Progress

Phase 2 (Spirit Library) complete:

- [x] 02-01: Tailwind + shadcn/ui Setup (design system foundation)
- [x] 02-02: Spirit Schema and Seed Data
- [x] 02-03: Spirit List UI
- [x] 02-04: Filter and Search
- [x] 02-05: Spirit Detail & View Transitions
- [x] 02-06: Bottom Navigation & E2E Tests

## Phase 2.1 Summary

Phase 2.1 (Spirit Library Polish) is now complete with:

- complexityModifier and description fields added to spirit schema
- Immense aspect added for Lightning's Swift Strike (all 7 aspects now have modifiers)
- Spirit images scraped from wiki and stored locally (River, Lightning)
- 44px touch targets and cursor-pointer on all interactive elements
- View transition CSS fixed with correct ::view-transition-group(*) syntax
- Aspect title display cleaned up (aspect name as h1, "Aspect of [Base]" subtitle)
- Description field displayed on spirit detail pages

## Phase 2.1 Progress

Phase 2.1 (Spirit Library Polish) complete:

- [x] 02.1-01: Schema and Seed Data Update
- [x] 02.1-02: Spirit Images
- [x] 02.1-03: Filter Fixes
- [x] 02.1-04: Accessibility and Polish
- [x] 02.1-05: View Transitions
- [x] 02.1-06: Aspect Title & Description

## Phase 3 Progress

Phase 3 (Spirit Detail & Board) complete:

- [x] 03-01: Schema and Seed Data (board data fields)
- [x] 03-02: Variant Tabs Component
- [x] 03-03: Overview Section (radar chart, strengths/weaknesses)
- [x] 03-04: Growth and Presence Track Components
- [x] 03-05: Innate and Power Components
- [x] 03-06: E2E Tests and External Links

**UAT Result:** 5/13 tests passed, 8 issues diagnosed → Phase 3.1 created

## Phase 3.1 Progress

Phase 3.1 (Spirit Board Polish) complete:

- [x] 03.1-01: Foundation (element icons, power DSL)
- [x] 03.1-02: Schema and Seed Data Update
- [x] 03.1-03: Tabs & Radar Polish
- [x] 03.1-04: Growth Panel Redesign
- [x] 03.1-05: Presence Track Redesign
- [x] 03.1-06: Innate Powers & Cards Redesign
- [x] 03.1-07: External Links Polish (merged into Phase 3.2)

## Phase 3.2 Summary

Phase 3.2 (Spirit Board Refinements) is now complete with:

- react-intersection-observer for scroll-aware aspect name in header
- Spirit-specific presence track colors (cyan, orange, violet, indigo, stone)
- Schema extensions for complex spirits (orActions, connectsTo, unlocksGrowth, presenceCap)
- Minimalist tabs with flat border-b-2 indicator
- CSS subgrid for equal-height growth cards
- Collapsible Hand section with card count badge
- Border-only speed indicators for innate powers
- Four Very High complexity spirits demonstrating all patterns

## Phase 3.2 Progress

Phase 3.2 (Spirit Board Refinements) complete:

- [x] 03.2-01: Foundation (react-intersection-observer, spirit track colors, schema extensions)
- [x] 03.2-02: Minimalist Tabs with Scroll Sync (flat border indicator, scroll-aware header, pills below name)
- [x] 03.2-03: Growth Panel CSS Subgrid and Tooltips
- [x] 03.2-04: Presence Tracks & Cards Polish (spirit-specific colors, collapsible Hand section)
- [x] 03.2-05: Innate Powers Border-Only Speed
- [x] 03.2-06: Complex Spirits Seed Data (Fractured Days, Starlight, Finder, Serpent)

**Gap Closure Plans (UAT fixes):**

- [x] 03.2-07: Fix presence track colors (TrackColor type, remove type cast)
- [x] 03.2-08: Growth panel layout simplification (inline labels with frosty blur, hover effects)
- [x] 03.2-09: Card speed border styling (full border, hover effects, collapsible innates)
- [x] 03.2-10: Tabs z-index fix (z-10 to z-0 for proper scroll stacking)

## Phase 3.3 Summary

Phase 3.3 (Spirit Board Final Polish) is now complete with:

- G1/G2/G3 labels inline with frosty blur backdrop effect
- Radix Tooltip for branching (GitBranch) and unlock (Sprout) track indicators
- presenceCap display in presence slots with stone/gray styling

## Phase 3.3 Progress

Phase 3.3 (Spirit Board Final Polish) complete:

- [x] 03.3-01: Hover-reveal G1/G2/G3 labels (group-hover pattern)
- [x] 03.3-02: Presence track indicators and presenceCap display

## Phase 3.4 Summary (ABANDONED)

Phase 3.4 (Presence Track Graph DSL) was abandoned at 9/10 plans complete. The graph DSL approach was too complex - the entire board visualization strategy (growth panels, presence tracks, innate powers, cards) was abandoned in favor of a simpler text-based opening guide approach.

**Partial work completed before abandonment:**
- [x] 03.4-01 through 03.4-10 (except 03.4-07 E2E tests)

**Reason for abandonment**: The graphical board visualization approach required too much complexity to accurately represent all spirit patterns. A simpler text-based opening guide better serves users who want to learn spirit openings.

## Phase 3.6 Summary

Phase 3.6 (Simplify Spirit Board + Text Openings) is now complete with:

- Board visualization components removed (growth panels, presence tracks, innate powers, cards)
- Simplified spirit detail page (image, name, badges, summary, overview, special rules, openings, links)
- Openings table with spiritId reference for text-based turn-by-turn guides
- TurnAccordion and OpeningSection components for displaying openings
- River standard opening with 3 turns as sample data

## Phase 3.6 Progress

Phase 3.6 (Simplify Spirit Board + Text Openings) complete:

- [x] 03.6-01: Remove Board Visualization Components
- [x] 03.6-02: Clean Schema and Seed Data (verified - work done in 03.6-01)
- [x] 03.6-03: E2E Test Updates (removed board sections test, fixed variant tabs assertions)
- [x] 03.6-04: Openings Schema and Queries (openings table, listBySpirit, getBySlug)
- [x] 03.6-05: Sample Opening Seed Data (River standard opening with 3 turns)
- [x] 03.6-06: Opening Display Components (TurnAccordion, OpeningSection)
- [x] 03.6-07: Spirit Detail Integration (OpeningSection integrated into spirits.$slug.tsx)
- [x] 03.6-08: UAT Gap Closure (SpecialRules removed, sourceUrl fixed, aspect isolation documented)

## Phase 4 Summary

Phase 4 (PWA & Offline) is now complete with:

- PWA hooks: useOnlineStatus, useServiceWorker, useInstallPrompt (workbox-window)
- PWA UI components: offline indicator, update banner, install prompt
- Settings page with cache management (Download for Offline, Refresh Data, Clear Cache)
- PWA integration in root layout and bottom nav
- E2E tests for offline indicator, settings page, and manifest validation
- Manual test checklist for cold-start offline verification

## Phase 4 Progress

Phase 4 (PWA & Offline) complete:

- [x] 04-01: PWA Hooks & SW Configuration (workbox-window, useOnlineStatus, useServiceWorker, useInstallPrompt)
- [x] 04-02: PWA UI Components (offline indicator, update banner, install prompt)
- [x] 04-03: Settings Page (cache management, offline download)
- [x] 04-04: PWA Integration (root layout, bottom nav)
- [x] 04-05: E2E Tests & Integration

**Gap Closure Plans (UAT fixes):**

- [x] 04-06: Subtle Offline Indicator (bottom-right pill, muted zinc styling)
- [x] 04-07: Simplify Settings Page (Sync Data button, Clear Cache with IndexedDB)
- [x] 04-08: Query Persistence (IndexedDB via idb-keyval, 7-day gcTime)
- [x] 04-09: Service Worker Cleanup (remove dead Convex caching rule, document offline architecture)

## Phase 5 Progress

Phase 5 (Text Opening Management) in progress:

- [x] 05-01: Admin Infrastructure (useAdmin hook, CRUD mutations with requireAdmin)
- [x] 05-02: Spirit Search (search input with URL persistence)
- [x] 05-03: Edit Mode Infrastructure (useEditMode hook, EditFab component)
- [x] 05-04: Opening Editor (EditableText, EditableOpening, OpeningSection edit mode)
- [x] 05-05: Opening CRUD Operations (CRUD mutations, EditFab integration, navigation blocking)
- [ ] 05-06: E2E Tests

**Gap Closure Plans:**

- [x] 05-07: Role System Change (isAdmin boolean to role string for future RBAC)
- [x] 05-08: Remove Turn Notes Field (simplified turn schema, opening-level description sufficient)
- [x] 05-13: Fix Scroll Behavior on Edit Toggle (single wrapper pattern to prevent scroll jumps)

## Session Continuity

Last session: 2026-01-31
Stopped at: Completed 05-13-PLAN.md (Fix Scroll Behavior on Edit Toggle)
Resume file: None
