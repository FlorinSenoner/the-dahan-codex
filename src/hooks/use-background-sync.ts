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

    // Public content should be available offline even without auth.
    syncSpiritsAndOpenings(queryClient).catch((e) =>
      console.warn('Background spirit sync failed:', e),
    )

    if (isAuthReady) {
      syncGames(queryClient).catch((e) => console.warn('Background game sync failed:', e))
    }
  }, [isAuthReady, isOnline, queryClient])
}
