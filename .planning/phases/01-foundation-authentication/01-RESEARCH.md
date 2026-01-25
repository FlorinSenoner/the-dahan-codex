# Phase 1: Foundation & Authentication - Research

**Researched:** 2025-01-25
**Domain:** TanStack Start + Convex + Clerk + Cloudflare Workers + PWA + CI/CD
**Confidence:** HIGH (verified with official documentation and multiple sources)

## Summary

This phase establishes the complete technical foundation for The Dahan Codex. The stack combines TanStack Start (full-stack React framework), Convex (real-time backend), Clerk (authentication), and Cloudflare Workers (edge deployment) with manual Workbox PWA setup due to vite-plugin-pwa incompatibility.

The primary complexity lies in three areas: (1) the PWA service worker must be generated manually with Workbox since vite-plugin-pwa is incompatible with TanStack Start's Vite 6 environment API, (2) TanStack Start must be pinned to version 1.140.5 to avoid Cloudflare platform import issues in production builds, and (3) SSR authentication requires explicit token handling in route `beforeLoad` functions to make Clerk tokens available to Convex during server-side rendering.

**Primary recommendation:** Start with the TanStack Start + Cloudflare deployment pipeline first, validate it works, then layer in Convex/Clerk auth, and finally add manual Workbox PWA generation. Each layer should be validated independently before proceeding.

## Standard Stack

The established libraries/tools for this phase:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tanstack/react-start | 1.140.5 (pinned) | Full-stack React framework | File-based routing, SSR, server functions. Must pin to avoid Cloudflare platform import bug in 1.142.x |
| @tanstack/react-router | 1.140.5 (pinned) | Type-safe routing | Comes with TanStack Start, file-based routing with loaders |
| @tanstack/react-query | ^5.x | Server state | Automatic caching, pairs with Convex via adapter |
| convex | ^1.25.0+ | Real-time backend | Reactive queries, WebSocket, TypeScript-first |
| @convex-dev/react-query | latest | Query adapter | Bridges Convex to TanStack Query patterns |
| @clerk/tanstack-start | latest | Authentication | TanStack Start SDK for Clerk (currently beta) |
| convex/react-clerk | latest | Auth provider | ConvexProviderWithClerk for token coordination |
| React | ^19.x | UI library | Required by TanStack Start, Clerk ^5.x compatible |
| TypeScript | ^5.7.x | Type safety | Required by all stack components |

### Infrastructure

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @cloudflare/vite-plugin | latest | Cloudflare Workers | Official plugin for TanStack Start deployment |
| wrangler | latest | CF CLI | Deploy, preview, manage Workers |
| workbox-build | ^7.x | Service worker | Manual SW generation (vite-plugin-pwa incompatible) |
| workbox-precaching | ^7.x | Precaching | Precache manifest for static assets |
| workbox-routing | ^7.x | Runtime caching | URL pattern matching for cache strategies |
| workbox-strategies | ^7.x | Cache strategies | NetworkFirst, CacheFirst, StaleWhileRevalidate |

### Development Tools

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| pnpm | ^9.x | Package manager | Project requirement, faster, strict |
| @biomejs/biome | ^1.9.x | Lint/format | Single tool replaces ESLint + Prettier |
| mise | latest | Toolchain | Node.js version management |
| lefthook | latest | Git hooks | Fast, cross-platform hook manager |
| @playwright/test | ^1.49.x | E2E testing | Cross-browser, project requirement |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TanStack Start pinned | TanStack Start latest | Latest has Cloudflare platform import bug in middleware |
| Manual Workbox | vite-plugin-pwa | vite-plugin-pwa incompatible with TanStack Start Vite 6 environment API |
| Lefthook | Husky + lint-staged | Husky requires additional lint-staged package; Lefthook is all-in-one |
| mise | nvm/fnm | mise manages multiple tools (node, pnpm), not just Node.js |

**Installation:**

