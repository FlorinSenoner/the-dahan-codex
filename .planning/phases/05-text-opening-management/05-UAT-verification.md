---
status: complete
phase: 05-text-opening-management
source: 05-15-SUMMARY.md, 05-16-SUMMARY.md, 05-17-SUMMARY.md, 05-18-SUMMARY.md, 05-06-SUMMARY.md
started: 2026-01-31T18:00:00Z
updated: 2026-01-31T19:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Search Finds Aspect Names
expected: On spirits list (/spirits), searching "Immense" finds Lightning's Swift Strike Immense aspect. Searching "Sunshine" finds River's Sunshine aspect.
result: pass

### 2. Edit Mode Toggle Without Scroll Jump
expected: On a spirit detail page (e.g., /spirits/river-surges-in-sunlight), scroll down to openings section, then click Edit FAB. Page should NOT scroll to top - current scroll position is preserved.
result: pass
note: Fixed by adding resetScroll: false to navigate calls in opening-section.tsx

### 3. Save Exits Edit Mode
expected: In edit mode, make a change to an opening (e.g., edit a turn's instructions). Click Save. After save completes, edit mode exits automatically (FAB shows pencil again, not X).
result: pass

### 4. No False Unsaved Warning After Save
expected: After saving changes (test 3), try navigating away (click Spirits tab). No "unsaved changes" warning appears - you navigate cleanly.
result: pass
note: Fixed by adding enableBeforeUnload: shouldBlock to useBlocker options

### 5. Save Button Always Visible When Changes Exist
expected: In edit mode with changes, Save button (checkmark) is always visible. If opening name or any turn title/instructions is empty, Save is disabled (greyed out) but still visible.
result: pass

### 6. Delete Opening Stays in Edit Mode
expected: In edit mode on a spirit with an opening, delete the opening via AlertDialog. After deletion, should remain in edit mode (can immediately create a new opening).
result: pass

### 7. Cannot Delete Last Turn
expected: In edit mode with an opening that has only 1 turn, the delete turn button (trash icon) should be hidden - only delete opening button is available.
result: pass

### 8. Themed Navigation Warning
expected: In edit mode with unsaved changes, click Spirits tab. A themed AlertDialog appears (not browser confirm()). Clicking "Stay" keeps you on page, clicking "Discard" navigates away.
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

- truth: "Scroll position preserved when creating new opening (adding ?opening=<id> to URL)"
  status: fixed
  reason: "User reported: when entering the edit mode, and when editing an existing opening it does not jump to the top. but when creating a new opening it does. I assume this is because we add the opening ID to the url (?opening=<id>). fix this, even when adding the opening to the URL we should not jump to the top of the screen"
  severity: major
  test: 2
  root_cause: "TanStack Router resets scroll position on URL changes by default"
  fix: "Added resetScroll: false to all navigate calls in opening-section.tsx"
  artifacts:
    - path: "app/components/spirits/opening-section.tsx"
      change: "Added resetScroll: false to handleTabChange, handleSave, and handleDelete navigate calls"

- truth: "No unsaved changes warning when no changes made and not in edit mode"
  status: fixed
  reason: "User reported: load a spirit detail page, make no changes and press reload page - triggers 'Reload site?' alert even if never entered edit mode and no changes present"
  severity: major
  test: 4
  root_cause: "useBlocker's enableBeforeUnload defaults to true, causing browser dialog regardless of shouldBlockFn"
  fix: "Added enableBeforeUnload: shouldBlock to useBlocker options to only enable when there are actual unsaved changes"
  artifacts:
    - path: "app/routes/spirits.$slug.tsx"
      change: "Added enableBeforeUnload: shouldBlock to useBlocker options"
