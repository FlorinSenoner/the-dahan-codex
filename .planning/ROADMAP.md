# Roadmap: The Dahan Codex

## Overview

The Dahan Codex delivers an offline-first companion PWA for Spirit Island,
progressing from validated infrastructure through complete spirit reference
functionality to the core differentiator: the opening scrubber. The journey
prioritizes foundation stability (known pitfalls from research), builds
reference data as table stakes, establishes offline architecture before user
mutations, and defers highest-complexity features (opening scrubber, admin
tools) until core functionality proves valuable. User data features (games,
notes) come after offline infrastructure is proven, and admin tooling is last
priority.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Authentication** - TanStack Start, Convex, Clerk,
      PWA generation, Cloudflare deployment validated
- [x] **Phase 2: Spirit Library** - Browsable spirit list with reference data
      and basic navigation
- [x] **Phase 2.1: Spirit Library Polish** - UAT fixes: images, data, UI polish, SSR (INSERTED)
- [x] **Phase 3: Spirit Detail & Board** - Complete spirit pages with
      visualization (radar, presence, growth)
- [x] **Phase 3.1: Spirit Board Polish** - UAT fixes: DSL system, element icons, schema corrections, visual polish (INSERTED)
- [x] **Phase 3.2: Spirit Board Refinements** - UI polish: minimalist tabs, scroll behavior, growth icons, complex spirits support (INSERTED)
- [x] **Phase 3.3: Spirit Board Final Polish** - Growth hover labels, presence track branching DSL for complex spirits (INSERTED)
- [ ] **Phase 4: PWA & Offline** - Full offline-first experience for reference
      data
- [ ] **Phase 5: Opening Scrubber** - Turn-by-turn graphical visualization (core
      value)
- [ ] **Phase 6: User Data** - Game tracker, CSV export/import, notes with
      backlinks
- [ ] **Phase 7: Admin Tools** - Visual opening builder and seed data management

## Phase Details

### Phase 1: Foundation & Authentication

**Goal**: Validated tech stack with auth, PWA generation, and Cloudflare
deployment working in CI **Depends on**: Nothing (first phase) **Requirements**:
INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08,
INFRA-09, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06 **Success
Criteria** (what must be TRUE):

1. User can sign in with Clerk and see authenticated state persist across
   browser refresh
2. Service worker is generated and validated in CI (no vite-plugin-pwa failures)
3. App deploys to Cloudflare Workers and serves a page with real-time Convex
   connection
4. Public routes are accessible without login; authenticated routes redirect to
   sign-in
5. Pre-commit hooks run Biome checks and CI runs typecheck, build, and
   Playwright smoke test **Plans**: 7 plans

Plans:

- [x] 01-01-PLAN.md — Project scaffolding with TanStack Start, mise, biome,
      lefthook
- [x] 01-02-PLAN.md — Cloudflare Workers deployment configuration
- [x] 01-03-PLAN.md — Convex backend integration with TanStack Query
- [x] 01-04-PLAN.md — Clerk authentication with SSR token handling
- [x] 01-05-PLAN.md — Manual Workbox PWA with service worker generation
- [x] 01-06-PLAN.md — GitHub Actions CI/CD with Playwright tests
- [x] 01-07-PLAN.md — Fix service worker registration timing (gap closure)

### Phase 2: Spirit Library

**Goal**: Users can browse all spirits with basic filtering and navigation
**Depends on**: Phase 1 **Requirements**: SPRT-01, SPRT-02, SPRT-03, SPRT-04,
SPRT-05, DATA-01, DATA-02, DATA-03, DATA-04, DATA-05 **Success Criteria** (what
must be TRUE):

1. User sees a list of spirit rows showing name, image, and complexity label
2. Tapping a spirit row navigates to spirit detail page with shareable URL
3. River Surges in Sunlight and Lightning's Swift Strike are fully populated
   with all aspects
4. Credits/attribution page is accessible with disclaimer and external source
   links **Plans**: 6 plans

Plans:

- [x] 02-01-PLAN.md — Design system setup (Tailwind v4 + shadcn/ui + Spirit Island theme)
- [x] 02-02-PLAN.md — Convex spirit schema and seed data
- [x] 02-03-PLAN.md — Spirit list route and components
- [x] 02-04-PLAN.md — Filter system with bottom sheet
- [x] 02-05-PLAN.md — Spirit detail route with View Transitions
- [x] 02-06-PLAN.md — Bottom navigation, credits page, and E2E tests

### Phase 2.1: Spirit Library Polish (INSERTED)

**Goal**: Address UAT issues from Phase 2 - fix data gaps, improve UI polish, resolve SSR errors
**Depends on**: Phase 2 **Requirements**: From UAT gaps **Success Criteria** (what must be TRUE):

