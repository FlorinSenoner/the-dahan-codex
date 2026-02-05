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
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([])

  // Load pending games from IndexedDB on mount
  useEffect(() => {
    getAllPendingGames().then(setPendingGames).catch(console.error)
  }, [])

  // Refresh when layout-level sync completes
  useEffect(() => {
    function handleSynced() {
      getAllPendingGames().then(setPendingGames).catch(console.error)
    }
    window.addEventListener('outbox-synced', handleSynced)
    return () => window.removeEventListener('outbox-synced', handleSynced)
  }, [])

  const saveOfflineGame = useCallback(async (formData: GameFormData) => {
    const game = await savePendingGame(formData)
    setPendingGames((prev) => [game, ...prev])
    return game
  }, [])

  return { pendingGames, saveOfflineGame }
}

export function useOfflineOps() {
  const [offlineOps, setOfflineOps] = useState<OfflineOperation[]>([])

  // Load offline ops from IndexedDB on mount
  useEffect(() => {
    getAllOfflineOps().then(setOfflineOps).catch(console.error)
  }, [])

  // Refresh when layout-level sync completes
  useEffect(() => {
    function handleSynced() {
      getAllOfflineOps().then(setOfflineOps).catch(console.error)
    }
    window.addEventListener('outbox-synced', handleSynced)
    return () => window.removeEventListener('outbox-synced', handleSynced)
  }, [])

  const refreshOps = useCallback(async () => {
    const ops = await getAllOfflineOps()
    setOfflineOps(ops)
  }, [])

  return { offlineOps, refreshOps }
}
