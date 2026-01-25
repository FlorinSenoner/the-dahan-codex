---
phase: 01-foundation-authentication
plan: 04
subsystem: auth
tags: [clerk, convex, tanstack-start, ssr, jwt, protected-routes]

# Dependency graph
requires:
  - phase: 01-03
    provides: Convex backend with ConvexProvider and QueryClientProvider
provides:
  - Clerk authentication integration
  - SSR auth token handling via server functions
  - Protected route layout with beforeLoad auth check
  - Admin role detection helpers for Convex functions
affects: [01-05-database-schema, 02-data-models, all-authenticated-features]

# Tech tracking
tech-stack:
  added: ["@clerk/tanstack-start@0.11.5"]
  patterns:
    [clerk-convex-provider-hierarchy, ssr-auth-server-fn, pathless-auth-layout]

key-files:
  created:
    - convex/auth.config.ts
    - convex/lib/auth.ts
    - app/lib/auth.ts
    - app/routes/sign-in.$.tsx
    - app/routes/_authenticated.tsx
    - app/routes/_authenticated/profile.tsx
  modified:
    - app/routes/__root.tsx
    - app/routes/index.tsx
    - package.json

key-decisions:
  - "Used pathless _authenticated layout instead of (authenticated) route group
    (TanStack Router constraint)"
  - "Use useConvexAuth() hook for auth state sync instead of Clerk's useAuth()"
  - "Admin role via Clerk JWT custom claim: user.public_metadata.isAdmin"

patterns-established:
  - "ClerkProvider > ConvexProviderWithClerk > QueryClientProvider hierarchy"
  - "getAuthData server function for SSR auth in beforeLoad"
  - "Protected routes under _authenticated pathless layout"

# Metrics
duration: 7min
completed: 2026-01-25
---

# Phase 1 Plan 4: Clerk Authentication Integration Summary

**Clerk SSR auth with protected routes using pathless layout and Convex auth
helpers for admin role detection**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-25T12:01:34Z
- **Completed:** 2026-01-25T12:08:21Z
- **Tasks:** 4
- **Files modified:** 10

## Accomplishments

- Clerk authentication fully integrated with SSR token handling
- Protected route layout using pathless `_authenticated` pattern
- Sign-in page with Clerk's SignIn component
- Admin role detection helpers ready for Convex functions
- Home page displays auth state with sign-in/out navigation

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Clerk and configure environment** - `80525d9` (feat)
2. **Task 2: Update root layout with auth providers** - `3a8b6c1` (feat)
3. **Task 3: Set up admin role detection in Convex** - `f0fb1ef` (feat)
4. **Task 4: Create sign-in page and protected routes** - `7425d46` (feat)

## Files Created/Modified

- `convex/auth.config.ts` - Clerk JWT validation config for Convex
- `convex/lib/auth.ts` - Auth helpers: getIdentity, requireAuth, isAdmin,
  requireAdmin
- `app/lib/auth.ts` - SSR getAuthData server function
- `app/routes/__root.tsx` - ClerkProvider and ConvexProviderWithClerk wrapping
- `app/routes/sign-in.$.tsx` - Dedicated sign-in page with Clerk component
- `app/routes/_authenticated.tsx` - Pathless layout with beforeLoad auth check
- `app/routes/_authenticated/profile.tsx` - Protected test route
- `app/routes/index.tsx` - Auth state display with navigation
- `package.json` - Added @clerk/tanstack-start dependency

## Decisions Made

- **Pathless layout pattern:** TanStack Router doesn't support `(authenticated)`
  route groups like Next.js. Used `_authenticated` pathless layout instead,
  which correctly wraps child routes.
- **useConvexAuth() over Clerk hooks:** Following research guidance, use
  `useConvexAuth()` for auth state as it properly syncs with Convex's token
  validation.
- **Imports correction:** `createServerFn` comes from `@tanstack/react-start`
  main export, not `/server` subpath. `getRequest` (not `getWebRequest`) from
  `/server` subpath.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Changed route group pattern from (authenticated) to
\_authenticated**

- **Found during:** Task 4 (Create protected route layout)
- **Issue:** TanStack Router rejected `(authenticated)` route group pattern with
  error: "A route configuration for a route group was found at
  `(authenticated).tsx`. This is not supported."
- **Fix:** Used `_authenticated` pathless layout pattern instead, which is the
  TanStack Router convention for layouts that don't add path segments
- **Files modified:** Created `_authenticated.tsx` and
  `_authenticated/profile.tsx` instead of `(authenticated).tsx` and
  `(authenticated)/profile.tsx`
- **Verification:** Dev server starts, routes generate correctly, typecheck
  passes
- **Committed in:** 7425d46 (Task 4 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking) **Impact on plan:** Route
structure works correctly with TanStack Router conventions. `/profile` still
requires auth, just uses underscore-prefix pathless layout pattern.

## Issues Encountered

- **Import paths:** Plan specified `createServerFn` and `getWebRequest` from
  `@tanstack/react-start/server`, but actual exports are `createServerFn` from
  `@tanstack/react-start` and `getRequest` from `@tanstack/react-start/server`.
  Fixed based on package type definitions.
- **node:http errors in dev:** Cloudflare Workers compatibility warnings appear
  during dev server start but don't prevent functionality. This is expected when
  using Clerk's node-based SDK in the Workers environment - actual deployment
  will work differently.

## User Setup Required

**External services require manual configuration:**

1. **Create Clerk Application:**
   - Go to https://dashboard.clerk.com
   - Create a new application
   - Enable Email/Password and Google OAuth sign-in

2. **Configure Environment Variables in `.env.local`:**
   - `VITE_CLERK_PUBLISHABLE_KEY` - From Clerk Dashboard -> API Keys
   - `CLERK_SECRET_KEY` - From Clerk Dashboard -> API Keys

3. **Create Convex JWT Template in Clerk:**
   - Go to Clerk Dashboard -> JWT Templates -> New template -> Convex
   - Add custom claim: `isAdmin` with value `{{user.public_metadata.isAdmin}}`
   - Copy the Issuer domain

4. **Set Convex Environment Variable:**
   - Go to
     https://dashboard.convex.dev/d/REDACTED_CONVEX_DEPLOYMENT/settings/environment-variables
   - Set `CLERK_JWT_ISSUER_DOMAIN` to the issuer from step 3

5. **Verify setup:**
   ```bash
   pnpm convex dev  # Should connect without auth config errors
   pnpm dev         # Should show working auth UI
   ```

## Next Phase Readiness

- Authentication infrastructure complete for protected features
- Admin role detection ready for admin-only Convex functions
- SSR auth pattern established for data fetching in authenticated routes
- Ready for database schema work (01-05) with user-related tables

---

_Phase: 01-foundation-authentication_ _Completed: 2026-01-25_
