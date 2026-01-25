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
- [ ] **Phase 2: Spirit Library** - Browsable spirit list with reference data
      and basic navigation
- [ ] **Phase 3: Spirit Detail & Board** - Complete spirit pages with
      visualization (radar, presence, growth)
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

1. User sees a grid of spirit cards showing name, image, and complexity label
2. Tapping a spirit card navigates to spirit detail page with shareable URL
3. River Surges in Sunlight and Lightning's Swift Strike are fully populated
   with all aspects
4. Credits/attribution page is accessible with disclaimer and external source
   links **Plans**: TBD

Plans:

- [ ] 02-01: TBD

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
   **Plans**: TBD

Plans:

- [ ] 03-01: TBD

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

**Execution Order:** Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7

| Phase                          | Plans Complete | Status   | Completed  |
| ------------------------------ | -------------- | -------- | ---------- |
| 1. Foundation & Authentication | 7/7            | Complete | 2026-01-25 |
| 2. Spirit Library              | 0/TBD          | Pending  | -          |
| 3. Spirit Detail & Board       | 0/TBD          | Pending  | -          |
| 4. PWA & Offline               | 0/TBD          | Pending  | -          |
| 5. Opening Scrubber            | 0/TBD          | Pending  | -          |
| 6. User Data                   | 0/TBD          | Pending  | -          |
| 7. Admin Tools                 | 0/TBD          | Pending  | -          |

---

_Roadmap created: 2025-01-25_ _Depth: comprehensive (7 phases)_ _Total v1
requirements: 89_
