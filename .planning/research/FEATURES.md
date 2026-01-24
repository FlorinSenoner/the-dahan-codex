# Feature Research

**Domain:** Spirit Island companion app
**Researched:** 2026-01-24
**Confidence:** HIGH (based on analysis of 10+ existing tools and community resources)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Spirit reference/lookup | Every existing tool provides this; users need quick access to spirit info during games | LOW | All 37+ spirits with name, complexity, expansion source |
| Spirit complexity ratings | Wiki and all apps categorize by Low/Moderate/High/Very High | LOW | Filter and display complexity clearly |
| Expansion filtering | Spirit Guide, SICK, Spirit Islander all filter by owned expansions | LOW | Let users show only content they own |
| Element tracking | Both Spirit Guide and Spirit Island Companion have this; innate power thresholds depend on it | MEDIUM | Track 8 elements per spirit, threshold notifications |
| Adversary/scenario reference | All companion apps include adversary and scenario descriptions | LOW | Difficulty levels, special rules, setup |
| Official FAQ access | Spirit Guide and Spirit Island Companion both link to Querki FAQ | LOW | Can link or embed common rulings |
| Scoring calculator | Spirit Guide, si-tracker GitHub, spreadsheets all have this | MEDIUM | Victory/defeat type, difficulty, Dahan count, blight, invader cards, terror level |
| Mobile-friendly interface | All modern tools are mobile-first or responsive | MEDIUM | PWA target means this is foundational |
| Search/filter capabilities | SICK has advanced search syntax; users expect to find cards/spirits quickly | MEDIUM | Name, elements, expansion, complexity filters |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Opening scrubber** (graphical turn-by-turn) | NO existing tool does this; Spirit Island Hub has text guides but no visual/interactive tool | HIGH | Unique differentiator - visualize growth options, presence tracks, and turn progression |
| **Spirit variants/aspects as first-class entities** | Wiki documents 31 aspects but no tool treats them as browsable entities alongside spirits | MEDIUM | Aspects change complexity and playstyle; treat as variant spirits, not footnotes |
| **Power ratings radar chart** | Tier lists exist on TierMaker but no app visualizes spirit strengths graphically | MEDIUM | Offensive, defensive, control, fear, support dimensions |
| **Presence track visualization** | Spirit Guide explicitly LACKS growth options and presence tracks; users requested this | HIGH | Interactive presence track showing reveals, elements gained, energy/card plays |
| **Multi-spirit game tracker** (1-6 spirits) | Spreadsheets exist but no dedicated app tracks full game state with multiple spirits | HIGH | Track energy, elements, cards, presence per spirit during play |
| **Full offline PWA** | Handelabra app has offline issues; no companion is truly offline-first PWA | MEDIUM | Works without internet after initial load - critical for game nights |
| **Notes with backlinks** | No existing tool has this; wiki has links but not user notes | MEDIUM | Personal annotations that cross-reference spirits, powers, strategies |
| **CSV export/import for game history** | si-tracker has JSON export; spreadsheet users need CSV | LOW | Portability for data analysis |
| **Spirit synergy/pairing recommendations** | BGG has pairing tier matrix but no app integrates this | MEDIUM | Show which spirits pair well together based on community data |
| **Growth option visualizer** | Text descriptions exist; no graphical representation of growth choices | HIGH | Show all growth options with what they provide visually |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time multiplayer sync | "We want to track together" | Massive complexity, connectivity issues during game nights, sync conflicts | Local-first design; each player uses own device independently |
| Full game AI/automation | "Like the Handelabra app" | Competes with official product, massive scope, licensing issues | Reference/companion only - enhance physical game, don't replace it |
| Card image hosting | "Show me the cards" | Copyright issues with Greater Than Games card art | Link to SICK.oberien.de for card lookup; use text descriptions with permission |
| Rule enforcement/validation | "Tell me if my move is legal" | Too complex, edge cases, frustrates users when wrong | Rule reminders and FAQ lookups instead of enforcement |
| Achievement gamification | "Unlock badges for playing" | Distracts from core utility, adds maintenance burden | Simple game history log without gamification layer |
| Social features (profiles, sharing) | "Share my stats" | Scope creep, privacy concerns, server costs | CSV export for sharing; no accounts needed |
| Push notifications | "Remind me of game nights" | Requires accounts, server infrastructure, intrusive | PWA is utility tool, not engagement platform |
| Integrated timer/turn clock | "We need time pressure" | Not core to Spirit Island experience; adds stress | Out of scope - use separate timer if desired |

## Feature Dependencies

```
[Spirit Data Model]
    |
    +---> [Spirit Reference Library]
    |         |
    |         +---> [Filter by expansion]
    |         +---> [Filter by complexity]
    |         +---> [Search]
    |
    +---> [Spirit Overview Pages]
    |         |
    |         +---> [Power ratings radar chart]
    |         +---> [Strengths/weaknesses text]
    |
    +---> [Spirit Variants/Aspects]
              |
              +---> [Aspects as first-class entities]

[Presence Track Data]
    |
    +---> [Opening Scrubber]
              |
              +---> [Growth options visualization]
              +---> [Turn-by-turn progression]

[Game State Model]
    |
    +---> [Game Tracker]
    |         |
    |         +---> [Multi-spirit support (1-6)]
    |         +---> [Score calculation]
    |         +---> [CSV export/import]
    |
    +---> [Element Tracking per Spirit]

[Notes System]
    |
    +---> [Backlinks] ------requires------> [Spirit/Power Entity References]

[PWA Infrastructure]
    |
    +---> [Offline Support] ------requires------> [Service Worker + Local Storage]
    +---> [All features] work offline
```

### Dependency Notes

