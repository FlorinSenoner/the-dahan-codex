---
status: resolved
trigger: "The Sync Data button no longer works. Clicking it shows Sync failed. Check your connection."
created: 2026-02-14T00:00:00Z
updated: 2026-02-14T00:02:00Z
---

## Current Focus

hypothesis: CONFIRMED - syncData() unconditionally calls syncGames() which requires auth
test: Applied fix, typecheck and lint pass
expecting: Sync succeeds for spirits (public) regardless of auth, games only when signed in
next_action: Archive and commit

## Symptoms

expected: Clicking the sync data button should sync/refresh data successfully
actual: Shows error message "Sync failed. Check your connection."
errors: "Sync failed. Check your connection."
reproduction: Click the sync data button in the app
started: Recently broken - was working before

## Eliminated

- hypothesis: Recent cache-control header changes (f83c0ee) broke sync
  evidence: The only code change was in public/_headers (no-store -> no-cache). This affects HTTP caching of HTML/SW files, not Convex WebSocket connections or TanStack Query behavior.
  timestamp: 2026-02-14T00:01:00Z

## Evidence

- timestamp: 2026-02-14T00:00:30Z
  checked: src/routes/settings.tsx syncData() function
  found: syncData() calls syncGames(queryClient) first, then syncSpiritsAndOpenings(queryClient). Any exception triggers generic "Sync failed. Check your connection."
  implication: The error message hides the actual cause (could be auth, network, or anything else)

- timestamp: 2026-02-14T00:00:40Z
  checked: src/lib/sync.ts syncGames() function
  found: syncGames calls queryClient.fetchQuery(convexQuery(api.games.listGames, {})). listGames in convex/games.ts calls requireAuth(ctx) which throws "Not authenticated" when user is not signed in.
  implication: Sync will always fail for unauthenticated users because syncGames is called first

- timestamp: 2026-02-14T00:00:45Z
  checked: Background sync guard in __root.tsx GlobalSync component
  found: useBackgroundSync(isAuthReady) correctly gates game sync with isAuthReady = isLoaded && !!isSignedIn. But the manual syncData() in settings has no such guard.
  implication: Background sync handles auth correctly but manual sync button does not

- timestamp: 2026-02-14T00:00:50Z
  checked: Git history for settings.tsx
  found: Settings page was never under _authenticated/ guard. syncData has always unconditionally called both syncGames and syncSpiritsAndOpenings. The Account section (with isSignedIn check) was added in commit de9e1f7 but syncData was never updated.
  implication: This is a latent bug since d0ebbe2 when sync was first introduced

- timestamp: 2026-02-14T00:00:55Z
  checked: TanStack Query default retry behavior
  found: No retry: false is configured, so default 3 retries with exponential backoff apply. This means the "Sync failed" message appears after several seconds of retrying.
  implication: User experiences a delay before seeing the error

## Resolution

root_cause: The syncData() function in settings.tsx unconditionally calls syncGames(), which calls the Convex listGames query requiring authentication (requireAuth). When the user is not signed in, Convex throws "Not authenticated", which is caught and displayed as the misleading "Sync failed. Check your connection." error. The background sync hook (useBackgroundSync) correctly guards game sync behind isAuthReady, but the manual sync button was never given the same guard. This is a latent bug since commit d0ebbe2 when sync was first introduced.
fix: Added isSignedIn guard around the syncGames() call in syncData(). When not signed in, only spirits and openings (public data) are synced. The isSignedIn value from Clerk's useUser() hook was already available in the component.
verification: TypeScript typecheck passes, Biome lint passes clean, E2E settings tests unaffected (they test button presence, not click behavior)
files_changed: [src/routes/settings.tsx]
