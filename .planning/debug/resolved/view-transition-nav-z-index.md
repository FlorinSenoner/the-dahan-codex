---
status: resolved
trigger: "During view transitions between spirit listing page and spirit detail page, spirit images overlay the bottom nav bar"
created: 2026-02-14T00:00:00Z
updated: 2026-02-14T00:00:02Z
---

## Current Focus

hypothesis: CONFIRMED AND FIXED
test: N/A
expecting: N/A
next_action: Archive session

## Symptoms

expected: Bottom nav bar stays visually on top of all content during view transitions between pages
actual: Spirit images from the listing page overlay/cover the bottom nav bar during the view transition animation
errors: No errors - purely visual/CSS z-index issue during view transitions
reproduction: Navigate from /spirits to /spirits/bringer-of-dreams-and-nightmares (or any spirit detail page). During the view transition animation, spirit images appear above the bottom nav bar.
started: Likely since view transitions were implemented

## Eliminated

## Evidence

- timestamp: 2026-02-14T00:00:01Z
  checked: src/components/layout/bottom-nav.tsx
  found: BottomNav has z-50 (CSS z-index 50) but NO viewTransitionName property
  implication: During view transitions, elements without viewTransitionName participate in the default root transition group and lose their z-index stacking

- timestamp: 2026-02-14T00:00:01Z
  checked: src/components/spirits/spirit-row.tsx
  found: Spirit image divs have viewTransitionName like "spirit-image-{slug}" (line 56)
  implication: Spirit images get their own named view-transition-group in the transition overlay, which renders above unnamed elements

- timestamp: 2026-02-14T00:00:01Z
  checked: src/styles/globals.css
  found: page-header already has ::view-transition-group(page-header) { z-index: 100 } - this is the exact pattern needed for the nav bar too
  implication: The team already solved this for the page header using the same technique. BottomNav needs the same treatment.

- timestamp: 2026-02-14T00:00:01Z
  checked: src/components/ui/page-header.tsx
  found: PageHeader has viewTransitionName: 'page-header' (line 29) which keeps it on top via CSS z-index 100 on its view-transition-group
  implication: Confirms the pattern - named view transition + z-index on the group

- timestamp: 2026-02-14T00:00:01Z
  checked: src/components/ui/sonner.tsx
  found: Sonner uses position="bottom-center" with default Sonner z-index (which is typically 999999). No viewTransitionName set on Sonner.
  implication: Sonner toasts render in the normal DOM, not in the view transition overlay. They should be unaffected by view-transition-group z-index changes since those z-indices only apply within the ::view-transition pseudo-element tree.

## Resolution

root_cause: BottomNav lacks a viewTransitionName, so during view transitions it becomes part of the default root snapshot. Meanwhile, spirit images have named view-transition-groups (e.g. spirit-image-{slug}) which are rendered as separate layers in the view transition overlay. The browser paints named groups on top of the root group by default, causing spirit images to visually overlay the nav bar. The page-header already solved this with viewTransitionName: 'page-header' + ::view-transition-group(page-header) { z-index: 100 }.
fix: Added viewTransitionName: 'bottom-nav' to the BottomNav nav element, and added ::view-transition-group(bottom-nav) { z-index: 100 } in globals.css alongside the existing page-header rule.
verification: TypeScript typecheck passes, Biome lint passes, production build succeeds. Sonner toast z-index is unaffected because Sonner renders in the normal DOM (not the view-transition overlay), and its default z-index (999999) operates in normal stacking context, not the view-transition pseudo-element tree.
files_changed:
  - src/components/layout/bottom-nav.tsx
  - src/styles/globals.css
