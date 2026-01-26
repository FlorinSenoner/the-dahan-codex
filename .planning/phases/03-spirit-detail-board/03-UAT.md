---
status: complete
phase: 03-spirit-detail-board
source: 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-PLAN.md
started: 2026-01-26T15:00:00Z
updated: 2026-01-26T16:50:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Variant Tabs Display
expected: Navigate to /spirits/river-surges-in-sunlight. See horizontal tabs below header showing base spirit and aspect names.
result: issue
reported: "tabs are present but: 1. the scroll on top of the header (with the back button and the name of the spirit) it should slide below and for the aspects once it passes below it should all to the spirit name the aspect name. 2. the tabs should not have the name of the spirit but rather 'Base' (for the spirit with no aspect). this should then not be added to the header when scrolled 3. there is a vertical scroll in the tab bar. this should never be the case. only horizontal scroll should be possible on small devices 4. the 'highlighted tab' should not have rounded corners. and there should not be any padding on the left/right of the tab bar 5. make the highlight a bit more vibrant e.g. work with gradients."
severity: major

### 2. Variant Tab Navigation
expected: Click "Sunshine" tab. URL changes to /spirits/river-surges-in-sunlight/sunshine. Shows "Aspect of River Surges in Sunlight" subtitle.
result: pass

### 3. Radar Chart Visibility
expected: See 5-axis radar chart (Offense, Defense, Control, Fear, Utility) with values plotted. Chart uses dark theme colors.
result: issue
reported: "the chart is not visible at all against the black background. make it visible. make sure to add a spider web to make it visually more appealing and easier to read"
severity: major

### 4. Strengths and Weaknesses Lists
expected: See "Strengths" heading with green styling and bullet list. See "Weaknesses" heading with red styling and bullet list.
result: issue
reported: "this is visible but again visually not interesting. also consider moving this and the radar and the longer description text into a sidebar on larger screens as there is too much white space. on mobile it should be collapsed by default"
severity: minor

### 5. Growth Panel
expected: See "Growth" section with growth option cards displaying title and actions (e.g., "Reclaim All" + "Gain Power Card").
result: issue
reported: "does not work as expected. shows only 2 growth options for lightning and 2 for river - there should be more (see wiki). titles 'Top' and 'Bottom' don't make sense - should be G1, G2, G3 (only visible on hover). visually each growth option should be in a card with separate boxes and icons for each action. use SVGs for icons (energy, card, presence, reclaim types). update the DSL to be more detailed and typed with action types."
severity: major

### 6. Presence Tracks Display
expected: See "Presence Tracks" section with two rows: Energy per Turn (amber label) and Card Plays per Turn (blue label). Slots show numbers.
result: issue
reported: "design is fine but visually not very appealing. add faint gradient backgrounds with color - create 2 more variations to pick from. cursor should show pointer on hover. DSL not good enough for complex cases like Serpent Slumbering Beneath the Island which has: absorbed presence track, element unlocks, reclaim one slots, innate power unlocks. Need more robust data model."
severity: major

### 7. Presence Slot Tooltips
expected: Hover/tap on a presence slot. Tooltip shows slot value, any bonuses (elements granted), and slot index.
result: pass

### 8. Innate Powers Accordion
expected: See "Innate Powers" section. Click to expand an innate. See element threshold badges (e.g., "2 Sun") and description.
result: issue
reported: "innate data for River is wrong. DSL needs improvement: add speed (fast/slow), range (normal vs sacred site vs sacred site + land type), target land. Use horizontal layout for speed/range/target. Share DSL with unique power cards. Create SVG icons for all 8 elements matching original marker icons (Sun, Moon, Fire, Air, Water, Earth, Plant, Animal). Thresholds show element counts + icons + effect text with inline icons for Dahan/Town/etc."
severity: major

### 9. Starting Cards Display
expected: See "Starting Cards" section with horizontal scrolling row of 4 cards (River's Bounty, etc.). Cards show Fast/Slow badge and cost.
result: issue
reported: "should be called 'Cards' not 'Starting Cards'. use same DSL and depiction as innate powers. keep cost as is. red outline if fast, blue outline if slow. display in two lines: 1) speed, range, target 2) element icons"
severity: minor

### 10. External Resource Links
expected: See "Resources" section at bottom. Wiki link, FAQ link, and Card Catalogue link visible. All have external link icon.
result: issue
reported: "works fine but use same component as on /credits page (icons are different). make text clear that user is directed to relevant page for current spirit. remove 'Links open in a new tab' text - unnecessary"
severity: cosmetic

### 11. External Links Open New Tab
expected: Click Wiki link. Opens in new tab (doesn't navigate away from app). Same for FAQ and Card Catalogue links.
result: pass

### 12. Mobile Responsiveness
expected: Shrink viewport to mobile width. Tabs scroll horizontally. Cards scroll horizontally. Presence tracks wrap without breaking layout.
result: pass

### 13. Lightning Spirit Consistency
expected: Navigate to /spirits/lightnings-swift-strike. Same structure works: variant tabs, overview, growth, presence, innates, cards, resources.
result: pass

## Summary

total: 13
passed: 5
issues: 8
pending: 0
skipped: 0

## Gaps

- truth: "Variant tabs display correctly below header with proper styling"
  status: failed
  reason: "User reported: tabs present but multiple issues - sticky header should show aspect name when scrolled, base tab should say 'Base' not spirit name, vertical scroll appearing in tab bar, highlighted tab has rounded corners and padding, highlight not vibrant enough"
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Radar chart visible with dark theme colors"
  status: failed
  reason: "User reported: the chart is not visible at all against the black background. make it visible. make sure to add a spider web to make it visually more appealing and easier to read"
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Strengths and weaknesses displayed with good visual design"
  status: failed
  reason: "User reported: visible but visually not interesting. move this, radar, and description text into a sidebar on larger screens (too much whitespace). on mobile it should be collapsed by default"
  severity: minor
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Growth panel displays all growth options with proper visualization"
  status: failed
  reason: "User reported: only 2 growth options shown for each spirit (should be more per wiki). titles 'Top'/'Bottom' wrong - should be G1/G2/G3 on hover only. needs cards with separate boxes and SVG icons for each action type (energy, card, presence, reclaim). DSL needs typed action structure."
  severity: major
  test: 5
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Presence tracks display with good visual design and robust data model"
  status: failed
  reason: "User reported: visually not appealing - add gradient backgrounds with color variations to pick from. cursor should show pointer on hover. DSL insufficient for complex spirits like Serpent (absorbed presence track, element unlocks, reclaim one slots, innate power unlocks). Need more robust data model."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Innate powers display correctly with element thresholds and descriptions"
  status: failed
  reason: "User reported: River innate data wrong. DSL needs: speed (fast/slow), range (normal/sacred site/sacred site + land type), target land. Horizontal layout for speed/range/target. Share DSL with unique power cards. Create 8 element SVG icons matching original markers (Sun, Moon, Fire, Air, Water, Earth, Plant, Animal). Thresholds need element counts + icons + effect text with inline icons."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Starting cards display with proper styling and shared DSL"
  status: failed
  reason: "User reported: should be called 'Cards' not 'Starting Cards'. use same DSL and depiction as innate powers. keep cost as is. red outline if fast, blue outline if slow. display in two lines: 1) speed, range, target 2) element icons"
  severity: minor
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "External resource links consistent with credits page"
  status: failed
  reason: "User reported: works fine but use same component as /credits page (icons different). make text clear user is directed to relevant page for current spirit. remove 'Links open in a new tab' text"
  severity: cosmetic
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
