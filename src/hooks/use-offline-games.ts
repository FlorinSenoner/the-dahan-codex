import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useState } from 'react'
import type { GameFormData } from '@/components/games/game-form'
import {
  getAllOfflineOps,
  getAllPendingGames,
  type OfflineOperation,
  type PendingGame,
  savePendingGame,
} from '@/lib/offline-games'

export function usePendingGames() {
  const { isLoaded, userId } = useAuth()
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([])

  // Load pending games for current user.
  useEffect(() => {
    if (!isLoaded || !userId) {
      setPendingGames([])
      return
    }
    const currentUserId = userId
    getAllPendingGames(currentUserId).then(setPendingGames).catch(console.error)
  }, [isLoaded, userId])

  // Refresh when layout-level sync completes
  useEffect(() => {
    if (!isLoaded || !userId) return
    const currentUserId = userId

    function handleSynced() {
      getAllPendingGames(currentUserId).then(setPendingGames).catch(console.error)
    }
    window.addEventListener('outbox-synced', handleSynced)
    return () => window.removeEventListener('outbox-synced', handleSynced)
  }, [isLoaded, userId])

  const saveOfflineGame = useCallback(
    async (formData: GameFormData) => {
      if (!userId) {
        throw new Error('Must be signed in to save offline games')
      }
      const game = await savePendingGame(userId, formData)
      setPendingGames((prev) => [game, ...prev])
      return game
    },
    [userId],
  )

  return { pendingGames, saveOfflineGame }
}

export function useOfflineOps() {
  const { isLoaded, userId } = useAuth()
  const [offlineOps, setOfflineOps] = useState<OfflineOperation[]>([])

  // Load offline ops for current user.
  useEffect(() => {
    if (!isLoaded || !userId) {
      setOfflineOps([])
      return
    }
    const currentUserId = userId
    getAllOfflineOps(currentUserId).then(setOfflineOps).catch(console.error)
  }, [isLoaded, userId])

  // Refresh when layout-level sync completes
  useEffect(() => {
    if (!isLoaded || !userId) return
    const currentUserId = userId

    function handleSynced() {
      getAllOfflineOps(currentUserId).then(setOfflineOps).catch(console.error)
    }
    window.addEventListener('outbox-synced', handleSynced)
    return () => window.removeEventListener('outbox-synced', handleSynced)
  }, [isLoaded, userId])

  const refreshOps = useCallback(async () => {
    if (!userId) {
      setOfflineOps([])
      return
    }
    const ops = await getAllOfflineOps(userId)
    setOfflineOps(ops)
  }, [userId])

  return { offlineOps, refreshOps }
}
