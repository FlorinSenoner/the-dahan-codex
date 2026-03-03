/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

// Clean up old caches from previous versions
cleanupOutdatedCaches()
clientsClaim()

// Precache all assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

// App-shell fallback: serve a neutral shell for all SPA navigation requests.
// Cloudflare may redirect /app-shell.html -> /app-shell, so prefer precache and
// only fall back to fetching the canonical extensionless path.
const navigationHandler = async () => {
  const precached = await matchPrecache('/app-shell.html')
  if (precached) return precached
  return fetch('/app-shell')
}
const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [/\.[^/]+$/],
})
registerRoute(navigationRoute)

// Cache fonts with CacheFirst (1 year)
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  }),
)

// Cache images with StaleWhileRevalidate (30 days)
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  }),
)

// Cache public snapshot API for offline public-route hydration.
registerRoute(
  ({ request, url }) => {
    if (request.method !== 'GET') return false
    if (url.pathname === '/public-snapshot') return true
    return url.hostname.endsWith('.convex.site') && url.pathname === '/public-snapshot'
  },
  new StaleWhileRevalidate({
    cacheName: 'public-snapshot',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
  }),
)

// Listen for SKIP_WAITING message from workbox-window
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
