import { useClerk, useUser } from '@clerk/clerk-react'
import { createFileRoute, getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { LogIn, LogOut, Monitor, Moon, RefreshCw, Sun, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { useTheme } from '@/contexts/theme-context'
import { usePageMeta } from '@/hooks'
import { clearOfflineData } from '@/lib/offline-games'
import { syncGames, syncSpiritsAndOpenings } from '@/lib/sync'
import { cn } from '@/lib/utils'
import { clearPersistedQueryCache } from '../router'

const routeApi = getRouteApi('/settings')

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  usePageMeta('Settings')

  const { queryClient } = routeApi.useRouteContext()

  // State for Sync Data
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  // State for Clear Cache
  const [isClearing, setIsClearing] = useState(false)

  async function syncData() {
    setIsSyncing(true)
    try {
      setSyncStatus('Syncing games...')
      await syncGames(queryClient)

      setSyncStatus('Syncing spirits & openings...')
      await syncSpiritsAndOpenings(queryClient)

      setSyncStatus('Sync complete!')
      setTimeout(() => setSyncStatus(null), 3000)
    } catch (error) {
      console.error('Failed to sync data:', error)
      setSyncStatus('Sync failed. Check your connection.')
    } finally {
      setIsSyncing(false)
    }
  }

  async function clearCache() {
    setIsClearing(true)
    try {
      // Delete TanStack Query cache (in-memory + IndexedDB)
      await clearPersistedQueryCache(queryClient)

      // Delete offline outbox stores
      await clearOfflineData()

      // Delete all service worker caches
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))

      // Unregister service worker to force full refresh
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
      }

      window.location.reload()
    } catch (error) {
      console.error('Failed to clear cache:', error)
      setIsClearing(false)
    }
  }

  const { theme, setTheme } = useTheme()
  const { user, isSignedIn } = useUser()
  const clerk = useClerk()
  const navigate = useNavigate()

  async function handleSignOut() {
    await clerk.signOut()
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/" title="Settings" />

      <main className="p-4 max-w-lg mx-auto">
        {/* Account Section */}
        <section className="mt-6">
          <Heading className="text-foreground" variant="h3">
            Account
          </Heading>
          {isSignedIn ? (
            <>
              <div className="mt-4 flex items-center gap-4">
                <img
                  alt={user.fullName ?? 'User avatar'}
                  className="h-12 w-12 rounded-full"
                  src={user.imageUrl}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user.fullName || user.firstName}</p>
                  {user.primaryEmailAddress?.emailAddress && (
                    <p className="text-sm text-muted-foreground truncate">
                      {user.primaryEmailAddress.emailAddress}
                    </p>
                  )}
                </div>
                <Button onClick={handleSignOut} size="sm" variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
              <Text className="mt-3" variant="muted">
                Sign in is needed to save and sync your game history across devices.
              </Text>
            </>
          ) : (
            <>
              <Text className="mt-2" variant="muted">
                Sign in to track your Spirit Island games and sync them across devices.
              </Text>
              <div className="mt-4">
                <Button asChild>
                  <Link params={{ _splat: '' }} to="/sign-in/$">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </>
          )}
        </section>

        {/* Theme Section */}
        <section className="mt-6">
          <Heading className="text-foreground" variant="h3">
            Theme
          </Heading>
          <Text className="mt-2" variant="muted">
            Choose how The Dahan Codex looks to you.
          </Text>
          <div className="mt-4 flex gap-3">
            {(
              [
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <Button
                className={cn('flex-1')}
                key={value}
                onClick={() => setTheme(value)}
                variant={theme === value ? 'default' : 'outline'}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {/* Cache Management Section */}
        <section className="mt-6">
          <Heading className="text-foreground" variant="h3">
            Cache Management
          </Heading>
          <Text className="mt-2" variant="muted">
            Data syncs automatically in the background. Use the button below to force a full sync,
            or clear cached data if something seems broken.
          </Text>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 cursor-pointer"
              disabled={isSyncing || isClearing}
              onClick={syncData}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? syncStatus || 'Syncing...' : 'Sync Data'}
            </Button>
            <Button
              className="flex-1 cursor-pointer"
              disabled={isSyncing || isClearing}
              onClick={clearCache}
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? 'Clearing...' : 'Clear Cache'}
            </Button>
          </div>
          {syncStatus && !isSyncing && (
            <Text className="mt-2 text-muted-foreground" variant="small">
              {syncStatus}
            </Text>
          )}
        </section>
      </main>
    </div>
  )
}
