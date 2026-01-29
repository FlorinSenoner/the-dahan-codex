# Manual Test Checklist

## PWA Cold-Start Offline (PWA-02)

**Purpose**: Verify app loads and displays spirit library when completely offline (cold start).

**Prerequisites**:
- Chrome DevTools available
- App deployed or running locally with `pnpm preview`

**Steps**:
1. Open app in Chrome, navigate to /spirits
2. Wait for service worker to install (check DevTools > Application > Service Workers)
3. Browse a few spirits to populate cache (view 2-3 spirit detail pages)
4. Close all browser tabs with the app
5. Open DevTools > Network tab, enable "Offline" checkbox
6. Open a new tab and navigate to app URL
7. Verify:
   - [ ] App shell loads (header, bottom nav visible)
   - [ ] Spirit list renders with names and images
   - [ ] Can navigate to spirit detail page
   - [ ] Offline indicator appears at top
8. Disable "Offline" in DevTools
9. Verify offline indicator disappears

**Expected Result**: App renders cached spirit library data without network connection.

**Notes**:
- First visit must be online to install SW and cache data
- Convex data caches on first view via stale-while-revalidate strategy
- Images cache via Workbox CacheFirst strategy