- **Spirit Reference requires Spirit Data Model:** Must have complete spirit data (all 37+ spirits, 31 aspects) before building UI
- **Opening Scrubber requires Presence Track Data:** Need structured data on each spirit's growth options and presence track reveals
- **Game Tracker requires Game State Model:** Complex state management for tracking multiple spirits' energy, elements, cards
- **Backlinks require Entity References:** Notes system needs stable IDs for spirits, powers, strategies to link between
- **Offline Support requires PWA Infrastructure:** Service worker and caching strategy must be planned from start, not bolted on

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the concept.

- [ ] **Spirit reference library** - All spirits with complexity, expansion, basic info. This is table stakes.
- [ ] **Expansion filtering** - Let users configure owned content
- [ ] **Spirit overview pages** - Complexity, setup, special rules, growth options (text initially)
- [ ] **Mobile-responsive design** - Must work on phones at game table
- [ ] **Basic PWA** - Installable, works offline after first load
- [ ] **Search** - Find spirits by name

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **Aspects as first-class entities** - After base spirits are solid, add variant browsing
- [ ] **Power ratings visualization** - Once spirit pages exist, add radar charts
- [ ] **Element tracker** - After proving people use the app during games
- [ ] **Score calculator** - Natural addition after tracker proves useful
- [ ] **Opening scrubber (basic)** - Start with one spirit, validate concept before full implementation

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Full opening scrubber** - All spirits with interactive turn progression. HIGH complexity, validate first.
- [ ] **Multi-spirit game tracker** - Complex state management. Wait until single-spirit tracker proves value.
- [ ] **Notes with backlinks** - Unique feature but not core. Add after reference library is mature.
- [ ] **CSV export/import** - Nice for power users but not launch-critical
- [ ] **Synergy recommendations** - Community data integration is complex. Defer.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Spirit reference library | HIGH | LOW | P1 |
| Expansion filtering | HIGH | LOW | P1 |
| Spirit overview pages | HIGH | MEDIUM | P1 |
| Mobile-responsive | HIGH | MEDIUM | P1 |
| Basic PWA/offline | HIGH | MEDIUM | P1 |
| Search spirits | MEDIUM | LOW | P1 |
| Aspects as entities | MEDIUM | MEDIUM | P2 |
| Power ratings chart | MEDIUM | MEDIUM | P2 |
| Element tracker | MEDIUM | MEDIUM | P2 |
| Score calculator | MEDIUM | MEDIUM | P2 |
| Opening scrubber | HIGH | HIGH | P2 |
| Game tracker | MEDIUM | HIGH | P3 |
| Notes with backlinks | MEDIUM | HIGH | P3 |
| CSV export | LOW | LOW | P3 |
| Synergy recommendations | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch - core reference functionality
- P2: Should have, add when possible - differentiating features
- P3: Nice to have, future consideration - power user features

## Competitor Feature Analysis

| Feature | Spirit Guide (iOS) | SICK | Spirit Islander | Spirit Island Wiki | Our Approach |
|---------|-------------------|------|-----------------|-------------------|--------------|
| Spirit reference | Yes (all spirits) | No (cards only) | No (setup only) | Yes (comprehensive) | Complete reference with filtering |
| Aspects support | Partial | No | No | Yes (documented) | First-class browsable entities |
| Element tracking | Yes | No | No | No | Yes, with innate threshold alerts |
| Presence tracks | **No** (user-requested) | No | No | Text only | **Visual interactive tracks** |
| Growth options | **No** (user-requested) | No | No | Text only | **Visual growth option display** |
| Opening guides | No | No | No | Partial (external links) | **Turn-by-turn scrubber** |
| Score calculator | Yes | No | No | No | Yes, official formula |
| Game logging | Yes (basic form) | No | No | No | Multi-spirit with CSV export |
| Search | Basic | Advanced syntax | Filters | Wiki search | Name + filters |
| Offline | Partial issues | No (web) | No (web) | No (web) | **Full PWA offline** |
| Randomizer | Yes | No | **Yes (primary)** | No | Out of scope (Spirit Islander is excellent) |

## Sources

### Primary Sources (HIGH confidence)
- [Spirit Island Wiki - List of Spirits](https://spiritislandwiki.com/index.php?title=List_of_Spirits) - Comprehensive spirit data
- [Spirit Island Wiki - Aspect Cards](https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards) - 31 aspects documented
- [SICK - Spirit Island Card Katalog](https://sick.oberien.de/) - Card search reference, GitHub source
- [Spirit Island FAQ (Querki)](https://querki.net/u/darker/spirit-island-faq/) - Official FAQ structure
- [Spirit Guide App Store](https://apps.apple.com/us/app/spirit-guide/id1452929632) - Feature list and user reviews

### Secondary Sources (MEDIUM confidence)
- [Spirit Island Hub](https://latentoctopus.github.io/) - Opening guides, community resources
- [Spirit Islander](https://www.spiritislander.com/) - Setup randomizer reference
- [si-tracker GitHub](https://github.com/taghori/si-tracker) - Score calculator, game history features
- [BGG Spirit Island Pairing Tiers](https://boardgamegeek.com/thread/3135353/spirit-island-pairing-tiers-v10) - Synergy matrix

### Community Discussions (LOW-MEDIUM confidence)
- [BGG Companion App Thread](https://boardgamegeek.com/thread/2073241/spirit-island-companion-app) - User requests
- [BGG Opening Guides Thread](https://boardgamegeek.com/thread/2484816/openings-jagged-earth-spirits) - Strategy content
- [BGG Long Term Stats Spreadsheets](https://boardgamegeek.com/thread/2488956/spirit-island-long-term-stats-v2) - Tracking patterns

---
*Feature research for: Spirit Island companion app (The Dahan Codex)*
*Researched: 2026-01-24*
