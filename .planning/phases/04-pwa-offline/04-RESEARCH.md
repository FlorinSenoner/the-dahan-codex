# Phase 4: PWA & Offline - Research

**Researched:** 2026-01-28
**Domain:** Progressive Web App, Service Worker, Offline Caching
**Confidence:** HIGH

## Summary

Phase 4 transforms The Dahan Codex into a full PWA with offline capabilities. The existing foundation (service worker generation via Workbox, manifest.json, SW registration) provides a solid base to build upon. The primary work involves implementing the user-facing update flow (update banner with user-controlled reload), offline indicator, install prompt handling, and ensuring all reference data is properly cached for offline viewing.

The project already uses manual Workbox generation via `scripts/generate-sw.ts` with `skipWaiting: false` (correct for user-controlled updates). The main additions needed are: (1) UI components for offline/update states, (2) enhanced SW registration to communicate update availability, (3) iOS install instructions since `beforeinstallprompt` is Chromium-only, and (4) a settings page for cache management.

**Primary recommendation:** Leverage the existing Workbox setup, add `workbox-window` for client-side update coordination, implement `useSyncExternalStore` for offline status, and create non-dismissible update banner with SKIP_WAITING message pattern.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| workbox-build | 7.4.0 | Service worker generation | Official Google library for precaching and runtime caching |
| workbox-core | 7.4.0 | SW runtime utilities | Part of Workbox ecosystem |
| workbox-precaching | 7.4.0 | Precache management | Handles revision-based caching |
| workbox-routing | 7.4.0 | Route matching | URL pattern matching for caching strategies |
| workbox-strategies | 7.4.0 | Caching strategies | NetworkFirst, CacheFirst, StaleWhileRevalidate |
| workbox-expiration | 7.4.0 | Cache expiration | Manages cache size and age limits |

### To Add
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| workbox-window | 7.4.0 | Client-side SW management | Update detection, skip waiting coordination |

### No Additional Libraries Needed
| Instead of | Why Not |
|------------|---------|
| react-pwa-install | Simple hook is sufficient for `beforeinstallprompt` |
| @rehooks/online-status | `useSyncExternalStore` with native APIs is cleaner |
| service-worker-updater | Project has custom SW setup, workbox-window is better fit |

**Installation:**
```bash
pnpm add workbox-window
```

## Architecture Patterns

### Recommended Component Structure
```
app/
├── hooks/
│   ├── use-online-status.ts       # useSyncExternalStore for navigator.onLine
│   ├── use-service-worker.ts      # SW registration, update state management
│   └── use-install-prompt.ts      # beforeinstallprompt event handling
├── components/
│   ├── pwa/
│   │   ├── offline-indicator.tsx  # Status icon in header
│   │   ├── update-banner.tsx      # Top banner for SW updates
│   │   └── install-prompt.tsx     # Bottom banner with iOS instructions
│   └── layout/
│       └── bottom-nav.tsx         # (exists) - add offline indicator
├── routes/
│   └── settings.tsx               # New settings page
└── lib/
    └── sw-register.ts             # (exists) - enhance for update coordination
```

### Pattern 1: useSyncExternalStore for Offline Status
**What:** React 18+ hook for subscribing to browser online/offline events
**When to use:** Tracking network connectivity without tearing issues
**Example:**
```typescript
// Source: React docs + verified pattern
import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Assume online during SSR
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

### Pattern 2: Workbox Window for Update Flow
**What:** Client library that coordinates with service worker for updates
**When to use:** Detecting waiting SW, triggering skipWaiting, reloading
**Example:**
```typescript
// Source: Workbox documentation
import { Workbox } from 'workbox-window';

const wb = new Workbox('/sw.js');

// Detect when new SW is waiting
wb.addEventListener('waiting', () => {
  // Show update banner to user
  setUpdateAvailable(true);
});

// When user clicks reload
function handleUpdate() {
  wb.messageSkipWaiting();
}

// Reload after new SW takes control
wb.addEventListener('controlling', () => {
  window.location.reload();
});

