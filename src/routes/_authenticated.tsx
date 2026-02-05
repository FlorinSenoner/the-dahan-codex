import { useAuth } from '@clerk/clerk-react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useOnlineStatus } from '@/hooks'
import { useBackgroundSync } from '@/hooks/use-background-sync'
import { useOutboxSync } from '@/hooks/use-outbox-sync'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()

  // Auto background sync: games on mount, spirits/openings during idle time
  useBackgroundSync(isLoaded && isSignedIn)

  // Flush offline outboxes (pending games + offline ops) on reconnect
  useOutboxSync(isLoaded && isSignedIn)

  useEffect(() => {
    if (isLoaded && !isSignedIn && isOnline) {
      navigate({ to: '/sign-in/$', params: { _splat: '' } })
    }
  }, [isLoaded, isSignedIn, isOnline, navigate])

  if (!isLoaded) {
    // When offline and Clerk can't load, show cached data anyway
    if (!isOnline) return <Outlet />
    return <div className="p-8">Loading...</div>
  }

  if (!isSignedIn) {
    // When offline, show cached data instead of redirecting
    if (!isOnline) return <Outlet />
    return <div className="p-8">Redirecting to sign in...</div>
  }

  return <Outlet />
}
