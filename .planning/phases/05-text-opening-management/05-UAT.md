---
status: complete
phase: 05-text-opening-management
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-07-SUMMARY.md, 05-08-SUMMARY.md, 05-09-SUMMARY.md, 05-10-SUMMARY.md, 05-11-SUMMARY.md, 05-12-SUMMARY.md, 05-13-SUMMARY.md, 05-14-SUMMARY.md
started: 2026-01-31T10:15:00Z
updated: 2026-01-31T10:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Admin Access Control
expected: Admin sees Edit FAB (pencil icon) on spirit detail; non-admin does not see Edit FAB
result: pass

### 2. Spirit Search
expected: On spirits list (/spirits), search bar filters spirits by name/summary/description as you type. URL updates with ?search= parameter. Results count shows when search active.
result: issue
reported: "it appears to only find the name of the spirits. aspects, are not found"
severity: major

### 3. Edit Mode Toggle
expected: Clicking Edit FAB enters edit mode (URL shows ?edit=true). FAB changes to X icon. Clicking X exits edit mode (URL clears ?edit=true).
result: issue
reported: "FAB is present but behavior not correct. When clicking save it should save AND exit edit mode. Also after clicking save, 'You have unsaved changes' alert still appears (shouldn't). Also replace browser confirm() with themed AlertDialog modal."
severity: major

### 4. Opening Editor Display
expected: In edit mode on River spirit, existing opening shows inline editor with editable name, description, and turns. Each turn has title and instructions fields.
result: pass

### 5. Add Turn
expected: In edit mode, clicking "Add Turn" button adds a new turn row at bottom of turn list with empty title and instructions fields.
result: pass

### 6. Delete Turn
expected: Clicking delete (trash) button on a turn shows themed AlertDialog confirmation modal. Confirming deletes the turn; remaining turns renumber sequentially.
result: pass

### 7. Save Opening
expected: After making changes, FAB shows Save button (checkmark). Clicking Save persists changes to database. Success toast or visual confirmation appears.
result: issue
reported: "Save persists data correctly, no toast needed. But should exit edit mode after save (switch to read mode) as visual confirmation."
severity: major

### 8. Validation Feedback
expected: If opening name is empty OR any turn has empty title or instructions, Save button is disabled/not shown. Empty required fields show destructive border (red outline).
result: issue
reported: "Save button visibility inconsistent. Should always be visible but greyed out when invalid, only active when all required fields filled. Currently shows when opening name exists but isn't clickable until turn title+instructions also filled."
severity: major

### 9. Navigation Warning
expected: With unsaved changes in edit mode, navigating away (clicking spirits tab or browser back) shows confirmation dialog asking to discard changes.
result: issue
reported: "Works functionally but uses browser confirm() alert. Should use themed AlertDialog modal consistent with delete turn/opening modals."
severity: minor

### 10. Delete Opening
expected: In edit mode with existing opening, delete opening button shows themed AlertDialog with opening name. Confirming deletes the opening from database.
result: issue
reported: "Delete works but: 1) After deleting should stay in edit mode, not exit. 2) Should not allow deleting all turns - hide delete turn button when only 1 turn left, keep only delete opening button."
severity: major

### 11. Create New Opening
expected: In edit mode on spirit with no openings OR using Add Opening button, form appears for new opening. Saving creates opening in database linked to spirit.
result: pass

### 12. Scroll Stability on Edit Toggle
expected: Entering and exiting edit mode does NOT cause page to scroll to top. Current scroll position is preserved.
result: issue
reported: "Page scrolls to top when toggling edit mode. Likely caused by URL update (edit=true/false). Remove URL state for edit mode - not needed."
severity: major

### 13. Multiple Openings Tabs
expected: Spirit with multiple openings shows tabs UI. Clicking a tab switches displayed opening. URL updates with ?opening=<id>. Single opening spirits show content without tabs.
result: pass

### 14. URL Persistence for Opening Tab
expected: Refreshing page with ?opening=<id> in URL keeps that opening tab selected. Sharing URL takes user directly to that opening.
result: pass

## Summary

total: 14
passed: 7
issues: 7
pending: 0
skipped: 0

## Gaps

- truth: "Search filters spirits by name/summary/description including aspects"
  status: failed
  reason: "User reported: it appears to only find the name of the spirits. aspects, are not found"
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Save button saves changes and exits edit mode; no unsaved changes alert after save; use AlertDialog instead of confirm()"
  status: failed
  reason: "User reported: FAB is present but behavior not correct. When clicking save it should save AND exit edit mode. Also after clicking save, 'You have unsaved changes' alert still appears (shouldn't). Also replace browser confirm() with themed AlertDialog modal."
  severity: major
  test: 3
  related_tests: [7, 9]
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Save button always visible, greyed out when invalid, active when all required fields filled"
  status: failed
  reason: "User reported: Save button visibility inconsistent. Should always be visible but greyed out when invalid, only active when all required fields filled. Currently shows when opening name exists but isn't clickable until turn title+instructions also filled."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Delete opening stays in edit mode; cannot delete last turn (hide delete button when 1 turn left)"
  status: failed
  reason: "User reported: Delete works but: 1) After deleting should stay in edit mode, not exit. 2) Should not allow deleting all turns - hide delete turn button when only 1 turn left, keep only delete opening button."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Scroll position preserved when toggling edit mode"
  status: failed
  reason: "User reported: Page scrolls to top when toggling edit mode. Likely caused by URL update (edit=true/false). Remove URL state for edit mode - not needed."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
