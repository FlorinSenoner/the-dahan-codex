# Phase 6: User Data - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Logged-in users can track Spirit Island games and export/import via CSV. Game tracking includes recording played games with spirits, adversary, scenario, and detailed outcomes. CSV enables full data portability with ID-based sync.

**Explicitly deferred:** Notes with backlinks (originally scoped for this phase) — moved to future phase.

</domain>

<decisions>
## Implementation Decisions

### Game entry flow
- Support 1-6 spirits per game (standard Spirit Island player count)
- Required fields: at least one spirit + win/loss outcome
- All other fields optional (adversary, scenario, score, detailed outcome info)
- Detailed outcome captures: win type (fear victory, blighted island, etc.), invader stage, blight count — all optional
- Spirit selection via searchable dropdown
- Adversary selection: dropdown + level picker (0-6)
- Game date defaults to today, user can change
- Opening tracking: not included (just spirit, not which opening was used)

### Page structure
- **Game list page** — All games with compact row display (date, spirit icons, adversary, outcome)
- **New game page** — Full-page form for creating games
- **Game detail page** — Shows all info visible immediately, edit button toggles to inline form
- **Shared form components** — Same form for create and edit, pre-filled for existing games
- **Stats page** — Separate dedicated page for aggregate statistics (not on game list)

### Game list behavior
- Compact rows (table-like) showing key info in one line
- Multiple sort options: date, spirit, adversary, outcome
- Search box + filter chips for structured filtering
- Load all games at once (no pagination — fine for typical usage <1000 games)
- Friendly empty state with illustration + "Log your first game" prompt

### Game deletion
- Delete button with confirmation dialog
- Immediate delete on confirmation (no undo)

### Game detail page
- All info visible immediately (no collapsible sections)
- Edit button toggles view to inline form using shared components

### CSV export
- Include all game fields: date, spirits, adversary, scenario, outcome, score, all details
- Include game ID for sync purposes
- Multiple spirits comma-separated in single column: "River Surges, Lightning's Swift Strike"

### CSV import
- ID-based sync: CSV is authoritative for matching game IDs
- Matching ID → full replacement (not merge) — missing fields removed
- New IDs in CSV → create new games
- After import: app data matches CSV exactly for imported games

### Claude's Discretion
- Date format in CSV (ISO 8601 recommended)
- Exact filter chip options and UI
- Stats page metrics and visualizations
- Form validation messages and UX

</decisions>

<specifics>
## Specific Ideas

- Reuse exact form components between create and edit — "edit is create with pre-filled data"
- Stats on separate page keeps game list clean and focused

</specifics>

<deferred>
## Deferred Ideas

- **Notes with backlinks** — Rich text notes attached to spirits/openings/games with backlinks. Originally scoped for Phase 6, user chose to defer to simplify scope.

</deferred>

---

*Phase: 06-user-data*
*Context gathered: 2026-01-31*
