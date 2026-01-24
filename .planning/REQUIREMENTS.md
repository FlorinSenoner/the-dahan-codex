# Requirements: The Dahan Codex

**Defined:** 2025-01-24
**Core Value:** The Opening Scrubber — graphical, scrubbable visualization of spirit openings

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: TanStack Start project with file-based routing
- [ ] **INFRA-02**: Convex backend connected with real-time subscriptions
- [ ] **INFRA-03**: Manual Workbox PWA setup (service worker generation validated in CI)
- [ ] **INFRA-04**: Cloudflare Workers deployment (pinned TanStack Start version)
- [ ] **INFRA-05**: Biome formatting/linting configured
- [ ] **INFRA-06**: mise toolchain management configured
- [ ] **INFRA-07**: Pre-commit hooks running Biome checks
- [ ] **INFRA-08**: GitHub Actions CI (biome, typecheck, build, Playwright)
- [ ] **INFRA-09**: Sentry error monitoring integrated

### Authentication

- [ ] **AUTH-01**: Clerk sign-in/sign-up flow
- [ ] **AUTH-02**: Admin role detection via Clerk
- [ ] **AUTH-03**: Public read access (spirits/openings viewable without login)
- [ ] **AUTH-04**: Authenticated write access (games/notes require login)
- [ ] **AUTH-05**: Session persistence across browser refresh
- [ ] **AUTH-06**: SSR auth token handling in route loaders

### PWA & Offline

- [ ] **PWA-01**: App is installable (add to home screen)
- [ ] **PWA-02**: App works offline in read-only mode
- [ ] **PWA-03**: In-app update banner when new version available
- [ ] **PWA-04**: Reference data (spirits, adversaries, scenarios) precached for offline
- [ ] **PWA-05**: User data (games, notes) cached from Convex for offline viewing
- [ ] **PWA-06**: Offline indicator shown only when disconnected
- [ ] **PWA-07**: User-prompted update flow (no automatic skipWaiting)

### Spirit Library

- [ ] **SPRT-01**: Spirit list displays as grid/cards with spirit images
- [ ] **SPRT-02**: Spirit list shows complexity label per spirit
- [ ] **SPRT-03**: Tap spirit card navigates to spirit detail page
- [ ] **SPRT-04**: v1 includes River Surges in Sunlight with all aspects
- [ ] **SPRT-05**: v1 includes Lightning's Swift Strike with all aspects

### Spirit Detail

- [ ] **DTAIL-01**: Spirit detail page with sub-tabs (Overview | Openings)
- [ ] **DTAIL-02**: Variant selector shows base spirit + available aspects
- [ ] **DTAIL-03**: Switching variant updates all displayed content
- [ ] **DTAIL-04**: Overview shows complexity label
- [ ] **DTAIL-05**: Overview shows strengths (3-6 bullets)
- [ ] **DTAIL-06**: Overview shows weaknesses (3-6 bullets)
- [ ] **DTAIL-07**: Radar chart displays power ratings (Offense, Control, Fear, Defense, Utility)
- [ ] **DTAIL-08**: Links to wiki page, FAQ, and external resources

### Spirit Board Visualization

