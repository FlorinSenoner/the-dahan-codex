# Stack Research

**Domain:** Spirit Island companion PWA (offline-first, game reference app)
**Researched:** 2025-01-24 **Confidence:** MEDIUM (TanStack Start PWA
integration has known gaps requiring custom solutions)

## Recommended Stack

### Core Technologies

| Technology      | Version                      | Purpose                    | Why Recommended                                                                                                              | Confidence |
| --------------- | ---------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TanStack Start  | ^1.157.x                     | Full-stack React framework | SSR, streaming, server functions, Vite-native. Official Cloudflare Workers support. RC but API-stable.                       | HIGH       |
| TanStack Router | ^1.157.x                     | Type-safe routing          | File-based routing, search params, loader patterns. Comes with TanStack Start.                                               | HIGH       |
| TanStack Query  | ^5.x                         | Server state management    | Automatic caching, background refetching, optimistic updates. Best-in-class for async state.                                 | HIGH       |
| Convex          | ^1.25.0+                     | Backend/database           | Reactive queries over WebSocket, TypeScript-first, serverless. Tight TanStack Query integration via @convex-dev/react-query. | HIGH       |
| Clerk           | ^5.59.x (@clerk/clerk-react) | Authentication             | First-party Convex integration, JWT templates, social auth, MFA. ConvexProviderWithClerk simplifies setup.                   | HIGH       |
| TypeScript      | ^5.7.x                       | Type safety                | Required by Convex, TanStack ecosystem fully typed.                                                                          | HIGH       |
| React           | ^19.x                        | UI library                 | TanStack Start supports React 19. Required by Clerk ^5.x.                                                                    | HIGH       |

### PWA & Offline Technologies

| Technology       | Version | Purpose                | Why Recommended                                                                             | Confidence |
| ---------------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| Workbox          | ^7.x    | Service worker toolkit | Industry standard for PWA caching strategies. Required for manual TanStack Start PWA setup. | HIGH       |
| Dexie.js         | ^4.x    | IndexedDB wrapper      | Fluent API, schema migrations, complex queries. Best DX for offline data storage.           | HIGH       |
| Web App Manifest | N/A     | PWA installability     | Standard manifest.json for install prompts, icons, theme.                                   | HIGH       |

**CRITICAL NOTE ON PWA INTEGRATION:**

