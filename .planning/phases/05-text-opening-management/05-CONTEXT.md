# Phase 5: Text Opening Management - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin tools for creating and managing text-based spirit openings. Admins use inline editing on existing spirit detail pages to add/edit turn-by-turn opening guides. No separate admin area — edit mode transforms the public view into an editable interface.

</domain>

<decisions>
## Implementation Decisions

### Editor Workflow
- Global edit mode toggle via floating button (bottom-right)
- When edit mode on: "Edit" button + "Save" button side-by-side
- Inline editing — text content becomes textarea when in edit mode
- Editable sections get subtle border/highlight in edit mode
- Unsaved changes warning on navigation (browser confirm, client-side state)
- Save entire opening at once (not per-turn)
- "Add Opening" button always visible (whether openings exist or not)
- "Add Turn" button inline below existing turns
- Delete individual turns AND entire openings (both with confirmation)
- No turn reordering — turns added in sequence
- Turn requires: title + instructions (turn number auto-assigned)
- Keyboard shortcuts: Ctrl+E to toggle edit, Ctrl+S to save

### Admin Navigation
- No separate admin area — admins use same spirit list and detail pages
- Floating edit button hidden for non-admins
- No admin indicators on spirit list (identical view for all users)
- No admin overview page for openings
- Edit mode persisted in URL: `?edit=true` (only activates if user is admin)
- Works on both mobile and desktop

### Opening Metadata
- Opening name (required)
- Optional description field for overall strategy context
- Optional attribution: author name, source URL
- No difficulty setting (remove from schema if present)
- No tags
- Basic timestamps: createdAt, updatedAt

### Search
- Search bar on spirits list page (not global header)
- Searches spirits only (name, description) — not opening content
- Instant filter as-you-type (debounced)
- URL param `?search=` for shareable filtered views

### Permissions
- Admin status via Clerk metadata (`user.public_metadata.isAdmin`)
- Manage admins via Clerk Dashboard
- Edit UI completely hidden for non-admins
- Backend permission checks in Convex mutations (defense in depth)

### Claude's Discretion
- Debounce timing for search
- Exact floating button positioning and styling
- Confirmation dialog UI for deletes
- Textarea sizing and behavior
- Error handling for failed saves

</decisions>

<specifics>
## Specific Ideas

- Edit mode should feel like toggling a switch — same page, different mode
- Border/highlight on editable sections should be subtle, not jarring
- Floating buttons should not obscure important content
- Keyboard shortcuts for power users (Ctrl+E, Ctrl+S)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-text-opening-management*
*Context gathered: 2026-01-29*
