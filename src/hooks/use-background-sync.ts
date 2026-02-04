import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { syncGames, syncSpiritsAndOpenings } from '@/lib/sync'

/**
 * Auto background sync hook. Syncs games immediately on auth + online,
 * spirits/openings during idle time.
 */
export function useBackgroundSync(isAuthReady: boolean | undefined) {
  const queryClient = useQueryClient()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (!isAuthReady || !isOnline) return

    // Immediate: sync games
    syncGames(queryClient).catch(() => {})

    // Idle: sync spirits and openings
    const idleCallback =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 2000)

    const cancelIdle = typeof cancelIdleCallback === 'function' ? cancelIdleCallback : clearTimeout

    const idleId = idleCallback(() => {
      syncSpiritsAndOpenings(queryClient).catch(() => {})
    })

    return () => cancelIdle(idleId as number)
  }, [isAuthReady, isOnline, queryClient])
}
