# The Dahan Codex

## What This Is

A companion app for the board game Spirit Island, designed for the community.
The app provides a spirits reference library with detailed overviews, and most
importantly, text-based turn-by-turn opening guides that make spirit
openings understandable at a glance rather than walls of text. Logged-in users
can track their games with CSV export/import.

## Core Value

**Text-Based Opening Guides** — structured, turn-by-turn opening guides for
Spirit Island spirits. Users browse spirits, view power ratings and
strengths/weaknesses, then read curated opening guides that explain growth
choices and strategy for the first few turns. 85 opening guides cover all
major spirits from community sources.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Spirits Library (Public)

- [x] List of all 37 spirits with filters (expansion, complexity, elements)
- [x] Each spirit has Overview: complexity label, strengths (3-6 bullets),
      weaknesses (3-6 bullets)
- [x] Radar chart visualization for power ratings (Offense, Control, Fear,
      Defense, Utility)
- [x] Spirit Variants as first-class: base variant + aspect variants
- [x] Variant selector on spirit page (Base + list of aspects)
- [x] Links to external sources (wiki) with credits page
- [x] Per-spirit wiki links + global attribution page

#### Opening Guides (Public)

- [x] Text-based turn-by-turn opening guides
- [x] Multiple openings per spirit shown as tabs
- [x] Openings display as collapsible accordions (one per turn, default open)
- [x] Opening metadata: name, author, source URL
- [x] Admin CRUD for creating/editing/deleting openings
- [x] 85 opening guides seeded from community sources

#### Game Tracker (Logged-in Users)

- [x] Track: date, result (win/loss), 1-6 spirits (dynamic list entry)
- [x] Each spirit entry: spirit variant + optional player name
- [x] Optional scenario: name + structured difficulty
- [x] Optional adversary with level (0-6)
- [x] Optional secondary adversary with level
- [x] Official Spirit Island scoring
- [x] Notes field
- [x] CSV export: Excel-friendly, stable schema, fixed columns (spirit1-spirit6)
- [x] CSV import: validates known names, allows custom/unknown, preview before import

#### Search & Navigation

- [x] Client-side search across spirits (name, description, aspect names, works offline)
- [x] Bottom tabs always visible on all screens (Spirits / Games / Settings)
- [x] Spirit detail page has variant tabs + openings section
- [x] Shareable URLs for spirits, variants, openings

#### Authentication & Authorization

- [x] Clerk auth
- [x] Public read-only: spirits library, openings viewable without login
- [x] Logged-in users: game tracking
- [x] Admin role (Clerk): access to opening editor via edit mode

#### PWA & Offline

- [x] Full Progressive Web App: installable, offline capable
- [x] Cache everything for offline read-only experience
- [x] Reference data cached via TanStack Query + IndexedDB
- [x] User data (games) cached with offline write outbox
- [x] In-app update banner ("New version available → Reload")
- [x] Offline indicator shown only when disconnected

#### UI/UX

- [x] Mobile-first design
- [x] Dark theme first; light theme toggle in Settings
- [x] Modern UI with Spirit Island color accents (element + complexity colors)
- [x] Toast notifications for errors (sonner)
- [x] Offline indicator shown only when disconnected
- [x] Touch-first with 44px touch targets
- [x] Accessibility: touch targets, color contrast

#### Credits & Attribution

- [x] Credits/Attribution page listing all external data sources
- [x] Per-spirit links to wiki pages
- [x] Disclaimer: "The Dahan Codex is an unofficial fan project and is not
      affiliated with Greater Than Games, LLC."

### Future (v2+)

- **Graphical Opening Scrubber** — interactive board visualization with
  timeline slider (abandoned in v1 due to complexity, may revisit)
- **Notes with backlinks** — rich-text notes attachable to spirits/games
- **Favorites / Recently viewed** — per-user tracking
- **Push notifications** — after explicit opt-in
- **Bundled card images** — from card-katalog repo
- **Visual opening builder** — WYSIWYG admin tool

### Out of Scope

- **Offline writes** — v1 has outbox pattern for games; full offline sync
  planned for v2
- **Login system complexity** — No custom auth; Clerk handles everything
- **R2 storage** — Not needed; images bundled with app
- **i18n** — English only
- **Visual regression tests** — Functional Playwright tests only
- **Board-relative presence placement** — Track slots only, not land positions
- **Growth validation** — Display all options, trust author picked correctly
- **Loading skeletons/spinners** — App should be fast enough; reserve space

