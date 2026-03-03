import { describe, expect, it } from 'vitest'
import { shouldRenderAuthenticatedGames } from '@/lib/games-auth-gate'

describe('shouldRenderAuthenticatedGames', () => {
  it('renders authenticated games when Clerk is loaded and user is signed in', () => {
    expect(
      shouldRenderAuthenticatedGames({
        isLoaded: true,
        isOnline: true,
        isSignedIn: true,
      }),
    ).toBe(true)
  })

  it('renders sign-in prompt when Clerk is loaded and user is signed out', () => {
    expect(
      shouldRenderAuthenticatedGames({
        isLoaded: true,
        isOnline: true,
        isSignedIn: false,
      }),
    ).toBe(false)
  })

  it('renders sign-in prompt when Clerk is unresolved but online', () => {
    expect(
      shouldRenderAuthenticatedGames({
        isLoaded: false,
        isOnline: true,
        isSignedIn: undefined,
      }),
    ).toBe(false)
  })

  it('renders authenticated games when Clerk is unresolved and offline', () => {
    expect(
      shouldRenderAuthenticatedGames({
        isLoaded: false,
        isOnline: false,
        isSignedIn: undefined,
      }),
    ).toBe(true)
  })
})
