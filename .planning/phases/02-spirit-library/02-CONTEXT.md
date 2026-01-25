# Phase 2: Spirit Library - Context

**Gathered:** 2026-01-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Browsable list of spirits with filtering, navigation to detail pages, and
attribution. Users can see all spirits, filter/sort them, and tap to navigate to
spirit detail pages. v1 includes River Surges in Sunlight and Lightning's Swift
Strike with all their aspects.

</domain>

<decisions>
## Implementation Decisions

### List Layout & Display

- Vertical list layout (full-width rows, one spirit per row)
- Each row shows: large spirit image (120px+), name, 1-line summary, complexity
  badge
- Official spirit panel art for images
- Summary describes playstyle with thematic hook (AI-generated from wiki data)
- Page header with title + active filter summary
- Subtle highlight on tap before navigating

### Aspects in List

- Aspects appear as separate rows indented under their base spirit
- Aspects always visible (not collapsed)
- Each aspect uses its own aspect card art
- Build indented structure now (even with only 2 spirits in v1)

### Filtering & Sorting

- Filter options: expansion, complexity, elements (multi-select AND logic),
  power focus (offense, defense, fear, control, utility)
- Filter UI: button opens bottom sheet with all filter options
- Filter logic: OR within category, AND across categories
- Active filters shown as removable chips below header + badge count on filter
  icon
- "Clear all" button in bottom sheet AND as chip when filters active
- Sort options: alphabetical, complexity
- Default sort: alphabetical A-Z

### Empty & Loading States

- No loading state (data should be instant/cached)
- Empty filter results: friendly Spirit Island-themed illustration + message +
  clear filters button
- Errors: toast notification with retry option

### Navigation & URLs

- Spirit URLs: `/spirits/river-surges-in-sunlight` (slug based on full name)
- Aspect URLs: `/spirits/river-surges-in-sunlight?aspect=sunshine` (query param)
- View Transitions API for native-feeling navigation (match spirit
  image/name between list and detail)
- Filter state preserved in URL (shareable filtered views)
- Scroll position restored on back navigation
- Spirits is a dedicated bottom navigation tab
- Tapping aspect row navigates directly to aspect variant URL
- Back button only (no breadcrumbs)

### Styling & Design System

- Tailwind CSS + shadcn/ui components
- Botanical / Organic Serif design system adapted to Spirit Island
- Spirit Island earthy + elemental palette (not generic botanical)
- Element colors: adapted muted versions of official SI colors
- Typography: serif for both headlines and body (Claude picks specific faces)
- No paper grain texture
- Animations: graceful timing (500-700ms) with prefers-reduced-motion respect
- Dark mode default: deep forest/earth tones (night in the forest feel)
- Bottom sheet: botanical style with large rounded corners, generous spacing
- Filter chips: botanical pills (rounded-full, earthy colors)

### Claude's Discretion

- Spirit image shape (square, rounded corners, or other)
- Exact typography choices (headline and body serif faces)
- Image arch radius treatment
- Loading skeleton if needed despite "no loading state" preference
- Exact spacing and component sizing within botanical guidelines

</decisions>

<specifics>
## Specific Ideas

- View Transitions API for native-feeling navigation:
  https://tanstack.com/router/latest/docs/framework/react/api/router/ViewTransitionOptionsType
- Match spirit image and name elements between list and detail pages for
  smooth transitions
- Design system reference: Botanical / Organic Serif with principles of organic
  softness, typographic elegance, earthbound palette, breathing space,
  intentional movement, and staggered rhythm

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-spirit-library*
*Context gathered: 2026-01-25*
