import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { syncGames } from '@/lib/sync'

/**
 * Auto background sync hook.
 * Games background sync for authenticated users.
 * Public spirit/opening data is provided by build-time snapshot.
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
  }, [isAuthReady, isOnline, queryClient])
}
