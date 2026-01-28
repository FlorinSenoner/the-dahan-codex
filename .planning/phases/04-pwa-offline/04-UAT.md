---
status: diagnosed
phase: 04-pwa-offline
source: 04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md
started: 2026-01-28T19:30:00Z
updated: 2026-01-28T19:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Offline Indicator Appears When Disconnected
expected: Toggle offline in DevTools → amber banner appears at top with "You are offline" text and WifiOff icon. Toggle back online → banner disappears.
result: issue
reported: "the offline banner is functionally working. but it is way too prominent and in your face. also it's flickering when navigating (probably due to re-rendering). make it more subtle -> add an offline icon in the bottom right corner just so the user is informed, but the app should work normally so no need to have such a prominent banner"
severity: minor

### 2. Settings Page Accessible
expected: Navigate to Settings tab in bottom navigation → Settings page loads with "Settings" header and cache management options.
result: pass
note: "Cosmetic feedback: make icons more subtle (not green/red), group all under Cache Management with Refresh and Download next to each other"

### 3. Download for Offline Button
expected: On Settings page, click "Download for Offline" → button shows progress text while loading spirits and openings → returns to "Download for Offline" when complete.
result: pass
note: "Data gap: only spirits are fetched, aspects are not downloaded"

### 4. Refresh Data Button
expected: On Settings page, click "Refresh Data" → page reloads to refresh cached data.
result: skipped
reason: "Will be redesigned - user requested combining refresh + download into single button"

### 5. Clear Cache Button
expected: On Settings page, click "Clear Cache & Reset" → all caches cleared, service worker unregistered, page reloads.
result: skipped
reason: "Will be redesigned along with test 4"

### 6. Install Prompt (Chromium)
expected: In Chrome desktop (not installed as PWA), after 2-second delay an install prompt appears at bottom of screen with "Install App" option. Can be dismissed for 7 days.
result: pass

### 7. PWA Manifest Valid
expected: In DevTools → Application → Manifest → shows valid manifest with app name "The Dahan Codex", icons, and theme colors.
result: pass

### 8. App Loads Offline After Download
expected: After clicking "Download for Offline" on Settings, toggle offline in DevTools → navigate to Spirits list → spirits still display (from cache). Navigate to a spirit detail → spirit data shows.
result: issue
reported: "this only works for pages the user has previously visited. even if the user downloads the data on the settings page and he navigates to the spirits page, then goes offline, he can't open any of the spirit detail pages. also re-loading the pages shows nothing"
severity: major

## Summary

total: 8
passed: 4
issues: 5
pending: 0
skipped: 2

## Gaps

- truth: "Offline indicator should be subtle and not flicker"
  status: failed
  reason: "User reported: the offline banner is functionally working. but it is way too prominent and in your face. also it's flickering when navigating (probably due to re-rendering). make it more subtle -> add an offline icon in the bottom right corner just so the user is informed, but the app should work normally so no need to have such a prominent banner"
  severity: minor
  test: 1
  root_cause: "Full-width amber banner at top with fixed positioning causes visual disruption during navigation. Design is overly intrusive for an app that works seamlessly offline."
  artifacts:
    - path: "app/components/pwa/offline-indicator.tsx"
      issue: "Uses prominent bg-amber-600 banner at top-0 with full width"
  missing:
    - "Move to subtle bottom-right pill/icon (bottom-20 to clear BottomNav)"
    - "Use muted styling (bg-zinc-800/90) instead of prominent amber"
    - "Reduce z-index from z-50 to z-40"

- truth: "Settings page icons should be subtle and grouped logically"
  status: failed
  reason: "User reported: make the icons more subtle. no need to make them green and red. also group them all together under cache management with refresh and download next to each other"
  severity: cosmetic
  test: 2
  root_cause: "Buttons split across two sections (Offline Access vs Cache Management). Uses prominent styling: default variant, destructive variant (red), green success text."
  artifacts:
    - path: "app/routes/settings.tsx"
      issue: "Lines 97-172: Separate sections, prominent button variants, colored status text"
  missing:
    - "Consolidate all buttons under single Cache Management section"
    - "Change buttons to variant='outline' for subtle styling"
    - "Replace text-green-500 with text-muted-foreground"
    - "Place Download and Refresh buttons side-by-side"

- truth: "Download for Offline should fetch all spirit data including aspects"
  status: failed
  reason: "User reported: not all data is downloaded. only spirits are fetched, the aspects are not"
  severity: minor
  test: 3
  root_cause: "Download calls getSpiritBySlug without aspect parameter. Never calls getSpiritWithAspects. Aspects require the aspect parameter or getSpiritWithAspects query to fetch their data."
  artifacts:
    - path: "app/routes/settings.tsx"
      issue: "Lines 32-43: Loops calling getSpiritBySlug({ slug }) which only fetches base spirits"
  missing:
    - "Call getSpiritWithAspects for each base spirit to cache all aspect data"
    - "Or detect isAspect flag and call with correct aspect parameter"

- truth: "Settings cache buttons should be simplified to single Sync Data button"
  status: failed
  reason: "User reported: combine refresh + download into a single button for simplicity"
  severity: minor
  test: 4
  root_cause: "Three separate buttons (Download, Refresh, Clear) with confusing distinctions. Users don't understand difference between downloading and refreshing."
  artifacts:
    - path: "app/routes/settings.tsx"
      issue: "Three separate handler functions with overlapping purposes"
  missing:
    - "Single syncData() function: clear cache, then fetch all data fresh"
    - "Rename to 'Sync Data' button with RefreshCw icon"
    - "Keep Clear Cache as secondary/advanced option"

- truth: "Downloaded data should enable offline access to all spirit pages without prior visit"
  status: failed
  reason: "User reported: this only works for pages the user has previously visited. even if the user downloads the data on the settings page and he navigates to the spirits page, then goes offline, he can't open any of the spirit detail pages. also re-loading the pages shows nothing"
  severity: major
  test: 8
  root_cause: "Three architectural issues: (1) Convex uses WebSockets not HTTP - service worker cannot cache WebSocket data. (2) No data persistence layer - download only populates memory cache, lost on reload. (3) useSuspenseQuery hangs forever offline with no fallback."
  artifacts:
    - path: "app/routes/settings.tsx"
      issue: "Download populates memory-only cache with no persistence"
    - path: "scripts/generate-sw.ts"
      issue: "convex.cloud caching rule ineffective for WebSocket connections"
    - path: "app/router.tsx"
      issue: "Missing persistQueryClient configuration"
  missing:
    - "Install @tanstack/query-persist-client-core + idb-keyval for IndexedDB persistence"
    - "Configure persistQueryClient in router.tsx with gcTime/staleTime"
    - "Add offline-aware data fetching with cached data fallback"
    - "Remove ineffective convex-api-cache service worker rule"
