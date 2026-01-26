# Browser Verification Reference

Patterns and guidance for verifying features work via browser automation.

<core_concept>

## Static vs Browser Verification

| Aspect | Static Verifier | Browser Verifier |
|--------|-----------------|------------------|
| **What** | Code analysis | Live interaction |
| **How** | grep, file checks | Playwright MCP |
| **Verifies** | Exists, substantive, wired | Actually works |
| **Speed** | Fast | Slower |
| **Scope** | All code artifacts | User-facing only |

**Use both:** Static verifier catches missing/stub code. Browser verifier catches code that exists but doesn't work.

</core_concept>

<identifying_user_facing_truths>

## User-Facing vs Backend Truths

Browser verification only applies to user-facing truths. Classify truths before verification.

### User-Facing (Needs Browser)

| Pattern | Example | Why Browser Needed |
|---------|---------|-------------------|
| "User can see X" | "User can see spirit list" | Visual confirmation |
| "User can click X" | "User can click filter button" | Interaction test |
| "User can navigate to X" | "User can navigate to details" | Navigation flow |
| "User can submit X" | "User can submit search query" | Form interaction |
| "X appears when Y" | "Error shows when invalid" | Conditional display |
| "X updates when Y" | "List updates on filter" | Dynamic behavior |

### Backend-Only (Static Verifier Handles)

| Pattern | Example | Why No Browser |
|---------|---------|----------------|
| "API returns X" | "API returns filtered data" | Internal response |
| "Schema includes X" | "Schema has spirit fields" | Database structure |
| "Hook provides X" | "useSpirits provides data" | Internal state |
| "Function validates X" | "validateInput checks required" | Logic unit |
| "Type includes X" | "SpiritType has aspects" | Type definition |

### Edge Cases

| Pattern | Classification | Rationale |
|---------|---------------|-----------|
| "Data loads when page opens" | User-facing | User sees loading state |
| "Cache reduces API calls" | Backend | Performance optimization |
| "Error boundary catches errors" | User-facing | User sees fallback UI |
| "Middleware authenticates" | Backend | Request processing |

</identifying_user_facing_truths>

<verification_scenarios>

## Common Verification Scenarios

### Scenario 1: Component Renders

**Truth:** "User can see the spirit list on the home page"

**Test Flow:**
1. Navigate to home page
2. Wait for content load
3. Take snapshot
4. Search for list elements in accessibility tree
5. Verify expected items present

**Pass if:** List items visible in snapshot
**Fail if:** Empty state, error, or missing component

### Scenario 2: Navigation Flow

**Truth:** "User can navigate from list to detail page"

**Test Flow:**
1. Navigate to list page
2. Snapshot, find clickable item
3. Click item
4. Wait for navigation
5. Snapshot new page
6. Verify detail content visible

**Pass if:** URL changed and detail content present
**Fail if:** Navigation fails or detail page empty

### Scenario 3: Form Submission

**Truth:** "User can search for spirits by name"

**Test Flow:**
1. Navigate to search page
2. Snapshot, find search input
3. Type search query
4. Click search button (or submit)
5. Wait for results
6. Snapshot results
7. Verify results match query

**Pass if:** Results displayed and relevant
**Fail if:** No results, error, or wrong results

### Scenario 4: State Change

**Truth:** "User can toggle favorite status"

**Test Flow:**
1. Navigate to item page
2. Snapshot, find toggle button, note initial state
3. Click toggle
4. Wait for update
5. Snapshot, verify state changed
6. (Optional) Refresh and verify persistence

**Pass if:** State toggled and (optionally) persisted
**Fail if:** State unchanged or reverts

### Scenario 5: Error Handling

**Truth:** "User sees error message for invalid input"

**Test Flow:**
1. Navigate to form
2. Enter invalid input (or leave required empty)
3. Submit form
4. Snapshot
5. Look for error message element

**Pass if:** Error message displayed with helpful text
**Fail if:** No error shown, form submits anyway, or generic error

### Scenario 6: Loading States

**Truth:** "User sees loading indicator while data fetches"

**Test Flow:**
1. Navigate to page with async data
2. Immediately snapshot (before data loads)
3. Look for loading indicator
4. Wait for data
5. Snapshot again
6. Verify data replaced loading state

**Pass if:** Loading state visible initially, then replaced by content
**Fail if:** Blank screen, no loading indicator, or stuck loading

</verification_scenarios>

<server_lifecycle>

## Dev Server Management

### Startup Check

```bash
# Check if server responds
check_server() {
  local status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "000")
  [ "$status" = "200" ] && echo "running" || echo "not_running"
}
```

### Start Server

```bash
# Start in background if not running
if [ "$(check_server)" = "not_running" ]; then
  pnpm dev &

  # Wait for ready (up to 30 seconds)
  for i in {1..30}; do
    [ "$(check_server)" = "running" ] && break
    sleep 1
  done
fi
```