1. Spirit images load correctly (scraped from Spirit Island wiki)
2. All aspects present including Immense for Lightning's Swift Strike
3. Aspect complexity modifiers displayed (up/down/equal arrows with color coding)
4. Touch targets meet 44px minimum, pointer cursors on interactive elements
5. SSR errors resolved (Convex queries skip during server render)
6. View transitions animate between list and detail pages

**UAT Gaps to Address:**
- Images: Scrape from wiki (spiritislandwiki.com)
- Data: Add Immense aspect, fix aspect complexity values
- UI: Complexity color coding, element colors in filters, touch targets, pointer cursors
- Layout: Fix Clear All button shift, filter chip sizing
- SSR: Fix Convex useQuery outside provider errors
- Transitions: Enable view transitions for title and image
- Content: Add longer description field for spirit theme/playstyle
- Aspect title: Show just aspect name, not "Spirit (Aspect)"

**Plans**: 6 plans

Plans:
- [x] 02.1-01-PLAN.md — Schema + data: add Immense, complexityModifier, description
- [x] 02.1-02-PLAN.md — Scrape spirit images from wiki
- [x] 02.1-03-PLAN.md — Touch targets + cursor-pointer fixes
- [x] 02.1-04-PLAN.md — Color coding for complexity and elements
- [x] 02.1-05-PLAN.md — Fix view transition CSS
- [x] 02.1-06-PLAN.md — Aspect title display + description field

### Phase 3: Spirit Detail & Board

**Goal**: Complete spirit detail pages with variant selection and board
visualization **Depends on**: Phase 2 **Requirements**: DTAIL-01, DTAIL-02,
DTAIL-03, DTAIL-04, DTAIL-05, DTAIL-06, DTAIL-07, DTAIL-08, BOARD-01, BOARD-02,
BOARD-03, BOARD-04, BOARD-05 **Success Criteria** (what must be TRUE):

1. User can switch between base spirit and aspects using variant selector
2. Overview tab shows complexity, strengths, weaknesses, and power ratings radar
   chart
3. Growth panel displays all growth options with clear iconography
4. Presence tracks render as discrete slots showing energy, card plays,
   elements, reclaim
5. Links to wiki, FAQ, and external resources work from spirit detail page

**Plans**: 6 plans

Plans:

- [x] 03-01-PLAN.md — Schema extension and seed data with board information
- [x] 03-02-PLAN.md — Dependencies and variant tabs with URL sync
- [x] 03-03-PLAN.md — Overview section with radar chart
- [x] 03-04-PLAN.md — Growth panel and presence tracks
- [x] 03-05-PLAN.md — Innate powers, special rules, and card hand
- [x] 03-06-PLAN.md — External links and E2E verification

### Phase 3.1: Spirit Board Polish (INSERTED)

**Goal**: Address UAT issues from Phase 3 - fix DSL system for growth/innates/cards, create element SVG icons, correct schema and data, improve visual design
**Depends on**: Phase 3 **Requirements**: From UAT gaps **Success Criteria** (what must be TRUE):

1. Variant tabs show "Base" label, no vertical scroll, gradient highlight, sticky header with aspect name
2. Radar chart visible on dark background with spider web grid lines
3. Overview section in sidebar on desktop, collapsible on mobile
4. Growth panel shows correct data (G1/G2/G3) with typed DSL and SVG icons for actions
5. Presence tracks support complex spirits (Serpent pattern), gradient backgrounds, pointer cursor
6. Innate powers have speed/range/target header, 8 element SVG icons, shared DSL with cards
7. Cards renamed, speed-based colored outlines, two-line layout with shared DSL
8. External links use consistent styling with credits page

**UAT Gaps to Address:**
- Tabs: "Base" label, no vertical scroll, gradient highlight, sticky header with aspect name
- Radar: Visibility on dark bg, spider web grid, higher contrast
- Layout: Sidebar on desktop for overview/description, collapsible on mobile
- Growth: Schema redesign (G1/G2/G3), correct data from wiki, typed action DSL, SVG icons
- Presence: Dynamic track support, innate unlock slots, gradient backgrounds
- Innates: Speed/range/target header, 8 element SVGs, effect text DSL, shared with cards
- Cards: Rename to "Cards", speed-based outline color, range/target fields
- External Links: Consistent styling with credits page

**Plans**: 7 plans

Plans:
- [x] 03.1-01-PLAN.md — Element SVG icons and power DSL types (foundation)
- [x] 03.1-02-PLAN.md — Schema redesign and correct seed data
- [x] 03.1-03-PLAN.md — Variant tabs and radar chart visual polish
- [x] 03.1-04-PLAN.md — Growth panel redesign with icons
- [x] 03.1-05-PLAN.md — Presence track dynamic array and styling
- [x] 03.1-06-PLAN.md — Innate powers and card hand shared DSL
- [x] 03.1-07-PLAN.md — Responsive layout and external links polish

