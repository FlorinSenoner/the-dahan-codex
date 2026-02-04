import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { del } from 'idb-keyval'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { api } from '../../convex/_generated/api'
import { persistQueryCache } from '../router'

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
    setSyncStatus('Loading spirits...')
    try {
      // Fetch all spirits via TanStack Query (this gets persisted to IndexedDB)
      const spirits = await queryClient.fetchQuery(convexQuery(api.spirits.listSpirits, {}))

      // Get unique base spirit slugs (filter out aspects)
      const baseSpiritSlugs = spirits.filter((s) => !s.isAspect).map((s) => s.slug)

      // Fetch each base spirit AND its aspects via getSpiritWithAspects
      setSyncStatus(`Syncing spirits (0/${baseSpiritSlugs.length})...`)
      for (let i = 0; i < baseSpiritSlugs.length; i++) {
        // This fetches base spirit AND all its aspects in one query
        await queryClient.prefetchQuery(
          convexQuery(api.spirits.getSpiritWithAspects, {
            slug: baseSpiritSlugs[i],
          }),
        )
        setSyncStatus(`Syncing spirits (${i + 1}/${baseSpiritSlugs.length})...`)
      }

      // Also fetch individual spirit pages to cache getSpiritBySlug responses
      for (const spirit of spirits) {
        if (spirit.isAspect) {
          // For aspects, need to call with aspect parameter (lowercase to match URL)
          const baseSpirit = spirits.find((s) => s._id === spirit.baseSpirit)
          if (baseSpirit && spirit.aspectName) {
            await queryClient.prefetchQuery(
              convexQuery(api.spirits.getSpiritBySlug, {
                slug: baseSpirit.slug,
                aspect: spirit.aspectName.toLowerCase(),
              }),
            )
          }
        } else {
          await queryClient.prefetchQuery(
            convexQuery(api.spirits.getSpiritBySlug, {
              slug: spirit.slug,
            }),
          )
        }
      }

      // Fetch openings for each spirit
      setSyncStatus('Syncing openings...')
      for (const spirit of spirits) {
        await queryClient.prefetchQuery(
          convexQuery(api.openings.listBySpirit, { spiritId: spirit._id }),
        )
      }

      // Manually persist to IndexedDB to ensure data is saved
      setSyncStatus('Saving to offline storage...')
      await persistQueryCache(queryClient)

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
      await del('tanstack-query-cache')

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
            Sync spirit data for offline access or clear cached data if something seems broken.
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