```bash
# Core framework (pinned versions)
pnpm add @tanstack/react-start@1.140.5 @tanstack/react-router@1.140.5 @tanstack/react-query@^5 react@^19 react-dom@^19

# Backend + Auth
pnpm add convex @convex-dev/react-query @clerk/tanstack-start

# PWA (manual Workbox)
pnpm add workbox-core workbox-precaching workbox-routing workbox-strategies workbox-expiration

# Dev dependencies
pnpm add -D typescript @types/react @types/react-dom @cloudflare/vite-plugin wrangler @biomejs/biome @playwright/test workbox-build lefthook
```

## Architecture Patterns

### Recommended Project Structure

```
the-dahan-codex/
├── app/
│   ├── routes/
│   │   ├── __root.tsx           # Root layout, ClerkProvider + ConvexProviderWithClerk
│   │   ├── index.tsx            # Home page (public)
│   │   ├── sign-in.$.tsx        # Clerk sign-in page
│   │   ├── sign-up.$.tsx        # Clerk sign-up page (optional, combined by default)
│   │   ├── spirits/
│   │   │   └── index.tsx        # Spirits list (public)
│   │   └── (authenticated)/     # Route group for auth-required routes
│   │       ├── games/
│   │       │   └── index.tsx    # Games list (requires auth)
│   │       └── notes/
│   │           └── index.tsx    # Notes list (requires auth)
│   ├── components/
│   │   └── ui/                  # Shared UI primitives
│   ├── lib/
│   │   ├── convex.ts            # Convex client setup
│   │   └── auth.ts              # Auth helpers
│   ├── router.tsx               # TanStack Router config
│   └── routeTree.gen.ts         # Generated route tree
├── convex/
│   ├── schema.ts                # Database schema
│   ├── auth.config.ts           # Clerk JWT config
│   └── _generated/              # Auto-generated types
├── public/
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # App icons
├── scripts/
│   └── generate-sw.ts           # Workbox service worker generator
├── vite.config.ts               # Vite + Cloudflare config
├── wrangler.jsonc               # Cloudflare Workers config
├── biome.json                   # Biome config
├── lefthook.yml                 # Git hooks config
├── mise.toml                    # Toolchain config
└── package.json
```

### Pattern 1: Provider Hierarchy for Auth + Data

**What:** Proper nesting of Clerk and Convex providers for authenticated data access.
**When to use:** App root setup. Required for auth to flow correctly to Convex.
**Example:**

```typescript
// app/routes/__root.tsx
import { ClerkProvider, useAuth } from '@clerk/tanstack-start';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexQueryClient } from '@convex-dev/react-query';

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

export const Route = createRootRoute({
  component: () => (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  ),
});
```
**Source:** [Convex TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk)

### Pattern 2: SSR Token Handling in beforeLoad

**What:** Explicitly retrieve and set Clerk token for SSR Convex queries.
**When to use:** Any route that loads authenticated data during SSR.
**Example:**

```typescript
// app/routes/(authenticated)/games/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start/server';
import { getAuth } from '@clerk/tanstack-start/server';
import { getWebRequest } from '@tanstack/react-start/server';

const getAuthData = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getWebRequest();
  const auth = await getAuth(request);
  const token = await auth.getToken({ template: 'convex' });
  return { userId: auth.userId, token };
});

export const Route = createFileRoute('/(authenticated)/games/')({
  beforeLoad: async ({ context }) => {
    const { userId, token } = await getAuthData();

    if (!userId) {
      throw redirect({ to: '/sign-in' });
    }

    // Set token for SSR Convex queries
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
  },
  component: GamesPage,
});
```
**Source:** [Convex TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk)

### Pattern 3: Dedicated Sign-In Page with Clerk

**What:** Dedicated sign-in route using Clerk's SignIn component.
**When to use:** When you want a dedicated sign-in page rather than a modal.
**Example:**