### Phase 3.2: Spirit Board Refinements (INSERTED)

**Goal**: Address remaining UI/UX issues - minimalist aspect navigation, proper scroll behavior, refined growth panel, and support for complex spirits (Fractured Days, Starlight, Finder, Serpent)
**Depends on**: Phase 3.1 **Requirements**: From UAT gaps **Success Criteria** (what must be TRUE):

1. Aspect nav bar uses minimalist styling (no gradient), scrolls behind header, shows aspect name in header when scrolled
2. Aspect nav bar only renders for spirits with 1+ aspects
3. Complexity/element pills extracted below spirit name, description in collapsible overview
4. Growth panel uses neutral icons, minimal text (just modifiers), equal-size action cards with CSS subgrid, tooltips on hover
5. Growth schema supports complex patterns (Fractured Days choose-from-four style)
6. Presence tracks use spirit-specific colors, support 3+ tracks and connected/overlapping tracks (Finder, Starlight)
7. Innate powers show elements and effect in one line, speed indicated by border color (not badge)
8. Cards section split into hand/discard (collapsible), equal-width cards, ellipsis for long titles, speed via border only
9. New spirits added: Finder of Paths Unseen, Starlight Seeks Its Form, Fractured Days Split the Sky, Serpent Slumbering Beneath the Island

**UAT Gaps to Address:**
- Tabs: Remove gradient, minimalist style, scroll behind header, aspect name in header when scrolled
- Conditional render: Hide aspect nav when no aspects exist
- Layout: Extract pills below name, move description into overview section
- Growth: Neutral colors, bigger icons, minimal text (modifiers only), CSS subgrid for equal sizing, support Fractured Days pattern
- Presence: Spirit-specific gradient colors, 3+ tracks, connected/overlapping tracks support
- Innates: Single-line elements+effect, border color for speed (no badge)
- Cards: Hand/discard sections, collapsible with count, equal width, ellipsis, border-only speed
- Data: Add 4 complex spirits to demonstrate all patterns

**Plans**: 10 plans

Plans:
- [x] 03.2-01-PLAN.md — Install react-intersection-observer, spirit track colors, schema extensions
- [x] 03.2-02-PLAN.md — Minimalist aspect tabs with scroll detection
- [x] 03.2-03-PLAN.md — Growth panel CSS subgrid and tooltips
- [x] 03.2-04-PLAN.md — Spirit-specific presence colors and cards hand/discard
- [x] 03.2-05-PLAN.md — Innate powers border-only speed styling
- [x] 03.2-06-PLAN.md — Seed data for 4 complex spirits
- [x] 03.2-07-PLAN.md — Fix seed data colors and presence track type (gap closure)
- [x] 03.2-08-PLAN.md — Growth panel simplification with hover effects (gap closure)
- [x] 03.2-09-PLAN.md — Cards and innates full border with collapsible innates (gap closure)
- [x] 03.2-10-PLAN.md — Tabs z-index fix (gap closure)

### Phase 3.3: Spirit Board Final Polish (INSERTED)

**Goal**: Address final cosmetic issues and enhance presence track visualization for complex spirits (Finder, Starlight, Serpent)
**Depends on**: Phase 3.2 **Requirements**: From UAT gaps **Success Criteria** (what must be TRUE):

1. G1/G2/G3 labels show on hover only (not always visible), positioned absolute top-right of growth cards
2. Presence track indicators use Radix Tooltip with connection details
3. Unlock track indicators show tooltip explaining growth unlock
4. presenceCap slots display cap values prominently with appropriate styling
5. Complex spirits render their unique track patterns correctly

**UAT Gaps to Address:**
- Growth: G1/G2/G3 badges hover-only with absolute top-right positioning for more compact cards
- Presence: Enhanced track indicators with Radix Tooltip (connectionPoint info)
- Presence: presenceCap display in slots for Serpent's Deep Slumber track

**Plans**: 2 plans

Plans:
- [x] 03.3-01-PLAN.md — Growth panel hover-reveal G1/G2/G3 labels
- [x] 03.3-02-PLAN.md — Enhanced presence track indicators and presenceCap display

### Phase 4: PWA & Offline

**Goal**: App works offline with cached reference data and proper update flow
**Depends on**: Phase 3 **Requirements**: PWA-01, PWA-02, PWA-03, PWA-04,
PWA-05, PWA-06, PWA-07 **Success Criteria** (what must be TRUE):

1. User can install app to home screen (PWA manifest valid)
2. App loads and displays spirit library when completely offline
3. Offline indicator appears only when disconnected, disappears on reconnection
4. Update banner appears when new service worker is waiting; user controls when
   to reload **Plans**: TBD

Plans:

