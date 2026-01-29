---
status: complete
phase: 04-pwa-offline (gap closure)
source: 04-06-SUMMARY.md, 04-07-SUMMARY.md, 04-08-SUMMARY.md, 04-09-SUMMARY.md
started: 2026-01-28T20:00:00Z
updated: 2026-01-29T12:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Subtle Offline Indicator
expected: Toggle offline in DevTools → small muted pill appears at bottom-right corner (not top banner). Shows "Offline" with WifiOff icon in zinc/gray styling. Toggle back online → pill disappears.
result: pass

### 2. Simplified Settings Page
expected: Navigate to Settings tab → see single "Cache Management" section with "Sync Data" and "Clear Cache" buttons side-by-side. No separate "Offline Access" section. Buttons use subtle outline styling (not colored).
result: pass
note: "Missing cursor-pointer on hover for buttons"

### 3. Sync Data Fetches Aspects
expected: Click "Sync Data" on Settings → button shows syncing status. After completion, open DevTools → Application → IndexedDB → check tanstack-query-cache contains spirit data including aspects (not just base spirits).
result: pass
note: "Fixed: Now uses queryClient.prefetchQuery with convexQuery, manual persistQueryCache call, and lowercase aspect names to match URL format"

### 4. Clear Cache Removes IndexedDB
expected: Click "Clear Cache" on Settings → page reloads. Open DevTools → Application → IndexedDB → "tanstack-query-cache" should be empty or deleted. Service worker should also be unregistered.
result: pass

### 5. Query Persistence Across Sessions
expected: Click "Sync Data" to download spirits → close browser completely → reopen browser and navigate to a spirit detail page (e.g., River) → spirit data loads from IndexedDB cache (visible in Network tab as no new requests).
result: pass

### 6. Offline Access After Sync
expected: Click "Sync Data" on Settings → toggle offline in DevTools → navigate to Spirits list → spirits display. Click on a spirit detail page → spirit data shows from cached data (no network error).
result: pass
note: "Data works offline. Images only cached after visiting pages (image prefetch deferred to future work)"

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
