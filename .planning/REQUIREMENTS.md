# Requirements: The Dahan Codex

**Defined:** 2025-01-24 **Updated:** 2026-02-13
**Core Value:** Text-based turn-by-turn opening guides for Spirit Island spirits

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: TanStack Router project with file-based routing (changed from TanStack Start)
- [x] **INFRA-02**: Convex backend connected with real-time subscriptions
- [x] **INFRA-03**: vite-plugin-pwa with injectManifest strategy (changed from manual Workbox)
- [x] **INFRA-04**: Cloudflare Pages deployment (client-only SPA)
- [x] **INFRA-05**: Biome formatting/linting configured
- [x] **INFRA-06**: lefthook git hooks (changed from mise)
- [x] **INFRA-07**: Pre-commit hooks running Biome checks
- [x] **INFRA-08**: GitHub Actions CI (biome, typecheck, build, Playwright)
- [ ] **INFRA-09**: Sentry error monitoring integrated (not yet implemented)

### Authentication

- [x] **AUTH-01**: Clerk sign-in/sign-up flow
- [x] **AUTH-02**: Admin role detection via Clerk (role-based, publicMetadata.role)
- [x] **AUTH-03**: Public read access (spirits/openings viewable without login)
- [x] **AUTH-04**: Authenticated write access (games require login)
- [x] **AUTH-05**: Session persistence across browser refresh
- [x] **AUTH-06**: ~~SSR auth token handling~~ (Removed: client-only SPA)

### PWA & Offline

- [x] **PWA-01**: App is installable (add to home screen)
- [x] **PWA-02**: App works offline in read-only mode
- [x] **PWA-03**: In-app update banner when new version available
- [x] **PWA-04**: Reference data (spirits, openings) cached via TanStack Query + IndexedDB
- [x] **PWA-05**: User data (games) cached for offline viewing + outbox for offline writes
- [x] **PWA-06**: Offline indicator shown only when disconnected
- [x] **PWA-07**: User-prompted update flow (no automatic skipWaiting)

### Spirit Library

- [x] **SPRT-01**: Spirit list displays as rows with spirit images
- [x] **SPRT-02**: Spirit list shows complexity label per spirit
- [x] **SPRT-03**: Tap spirit row navigates to spirit detail page
- [x] **SPRT-04**: All 37 base spirits with aspects (expanded from v1 scope)
- [x] **SPRT-05**: Filter by complexity, elements, and text search

### Spirit Detail

- [x] **DTAIL-01**: Spirit detail page with variant tabs and openings section
- [x] **DTAIL-02**: Variant selector shows base spirit + available aspects
- [x] **DTAIL-03**: Switching variant updates all displayed content
- [x] **DTAIL-04**: Overview shows complexity label
- [x] **DTAIL-05**: Overview shows strengths (3-6 bullets)
- [x] **DTAIL-06**: Overview shows weaknesses (3-6 bullets)
- [x] **DTAIL-07**: Radar chart displays power ratings (Offense, Control, Fear, Defense, Utility)
- [x] **DTAIL-08**: Links to wiki page and external resources

### Text-Based Openings (changed from graphical scrubber)

- [x] **OPEN-01**: Opening list shows available openings for current variant
- [x] **OPEN-02**: Openings display as collapsible turn-by-turn accordions
- [x] **OPEN-03**: Multiple openings per spirit shown as tabs
- [x] **OPEN-04**: Opening metadata: name, author, source URL
- [x] **OPEN-05**: Admin CRUD for creating/editing/deleting openings
- [x] **OPEN-06**: 85 opening guides from community sources seeded

### Game Tracker

- [x] **GAME-01**: Create game with date and result (win/loss)
- [x] **GAME-02**: Add 1-6 spirits per game (dynamic list entry)
- [x] **GAME-03**: Each spirit entry specifies variant (base or aspect)
- [x] **GAME-04**: Optional player name per spirit
- [x] **GAME-05**: Optional scenario selection with structured difficulty
- [x] **GAME-06**: Optional primary adversary with level (0-6)
- [x] **GAME-07**: Optional secondary adversary with level
- [x] **GAME-08**: Official Spirit Island score calculation
- [x] **GAME-09**: Notes field for game
- [x] **GAME-10**: Game list view shows all recorded games
- [x] **GAME-11**: Game detail view shows full game information
- [x] **GAME-12**: Edit existing game
- [x] **GAME-13**: Delete game (with confirmation, soft delete)

### CSV Export/Import

- [x] **CSV-01**: Export games to CSV (Excel-friendly format)
- [x] **CSV-02**: CSV uses fixed columns: spirit1-spirit6 (empty if unused)
- [x] **CSV-03**: CSV includes all game fields (date, result, scenario, adversary, score, notes)
- [x] **CSV-04**: Import games from CSV
- [x] **CSV-05**: Import validates known spirit/adversary/scenario names
- [x] **CSV-06**: Import allows unknown/custom names
- [x] **CSV-07**: Import shows preview before confirming

### Search

- [x] **SRCH-01**: Client-side search across spirits (name, description, aspect names)
- [x] **SRCH-02**: Search works offline (searches cached data)

### Reference Data

- [x] **DATA-01**: All official adversaries with levels (hardcoded constants for v1)
- [x] **DATA-02**: All official scenarios with difficulty (hardcoded constants for v1)
- [x] **DATA-03**: Expansion metadata (spirits categorized by expansion)
- [x] **DATA-04**: Credits/attribution page with all external data sources
- [x] **DATA-05**: Legal disclaimer ("Not affiliated with Greater Than Games, LLC")