wb.register();
```

### Pattern 3: beforeinstallprompt for Install Banner
**What:** Chromium-only event for custom install prompt
**When to use:** Showing install banner after user engagement
**Example:**
```typescript
// Source: MDN + web.dev
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS (no beforeinstallprompt support)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome;
  };

  return { isInstallable, isIOS, promptInstall };
}
```

### Pattern 4: Non-Dismissible Update Banner
**What:** Top banner that persists until user reloads
**When to use:** When new service worker is waiting
**Example:**
```typescript
// Source: Context from prior decisions
export function UpdateBanner({ onReload }: { onReload: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 text-center">
      <span className="mr-4">A new version is ready</span>
      <button
        onClick={onReload}
        className="bg-background text-foreground px-4 py-1 rounded"
      >
        Reload
      </button>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Auto skipWaiting:** Never use `skipWaiting: true` in generateSW - causes broken state during lazy-loaded code
- **Dismissible update banner:** Users may forget to reload, causing stale app state
- **polling navigator.onLine:** Use event listeners, not intervals
- **Assuming online on first load:** Check `navigator.onLine` initial value

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SW update coordination | Custom postMessage | workbox-window | Handles edge cases, events |
| Precache manifest | Manual file list | workbox-build generateSW | Hash-based revisions |
| Cache strategies | Custom fetch handlers | workbox-strategies | Tested, handles failures |
| Online status | useState + useEffect | useSyncExternalStore | Concurrency-safe in React 18 |

**Key insight:** Service worker update coordination has many edge cases (multiple tabs, race conditions, activation timing). workbox-window abstracts these correctly.

## Common Pitfalls

### Pitfall 1: skipWaiting Breaking Lazy-Loaded Code
**What goes wrong:** New SW activates mid-session, old cached chunks become unavailable
**Why it happens:** skipWaiting: true or calling skipWaiting without user consent
**How to avoid:** Always use skipWaiting: false, let user control reload timing
**Warning signs:** "Failed to load chunk" errors after updates

### Pitfall 2: Convex WebSocket Caching
**What goes wrong:** Trying to cache WebSocket connections or real-time data
**Why it happens:** Misunderstanding what can be cached
**How to avoid:** Only cache static responses (REST-like calls), not WebSocket frames. Convex handles its own caching automatically.
**Warning signs:** Stale real-time data, connection errors

### Pitfall 3: iOS PWA Gotchas
**What goes wrong:** Users can't install, or multiple installs create separate storage
**Why it happens:** iOS has no beforeinstallprompt, manual Add to Home Screen required
**How to avoid:** Show manual instructions for iOS, detect with userAgent
**Warning signs:** iOS users reporting they can't install

### Pitfall 4: navigateFallback Missing
**What goes wrong:** SPA routes 404 when offline
**Why it happens:** generateSW doesn't know about client-side routing
**How to avoid:** Set navigateFallback: '/index.html' for SPA
**Warning signs:** Offline navigation to /spirits/river returns network error

### Pitfall 5: Offline Indicator Stuck
**What goes wrong:** Indicator shows offline even when reconnected
**Why it happens:** Not listening to both online and offline events
**How to avoid:** Subscribe to both events, clean up listeners
**Warning signs:** Users report offline indicator won't disappear

### Pitfall 6: Cache Growing Unbounded
**What goes wrong:** IndexedDB fills up on mobile devices
**Why it happens:** No expiration policy for runtime caches
**How to avoid:** Set maxEntries and maxAgeSeconds on all caches
**Warning signs:** Storage quota errors, slow performance

## Code Examples

Verified patterns from official sources:

### generateSW Configuration for SPA
```typescript
// Source: Workbox docs + project context
import { generateSW } from "workbox-build";

await generateSW({
  swDest: "dist/sw.js",
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,png,svg,ico,webp,woff,woff2,json}"],
  globIgnores: ["**/node_modules/**", "sw.js", "workbox-*.js"],

  // CRITICAL: User-controlled updates
  skipWaiting: false,
  clientsClaim: false,

  // SPA support
  navigateFallback: "/index.html",
  navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/],

  // Runtime caching
  runtimeCaching: [
    {
      // Convex API (NetworkFirst with fallback)
      urlPattern: /^https:\/\/.*\.convex\.cloud/,
      handler: "NetworkFirst",
      options: {
        cacheName: "convex-api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
          maxEntries: 100,
        },
      },
    },
    {
      // Spirit images (CacheFirst - static)
      urlPattern: /\/spirits\/.*\.(png|jpg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "spirit-images",
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          maxEntries: 100,
        },
      },
    },
  ],
});
```

### Service Worker Message Handler
```typescript
// Source: Workbox docs - add to sw.js template or post-process
// This is automatically included by workbox-build when skipWaiting: false
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### Offline Indicator Component
```typescript
// Source: Derived from research
import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-amber-600 text-white text-center py-1 text-sm z-50 animate-in fade-in"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="inline-block w-4 h-4 mr-2" />
      You're offline
    </div>
  );
}
```

### Settings Page Cache Management
```typescript
// Source: Derived from requirements
async function clearAppCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(name => caches.delete(name))
  );
  // Force SW to refetch on next load
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
    }
  }
  window.location.reload();
}

