import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { syncGames, syncSpiritsAndOpenings } from '@/lib/sync'

/**
 * Auto background sync hook.
 * - Spirits/openings sync for all online sessions (public data).
 * - Games sync only when auth is ready.
 */
export function useBackgroundSync(isAuthReady: boolean | undefined) {
  const queryClient = useQueryClient()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (!isOnline) return

    // Games sync is lightweight — run eagerly when auth is ready.
    if (isAuthReady) {
      syncGames(queryClient).catch((e) => console.warn('Background game sync failed:', e))
    }

    // Spirit/openings sync is heavy (many batched queries) — defer to idle time
    // so it doesn't contend with initial route data fetches.
    const scheduleIdle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000))
    const id = scheduleIdle(() => {
      syncSpiritsAndOpenings(queryClient).catch((e) =>
        console.warn('Background spirit sync failed:', e),
      )
    })

    return () => {
      const cancelIdle = window.cancelIdleCallback ?? clearTimeout
      cancelIdle(id)
    }
  }, [isAuthReady, isOnline, queryClient])
}