vite-plugin-pwa and Serwist are **incompatible** with TanStack Start production
builds due to Vite 6 environment API issues
([GitHub Issue #4988](https://github.com/TanStack/router/issues/4988)). The
workaround requires:

1. Custom Vite plugin using Workbox directly
2. Manual service worker generation post-build
3. Reading Vinxi manifests for precache URLs

This is a **known gap** that requires custom implementation. Estimated
additional effort: 1-2 days.

### Styling & UI Components

| Technology             | Version                   | Purpose             | Why Recommended                                                                                     | Confidence |
| ---------------------- | ------------------------- | ------------------- | --------------------------------------------------------------------------------------------------- | ---------- |
| Tailwind CSS           | ^4.1.x                    | Utility-first CSS   | 5x faster builds, native Vite plugin, zero-config with v4. Industry standard.                       | HIGH       |
| Radix UI Primitives    | ^1.4.x (radix-ui package) | Headless components | 32 accessible primitives, massive ecosystem (shadcn/ui), React-only focus. More mature than Ark UI. | HIGH       |
| Framer Motion (Motion) | ^12.x                     | Animations          | Best React animation library. Rebranded to "Motion" but same API.                                   | HIGH       |
| Recharts               | ^3.6.x                    | Data visualization  | SVG-based, declarative React components. Ideal for radar charts and dashboards.                     | HIGH       |

### Infrastructure & Deployment

| Technology              | Version | Purpose           | Why Recommended                                                                      | Confidence |
| ----------------------- | ------- | ----------------- | ------------------------------------------------------------------------------------ | ---------- |
| Cloudflare Workers      | N/A     | Edge runtime      | Official TanStack Start support via @cloudflare/vite-plugin. Global edge deployment. | HIGH       |
| Wrangler                | Latest  | CF Workers CLI    | Official Cloudflare deployment tool. Required for deploy script.                     | HIGH       |
| @cloudflare/vite-plugin | Latest  | Build integration | Required for TanStack Start + Workers. Replaces older Nitro preset approach.         | HIGH       |

### Development Tools

| Tool       | Purpose            | Notes                                                |
| ---------- | ------------------ | ---------------------------------------------------- |
| pnpm       | Package manager    | Project requirement. Faster, strict by default.      |
| Biome      | Linting/formatting | Project requirement. Replaces ESLint + Prettier.     |
| Playwright | E2E testing        | Project requirement. Cross-browser testing.          |
| Sentry     | Error monitoring   | Project requirement. Error tracking and performance. |

### Supporting Libraries

| Library                           | Version | Purpose                    | When to Use                                                                   |
| --------------------------------- | ------- | -------------------------- | ----------------------------------------------------------------------------- |
| @convex-dev/react-query           | Latest  | TanStack Query + Convex    | Always - bridges Convex queries to TanStack Query patterns                    |
| @tanstack/react-router-with-query | Latest  | Router + Query integration | Always - enables loader-level data fetching                                   |
| Zustand                           | ^5.x    | Client state               | For UI state not managed by TanStack Query (modals, preferences, filters)     |
| nuqs                              | Latest  | URL search params          | Type-safe URL state for filters, pagination. Pairs well with TanStack Router. |
| date-fns                          | ^4.x    | Date utilities             | Lightweight date formatting/parsing                                           |
| clsx + tailwind-merge             | Latest  | Class utilities            | Conditional Tailwind class composition                                        |

## Installation

```bash
# Core framework
pnpm add @tanstack/react-start @tanstack/react-router @tanstack/react-query react react-dom

# Backend + Auth
pnpm add convex @convex-dev/react-query @tanstack/react-router-with-query @clerk/clerk-react

# PWA + Offline (manual Workbox setup)
pnpm add dexie workbox-core workbox-precaching workbox-routing workbox-strategies workbox-expiration

# Styling + UI
pnpm add tailwindcss radix-ui motion recharts

# State + Utilities
pnpm add zustand nuqs date-fns clsx tailwind-merge

# Dev dependencies
pnpm add -D typescript @types/react @types/react-dom @cloudflare/vite-plugin wrangler @biomejs/biome @playwright/test @sentry/vite-plugin workbox-build
```

## Alternatives Considered

| Recommended    | Alternative    | When to Use Alternative                                                                                                            |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| TanStack Start | Next.js        | If you need stable PWA plugins (next-pwa/Serwist work with Next.js). Next.js has mature ecosystem but vendor lock-in concerns.     |
| TanStack Start | Remix          | If you prefer Remix's form-centric patterns. Less Cloudflare Workers support than TanStack Start now.                              |
| Convex         | Supabase       | If you need raw SQL access, PostGIS, or existing Postgres tooling. Convex's reactive model better fits this app's real-time needs. |
| Dexie.js       | idb            | If you only need simple key-value storage. Dexie is better for complex queries and schema migrations.                              |
| Dexie.js       | localForage    | If you need fallback to WebSQL/localStorage. Not needed for modern browsers.                                                       |
| Radix UI       | Ark UI         | If you need cross-framework support (Vue, Solid). For React-only, Radix has larger ecosystem and more components.                  |
| Radix UI       | Headless UI    | Fewer components (10 vs 32). Radix is more comprehensive.                                                                          |
| Zustand        | Jotai          | If you prefer atomic state model. Zustand better for centralized app state patterns.                                               |
| Zustand        | TanStack Store | If you need fine-grained reactivity like SolidJS. Zustand is simpler and more widely adopted.                                      |
| Recharts       | Visx           | If you need low-level D3 control. Recharts is higher-level, faster to implement.                                                   |
| Framer Motion  | React Spring   | Personal preference. Framer Motion has better layout animations and gesture support.                                               |

## What NOT to Use

| Avoid                                | Why                                                             | Use Instead                                                 |
| ------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------- |
| vite-plugin-pwa                      | Incompatible with TanStack Start (Vite 6 environment API issue) | Manual Workbox setup with custom Vite plugin                |
| Serwist with TanStack Start          | Same incompatibility as vite-plugin-pwa                         | Manual Workbox setup                                        |
| @tanstack/start (old package)        | Deprecated package name                                         | @tanstack/react-start                                       |
| Clerk's `<SignedIn>` / `<SignedOut>` | Doesn't sync with Convex auth state                             | Convex's `<Authenticated>` / `<Unauthenticated>` components |
| useAuth() from Clerk                 | Doesn't wait for Convex token validation                        | useConvexAuth() hook                                        |
| Redux                                | Overkill for this app, adds boilerplate                         | Zustand + TanStack Query                                    |
| Chakra UI                            | Not headless, harder to customize                               | Radix UI + Tailwind CSS                                     |
| SQLite (in browser)                  | Overkill for read-mostly offline cache                          | Dexie.js / IndexedDB                                        |

## Stack Patterns by Variant

**For offline-first read-only mode:**

- Cache Convex query results in Dexie.js via service worker
- Use stale-while-revalidate strategy for API responses
- Precache all static assets and Spirit data JSON
- Convex's curvilinear (alpha) could provide sync later

**For authenticated write operations:**

- Require online connectivity for writes (Convex mutations)
- Queue failed mutations in IndexedDB for retry (stretch goal)
- Use Convex optimistic updates for responsive UI

**For data visualization (radar charts):**

- Recharts ResponsiveContainer for adaptive sizing
- RadarChart component with custom styling via Tailwind
- Pre-compute power ratings in Convex queries

## Version Compatibility

| Package A                      | Compatible With                 | Notes                                                    |
| ------------------------------ | ------------------------------- | -------------------------------------------------------- |
| @tanstack/react-start@^1.157.x | React 19, Vite 6                | Requires Vite 6 for Cloudflare plugin                    |
| @cloudflare/vite-plugin        | @tanstack/react-start@^1.138.0+ | Required for prerendering support                        |
| Clerk@^5.x                     | React 18+                       | Requires React 18 minimum, works with React 19           |
| Convex@^1.25.0+                | @convex-dev/react-query         | Minimum version for Better Auth and TanStack integration |
| Tailwind CSS@^4.x              | Vite 6                          | Native Vite plugin, no PostCSS config needed             |
| Dexie@^4.x                     | All modern browsers             | No IE11 support (not needed for PWA target)              |

## Convex + Clerk Integration Pattern

```typescript
// app/router.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});

// Wrap with ClerkProvider > ConvexProviderWithClerk > QueryClientProvider
```

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

## Cloudflare Workers Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react(),
  ],
});
```

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "the-dahan-codex",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
}
```