## Context

### Primary Research Sources

- **Spirit Island Wiki** (authoritative names + structures):
  - Spirits list: https://spiritislandwiki.com/index.php?title=List_of_Spirits
  - Aspects list:
    https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards
  - Scenarios list: https://spiritislandwiki.com/index.php?title=Scenarios
  - Adversaries list:
    https://spiritislandwiki.com/index.php?title=List_of_Adversaries
- **Card info + artwork lookup**: https://sick.oberien.de/?query=
- **Card images repo** (for v2 bundling):
  https://github.com/oberien/spirit-island-card-katalog
- **Community + rulings**:
  - Reddit: https://www.reddit.com/r/spiritisland/
  - FAQ/rulings:
    https://querki.net/u/darker/spirit-island-faq/#!spirit-island-faq

### Content Rules (Non-negotiable)

- Do NOT copy large bodies of wiki text into the app
- Prefer: (a) original short summaries, (b) structured data (names, numbers,
  labels), (c) links to sources
- Spirit overview content: derive from wiki structure, use AI for
  summaries/ratings
- Openings: curated from community sources (Reddit, BGG, strategy guides)
- Art: use wiki images, bundle with app

### Reference Data Scope

- **Expansions**: Base Game, Branch & Claw, Jagged Earth, Feather & Flame,
  Horizons, Nature Incarnate, promos
- **Spirits**: All 37 base spirits + 31 aspects
- **Adversaries**: All official (hardcoded constants for v1)
- **Scenarios**: All official (hardcoded constants for v1)
- **Openings**: 85 guides from community sources

### Data Architecture

- **Convex** is cloud-first source of truth
- **Convex generates types** used by app
- **Convex functions organized by domain**: spirits.ts, games.ts, openings.ts
- **Offline**: TanStack Query cache persisted to IndexedDB via idb-keyval
- **Seeding**: TS files seed Convex on deploy (no runtime scraping)
- **Scraping**: One-time scripts scrape wiki for spirit/aspect data

## Constraints

- **Tech stack**: TanStack Router (React 19 + TypeScript, client-only SPA),
  TanStack Query, Convex, Clerk, Cloudflare Pages, Tailwind CSS v4, Radix
  primitives (shadcn/ui), Recharts — these are fixed choices
- **Package manager**: pnpm
- **Tooling**: Biome (formatting/linting), lefthook (git hooks),
  commitlint (conventional commits), knip (unused code), jscpd (duplication)
- **Testing**: Playwright E2E only (Chromium), real spirit data (not mocks)
- **Deployment**: Cloudflare Pages (client-only SPA)
- **Auth**: Clerk only, no custom auth system
- **Licensing**: Unofficial fan project, all Spirit Island materials belong to
  Greater Than Games, LLC

## Key Decisions

| Decision                             | Rationale                                                            | Outcome             |
| ------------------------------------ | -------------------------------------------------------------------- | ------------------- |
| Client-only SPA (not SSR)            | No SEO benefit, SSR added Clerk/Convex hydration complexity          | Decided (quick-010) |
| Clerk auth from M1                   | Easier to build with auth infrastructure than retrofit later         | Decided (Phase 1)   |
| Convex cloud-first (not local-first) | Simplifies v1 significantly; local-first sync is complex             | Decided (Phase 1)   |
| Text openings (not graphical scrubber) | Graphical board too complex for all spirit patterns                | Decided (Phase 3.6) |
| Radar chart for power ratings        | Shows spirit's "shape" at a glance better than bar charts            | Decided (Phase 3)   |
| idb-keyval (not Dexie.js)            | Simpler key-value storage sufficient for TanStack Query persistence  | Decided (Phase 4)   |
| vite-plugin-pwa injectManifest       | Generates SW from TypeScript src/sw.ts                               | Decided (Phase 4)   |
| No loading states                    | Force fast performance; offline-first cached data is instant         | Decided (Phase 4)   |
| Bundle images (no R2)                | Simplifies architecture; images are static reference data            | Decided (Phase 8)   |
| Fixed CSV columns                    | Excel-friendly; spirit1-spirit6 columns easier than delimited        | Decided (Phase 6)   |
| Client-side search                   | Works offline; data volume manageable for in-memory search           | Decided (Phase 5)   |
| Outbox pattern for offline writes    | Games saved to IndexedDB when offline, synced when online            | Decided (Phase 6)   |

---

_Last updated: 2026-02-13_
