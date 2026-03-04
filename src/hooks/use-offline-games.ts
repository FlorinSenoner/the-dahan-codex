import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useState } from 'react'
import type { GameFormData } from '@/components/games/game-form'
import type { OfflineOperation, PendingGame } from '@/lib/offline-games'
import { getAllOfflineOps, getAllPendingGames, savePendingGame } from '@/lib/offline-games'

function useUserScopedOutboxList<T>(
  isLoaded: boolean,
  userId: string | null | undefined,
  loadByUser: (ownerId: string) => Promise<T[]>,
) {
  const [items, setItems] = useState<T[]>([])

  const loadCurrentUser = useCallback(
    async (ownerId: string) => {
      const next = await loadByUser(ownerId)
      setItems(next)
      return next
    },
    [loadByUser],
  )

  useEffect(() => {
    if (!isLoaded || !userId) {
      setItems([])
      return
    }
    let cancelled = false
    loadByUser(userId)
      .then((next) => {
        if (!cancelled) setItems(next)
      })
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [isLoaded, userId, loadByUser])

  useEffect(() => {
    if (!isLoaded || !userId) return
    let cancelled = false
    const currentUserId = userId

    function handleSynced() {
      loadByUser(currentUserId)
        .then((next) => {
          if (!cancelled) setItems(next)
        })
        .catch(console.error)
    }
    window.addEventListener('outbox-synced', handleSynced)
    return () => {
      cancelled = true
      window.removeEventListener('outbox-synced', handleSynced)
    }
  }, [isLoaded, userId, loadByUser])

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([])
      return []
    }
    return loadCurrentUser(userId)
  }, [userId, loadCurrentUser])

  return { items, setItems, refresh }
}

export function usePendingGames() {
  const { isLoaded, userId } = useAuth()
  const { items: pendingGames, setItems: setPendingGames } = useUserScopedOutboxList<PendingGame>(
    isLoaded,
    userId,
    getAllPendingGames,
  )

  const saveOfflineGame = useCallback(
    async (formData: GameFormData) => {
      if (!userId) {
        throw new Error('Must be signed in to save offline games')
      }
      const game = await savePendingGame(userId, formData)
      setPendingGames((prev) => [game, ...prev])
      return game
    },
    [userId, setPendingGames],
  )

  return { pendingGames, saveOfflineGame }
}

export function useOfflineOps() {
  const { isLoaded, userId } = useAuth()
  const { items: offlineOps, refresh: refreshOps } = useUserScopedOutboxList<OfflineOperation>(
    isLoaded,
    userId,
    getAllOfflineOps,
  )

  return { offlineOps, refreshOps }
}
