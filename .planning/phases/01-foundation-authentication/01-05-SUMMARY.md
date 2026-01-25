---
phase: 01-foundation-authentication
plan: 05
subsystem: infra
tags: [pwa, workbox, service-worker, offline, manifest]

# Dependency graph
requires:
  - phase: 01-04
    provides: Root layout with ClerkProvider hierarchy for useEffect hook placement
provides:
  - Workbox-generated service worker with static asset precaching
  - PWA manifest enabling app installation
  - Service worker registration with update detection
  - Runtime caching for Convex API and external images
affects: [04-ui-polish, deployment, offline-features]

# Tech tracking
tech-stack:
  added: ["workbox-core@7.4.0", "workbox-precaching@7.4.0", "workbox-routing@7.4.0", "workbox-strategies@7.4.0", "workbox-expiration@7.4.0", "workbox-build@7.4.0", "tsx@4.21.0"]
  patterns: [manual-workbox-generation, sw-registration-in-root-useEffect, skipWaiting-false-for-safe-updates]

key-files:
  created:
    - scripts/generate-sw.ts
    - app/lib/sw-register.ts
    - public/manifest.json
    - public/icons/icon-192.png
    - public/icons/icon-512.png
    - public/icons/icon-maskable-512.png
  modified:
    - app/routes/__root.tsx
    - package.json

key-decisions:
  - "Manual Workbox via scripts/generate-sw.ts instead of vite-plugin-pwa (Vite 7 incompatibility)"
  - "skipWaiting: false to prevent broken state during service worker updates"
  - "Runtime caching: NetworkFirst for Convex API (24h), CacheFirst for external images (30d)"
  - "Placeholder icons with dark theme (#1a1a1a) - to be replaced with branded icons"

patterns-established:
  - "Service worker generated post-build via tsx scripts/generate-sw.ts"
  - "SW registration in root layout useEffect (client-side only)"
  - "Update detection logs 'New version available' - UI banner planned for Phase 4"

# Metrics
duration: 8min
completed: 2026-01-25
---

# Phase 1 Plan 5: Manual Workbox PWA Summary

**Workbox service worker with static asset precaching, PWA manifest for installability, and safe update detection via user-controlled skipWaiting**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-25T12:11:06Z
- **Completed:** 2026-01-25T12:19:15Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments
- Service worker generates during build, precaching 9 static assets (489 KB)
- PWA manifest enables app installation with "The Dahan Codex" branding
- Runtime caching configured for Convex API (NetworkFirst) and external images (CacheFirst)
- Service worker registration with hourly update checks and update detection logging
- skipWaiting: false ensures users don't experience broken state during updates

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Workbox dependencies and create PWA manifest** - `0d186cc` (feat)
2. **Task 2: Create service worker generator script** - `7f22300` (feat)
3. **Task 3: Register service worker and add manifest to app** - `5851f55` (feat)

## Files Created/Modified
- `scripts/generate-sw.ts` - Workbox build script using generateSW with precaching and runtime caching
- `app/lib/sw-register.ts` - Service worker registration with update detection
- `public/manifest.json` - PWA manifest with app metadata and icon references
- `public/icons/icon-192.png` - Placeholder icon (192x192, dark theme)
- `public/icons/icon-512.png` - Placeholder icon (512x512, dark theme)
- `public/icons/icon-maskable-512.png` - Maskable placeholder icon for Android
- `app/routes/__root.tsx` - Added manifest link, theme-color meta, icons, registerSW() call
- `package.json` - Added workbox dependencies, tsx, and generate-sw script to build

## Decisions Made
- Used manual Workbox generation (scripts/generate-sw.ts) instead of vite-plugin-pwa due to Vite 7 incompatibility identified in research
- Set skipWaiting: false to prevent service worker auto-update that could break app state during user sessions
- Configured runtime caching for Convex API with NetworkFirst strategy (24h TTL) to balance freshness and offline access
- Created placeholder icons with dark theme (#1a1a1a) matching app theme - branded icons to be created later

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Preview server returns 500 error on root route due to Clerk auth configuration requirements - this is expected without Clerk env vars configured. Static assets (manifest.json, sw.js, icons) serve correctly.

## User Setup Required

None - no external service configuration required for PWA functionality. Service worker and manifest work independently of authentication setup.

## Next Phase Readiness
- PWA infrastructure complete, app is installable and precaches static assets
- Service worker update detection ready - UI update banner planned for Phase 4
- Placeholder icons need replacement with branded artwork (low priority, non-blocking)
- Ready for Phase 1 completion (01-06 database schema)

---
*Phase: 01-foundation-authentication*
*Completed: 2026-01-25*
