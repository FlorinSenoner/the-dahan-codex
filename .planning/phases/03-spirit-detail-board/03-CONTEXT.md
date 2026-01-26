# Phase 3: Spirit Detail & Board - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete spirit detail pages with variant selection and board visualization. Users can switch between base spirit and aspects, view an overview with power ratings, and explore the board layout (growth, presence, innates, cards). External resources link to wiki, FAQ, and card catalogue.

</domain>

<decisions>
## Implementation Decisions

### Variant Selector
- Horizontal tabs below spirit header
- Tab labels show aspect names only (no complexity arrows)
- Scrollable horizontally if many aspects (5+)
- URL changes for each variant (`/spirits/river/sunshine`) — shareable links
- Tabs sticky at top when scrolling down
- All variants styled the same — highlight the currently selected one
- Direct navigation to aspect URL shows tabs immediately with correct selection
- No animation when switching variants — instant swap

### Page Structure
Order of sections on spirit detail page:
1. **Overview** — Radar chart, complexity, elements, strengths/weaknesses
2. **Special Rules** — Collapsible, only if spirit has them (e.g., Serpent's absorbed presence)
3. **Growth** — Icon cards for each growth option
4. **Presence** — Tracks as grid or diagram (prototype both, user picks)
5. **Innates** — Threshold cards, collapsed by default (reference material)
6. **Cards** — Hand of cards (unique powers + minor/major placeholders)

### Overview Section
- Radar/spider chart for power ratings (Offense, Defense, Control, Fear, Utility)
- Chart is visual only — not interactive
- Strengths/weaknesses as bullet lists
- Complexity shown as badge + brief explanation ("Why it's complex: multiple growth tracks")
- Element affinities as icons with count (🔥×3, 💧×2)
- Aspects show their own ratings if different, otherwise inherit from base

### Board Visualization
- **Growth options:** Icon cards showing actions (gain energy, add presence, etc.)
- **Presence tracks:** Prototype both grid of slots AND track diagram — user picks later
- All slots tappable with tooltips describing the reward
- **Innate powers:** Threshold cards showing element requirements and effects at each level
- **Special rules:** Collapsible section before Growth (if spirit has special mechanics)

### Card Hand
- Display as side-by-side row (scrollable if needed)
- Shows: spirit's unique powers + generic Minor Power placeholder + Major Power placeholder
- Card display style: Prototype both full card face AND mini preview — user picks later
- Tapping unique power card: Modal with full card image
- Tapping placeholder card: Tooltip explaining "Minor Power gained through growth"
- Aspect boards show their own version — no comparison highlighting to base

### External Links & Resources
- **Wiki:** Deep links to relevant sections on Spirit Island wiki
- **FAQ:** https://querki.net/u/darker/spirit-island-faq/ (searchable)
- **Card catalogue:** https://sick.oberien.de/?query=
- Footer section for general links
- Inline links where relevant (e.g., "View on SICK" in card modal)
- Open in in-app browser (keeps user in PWA)
- Text links style in footer
- When offline: show warning on tap ("You're offline")

### Claude's Discretion
- Exact radar chart styling and axis labels
- Special rules section layout
- Growth card icon design
- Tooltip appearance and animation
- In-app browser implementation details

</decisions>

<specifics>
## Specific Ideas

- Presence track display: Build both grid view and track diagram view — user will pick preferred option after seeing them
- Card hand display: Build both full card face and mini preview — user will pick preferred option
- Innates collapsed by default because they're reference material, not critical for opening strategy
- Cards section includes placeholder cards for minor/major powers since these can be gained turn 1 and played turn 2

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-spirit-detail-board*
*Context gathered: 2026-01-26*
