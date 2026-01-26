# Quick Task 008: Fix Convex SSR Error

## Summary

Fixed the Convex SSR error that appeared in the console during page load.

## Root Cause

The `__root.tsx` layout conditionally renders providers based on `isMounted` state:
- During SSR: `!isMounted` is true, so `<Outlet />` renders **without** ConvexProvider
- Child components (SpiritList, SpiritDetailContent) called `useQuery` with `"skip"`
- However, `useQuery` still tries to access Convex context even with `"skip"` - the hook needs the provider

## Solution

1. **Created `ClientOnly` component** (`app/components/client-only.tsx`)
   - Simple wrapper that returns `null` (or fallback) during SSR
   - Only renders children after component mounts on client

2. **Updated `spirits.index.tsx`**
   - Wrapped `SpiritList` with `ClientOnly`
   - Uses `SpiritListSkeleton` as fallback for SSR

3. **Updated `spirits.$slug.tsx`**
   - Extracted `SpiritDetailContent` component for data-fetching logic
   - Wrapped with `ClientOnly` using `SpiritDetailSkeleton` as fallback
   - Removed broken `isClient`/`"skip"` pattern

4. **Updated `spirit-list.tsx`**
   - Removed internal `isClient` state (no longer needed)
   - Exported `SpiritListSkeleton` for use as SSR fallback
   - Simplified component to just use `useQuery` directly

## Files Changed

- `app/components/client-only.tsx` (new)
- `app/components/spirits/spirit-list.tsx`
- `app/routes/spirits.index.tsx`
- `app/routes/spirits.$slug.tsx`

## Verification

- Navigated to `/spirits` page - no console errors
- Navigated to spirit detail page - no console errors
- Content loads correctly after hydration
- Skeleton shows during SSR/loading

## Commit

d8c00c3