### Port Conflict Handling

If port 5173 is occupied by another process:

1. Check what's using the port:
   ```bash
   lsof -i :5173
   ```

2. Options:
   - Kill the process if it's a stale dev server
   - Note conflict in report and skip browser verification
   - Don't try to use a different port (routes may be hardcoded)

### Server Cleanup

The orchestrator handles cleanup. Browser verifier should NOT kill the server — other verification may follow.

</server_lifecycle>

<screenshot_strategy>

## Screenshot Capture

### When to Screenshot

| Scenario | Screenshot? | Filename Pattern |
|----------|-------------|------------------|
| Verification passes | No | - |
| Verification fails | Yes | `failure_{truth_slug}.png` |
| Unexpected state | Yes | `unexpected_{description}.png` |
| Console errors | Optional | `error_{context}.png` |

### Screenshot Tool Usage

```
mcp__playwright__browser_take_screenshot(
  filename="failure_spirit_list_empty.png",
  type="png"
)
```

### Screenshot Location

Screenshots saved relative to working directory. Include in BROWSER-VERIFICATION.md:

```markdown
**Screenshot:** failure_spirit_list_empty.png
```

### Full Page vs Viewport

- Default: viewport only (what user sees)
- Use `fullPage: true` for long scrolling content issues

</screenshot_strategy>

<console_debugging>

## Console Error Analysis

### Check for Errors

After any verification failure:

```
mcp__playwright__browser_console_messages(level="error")
```

### Common Error Patterns

| Error Pattern | Likely Cause | Impact |
|---------------|--------------|--------|
| `TypeError: Cannot read property 'x' of undefined` | Missing data/prop | Component crash |
| `404 Not Found` | Missing API route or static asset | Missing content |
| `Network Error` | API not responding | No data |
| `Unhandled Promise Rejection` | Async error not caught | Undefined behavior |
| `Hydration mismatch` | SSR/client mismatch | Visual glitches |

### Include in Report

```markdown
**Console Errors:**
```
TypeError: Cannot read property 'name' of undefined
    at SpiritCard (spirit-card.tsx:15)
```
```

</console_debugging>

<gap_analysis>

## Structured Gap Output

When verification fails, provide structured gaps for the planner.

### Gap Structure

```yaml
gaps:
  - truth: "User can see spirit list"
    status: failed
    expected: "List of spirits with names and images"
    actual: "Empty div with no content"
    screenshot: "failure_spirit_list.png"
    console_errors:
      - "TypeError: spirits.map is not a function"
    root_cause: "Data not loading from API"
    suggested_fix: "Check useSpirits hook returns array"
```

### Gap Categories

| Category | Example | Fix Approach |
|----------|---------|--------------|
| Missing content | Element not in DOM | Check render logic |
| Broken interaction | Click does nothing | Check event handler |
| Wrong content | Shows placeholder | Check data binding |
| Error state | Red error message | Fix underlying error |
| Navigation failure | Wrong page or 404 | Check routing |
| Form issues | Submit doesn't work | Check form wiring |

</gap_analysis>

<integration_with_static>

## Relationship to Static Verifier

Browser verification runs AFTER static verification in execute-phase.

### Verification Flow

```
Static Verifier (gsd-verifier)
    ↓ Creates VERIFICATION.md
    ↓ Status: passed | gaps_found | human_needed
    ↓
[If passed or human_needed, and browser_verifier enabled]
    ↓
Browser Verifier (gsd-browser-verifier)
    ↓ Creates BROWSER-VERIFICATION.md
    ↓ Status: passed | gaps_found | blocked
    ↓
Orchestrator routes based on combined status
```

### Status Combinations

| Static | Browser | Combined Action |
|--------|---------|-----------------|
| passed | passed | Phase complete |
| passed | gaps_found | Browser gaps need fixes |
| passed | blocked | Manual verification needed |
| gaps_found | - | Static gaps first (browser skipped) |
| human_needed | passed | Present human checklist |
| human_needed | gaps_found | Browser gaps + human checklist |

</integration_with_static>

<config_toggle>

## Configuration

Browser verification is controlled via `.planning/config.json`:

```json
{
  "workflow": {
    "browser_verifier": true
  }
}
```

### Toggle Behavior

| Value | Behavior |
|-------|----------|
| `true` | Run browser verification after static verification |
| `false` | Skip browser verification (static only) |
| (missing) | Default to `false` (opt-in feature) |

### When to Enable

Enable `browser_verifier` when:
- Building user-facing features
- Phase involves UI components
- Previous phases had browser-related bugs
- High confidence needed before shipping

Disable `browser_verifier` when:
- Backend-only changes
- Infrastructure/tooling phases
- Rapid iteration (verification slows cycle)
- No dev server available

</config_toggle>
