# Pitfalls Research

**Domain:** Spirit Island PWA companion app with TanStack Start + Convex +
Clerk + Cloudflare Workers **Researched:** 2026-01-24 **Confidence:**
MEDIUM-HIGH (verified with official docs and multiple sources)

## Critical Pitfalls

### Pitfall 1: vite-plugin-pwa / Serwist Incompatibility with TanStack Start Production Builds

**What goes wrong:** Service worker generation fails in production builds. The
PWA assets and service worker bundle are not generated when using
`vite-plugin-pwa` (which Serwist wraps) alongside `tanstackStart()` in Vite
config. The `__WB_MANIFEST` placeholder is never replaced with the proper
precache manifest.

**Why it happens:** `vite-plugin-pwa` does not have proper support for Vite 6's
environment API, which TanStack Start uses. The build steps (generate assets,
generate serviceworker bundle) are seemingly not executed when both plugins are
present. There's an open PR
([vite-pwa/vite-plugin-pwa#786](https://github.com/vite-pwa/vite-plugin-pwa/issues/786))
but as of early 2025 the fix wasn't complete.

**How to avoid:**

1. Use manual Workbox configuration instead of relying on vite-plugin-pwa's
   automatic generation
2. Generate service worker with Workbox modules separately, save to `public/`
   dir, and run on build
3. Consider using Serwist directly with a custom build step rather than through
   Vite plugin
4. Pin to known working versions and test PWA generation in CI before upgrading

**Warning signs:**

- Service worker file missing or empty in build output
- `__WB_MANIFEST` appearing as literal string in generated SW file
- PWA not installable in production despite working in development
- No precached assets in Application > Cache Storage in DevTools

**Phase to address:** Foundation phase - this must be validated immediately when
setting up the PWA infrastructure

**Sources:**

- [TanStack Router Issue #4988](https://github.com/TanStack/router/issues/4988)
- [TanStack Router Discussion #4417](https://github.com/TanStack/router/discussions/4417)

---

### Pitfall 2: TanStack Start + Cloudflare Workers Platform Import Failures

**What goes wrong:** Production builds fail when middleware imports
`cloudflare:workers` for platform-specific bindings. Even when imports are only
used in `.server()` blocks, Rollup processes them during client build phase and
fails with unresolved imports.

**Why it happens:** After TanStack Start v1.142.x, there's a bug where
platform-specific imports in middleware are incorrectly bundled into the client
bundle. The server/client boundary is not properly respected for middleware
imports.

**How to avoid:**

1. Pin to `@tanstack/react-start@1.140.5` and related packages until fix is
   released
2. Isolate Cloudflare-specific code into separate server-only modules
3. Use dynamic imports with `typeof window` checks as last resort
4. Test production builds on Cloudflare preview before upgrading packages

**Warning signs:**

- Build errors mentioning "unresolved imports" for `cloudflare:*`
- Rollup errors about modules not found during client build
- Works in dev, fails in production build

**Phase to address:** Foundation phase - validate deployment pipeline
immediately; Infrastructure phase for ongoing monitoring

**Sources:**

- [TanStack Router Issue #6185](https://github.com/TanStack/router/issues/6185)
- [Cloudflare Workers SDK Issue #10969](https://github.com/cloudflare/workers-sdk/issues/10969)

---

### Pitfall 3: Convex + Clerk Token Not Available in SSR Loaders

**What goes wrong:** Authenticated Convex queries fail during server-side
rendering because the Clerk token isn't properly passed to the Convex HTTP
client. Users see unauthorized errors or empty data on first load, then correct
data after client hydration.

**Why it happens:** The Clerk token must be explicitly retrieved and set in
`beforeLoad` for SSR. Simply wrapping with `<ConvexProviderWithClerk>` only
handles client-side token refresh, not server-side authentication.

**How to avoid:**

1. In route `beforeLoad`, get token with
   `await auth.getToken({ template: "convex" })`
2. Set token on server client:
   `ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)`
3. Ensure `VITE_CONVEX_URL` environment variable is set (throws cryptic error if
   missing)
4. Use conditional check `if (token)` before `setAuth()` to handle
   unauthenticated routes

**Warning signs:**

- "Unauthorized" errors only during SSR, works after hydration
- Flash of empty state before data appears
- Different behavior between hard refresh and client navigation
- Error: "missing VITE_CONVEX_URL envar"

**Phase to address:** Authentication phase - this is core to the auth
integration

**Sources:**

- [Convex Docs: TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk)
- [Clerk Docs: Convex Integration](https://clerk.com/docs/guides/development/integrations/databases/convex)

---

### Pitfall 4: SSR Hydration Mismatches with Browser-Only APIs

**What goes wrong:** React hydration errors cause UI flickering, broken
interactivity, or complete component failure. The server-rendered HTML doesn't
match what the client tries to hydrate.

**Why it happens:** Common causes include:

- Using `Date.now()`, `Math.random()`, or locale-dependent formatting
- Checking `typeof window !== 'undefined'` for conditional rendering
- Using browser-only APIs (localStorage, IndexedDB) in initial render
- Feature flags or user preferences that differ server vs client

**How to avoid:**

1. Wrap browser-dependent UI in TanStack's `<ClientOnly>` component
2. Use `ssr: false` on routes requiring browser-only APIs
3. Use `ssr: 'data-only'` when you want server data but client rendering
4. Never use `Date.now()` or random values in SSR render paths
5. For Spirit data that references user preferences, load on client only

**Warning signs:**

- Console warnings about hydration mismatch
- UI elements appearing then disappearing on load
- Interactive elements not responding until full page reload
- Different content visible in "View Source" vs rendered page

**Phase to address:** Foundation phase for setup; every feature phase should
test hydration

**Sources:**

- [TanStack Start: Hydration Errors](https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors)
- [TanStack Start: Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)

---

### Pitfall 5: skipWaiting() Causing "Half-Old, Half-New" Application State

**What goes wrong:** After service worker update, users experience broken
functionality because old cached HTML is trying to load new JavaScript/CSS, or
vice versa. Forms lose data, menus reset, or the app becomes completely broken.

**Why it happens:** Calling `skipWaiting()` immediately in the install event
forces the new service worker to take control while old pages are still open.
These pages were loaded with old assets but are now served by a new service
worker that may have removed those assets from cache.

**How to avoid:**

1. Never call `skipWaiting()` automatically - require user consent
2. Implement update prompt: "New version available. Click to update."
3. On user confirmation, post `SKIP_WAITING` message to service worker
4. Only then call `self.skipWaiting()` and reload the page
5. Use `clientsClaim: false` initially, only claim after coordinated update

**Warning signs:**

- Users reporting random app breakage after "doing nothing"
- Support tickets spike after deployments
- Console errors about missing assets or chunk load failures
- App works after hard refresh but breaks again later

**Phase to address:** PWA Infrastructure phase - must be designed correctly from
the start

**Sources:**

- [web.dev: PWA Update](https://web.dev/learn/pwa/update)
- [Chrome Developers: Handling Service Worker Updates](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)
- [Rich Harris: Service Workers Gist](https://gist.github.com/Rich-Harris/fd6c3c73e6e707e312d7c5d7d0f3b2f9)

---

### Pitfall 6: Opaque Responses Bloating Cache Storage (7MB per Image)

**What goes wrong:** Cache storage fills up rapidly when caching images from
external sources (like sick.oberien.de for card images). PWA becomes slow or
browsers evict important cached data.

**Why it happens:** Cross-origin requests without CORS return "opaque responses"
which cannot be inspected. Browsers add ~7MB padding per opaque response to
prevent information leakage via storage quota probing. 100 card images cached as
opaque = 700MB of quota used.

**How to avoid:**

1. Add `crossorigin="anonymous"` to all external `<img>` tags
2. Verify external image source supports CORS headers
3. If source doesn't support CORS, proxy images through your own CDN/worker
4. For sick.oberien.de cards: verify CORS support, implement proxy if needed
5. Use network-first for external images rather than cache-first
6. Monitor cache size in DevTools Application tab

**Warning signs:**

- `navigator.storage.estimate()` shows unexpectedly large usage
- Cache storage growing faster than actual content would suggest
- PWA evicted from cache on mobile devices with limited storage
- iOS users losing cached data more frequently than Android

**Phase to address:** Card Image Loading phase - critical for the card preview
feature

**Sources:**

- [Cloud Four: When 7 KB Equals 7 MB](https://cloudfour.com/thinks/when-7-kb-equals-7-mb/)
- [Chrome Developers: Caching Resources at Runtime](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/)
- [Blog: Navigating CORS and Cache API](https://blog.jonathanlau.io/posts/navigating-cors-and-cache-api/)

---

## Moderate Pitfalls

### Pitfall 7: Clerk Token Expiration During Offline Periods

**What goes wrong:** Users who go offline (or close tab) for more than 60
seconds find themselves signed out when they return, even though their session
should still be valid.

**Why it happens:** Clerk uses extremely short-lived tokens (60 seconds) that
are automatically refreshed every 50 seconds. When offline or tab is closed,
refresh cannot happen. On reconnection, the expired token fails authentication.

**How to avoid:**

1. Implement graceful token refresh on app foreground/reconnection
2. For offline reads, don't require valid token - data is already cached
3. Only require re-authentication for mutations/sync operations
4. Show clear "Reconnecting..." state rather than forcing sign-in
5. Use Clerk's client token (cookie) to silently obtain new session token on
   reconnect

**Warning signs:**

- Users reporting frequent sign-outs
- "Session expired" errors after switching tabs
- Higher support tickets from mobile users (who switch apps frequently)

**Phase to address:** Authentication phase + Offline Sync phase

**Sources:**

- [Clerk Docs: Session Tokens](https://clerk.com/docs/guides/sessions/session-tokens)
- [Clerk Docs: Force Token Refresh](https://clerk.com/docs/guides/sessions/force-token-refresh)

---

### Pitfall 8: Convex Has No Native Offline Persistence

**What goes wrong:** App shows spinners or empty state when offline because
Convex queries require network connectivity. The "offline-first" experience is
completely broken.

**Why it happens:** Convex is designed as a real-time sync database, not an
offline-first database. It handles reconnection gracefully but doesn't persist
query results to IndexedDB. When offline, `useQuery` returns undefined or
throws.

**How to avoid:**

1. Implement separate IndexedDB layer for offline cache (using Dexie or idb)
2. On app load, populate Convex queries then mirror to IndexedDB
3. When offline, read from IndexedDB instead of Convex
4. Consider Replicache for full offline sync (Convex team recommends)
5. For read-only offline (The Dahan Codex use case), periodic full sync to
   IndexedDB is sufficient

**Warning signs:**

- Spinners when network is slow or offline
- "Could not connect" errors in offline mode
- Users complaining app is "useless on planes/subway"

**Phase to address:** Offline Caching phase - this is the core offline
architecture decision

**Sources:**

- [Convex: Object Sync Engine](https://stack.convex.dev/object-sync-engine)
- [Convex Backend Issue #95](https://github.com/get-convex/convex-backend/issues/95)

---

### Pitfall 9: Framer Motion Layout Animations Causing Jank on Scrubber

**What goes wrong:** The opening scrubber/timeline becomes janky during
animations. Frame rate drops when dragging, animations stutter, or UI becomes
unresponsive.

**Why it happens:**

- Layout animations trigger style recalculation and reflow
- `filter: blur()` costs scale sharply with blur radius (>10px is expensive)
- Complex DOM structures make style recalculation costly
- AnimatePresence exit animations block the main thread

**How to avoid:**

1. Only animate `transform` and `opacity` (composited properties)
2. Use `willChange` prop sparingly and only on animated elements
3. Keep blur values under 10px or eliminate blur entirely
4. Use `layoutId` for shared element transitions, not manual animations
5. Keep exit animations short (<200ms)
6. Test with 6x CPU throttling in DevTools
7. Use `LazyMotion` to reduce bundle size

**Warning signs:**

- Jank visible when dragging scrubber
- DevTools Performance shows long "Recalculate Style" tasks
- Animation frame rate below 30fps on mobile
- Users complaining about "laggy" scrubber

**Phase to address:** Scrubber Implementation phase - performance must be
validated early

**Sources:**

- [Motion.dev: Web Animation Performance Tier List](https://motion.dev/blog/web-animation-performance-tier-list)
- [Framer Motion GitHub Issue #442](https://github.com/framer/motion/issues/442)

---

### Pitfall 10: IndexedDB Schema Versioning Disasters

**What goes wrong:** Users with old cached data experience crashes, data loss,
or corrupted state after app updates that change the IndexedDB schema.

**Why it happens:** IndexedDB requires explicit version management. Schema
changes need migration logic. Without proper versioning:

- `onupgradeneeded` doesn't fire correctly
- Old data structures break new code
- Indexes referenced by queries don't exist

**How to avoid:**

1. Use a library with migration support (Dexie has excellent versioning)
2. Plan schema from the start - Spirit data model, Opening structure, user
   preferences
3. Write migrations for every schema change
4. Test upgrades from every previous version
5. Include schema version in debug info for support

**Warning signs:**

- "Object store not found" errors in console
- Data disappearing after updates
- Different behavior for new vs. returning users
- "Database error" reports from users who've had app installed longest

**Phase to address:** Data Model phase - schema must be designed for
evolvability from the start

**Sources:**

- [web.dev: Offline Data](https://web.dev/learn/pwa/offline-data)
- [Microsoft Edge: Store Data on Device](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/offline)

---

### Pitfall 11: iOS Safari PWA Cache Purging

**What goes wrong:** iOS users lose all cached data and must re-download
everything after not using the app for ~2 weeks.

**Why it happens:** Apple purges PWA storage for apps not added to homescreen
after approximately 2 weeks of inactivity. Even the service worker and all
IndexedDB data is deleted.

**How to avoid:**

1. Prominently encourage users to "Add to Home Screen"
2. Use `navigator.storage.persist()` to request persistent storage
3. Design for graceful re-sync when cache is cold
4. Show clear progress during initial data sync
5. Keep critical data sync fast (<30 seconds ideally)

**Warning signs:**

- iOS users reporting "having to download everything again"
- Higher data usage for iOS users in analytics
- PWA feeling slower on iOS than Android for returning users

**Phase to address:** PWA Infrastructure + Offline Caching phases

**Sources:**

- [Love2Dev: Service Worker Cache Storage Limit](https://love2dev.com/blog/what-is-the-service-worker-cache-storage-limit/)

---

## Technical Debt Patterns

| Shortcut                           | Immediate Benefit     | Long-term Cost                 | When Acceptable             |
| ---------------------------------- | --------------------- | ------------------------------ | --------------------------- |
| Using `registerType: 'autoUpdate'` | Simpler PWA setup     | Users lose data, confusing UX  | Never for apps with state   |
| Caching opaque responses           | Works without CORS    | 7MB per item, quota exhaustion | Never for bulk images       |
| Single IndexedDB object store      | Faster initial dev    | Slow queries, no indexing      | MVP only, plan migration    |
| Skipping token refresh handling    | Works in happy path   | Users constantly signed out    | Never                       |
| Using `ssr: false` everywhere      | Avoids hydration bugs | No SEO, slower initial load    | OK for authenticated routes |
| No service worker versioning       | Simpler deployment    | Cache invalidation nightmare   | Never                       |

## Integration Gotchas

| Integration                         | Common Mistake                                               | Correct Approach                                          |
| ----------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Convex + Clerk                      | Only wrapping with Provider, not setting token in beforeLoad | Explicitly get and set token in route beforeLoad for SSR  |
| Serwist + TanStack Start            | Using vite-plugin-pwa without checking build output          | Manual Workbox config or verify SW generation in CI       |
| Cloudflare Workers + TanStack Start | Using latest package versions                                | Pin to known working versions, test deploys               |
| External Images (sick.oberien.de)   | Caching without CORS crossorigin attribute                   | Add crossorigin="anonymous" or proxy through your CDN     |
| IndexedDB + Convex                  | Assuming Convex handles offline                              | Implement separate IndexedDB cache layer                  |
| Framer Motion + Scrubber            | Animating layout properties on drag                          | Only animate transform/opacity, use requestAnimationFrame |

## Performance Traps

| Trap                                | Symptoms                    | Prevention                                                 | When It Breaks                   |
| ----------------------------------- | --------------------------- | ---------------------------------------------------------- | -------------------------------- |
| Unthrottled Convex subscriptions    | High bandwidth, slow UI     | Batch queries, use pagination                              | >50 spirits displayed            |
| Full Spirit data in list views      | Slow render, memory issues  | Load summary first, detail on demand                       | >20 spirits in view              |
| Service worker precaching all cards | Slow install, storage quota | Cache on demand, prioritize common cards                   | >200 card images                 |
| Unoptimized presence track renders  | Jank on scrubber            | Memoize, virtualize if needed                              | Complex spirits with many tracks |
| Animating during drag               | Dropped frames              | Use `requestAnimationFrame`, skip non-essential animations | Mobile devices                   |

## Security Mistakes

| Mistake                                              | Risk                              | Prevention                                     |
| ---------------------------------------------------- | --------------------------------- | ---------------------------------------------- |
| Storing Clerk tokens in IndexedDB                    | Token theft if device compromised | Let Clerk manage tokens in httpOnly cookies    |
| Caching authenticated responses without user scoping | Data leakage between users        | Scope IndexedDB stores by user ID              |
| Not validating Convex mutations                      | Unauthorized data modification    | Use Convex's built-in auth checks in mutations |
| Exposing CONVEX_DEPLOY_KEY in client                 | Full database access              | Use VITE\_ prefix only for public URL          |

## UX Pitfalls

| Pitfall                                    | User Impact                  | Better Approach                                   |
| ------------------------------------------ | ---------------------------- | ------------------------------------------------- |
| Forcing reload on SW update                | Lost form state, confusion   | Prompt user, let them choose when                 |
| Silent offline failures                    | User thinks action succeeded | Show clear offline indicator, queue confirmation  |
| No sync progress indication                | User thinks app is frozen    | Show "Syncing..." with progress                   |
| Blocking UI during data load               | App feels slow               | Show skeleton states, progressive loading         |
| Different scrubber behavior online/offline | Confusion, support tickets   | Consistent UI, just show data freshness indicator |

## "Looks Done But Isn't" Checklist

- [ ] **PWA Install:** Test on actual mobile device, not just DevTools PWA audit
- [ ] **Offline Mode:** Test with DevTools offline AND airplane mode
      (different!)
- [ ] **Service Worker Update:** Test update flow with actual version bump, not
      just theory
- [ ] **Convex Auth:** Test SSR with auth, not just client-side navigation
- [ ] **Clerk Tokens:** Test after leaving tab for 5+ minutes, then returning
- [ ] **iOS PWA:** Test on actual iOS device, Safari behaves differently
- [ ] **Card Images:** Test caching 100+ images, check storage quota
- [ ] **Scrubber Animation:** Test with 6x CPU throttling enabled
- [ ] **IndexedDB Migration:** Test upgrade from previous schema version
- [ ] **Cloudflare Deploy:** Test production build on Cloudflare preview, not
      just local

## Recovery Strategies

| Pitfall                          | Recovery Cost | Recovery Steps                                                  |
| -------------------------------- | ------------- | --------------------------------------------------------------- |
| Broken SW cache                  | LOW           | Deploy Clear-Site-Data header, users auto-recover on next visit |
| Wrong skipWaiting behavior       | MEDIUM        | New SW version with correct behavior, communicate to users      |
| Schema migration failure         | HIGH          | Ship emergency migration, potentially lose some cached data     |
| Opaque response quota exhaustion | MEDIUM        | Proxy images, clear cache, re-download with CORS                |
| Hydration mismatch bugs          | LOW           | Add ClientOnly wrapper, deploy fix                              |
| Clerk token issues               | LOW           | Clear cookies, re-authenticate (users may be frustrated)        |

## Pitfall-to-Phase Mapping

| Pitfall                         | Prevention Phase          | Verification                                          |
| ------------------------------- | ------------------------- | ----------------------------------------------------- |
| vite-plugin-pwa incompatibility | Foundation                | CI job checking SW file exists and has valid manifest |
| Cloudflare platform imports     | Foundation                | Production build + deploy in CI                       |
| Convex + Clerk SSR auth         | Authentication            | Integration test: SSR page with auth data             |
| Hydration mismatches            | Foundation + All Features | Hydration error monitoring in production              |
| skipWaiting UX                  | PWA Infrastructure        | Manual QA: update flow with actual version bump       |
| Opaque response bloat           | Card Loading              | Storage quota check after caching 50 images           |
| Clerk token expiration          | Authentication + Offline  | Test: close tab 5 min, reopen, verify no sign-out     |
| Convex offline persistence      | Offline Caching           | Test: go offline, verify data still displays          |
| Framer Motion jank              | Scrubber Implementation   | Performance test with CPU throttling                  |
| IndexedDB versioning            | Data Model                | Test: upgrade from v1 schema to v2                    |
| iOS cache purging               | PWA Infrastructure        | Document homescreen requirement, test after 2 weeks   |

## Sources

**Official Documentation:**

- [Convex Docs: TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk)
- [TanStack Start: Hydration Errors](https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors)
- [Clerk Docs: Session Tokens](https://clerk.com/docs/guides/sessions/session-tokens)
- [Chrome Developers: Handling Service Worker Updates](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)
- [Serwist Docs: Background Syncing](https://serwist.pages.dev/docs/serwist/guide/background-syncing)

**GitHub Issues & Discussions:**

- [TanStack Router Issue #4988: vite-plugin-pwa incompatibility](https://github.com/TanStack/router/issues/4988)
- [TanStack Router Issue #6185: Cloudflare platform imports](https://github.com/TanStack/router/issues/6185)
- [TanStack Router Discussion #4417: PWA guidance](https://github.com/TanStack/router/discussions/4417)
- [Convex Backend Issue #95: Caching concerns](https://github.com/get-convex/convex-backend/issues/95)

**Community Resources:**

- [Rich Harris: Service Workers Gist](https://gist.github.com/Rich-Harris/fd6c3c73e6e707e312d7c5d7d0f3b2f9)
- [Cloud Four: When 7 KB Equals 7 MB](https://cloudfour.com/thinks/when-7-kb-equals-7-mb/)
- [Motion.dev: Web Animation Performance Tier List](https://motion.dev/blog/web-animation-performance-tier-list)
- [web.dev: PWA Update](https://web.dev/learn/pwa/update)
- [web.dev: Offline Data](https://web.dev/learn/pwa/offline-data)

---

_Pitfalls research for: Spirit Island PWA companion app (The Dahan Codex)_
_Researched: 2026-01-24_
