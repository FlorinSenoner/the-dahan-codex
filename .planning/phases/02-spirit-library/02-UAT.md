---
status: complete
phase: 02-spirit-library
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md, 02-05-SUMMARY.md, 02-06-SUMMARY.md]
started: 2026-01-25T19:30:00Z
updated: 2026-01-25T20:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Spirit List Display
expected: Navigate to /spirits. See a list of spirits with images, names, summaries, and complexity badges. River Surges in Sunlight and Lightning's Swift Strike should be visible as base spirits.
result: issue
reported: "there is only a complexity badge for the spirit and not the aspects. indicate also if the aspects change the complexity, the screenshot shows that all aspects for lightning make the spirit more complex. there are also aspects that make the spirit easier or harder (when filtering still use the base spirit complexity). the aspects only have complexity modifiers. the images are broken / missing. scrape them from the wiki: https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards, https://spiritislandwiki.com/index.php?title=List_of_Spirits. you are missing the Immense aspect from Lightning"
severity: major

### 2. Aspect Display Under Base Spirit
expected: On the spirit list, aspects appear indented below their base spirit with smaller images and an "A" indicator. Lightning's Swift Strike should show all 4 aspects (Immense, Pandemonium, Sparking, Wind) nested below it. Aspects show complexity modifiers (up arrow = harder, down arrow = easier, equal sign = same) instead of full complexity badges.
result: issue
reported: "the Immense aspect is missing. the modifiers for the aspects are missing. for now there are three identifiers up arrow = harder, down arrow = easier, equal sign = same complexity. color code them differently. also color code the difficulty differently"
severity: major

### 3. Complexity Badge Colors
expected: Complexity badges use distinct color coding. Base spirit complexity badges should be visually distinct. Aspect complexity modifiers should be color-coded: up arrow (harder) = one color, down arrow (easier) = another color, equal sign (same) = neutral color.
result: issue
reported: "this is completely missing"
severity: major

### 4. Filter Bottom Sheet Opens
expected: Tap the filter button (funnel icon). A bottom sheet slides up showing Complexity options (Low, Moderate, High, Very High) and Elements options (8 Spirit Island elements).
result: issue
reported: "funnel icon is too small. on mobile icon buttons need to be at least 42px x 42px. also on hover the cursor should turn into a pointer. this goes for all buttons!!! when selecting a complexity or element, the clear all appears (this is correct) but it should not shift (move the layout). the badges for the complexity should have the same color coding as on the spirit rows. assign different colors to different complexity (when selected), when not it's fine to keep them neutral. same goes for the elements, make them more exciting by using muted element colors (fire = red, sun = yellow, water = blue, ...) that go well with the color theme. only color the options when selected. also here make sure that the on hover the cursor turns into a pointer"
severity: major

### 5. Filter by Complexity
expected: In the filter sheet, select "Low" complexity and tap Apply. The list should show only Low complexity spirits. Filter chip appears below header showing "Low".
result: issue
reported: "this works but there is still an error in the data where some of the aspects have a medium complexity and therefore do not show up. the pills show up correctly, but also here make the tap area bigger (match at least the size of the filter pills in the bottom sheet). move the clear all either all the way to the right or separate it visually somewhat more by adding a divider bar, just so that the user knows that this is very different. again there is no pointer on hover and the tap area is too small"
severity: minor

### 6. Remove Filter via Chip
expected: With a filter active, tap the X on the filter chip. The filter is removed and all spirits are shown again.
result: pass

### 7. Spirit Detail Navigation
expected: Tap on a spirit row (e.g., River Surges in Sunlight). Navigate to the detail page with a smooth view transition animation. The image and name animate from list position to detail position.
result: issue
reported: "Page now renders after routing fix, but console shows multiple SSR errors: 'Could not find Convex client! useQuery must be used under ConvexProvider'. Also view transitions not working - title and image should animate between list and detail pages but they don't. Images broken so can't fully verify image transition."
severity: major

### 8. Spirit Detail Content
expected: On the spirit detail page, see the spirit's large image, name, complexity badge, summary text, and element badges (Sun, Water, etc.).
result: issue
reported: "this works, but the summary text is the same as on the list view. this is too limited as the summary text on the detail page can be a lot longer compared to the very short description on the list view. add an additional field for a somewhat longer description of the spirit. this description should capture the theme and mainly also the playstyle"
severity: minor

