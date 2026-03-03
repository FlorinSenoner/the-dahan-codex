import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { syncGames, syncPublicReferenceData } from '@/lib/sync'

/**
 * Auto background sync hook.
 * - Public snapshot sync runs whenever online (cache-aware).
 * - Games sync runs only when auth is ready.
 */
export function useBackgroundSync(isAuthReady: boolean | undefined) {
  const queryClient = useQueryClient()
  const isOnline = useOnlineStatus()
  const isPublicSyncingRef = useRef(false)
  const isGamesSyncingRef = useRef(false)

  useEffect(() => {
    if (!isOnline) return

    if (!isPublicSyncingRef.current) {
      isPublicSyncingRef.current = true
      syncPublicReferenceData(queryClient)
        .catch((error) => console.warn('Background public sync failed:', error))
        .finally(() => {
          isPublicSyncingRef.current = false
        })
    }

    if (isAuthReady && !isGamesSyncingRef.current) {
      isGamesSyncingRef.current = true
      syncGames(queryClient)
        .catch((error) => console.warn('Background game sync failed:', error))
        .finally(() => {
          isGamesSyncingRef.current = false
        })
    }
  }, [isAuthReady, isOnline, queryClient])
}