## PWA Service Worker Pattern (Manual Workbox)

Since vite-plugin-pwa is incompatible, use a custom build script:

```typescript
// scripts/generate-sw.ts
import { generateSW } from "workbox-build";
import { readFileSync } from "fs";

// Read Vinxi manifest for precache URLs
const manifest = JSON.parse(
  readFileSync(".vinxi/build/server/_server/.vite/manifest.json", "utf-8"),
);

await generateSW({
  swDest: "dist/public/sw.js",
  globDirectory: "dist/public",
  globPatterns: ["**/*.{js,css,html,png,svg,ico,webp,woff2}"],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.convex\.cloud/,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "convex-api-cache" },
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
});
```

## Offline Data Architecture

```
Online Mode:
  User -> TanStack Query -> Convex (WebSocket) -> Real-time data

Offline Mode:
  User -> TanStack Query -> Service Worker (Cache API) -> Cached response
            |
            v
          Dexie.js (IndexedDB) -> Full offline dataset

Sync Pattern:
  1. On app load: fetch from Convex, update Dexie
  2. On offline: serve from Dexie via service worker
  3. On reconnect: refetch from Convex, reconcile
```

## Sources

**HIGH Confidence (Official Documentation):**

- [Convex TanStack Start Quickstart](https://docs.convex.dev/quickstart/tanstack-start) -
  Full setup guide
- [Convex + Clerk Integration](https://docs.convex.dev/auth/clerk) - Auth
  configuration
- [Clerk Convex Integration](https://clerk.com/docs/guides/development/integrations/databases/convex) -
  JWT template setup
- [TanStack Start Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) -
  Deployment configuration
- [Dexie.js](https://dexie.org/) - Version 4.0 features

**MEDIUM Confidence (GitHub/Changelogs):**

- [TanStack Router Releases](https://github.com/TanStack/router/releases) -
  Current version v1.157.x
- [Serwist Releases](https://github.com/serwist/serwist/releases) - Version
  9.5.0
- [vite-plugin-pwa Issue #4988](https://github.com/TanStack/router/issues/4988) -
  PWA incompatibility confirmed
- [Tailwind CSS v4.1](https://tailwindcss.com/blog/tailwindcss-v4-1) - Latest
  features

**MEDIUM Confidence (Community/Blogs):**

- [Authentication Best Practices: Convex, Clerk and Next.js](https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs) -
  Three-layer auth pattern
- [State Management in 2025](https://medium.com/@pooja.1502/state-management-in-2025-redux-toolkit-vs-zustand-vs-jotai-vs-tanstack-store-c888e7e6f784) -
  Zustand recommendation
- [Headless UI Alternatives](https://blog.logrocket.com/headless-ui-alternatives-radix-primitives-react-aria-ark-ui/) -
  Radix vs Ark comparison
- [Offline-first Frontend Apps in 2025](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/) -
  Dexie recommendation

**LOW Confidence (Requires Validation):**

- Convex curvilinear offline sync engine (alpha, not production-ready)
- TanStack Start PWA community workarounds (may break with updates)

---

_Stack research for: The Dahan Codex - Spirit Island Companion PWA_ _Researched:
2025-01-24_