```typescript
// app/routes/sign-in.$.tsx
import { SignIn } from '@clerk/tanstack-start';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in/$')({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

Environment variables required:
```env
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```
**Source:** [Clerk TanStack Start Custom Pages](https://clerk.com/docs/references/tanstack-start/custom-signup-signin-pages)

### Pattern 4: Manual Workbox Service Worker Generation

**What:** Post-build script to generate service worker since vite-plugin-pwa is incompatible.
**When to use:** Required for PWA functionality with TanStack Start.
**Example:**

```typescript
// scripts/generate-sw.ts
import { generateSW } from 'workbox-build';

async function buildServiceWorker() {
  const { count, size, warnings } = await generateSW({
    swDest: 'dist/public/sw.js',
    globDirectory: 'dist/public',
    globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
    skipWaiting: false, // User-initiated update
    clientsClaim: false,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.convex\.cloud/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'convex-api-cache',
          expiration: { maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
        },
      },
    ],
  });

  console.log(`Generated SW precaching ${count} files (${size} bytes)`);
  if (warnings.length) console.warn('Warnings:', warnings);
}

buildServiceWorker();
```

Build script in package.json:
```json
{
  "scripts": {
    "build": "vite build && tsx scripts/generate-sw.ts"
  }
}
```
**Source:** [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build)

### Pattern 5: Admin Role Detection via Clerk Custom Claims

**What:** Add admin role to Clerk JWT template and check in Convex functions.
**When to use:** Protecting admin-only mutations/queries.
**Example:**

Clerk JWT Template (add to Claims):
```json
{
  "role": "{{user.public_metadata.role}}"
}
```

Convex function check:
```typescript
// convex/admin.ts
import { mutation } from './_generated/server';

