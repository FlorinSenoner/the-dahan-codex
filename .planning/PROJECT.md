# The Dahan Codex

## What This Is

A companion app for the board game Spirit Island, designed for the community. The app provides a spirits reference library with detailed overviews, and most importantly, a graphical turn-by-turn opening scrubber that makes spirit openings understandable at a glance rather than walls of text. Logged-in users can track their games and take notes with backlinks.

## Core Value

**The Opening Scrubber** — a graphical, scrubbable visualization of spirit openings that re-creates the spirit board mechanics in code. Users scrub through turns on a timeline and see the exact board state at each turn: growth options displayed with the chosen one highlighted, presence tracks updating slot by slot, and cards played shown with full previews. This is the key differentiator that makes openings actually learnable.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Spirits Library (Public)
- [ ] List/grid of all spirits with filters (expansion, complexity)
- [ ] Each spirit has Overview: complexity label, strengths (3-6 bullets), weaknesses (3-6 bullets)
- [ ] Radar chart visualization for power ratings (Offense, Control, Fear, Defense, Utility)
- [ ] Spirit Variants as first-class: base variant + aspect variants
- [ ] Variant selector on spirit page (Base + list of aspects)
- [ ] Links to external sources (wiki, FAQ) rather than copying text
- [ ] Per-spirit wiki links + global attribution page