### 9. Aspect Detail via Query Param
expected: Navigate to an aspect (e.g., tap Lightning's Swift Strike - Pandemonium). URL should be /spirits/lightnings-swift-strike?aspect=Pandemonium. The detail page shows the aspect's specific data.
result: issue
reported: "this works, but for the title use the same as in the list view e.g. use Pandemonium instead of Lightning's Swift Strike (Pandemonium). on the line below it already states that it's: Aspect of Lightning's Swift Strike (keep this)"
severity: cosmetic

### 10. Bottom Navigation Visible
expected: Bottom navigation bar is visible on all pages with 4 tabs: Spirits (active), Games, Notes, Settings. Spirits tab is highlighted when on /spirits routes.
result: pass

### 11. Bottom Nav Disabled Tabs
expected: Games, Notes, and Settings tabs are visually present but disabled/non-interactive (future features).
result: pass

### 12. Credits Page Access
expected: Navigate to /credits (via link or direct URL). See the credits page with legal disclaimer about Greater Than Games ownership and links to external sources.
result: pass
note: "Remove box around legal disclaimer - looks like a clickable button"

### 13. Dark Theme Applied
expected: The app uses a dark theme by default with Spirit Island night forest aesthetic. Dark backgrounds, light text, element-colored accents.
result: pass
note: "Future: use sans-serif font for botanical theme, rework accents for more colorful/vibrant feel like Spirit Island, add light theme option"

### 14. URL Filter Persistence
expected: Apply a filter, then copy the URL and open it in a new tab. The filtered view should be restored from the URL search params.
result: issue
reported: "the persistency works on the client. on the server there is an error in the logs: 'Could not find Convex client! useQuery must be used in the React component tree under ConvexProvider'. this needs to be fixed"
severity: major

## Summary

total: 14
passed: 5
issues: 9
pending: 0
skipped: 0

## Gaps

- truth: "Spirit list displays spirits with images, names, and complexity badges"
  status: failed
  reason: "User reported: Images broken/missing, need to scrape from wiki. Aspects should show complexity modifiers (up/down arrows) not badges. Missing Immense aspect for Lightning's Swift Strike."
  severity: major
  test: 1
  artifacts: []
  missing: []

- truth: "Aspects appear indented with complexity modifiers (up/down/equal)"
  status: failed
  reason: "User reported: Immense aspect missing. Complexity modifiers missing entirely. Need three modifiers: up arrow (harder), down arrow (easier), equal sign (same). Color code modifiers differently. Color code difficulty differently."
  severity: major
  test: 2
  artifacts: []
  missing: []

- truth: "Complexity badges and aspect modifiers are color-coded"
  status: failed
  reason: "User reported: completely missing"
  severity: major
  test: 3
  artifacts: []
  missing: []

- truth: "Filter bottom sheet opens with complexity and elements options"
  status: failed
  reason: "User reported: Funnel icon too small (need 42px min on mobile). Cursor not pointer on hover for buttons. Clear all causes layout shift. Complexity badges need color coding when selected. Elements need muted element colors when selected. Pointer cursor needed on filter options."
  severity: major
  test: 4
  artifacts: []
  missing: []

- truth: "Filter by complexity shows only matching spirits with filter chips"
  status: failed
  reason: "User reported: Works but data error - some aspects have wrong complexity so don't show. Filter chips tap area too small (match bottom sheet pills). Clear all needs visual separation (move right or add divider). No pointer on hover. Tap area too small."
  severity: minor
  test: 5
  artifacts: []
  missing: []

- truth: "Spirit detail navigation shows detail page with view transition"
  status: failed
  reason: "User reported: Page renders after routing fix, but SSR errors in console (Convex useQuery outside provider during SSR). View transitions not working - title and image should animate between list and detail but don't."
  severity: major
  test: 7
  artifacts: []
  missing: []

- truth: "Spirit detail page shows comprehensive spirit information"
  status: failed
  reason: "User reported: Works but summary text is same as list view - too limited. Need additional longer description field capturing spirit theme and playstyle for detail page."
  severity: minor
  test: 8
  artifacts: []
  missing: []

- truth: "Aspect detail page shows aspect-specific title"
  status: failed
  reason: "User reported: Title shows 'Lightning's Swift Strike (Pandemonium)' but should just show 'Pandemonium' like list view, since subtitle already says 'Aspect of Lightning's Swift Strike'."
  severity: cosmetic
  test: 9
  artifacts: []
  missing: []

- truth: "URL filter persistence works without SSR errors"
  status: failed
  reason: "User reported: Client-side persistence works, but server logs show SSR error 'Could not find Convex client! useQuery must be used under ConvexProvider'. Convex queries need SSR-safe pattern."
  severity: major
  test: 14
  artifacts: []
  missing: []