export const adminOnly = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    // Access custom claim
    const role = (identity as any).role;
    if (role !== 'admin') {
      throw new Error('Admin access required');
    }

    // Admin operation...
  },
});
```
**Source:** [Convex Auth in Functions](https://docs.convex.dev/auth/functions-auth)

### Anti-Patterns to Avoid

- **Using Clerk's `<SignedIn>`/`<SignedOut>` with Convex:** These don't sync with Convex auth state. Use Convex's `<Authenticated>`/`<Unauthenticated>` components instead.
- **Using `useAuth()` from Clerk:** Doesn't wait for Convex token validation. Use `useConvexAuth()` hook.
- **Setting `skipWaiting: true` in service worker:** Causes broken application state during updates. Use user-initiated update flow.
- **Using TanStack Start 1.142.x+ with Cloudflare platform imports:** Production builds fail. Pin to 1.140.5.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication | Custom auth system | Clerk | Handles OAuth, MFA, session management, token refresh |
| Service worker caching | Raw Cache API | Workbox | Handles precaching, versioning, update strategies correctly |
| Real-time data sync | WebSocket wrapper | Convex | Reactive queries, automatic reconnection, optimistic updates |
| Git hook management | .git/hooks scripts | Lefthook | Cross-platform, YAML config, parallel execution |
| Version management | Manual .nvmrc | mise | Manages multiple tools, auto-activation |
| Linting + formatting | ESLint + Prettier | Biome | Single tool, faster, consistent config |

**Key insight:** This stack has many moving parts (TanStack Start, Convex, Clerk, Cloudflare, Workbox). Using battle-tested integrations rather than custom glue code prevents subtle bugs at integration boundaries.

## Common Pitfalls

### Pitfall 1: TanStack Start + Cloudflare Platform Import Bug

**What goes wrong:** Production builds fail with unresolved `cloudflare:workers` imports when using middleware with platform-specific code.
**Why it happens:** TanStack Start 1.142.x restructured server function environment handling, causing platform imports to be analyzed in client build phase.
**How to avoid:**
1. Pin `@tanstack/react-start` and `@tanstack/react-router` to version 1.140.5
2. Add lockfile check in CI to detect accidental upgrades
3. Test production builds before any version upgrade
**Warning signs:** Build errors mentioning "unresolved imports" for `cloudflare:*`, works in dev but fails in prod build.
**Source:** [GitHub Issue #6185](https://github.com/TanStack/router/issues/6185)

### Pitfall 2: vite-plugin-pwa Incompatibility

**What goes wrong:** Service worker not generated in production builds. `__WB_MANIFEST` placeholder appears as literal string.
**Why it happens:** vite-plugin-pwa doesn't support Vite 6's environment API used by TanStack Start.
**How to avoid:**
1. Use manual Workbox setup with `workbox-build`
2. Run service worker generation as post-build step
3. Validate SW file exists in CI
**Warning signs:** PWA not installable in production, missing sw.js in build output, no entries in Application > Cache Storage.
**Source:** [TanStack Router Issue #4988](https://github.com/TanStack/router/issues/4988)

### Pitfall 3: Convex + Clerk Token Not Available in SSR

**What goes wrong:** Authenticated queries return undefined or throw during SSR, work after hydration.
**Why it happens:** Clerk token must be explicitly retrieved and set in `beforeLoad` for SSR. `<ConvexProviderWithClerk>` only handles client-side token refresh.
**How to avoid:**
1. In route `beforeLoad`, call `await auth.getToken({ template: 'convex' })`
2. Set token: `ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)`
3. Use conditional check `if (token)` to handle unauthenticated routes
**Warning signs:** Flash of empty state, "Unauthorized" errors only on hard refresh, different behavior between SSR and client navigation.
**Source:** [Convex TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk)

### Pitfall 4: skipWaiting Causing Broken Application State

**What goes wrong:** After service worker update, users experience broken functionality with asset loading failures.
**Why it happens:** `skipWaiting()` forces new SW to control pages loaded with old assets.
**How to avoid:**
1. Set `skipWaiting: false` in Workbox config
2. Implement user-initiated update prompt: "New version available. Click to update."
3. Only call `skipWaiting()` after user confirmation, then reload page
**Warning signs:** Random breakage after deployments, console errors about missing assets, users report "it was working, then broke."
**Source:** [web.dev PWA Update](https://web.dev/learn/pwa/update)

### Pitfall 5: Missing Environment Variables in CI/Production

**What goes wrong:** Build fails or app crashes with cryptic errors about missing environment variables.
**Why it happens:** Clerk and Convex require multiple environment variables that must be set in CI and Cloudflare.
**How to avoid:**
1. Document all required env vars in README
2. CI job should fail early if any required env var is missing
3. Use different env vars for dev/production (Clerk dev instance vs production)
**Required env vars:**
```
VITE_CONVEX_URL          # Convex deployment URL
VITE_CLERK_PUBLISHABLE_KEY  # Clerk public key
CLERK_SECRET_KEY         # Clerk secret (server only)
CLOUDFLARE_API_TOKEN     # For CI deployment
CLOUDFLARE_ACCOUNT_ID    # For CI deployment
```

## Code Examples

Verified patterns from official sources:

### Vite Config for Cloudflare Workers

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    react(),
  ],
});
```
**Source:** [Cloudflare Workers TanStack Start](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)

### Wrangler Configuration

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "the-dahan-codex",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true }
}
```
**Source:** [Cloudflare Workers TanStack Start](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)

### Convex Auth Config

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
```
**Source:** [Convex Clerk Integration](https://docs.convex.dev/auth/clerk)

### Biome Configuration

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "files": {
    "ignore": ["node_modules", "dist", ".vinxi", "convex/_generated"]
  }
}
```

### Lefthook Configuration

```yaml
# lefthook.yml
pre-commit:
  commands:
    biome:
      glob: "*.{js,ts,jsx,tsx,json,jsonc}"
      run: npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
    typecheck:
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit
```
**Source:** [Biome Git Hooks](https://biomejs.dev/recipes/git-hooks/)

### mise Configuration

```toml
# mise.toml
[tools]
node = "22"

[env]
_.path = ["{{config_root}}/node_modules/.bin"]

[hooks]
postinstall = "corepack enable && corepack prepare pnpm@latest --activate"