### UI/UX

- [x] **UI-01**: Mobile-first responsive design
- [x] **UI-02**: Dark theme as default
- [x] **UI-03**: Light theme toggle in Settings
- [x] **UI-04**: Modern UI with Spirit Island color accents (element colors, complexity colors)
- [x] **UI-05**: Bottom tabs always visible (Spirits / Games / Settings)
- [x] **UI-06**: Shareable URLs for spirits, variants, openings
- [x] **UI-07**: Touch-optimized 44px targets
- [x] **UI-08**: Color contrast (dark theme with oklch colors)
- [x] **UI-09**: Toast notifications for errors (sonner)
- [x] **UI-10**: No loading spinners/skeletons (offline-first, cached data)

### Testing

- [x] **TEST-01**: Playwright E2E: spirit list renders
- [x] **TEST-02**: Playwright E2E: spirit detail displays overview and radar chart
- [x] **TEST-03**: Playwright E2E: variant switching changes content
- [x] **TEST-04**: Playwright E2E: opening display works
- [x] **TEST-05**: Playwright E2E: game creation and listing
- [x] **TEST-06**: Playwright E2E: CSV export accessible
- [x] **TEST-07**: Playwright E2E: app loads offline with cached data
- [x] **TEST-08**: Playwright E2E: settings and PWA manifest valid

## v2 Requirements (Deferred)

Tracked but not in current roadmap.

### Graphical Opening Scrubber

- **SCRUB-01**: Slider/timeline interaction to scrub to any turn
- **SCRUB-02**: Board re-renders exact state at selected turn
- **SCRUB-03**: Growth panel highlights chosen growth option(s) per turn
- **SCRUB-04**: Presence tracks update to show state at selected turn
- **SCRUB-05**: Cards played with full card preview (from sick.oberien.de)
- **SCRUB-06**: Step forward/back buttons
- **SCRUB-07**: Play/animate mode auto-advances through turns
- **SCRUB-08**: Animated transitions (respect prefers-reduced-motion)

### Spirit Board Visualization

- **BOARD-01**: Growth panel displays all growth options for variant
- **BOARD-02**: Presence tracks display as discrete slots
- **BOARD-03**: Each slot shows grants (energy, card plays, elements, reclaim)
- **BOARD-04**: Innate powers display with element thresholds
- **BOARD-05**: Special rules display

### Notes

- **NOTE-01**: Create notes with rich-text editor
- **NOTE-02**: Attach notes to spirits
- **NOTE-03**: Attach notes to openings
- **NOTE-04**: Attach notes to games
- **NOTE-05**: Notes list view
- **NOTE-06**: Backlinks displayed on entity pages
- **NOTE-07**: Edit existing notes
- **NOTE-08**: Delete notes

### Other v2

- **SRCH-03**: Search results grouped by type (global search across all entities)
- **SPRT-V2-01**: Filter spirits by expansion
- **SPRT-V2-03**: Favorites (mark spirits as favorites)
- **SPRT-V2-04**: Recently viewed tracking
- **PWA-V2-01**: Push notifications for app updates (after opt-in)
- **ADV-V2-01**: Card images bundled with app (from card-katalog repo)
- **ADMN-02**: Visual opening builder (WYSIWYG)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                           | Reason                                                |
| --------------------------------- | ----------------------------------------------------- |
| Real-time multiplayer sync        | Massive complexity, connectivity issues at game tables |
| Game AI / automation              | Competes with official Handelabra digital app          |
| Spirit synergy recommendations    | Requires community data integration                   |
| Multiple languages (i18n)         | English only                                          |
| Board-relative presence placement | Track slots only, not island positions                 |
| Growth option validation          | Trust opening authors, display-only                    |
| Visual regression tests           | Functional E2E sufficient                              |

## Traceability

| Requirement   | Phase                            | Status   |
| ------------- | -------------------------------- | -------- |
| INFRA-01..08  | Phase 1: Foundation & Auth       | Complete |
| INFRA-09      | Phase 1: Foundation & Auth       | Pending  |
| AUTH-01..06   | Phase 1: Foundation & Auth       | Complete |
| PWA-01..04,06,07 | Phase 4: PWA & Offline       | Complete |
| PWA-05        | Phase 6: User Data               | Complete |
| SPRT-01..05   | Phase 2 + 8: Spirit Library      | Complete |
| DTAIL-01..08  | Phase 3 + 3.1..3.3: Spirit Detail | Complete |
| OPEN-01..06   | Phase 3.6 + 5: Text Openings    | Complete |
| GAME-01..13   | Phase 6: User Data               | Complete |
| CSV-01..07    | Phase 6: User Data               | Complete |
| SRCH-01..02   | Phase 5: Text Opening Management | Complete |
| DATA-01..05   | Phase 2 + 6: Reference Data      | Complete |
| UI-01..10     | Cross-cutting (all phases)       | Complete |
| TEST-01..08   | Phases 2-6: Testing              | Complete |

**v1 Coverage:**

- Total v1 requirements: 86
- Complete: 85
- Pending: 1 (INFRA-09 Sentry)

---

_Requirements defined: 2025-01-24_ _Last updated: 2026-02-13_
