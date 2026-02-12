import { useAuth } from '@clerk/clerk-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useBackgroundSync } from '@/hooks/use-background-sync'
import { useOutboxSync } from '@/hooks/use-outbox-sync'

export const Route = createFileRoute('/games')({
  component: GamesLayout,
})

function GamesLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth()

  // Background sync + outbox flush for authenticated users
  useBackgroundSync(isLoaded && !!isSignedIn)
  useOutboxSync({ isAuthReady: isLoaded && !!isSignedIn, ownerId: userId })

  return <Outlet />
}
