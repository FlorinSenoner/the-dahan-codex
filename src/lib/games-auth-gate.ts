export type GamesAuthGateInput = {
  isLoaded: boolean
  isOnline: boolean
  isSignedIn: boolean | undefined
}

export function shouldRenderAuthenticatedGames({
  isLoaded,
  isOnline,
  isSignedIn,
}: GamesAuthGateInput): boolean {
  if (isLoaded) {
    return isSignedIn === true
  }

  // Clerk unresolved: allow offline users to access cached/outbox games.
  return !isOnline
}