[settings]
experimental = true
```
**Source:** [mise Node.js Cookbook](https://mise.jdx.dev/mise-cookbook/nodejs.html)

### GitHub Actions CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Biome checks
        run: pnpm biome check .

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Build
        run: pnpm build
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL }}
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}

      - name: Verify service worker generated
        run: test -f dist/public/sw.js

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps chromium

      - name: Run Playwright tests
        run: pnpm test:e2e
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL }}
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}

  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build & Deploy
        run: pnpm build && pnpm exec wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL }}
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}
```
**Source:** [Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)

### PWA Manifest

```json
// public/manifest.json
{
  "name": "The Dahan Codex",
  "short_name": "Dahan Codex",
  "description": "Spirit Island companion app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#1a1a1a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| vite-plugin-pwa with TanStack Start | Manual Workbox setup | 2024 (Vite 6) | Must use workbox-build directly |
| TanStack Start latest | TanStack Start 1.140.5 pinned | Jan 2025 | Pin until Cloudflare import bug fixed |
| @tanstack/start package | @tanstack/react-start | 2024 | Package renamed |
| Clerk's auth components | Convex's Authenticated component | Current | Better sync with Convex auth state |
| ESLint + Prettier | Biome | 2023-2024 | Single tool, faster |

**Deprecated/outdated:**
- **@tanstack/start:** Renamed to @tanstack/react-start
- **vite-plugin-pwa with TanStack Start:** Incompatible with Vite 6 environment API
- **Clerk's `<SignedIn>`/`<SignedOut>` with Convex:** Don't sync with Convex auth state

## Open Questions

Things that couldn't be fully resolved:

1. **TanStack Start 1.140.5 bug fix timeline**
   - What we know: Version 1.142.x+ has Cloudflare platform import bug
   - What's unclear: When fix will be released
   - Recommendation: Pin to 1.140.5, check releases monthly

2. **Clerk TanStack Start SDK production readiness**
   - What we know: SDK is marked as beta
   - What's unclear: Timeline to stable release
   - Recommendation: Use it (it works), but expect possible breaking changes

3. **PR preview deployments with Convex**
   - What we know: Cloudflare supports PR previews
   - What's unclear: Best practice for Convex dev deployments per PR
   - Recommendation: Use single Convex dev deployment for all previews initially

## Sources

### Primary (HIGH confidence)
- [Convex TanStack Start with Clerk](https://docs.convex.dev/client/tanstack/tanstack-start/clerk) - Auth integration pattern
- [Cloudflare Workers TanStack Start](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) - Deployment configuration
- [Clerk TanStack React Start Quickstart](https://clerk.com/docs/tanstack-react-start/getting-started/quickstart) - SDK setup
- [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build) - Service worker generation
- [Biome Git Hooks](https://biomejs.dev/recipes/git-hooks/) - Pre-commit setup
- [Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) - CI deployment
- [mise Node.js Cookbook](https://mise.jdx.dev/mise-cookbook/nodejs.html) - Toolchain setup

### Secondary (MEDIUM confidence)
- [GitHub Issue #6185](https://github.com/TanStack/router/issues/6185) - Cloudflare platform import bug
- [TanStack Router Issue #4988](https://github.com/TanStack/router/issues/4988) - vite-plugin-pwa incompatibility
- [TanStack Router File-Based Routing](https://tanstack.com/router/v1/docs/framework/react/routing/file-based-routing) - Route structure

### Tertiary (LOW confidence)
- [tanstack-start-pwa repository](https://github.com/kulterryan/tanstack-start-pwa) - Community workaround, needs validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All core packages verified with official docs
- Architecture: HIGH - Patterns from official Convex/Clerk docs
- Pitfalls: HIGH - Verified with GitHub issues and official docs
- CI/CD: HIGH - Cloudflare official docs
- PWA: MEDIUM - Manual Workbox works, but community workaround not fully validated

**Research date:** 2025-01-25
**Valid until:** 2025-02-25 (30 days - check for TanStack Start bug fixes)
