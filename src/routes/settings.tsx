import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { del } from 'idb-keyval'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { syncGames, syncSpiritsAndOpenings } from '@/lib/sync'
import { idbStore } from '../router'

const routeApi = getRouteApi('/settings')

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
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
      // Delete TanStack Query IndexedDB cache
      await del('tanstack-query-cache', idbStore)

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/" title="Settings" />

      <main className="p-4 max-w-lg mx-auto">
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