- [ ] **BOARD-01**: Growth panel displays all growth options for variant
- [ ] **BOARD-02**: Presence tracks display as discrete slots
- [ ] **BOARD-03**: Each presence slot shows what it grants (energy, card plays, elements, reclaim, etc.)
- [ ] **BOARD-04**: Innate powers display with element thresholds
- [ ] **BOARD-05**: Special rules display (e.g., River's "Massive Flooding")

### Opening Scrubber

- [ ] **OPEN-01**: Opening list shows available openings for current variant
- [ ] **OPEN-02**: Opening detail displays turn timeline/slider
- [ ] **OPEN-03**: Scrubbing to a turn shows exact board state at that turn
- [ ] **OPEN-04**: Growth panel highlights chosen growth option(s) per turn
- [ ] **OPEN-05**: Presence tracks update to show state at selected turn
- [ ] **OPEN-06**: Cards played shown with full card preview (load from sick.oberien.de)
- [ ] **OPEN-07**: Card preview opens in in-app browser/modal
- [ ] **OPEN-08**: Step forward/back buttons navigate turns one at a time
- [ ] **OPEN-09**: Play/animate mode auto-advances through turns
- [ ] **OPEN-10**: Per-turn notes shown as expandable section
- [ ] **OPEN-11**: Strategy accordion for long-form text (collapsed by default)
- [ ] **OPEN-12**: Strategy text includes source links (wiki, reddit, FAQ)
- [ ] **OPEN-13**: Animated transitions between turns (respect prefers-reduced-motion)

### Game Tracker

- [ ] **GAME-01**: Create game with date and result (win/loss)
- [ ] **GAME-02**: Add 1-6 spirits per game (dynamic list entry)
- [ ] **GAME-03**: Each spirit entry specifies variant (base or aspect)
- [ ] **GAME-04**: Optional player name per spirit
- [ ] **GAME-05**: Optional scenario selection with structured difficulty
- [ ] **GAME-06**: Optional primary adversary with level (0-6)
- [ ] **GAME-07**: Optional secondary adversary with level
- [ ] **GAME-08**: Official Spirit Island score calculation
- [ ] **GAME-09**: Notes field for game
- [ ] **GAME-10**: Game list view shows all recorded games
- [ ] **GAME-11**: Game detail view shows full game information
- [ ] **GAME-12**: Edit existing game
- [ ] **GAME-13**: Delete game (with confirmation)

### CSV Export/Import

- [ ] **CSV-01**: Export games to CSV (Excel-friendly format)
- [ ] **CSV-02**: CSV uses fixed columns: spirit1-spirit6 (empty if unused)
- [ ] **CSV-03**: CSV includes all game fields (date, result, scenario, adversary, score, notes)
- [ ] **CSV-04**: Import games from CSV
- [ ] **CSV-05**: Import validates known spirit/adversary/scenario names
- [ ] **CSV-06**: Import allows unknown/custom names
- [ ] **CSV-07**: Import shows preview before confirming

### Notes

- [ ] **NOTE-01**: Create notes with rich-text editor (bold, italic, headers, lists, links)
- [ ] **NOTE-02**: Attach notes to spirits
- [ ] **NOTE-03**: Attach notes to openings
- [ ] **NOTE-04**: Attach notes to games
- [ ] **NOTE-05**: Notes list view shows all user notes
- [ ] **NOTE-06**: Backlinks displayed on spirit/opening/game pages ("X notes mention this")
- [ ] **NOTE-07**: Edit existing notes
- [ ] **NOTE-08**: Delete notes (with confirmation)

### Search

- [ ] **SRCH-01**: Global client-side search across spirits, openings, games, notes
- [ ] **SRCH-02**: Search works offline (searches cached data)
- [ ] **SRCH-03**: Search results grouped by type

### Admin

- [ ] **ADMN-01**: Admin routes accessible only with admin Clerk role
- [ ] **ADMN-02**: Visual opening builder (WYSIWYG)
- [ ] **ADMN-03**: Opening builder: select growth options by clicking
- [ ] **ADMN-04**: Opening builder: drag/select presence placement
- [ ] **ADMN-05**: Opening builder: add cards played per turn
- [ ] **ADMN-06**: Opening builder: add per-turn notes
- [ ] **ADMN-07**: Opening builder: add strategy text
- [ ] **ADMN-08**: Opening builder: save opening to Convex
- [ ] **ADMN-09**: Seed data management tools

### Reference Data

- [ ] **DATA-01**: All official adversaries with levels
- [ ] **DATA-02**: All official scenarios with difficulty
- [ ] **DATA-03**: Expansion metadata (which box each spirit/adversary/scenario belongs to)
- [ ] **DATA-04**: Credits/attribution page with all external data sources
- [ ] **DATA-05**: Legal disclaimer ("Not affiliated with Greater Than Games, LLC")

### UI/UX

- [ ] **UI-01**: Mobile-first responsive design
- [ ] **UI-02**: Dark theme as default
- [ ] **UI-03**: Light theme toggle in Settings
- [ ] **UI-04**: Hybrid styling (modern UI with Spirit Island color/icon accents)
- [ ] **UI-05**: Bottom tabs always visible (Spirits / Games / Notes / Settings)
- [ ] **UI-06**: Shareable URLs for spirits, variants, openings
- [ ] **UI-07**: Touch-optimized targets
- [ ] **UI-08**: Color contrast meets WCAG AA
- [ ] **UI-09**: Toast notifications for errors
- [ ] **UI-10**: No loading spinners/skeletons (reserve space, be fast)

### Testing

- [ ] **TEST-01**: Playwright E2E: spirit list renders
- [ ] **TEST-02**: Playwright E2E: spirit detail displays overview and radar chart
- [ ] **TEST-03**: Playwright E2E: variant switching changes content
- [ ] **TEST-04**: Playwright E2E: opening scrubber navigation works
- [ ] **TEST-05**: Playwright E2E: game creation and listing
- [ ] **TEST-06**: Playwright E2E: CSV export/import roundtrip
- [ ] **TEST-07**: Playwright E2E: app loads offline with cached data
- [ ] **TEST-08**: Playwright E2E: update banner appears on SW update

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Spirit Library

- **SPRT-V2-01**: Filter spirits by expansion
- **SPRT-V2-02**: Filter spirits by complexity
- **SPRT-V2-03**: Favorites (mark spirits as favorites)
- **SPRT-V2-04**: Recently viewed tracking
- **SPRT-V2-05**: All 37+ spirits with aspects

### Notes

- **NOTE-V2-01**: Tags for categorizing notes

### PWA

- **PWA-V2-01**: Offline writes with queue & sync
- **PWA-V2-02**: Push notifications for app updates (after opt-in)

### Advanced

- **ADV-V2-01**: Card images bundled with app (from card-katalog repo)
- **ADV-V2-02**: Turn diffs highlighted in scrubber

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time multiplayer sync | Massive complexity, connectivity issues at game tables |
| Game AI / automation | Competes with official Handelabra digital app |
| Card image hosting (v1) | Load from external source first, bundle in v2 |
| Spirit synergy recommendations | Requires community data integration |
| Multiple languages (i18n) | English only for v1 |
| Board-relative presence placement | Track slots only, not island positions |
| Growth option validation | Trust opening authors, display-only |
| Visual regression tests | Functional E2E sufficient for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-* | Phase 1 | Pending |
| AUTH-* | Phase 1 | Pending |
| PWA-* | Phase 2-3 | Pending |
| SPRT-* | Phase 2 | Pending |
| DTAIL-* | Phase 3 | Pending |
| BOARD-* | Phase 3 | Pending |
| OPEN-* | Phase 4 | Pending |
| GAME-* | Phase 5 | Pending |
| CSV-* | Phase 5 | Pending |
| NOTE-* | Phase 5 | Pending |
| SRCH-* | Phase 4 | Pending |
| ADMN-* | Phase 6 | Pending |
| DATA-* | Phase 2 | Pending |
| UI-* | All | Pending |
| TEST-* | All | Pending |

**Coverage:**
- v1 requirements: 89 total
- Mapped to phases: 89
- Unmapped: 0 ✓

---
*Requirements defined: 2025-01-24*
*Last updated: 2025-01-24 after initial definition*
