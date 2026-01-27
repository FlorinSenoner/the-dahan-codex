# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-01-24)

**Core value:** The Opening Scrubber - graphical, scrubbable visualization of
spirit openings **Current focus:** Phase 3 - Spirit Detail & Board

## Current Position

Phase: 3.2 (Spirit Board Refinements) - Gap closure complete
Plan: 10 of 10 (gap closure plans 07-10)
Status: Completed plans 03.2-01 through 03.2-06 + gap closure 03.2-07 through 03.2-10
Last activity: 2026-01-27 - Completed 03.2-10-PLAN.md (tabs z-index fix)

Progress: [██████████████████████████████] 100% (40/40 plans including gap closure)

## Performance Metrics

**Velocity:**

- Total plans completed: 36
- Average duration: 5.4 min
- Total execution time: 3.3 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 7     | 20 min | 2.9 min  |
| 02.1  | 6     | 28 min | 4.7 min  |
| 03    | 5     | 20 min | 4.0 min  |
| 03.1  | 5     | 38 min | 7.6 min  |
| 03.2  | 6     | 18 min | 3.0 min  |

**Recent Trend:**

- Last 5 plans: 8 min, 12 min, 2 min, 3 min, 5 min
- Trend: Stable (polish plans are quick)

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
- Inline G1/G2/G3 labels with backdrop-blur-sm frosty effect (always visible, not hover-reveal)
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
- [x] 03.2-09: Skip (superseded by 03.2-06)
- [x] 03.2-10: Tabs z-index fix (z-10 to z-0 for proper scroll stacking)

## Session Continuity

Last session: 2026-01-27
Stopped at: Completed 03.2-07-PLAN.md (fix presence track colors)
Resume file: None