async function refreshData() {
  // Clear only API cache, keep app shell
  await caches.delete('convex-api-cache');
  window.location.reload();
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CRA serviceWorker.js | Workbox generateSW/InjectManifest | 2020+ | More control, less boilerplate |
| useState for online status | useSyncExternalStore | React 18 (2022) | Concurrency-safe |
| Manual cache management | Workbox strategies + expiration | 2019+ | Automatic, tested |
| skipWaiting: true default | skipWaiting: false recommended | 2021+ | Prevents broken lazy loads |
| vite-plugin-pwa | Manual Workbox (Vite 7) | 2024+ | Plugin incompatible with Vite 7 |

**Deprecated/outdated:**
- CRA's built-in service worker: Replaced by Workbox
- Manual cache.match/cache.put: Use Workbox strategies instead
- window.applicationCache (AppCache): Removed from browsers

## Open Questions

Things that couldn't be fully resolved:

1. **Convex Offline Data Caching**
   - What we know: Convex auto-caches queries client-side, has alpha "curvilinear" for offline
   - What's unclear: Whether NetworkFirst caching of Convex HTTP calls is sufficient or if it interferes with WebSocket sync
   - Recommendation: Cache Convex responses with NetworkFirst, test offline reading thoroughly

2. **iOS Cache Purging**
   - What we know: iOS Safari can purge PWA caches aggressively
   - What's unclear: Exact thresholds and how to prevent
   - Recommendation: Test on iOS devices, consider showing "data may be unavailable offline" warning

3. **Settings Page Discovery**
   - What we know: Settings is disabled in bottom nav (Phase 4 scope)
   - What's unclear: Whether to enable Settings in Phase 4 or defer
   - Recommendation: Enable Settings tab, add Refresh Data and Clear Cache buttons

## Sources

### Primary (HIGH confidence)
- /googlechrome/workbox (Context7) - generateSW configuration, caching strategies
- React docs (useSyncExternalStore) - online status hook pattern
- Chrome for Developers (Workbox) - update handling best practices

### Secondary (MEDIUM confidence)
- [web.dev PWA Installation](https://web.dev/learn/pwa/installation) - iOS manual instructions
- [MDN beforeinstallprompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event) - install prompt API
- [Chrome Workbox Updates](https://developer.chrome.com/docs/workbox/handling-service-worker-updates) - skipWaiting pattern

### Tertiary (LOW confidence)
- WebSearch for iOS PWA limitations - needs device testing to verify

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Workbox is already in use, patterns well-documented
- Architecture: HIGH - React 18 patterns verified, project structure clear
- Pitfalls: MEDIUM - Most verified, iOS needs testing

**Research date:** 2026-01-28
**Valid until:** 60 days (PWA APIs stable, Workbox mature)

---

## Implementation Checklist (for Planner)

Based on research, Phase 4 should include:

1. **Add workbox-window** - Client-side SW coordination
2. **Enhance generate-sw.ts** - Add navigateFallback for SPA
3. **Create use-online-status hook** - useSyncExternalStore pattern
4. **Create use-service-worker hook** - Update detection, messageSkipWaiting
5. **Create use-install-prompt hook** - beforeinstallprompt + iOS detection
6. **Create OfflineIndicator component** - Shows only when offline
7. **Create UpdateBanner component** - Non-dismissible, Reload button
8. **Create InstallPrompt component** - Bottom banner, iOS instructions
9. **Create settings route** - Enable Settings tab, cache management buttons
10. **Update __root.tsx** - Integrate offline indicator and update banner
11. **Add apple-touch-icon** - iOS home screen icon support
12. **E2E tests** - Offline behavior, update flow

PWA-01 through PWA-07 requirements map to these items.
