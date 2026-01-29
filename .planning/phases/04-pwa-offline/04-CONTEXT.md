# Phase 4: PWA & Offline - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

App works fully offline with cached reference data (spirits, openings, images) and proper update flow. Users can install to home screen, see offline status, and control when to reload for updates. Offline experience matches online — all data available.

</domain>

<decisions>
## Implementation Decisions

### Offline Indicator
- Status icon in header, only visible when offline (not always-on)
- Fade in/out animation when connection state changes
- No tap interaction — just a visual indicator
- Icon: cloud-off or similar network status icon

### Update Flow
- Top banner (not dismissible) when new service worker is waiting
- Descriptive message: "A new version is ready" + Reload button
- Subtle accent color to draw attention without feeling urgent
- No changelog or "what's new" — just reload
- User controls when to reload (skipWaiting: false in SW config)

### Installation Prompt
- Bottom banner after engagement (user browses 2-3 spirits)
- Benefit-focused message: "Install for offline access"
- Re-prompt after 7 days if dismissed
- Success animation when installed (icon animates into place)
- iOS-specific: Show manual instructions ("Tap Share > Add to Home Screen")
- Detect installed state via display-mode: standalone + navigator.standalone (iOS)
- Hide prompt if already installed

### Caching Strategy
- Cache ALL data upfront: spirits, openings, images — full offline parity
- Cache during service worker install event (standard PWA pattern)
- Stale-while-revalidate: show cached immediately, fetch fresh in background
- Subtle sync indicator while refreshing (small icon/spinner)
- Silent failure unless cache very old (>7 days), then notify user
- Pull-to-refresh on spirit list to force refresh
- Settings page with "Refresh data" and "Clear cache" buttons
- Prioritize text data over images if storage quota low
- Start simple: service worker cache for Convex responses (add IndexedDB later if needed)

### Native App Feeling
- Standalone display mode (no browser chrome when installed)
- Browser handles swipe-back gesture natively
- View transitions on all navigation, shared elements only (content swaps)
- Browser default scroll restoration
- Minimal splash screen (theme background color, no logo animation)

### Claude's Discretion
- Exact sync indicator design and positioning
- Transition timing and easing curves
- Cache storage limit thresholds
- Error message wording for stale cache
- Install prompt engagement threshold (exact number of spirits viewed)

</decisions>

<specifics>
## Specific Ideas

- "Everything should work offline the same way as online"
- Settings page is the troubleshooting hub for cache management
- iOS needs special handling since it lacks beforeinstallprompt
- Keep transitions subtle — shared elements only, not full page slides

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-pwa-offline*
*Context gathered: 2026-01-28*