- [ ] 04-01: TBD

### Phase 5: Opening Scrubber

**Goal**: Users can visually scrub through spirit openings turn-by-turn (core
differentiator) **Depends on**: Phase 3 (requires spirit board visualization)
**Requirements**: OPEN-01, OPEN-02, OPEN-03, OPEN-04, OPEN-05, OPEN-06, OPEN-07,
OPEN-08, OPEN-09, OPEN-10, OPEN-11, OPEN-12, OPEN-13, SRCH-01, SRCH-02, SRCH-03
**Success Criteria** (what must be TRUE):

1. User sees list of available openings for current spirit variant
2. Scrubbing timeline updates board to show exact state at selected turn
3. Growth panel highlights chosen options; presence tracks show slot-by-slot
   state
4. Cards played appear as chips; tapping opens full preview from external source
5. Global search finds spirits, openings, and works offline **Plans**: TBD

Plans:

- [ ] 05-01: TBD

### Phase 6: User Data

**Goal**: Logged-in users can track games, export/import CSV, and take notes
with backlinks **Depends on**: Phase 4 (requires offline architecture for cached
user data) **Requirements**: GAME-01, GAME-02, GAME-03, GAME-04, GAME-05,
GAME-06, GAME-07, GAME-08, GAME-09, GAME-10, GAME-11, GAME-12, GAME-13, CSV-01,
CSV-02, CSV-03, CSV-04, CSV-05, CSV-06, CSV-07, NOTE-01, NOTE-02, NOTE-03,
NOTE-04, NOTE-05, NOTE-06, NOTE-07, NOTE-08 **Success Criteria** (what must be
TRUE):

1. User can create a game with 1-6 spirits, adversary, scenario, and score
2. User can edit and delete existing games with confirmation
3. CSV export downloads all games in Excel-friendly format; import validates and
   previews
4. User can create rich-text notes attached to spirits, openings, or games
5. Backlinks appear on spirit/opening/game pages showing which notes mention
   them **Plans**: TBD

Plans:

- [ ] 06-01: TBD

### Phase 7: Admin Tools

**Goal**: Admin users can visually author openings and manage seed data
**Depends on**: Phase 5 (requires opening data model) **Requirements**: ADMN-01,
ADMN-02, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ADMN-07, ADMN-08, ADMN-09 **Success
Criteria** (what must be TRUE):

1. Admin routes are inaccessible to non-admin users (Clerk role check)
2. Admin can create opening by selecting growth options and presence placements
   visually
3. Admin can add cards played, per-turn notes, and strategy text to opening
4. Saved opening appears in public opening list for that spirit **Plans**: TBD

Plans:

- [ ] 07-01: TBD

## Cross-Cutting Requirements

These requirements apply across all phases and are validated throughout
development:

**UI/UX (UI-01 through UI-10):**

- Mobile-first responsive design with dark theme default
- Bottom tabs always visible; shareable URLs for all main entities
- Touch-optimized targets; color contrast meets WCAG AA
- Toast notifications for errors; no loading spinners (reserve space)

**Testing (TEST-01 through TEST-08):**

- E2E tests added as features are built
- TEST-01 to TEST-04: Covered in Phases 2-3 (spirit library, detail, scrubber)
- TEST-05 to TEST-06: Covered in Phase 6 (game tracker, CSV)
- TEST-07 to TEST-08: Covered in Phase 4 (offline, update banner)

## Progress

**Execution Order:** Phases execute in numeric order: 1 > 2 > 2.1 > 3 > 3.1 > 3.2 > 3.3 > 4 > 5 > 6 > 7

| Phase                          | Plans Complete | Status      | Completed  |
| ------------------------------ | -------------- | ----------- | ---------- |
| 1. Foundation & Authentication | 7/7            | Complete    | 2026-01-25 |
| 2. Spirit Library              | 6/6            | Complete    | 2026-01-25 |
| 2.1 Spirit Library Polish      | 6/6            | Complete    | 2026-01-25 |
| 3. Spirit Detail & Board       | 6/6            | Complete    | 2026-01-26 |
| 3.1 Spirit Board Polish        | 7/7            | Complete    | 2026-01-27 |
| 3.2 Spirit Board Refinements   | 10/10          | Complete    | 2026-01-27 |
| 3.3 Spirit Board Final Polish  | 2/2            | Complete    | 2026-01-27 |
| 4. PWA & Offline               | 0/TBD          | Pending     | -          |
| 5. Opening Scrubber            | 0/TBD          | Pending     | -          |
| 6. User Data                   | 0/TBD          | Pending     | -          |
| 7. Admin Tools                 | 0/TBD          | Pending     | -          |

---

_Roadmap created: 2025-01-25_ _Depth: comprehensive (7 phases)_ _Total v1
requirements: 89_