#### Spirit Data Model (Full Modeling)
- [ ] Growth options: display all options available, highlight chosen (no validation needed)
- [ ] Presence tracks: discrete slots with typed grants (energy, card plays, elements, reclaim, etc.)
- [ ] Innate powers: element thresholds and effects
- [ ] Special rules: structured data (e.g., River's "Massive Flooding")

#### Opening Scrubber (Public)
- [ ] Slider/timeline interaction to scrub to any turn
- [ ] Board re-renders exact state at selected turn
- [ ] Growth panel shows all options, highlights the chosen one(s)
- [ ] Presence tracks render as discrete slots showing what each grants
- [ ] Diffs from previous turn highlighted (presence added/removed, growth choice, cards played)
- [ ] Step forward/back one turn
- [ ] Optional "play" mode animating through turns
- [ ] Animated transitions between turns (respect prefers-reduced-motion)
- [ ] Cards played shown as chips with full card preview (v1: load from sick.oberien.de)
- [ ] Card links open in in-app browser/modal
- [ ] Optional per-turn notes (expandable, small indicator)
- [ ] Accordion for long-form strategy text (collapsed by default, with source links)

#### Opening Authoring
- [ ] v1: Openings authored as JSON/TS seed files for Convex
- [ ] Strict validation at build time (fail build on invalid openings)
- [ ] Opening metadata: name/title, tags, source/author
- [ ] v2 (M4): Visual opening builder for admin (WYSIWYG, click growth options, interactive board)

#### Game Tracker (Logged-in Users)
- [ ] Track: date, result (win/loss), 1-6 spirits (dynamic list entry)
- [ ] Each spirit entry: spirit variant + optional player name
- [ ] Spirits categorized by expansion (derived)
- [ ] Optional scenario: name + structured difficulty (base number + modifier type)
- [ ] Optional adversary with level (0-6, number only)
- [ ] Optional secondary adversary with level
- [ ] Official Spirit Island scoring
- [ ] Notes field
- [ ] CSV export: Excel-friendly, stable schema, fixed columns (spirit1-spirit6, empty if unused)
- [ ] CSV import: validates known names, allows custom/unknown

#### Notes (Logged-in Users)
- [ ] Rich-text notes with basic formatting (bold, italic, headers, lists) + links
- [ ] Attachable to spirits, openings, games
- [ ] Tags
- [ ] Full backlinks (automatic bidirectional linking)
- [ ] Backlinks displayed on spirit/opening/game pages ("X notes mention this")

#### Search & Navigation
- [ ] Global client-side search across spirits, openings, games, notes (works offline)
- [ ] Bottom tabs always visible on all screens
- [ ] Spirit detail page has sub-tabs (Overview | Openings | future: Notes)
- [ ] Shareable URLs for spirits, variants, openings (/spirits/river-surges-in-sunlight)

#### Authentication & Authorization
- [ ] Clerk auth from M1
- [ ] Public read-only: spirits library, openings viewable without login
- [ ] Logged-in users: game tracking, notes
- [ ] Admin role (Clerk): access to visual opening builder, separate admin routes

#### PWA & Offline
- [ ] Full Progressive Web App: installable, offline capable
- [ ] Cache everything for native-like offline read-only experience
- [ ] App shell + spirit reference data + images precached
- [ ] User data (games/notes) cached from Convex for offline viewing
- [ ] v1: Read-only offline (no writes)
- [ ] v2: Offline writes with queue & sync
- [ ] In-app update banner ("New version available → Reload")
- [ ] v2: Optional push notifications after explicit opt-in

#### UI/UX
- [ ] Mobile-first design
- [ ] Dark theme first; light theme toggle in Settings
- [ ] Hybrid styling: clean modern UI with Spirit Island color/icon accents (earthy + elemental)
- [ ] No loading states — reserve space, be fast (3s timeout banner in v2)
- [ ] Toast notifications for errors
- [ ] Offline indicator shown only when disconnected
- [ ] Touch-first (keyboard navigation secondary)
- [ ] Respect prefers-reduced-motion for scrubber animations
- [ ] Accessibility: touch targets, color contrast

#### Credits & Attribution
- [ ] Credits/Attribution page listing all external data sources
- [ ] Thank contributors for their (indirect) contribution
- [ ] Per-spirit links to wiki pages
- [ ] Disclaimer: "The Dahan Codex is an unofficial fan project and is not affiliated with Greater Than Games, LLC. Spirit Island and all related materials, names, and images are the property of Greater Than Games, LLC."

### Out of Scope

- **Favorites** — Defer to v2, not needed for initial release
- **Recently viewed** — Defer to v2, then per-user tracking
- **Offline writes** — v1 is read-only offline; queue & sync planned for v2
- **Push notifications** — v1 uses in-app banner only; push in v2
- **Bundled card images** — v1 loads from sick.oberien.de; v2 bundles from card-katalog repo
- **Login system complexity** — No custom auth; Clerk handles everything
- **R2 storage** — Not needed; images bundled with app
- **i18n** — English only
- **Visual regression tests** — Functional Playwright tests only for v1
- **Board-relative presence placement** — Track slots only, not land positions on island
- **Growth validation** — Display all options, trust author picked correctly
- **Loading skeletons/spinners** — App should be fast enough; reserve space instead

## Context

### Primary Research Sources
- **Spirit Island Wiki** (authoritative names + structures):
  - Spirits list: https://spiritislandwiki.com/index.php?title=List_of_Spirits
  - Example spirit page: https://spiritislandwiki.com/index.php?title=Thunderspeaker#tab=Strategy
  - Aspects list: https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards
  - Scenarios list: https://spiritislandwiki.com/index.php?title=Scenarios
  - Adversaries list: https://spiritislandwiki.com/index.php?title=List_of_Adversaries
- **Card info + artwork lookup**: https://sick.oberien.de/?query=
- **Card images repo** (for v2 bundling): https://github.com/oberien/spirit-island-card-katalog
- **Community + rulings**:
  - Reddit: https://www.reddit.com/r/spiritisland/
  - FAQ/rulings: https://querki.net/u/darker/spirit-island-faq/#!spirit-island-faq

### Content Rules (Non-negotiable)
- Do NOT copy large bodies of wiki text into the app
- Prefer: (a) original short summaries, (b) structured data (names, numbers, labels), (c) links to sources
- Spirit overview content: derive from wiki structure, use AI for summaries/ratings
- Openings: authored by project maintainer
- Art: use wiki images, bundle with app

### Reference Data Scope
- **Expansions**: Base Game, Branch & Claw, Jagged Earth, Feather & Flame, Horizons, Nature Incarnate, promos
- **Adversaries**: All official
- **Scenarios**: All official
- **v1 Spirits**: River Surges in Sunlight + Lightning's Swift Strike (including all their aspects)
- **v1 Content volume**: Start small (few spirits deeply covered), expand over time

### Data Architecture
- **Convex** is cloud-first source of truth
- **Convex generates types** used by app
- **Convex functions organized by domain**: spirits.ts, games.ts, notes.ts, openings.ts
- **Offline**: cache Convex data locally for read-only access
- **Seeding**: JSON/TS files seed Convex on deploy (no runtime scraping)
- **Hybrid data sourcing**: scrape wiki structure once, AI generates summaries/ratings

## Constraints

- **Tech stack**: TanStack Start (React + TypeScript), TanStack ecosystem (Router, Query, Form), Convex, Clerk, Cloudflare Workers, Tailwind CSS, Radix/Ark primitives, Framer Motion, Recharts, Serwist — these are fixed choices
- **Package manager**: pnpm
- **Tooling**: Biome (formatting/linting), mise (toolchain management), pre-commit hooks
- **Testing**: Playwright E2E only (Chromium), real spirit data (not mocks), no visual regression
- **Monitoring**: Sentry for error tracking
- **Deployment**: Cloudflare Workers (not Pages), Cloudflare subdomain for now (custom domain post-v1)
- **Auth**: Clerk only, no custom auth system
- **Licensing**: Unofficial fan project, all Spirit Island materials belong to Greater Than Games, LLC

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Clerk auth from M1 | Easier to build with auth infrastructure than retrofit later | — Pending |
| Convex cloud-first (not local-first) | Simplifies v1 significantly; local-first sync is complex | — Pending |
| No loading states | Force fast performance; loading states make apps feel slower | — Pending |
| Radar chart for power ratings | Shows spirit's "shape" at a glance better than bar charts | — Pending |
| Slider/timeline scrubber | Most intuitive for turn-by-turn navigation on mobile | — Pending |
| Full spirit data modeling | Needed to display growth options and presence track grants accurately | — Pending |
| Hybrid styling | Modern clean UI with Spirit Island accents balances usability and theme | — Pending |
| Bundle images (no R2) | Simplifies architecture; images are static reference data | — Pending |
| Fixed CSV columns | Excel-friendly; spirit1-spirit6 columns easier than delimited | — Pending |
| Client-side search | Works offline; data volume manageable for in-memory search | — Pending |

---
*Last updated: 2025-01-24 after initialization*
