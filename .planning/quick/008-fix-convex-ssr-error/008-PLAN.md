# Quick Task 008: Fix Convex SSR Error

## Problem

Console shows repeated errors during SSR:
```
Error: Could not find Convex client! `useQuery` must be used in the React component tree under `ConvexProvider`.
```

The error occurs because:
1. `__root.tsx` renders `<Outlet />` without providers when `!isMounted` (during SSR)
2. `spirit-list.tsx` and `spirits.$slug.tsx` call `useQuery` with `"skip"` pattern
3. `useQuery` still tries to access Convex context even with `"skip"` - the hook itself needs the provider

## Solution

Create a `ClientOnly` wrapper component that prevents children from rendering during SSR. This ensures Convex hooks are never called on the server.

## Tasks

### Task 1: Create ClientOnly component

**File:** `app/components/client-only.tsx`

Create a simple wrapper that:
- Returns `null` (or optional fallback) during SSR
- Only renders children after mount (client-side)

### Task 2: Wrap Convex-dependent components

**Files:**
- `app/routes/spirits.index.tsx` - wrap `SpiritList`
- `app/routes/spirits.$slug.tsx` - wrap the entire page content

### Task 3: Verify fix

Use Playwright to:
1. Navigate to /spirits
2. Check console for errors
3. Verify content loads correctly

## Expected Outcome

- No Convex provider errors in console
- SSR renders skeleton/loading state
- Client hydration loads actual data
