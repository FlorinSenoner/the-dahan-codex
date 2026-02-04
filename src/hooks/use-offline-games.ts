import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { GameFormData } from '@/components/games/game-form'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { transformGameFormToPayload } from '@/lib/game-form-utils'
import {
  getAllOfflineOps,
  getAllPendingGames,
  type OfflineOperation,
  type PendingGame,
  removeOfflineOp,
  removePendingGame,
  savePendingGame,
  updateOfflineOpStatus,
  updatePendingGameStatus,
} from '@/lib/offline-games'

export function usePendingGames() {
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([])
  const isOnline = useOnlineStatus()
  const createGame = useMutation(api.games.createGame)
  const isSyncing = useRef(false)

  // Load pending games from IndexedDB on mount
  useEffect(() => {
    getAllPendingGames().then(setPendingGames).catch(console.error)
  }, [])

  const saveOfflineGame = useCallback(async (formData: GameFormData) => {
    const game = await savePendingGame(formData)
    setPendingGames((prev) => [game, ...prev])
    return game
  }, [])

  const syncPendingGames = useCallback(async () => {
    if (isSyncing.current) return
    isSyncing.current = true

    const games = await getAllPendingGames()
    if (games.length === 0) {
      isSyncing.current = false
      return
    }

    let synced = 0
    let failed = 0

    for (const game of games) {
      try {
        await updatePendingGameStatus(game.id, 'syncing')
        setPendingGames((prev) =>
          prev.map((g) => (g.id === game.id ? { ...g, syncStatus: 'syncing' as const } : g)),
        )

        await createGame(transformGameFormToPayload(game.formData))
        await removePendingGame(game.id)
        setPendingGames((prev) => prev.filter((g) => g.id !== game.id))
        synced++
      } catch {
        await updatePendingGameStatus(game.id, 'failed')
        setPendingGames((prev) =>
          prev.map((g) => (g.id === game.id ? { ...g, syncStatus: 'failed' as const } : g)),
        )
        failed++
      }
    }

    if (synced > 0) {
      toast.success(`Synced ${synced} offline game${synced > 1 ? 's' : ''}`)
    }
    if (failed > 0) {
      toast.error(`Failed to sync ${failed} game${failed > 1 ? 's' : ''}`)
    }

    isSyncing.current = false
  }, [createGame])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingGames.length > 0) {
      syncPendingGames()
    }
  }, [isOnline, syncPendingGames, pendingGames.length])

  return { pendingGames, saveOfflineGame, syncPendingGames }
}

export function useOfflineOps() {
  const [offlineOps, setOfflineOps] = useState<OfflineOperation[]>([])
  const isOnline = useOnlineStatus()
  const updateGameMutation = useMutation(api.games.updateGame)
  const deleteGameMutation = useMutation(api.games.deleteGame)
  const isSyncing = useRef(false)

  // Load offline ops from IndexedDB on mount
  useEffect(() => {
    getAllOfflineOps().then(setOfflineOps).catch(console.error)
  }, [])

  const refreshOps = useCallback(async () => {
    const ops = await getAllOfflineOps()
    setOfflineOps(ops)
  }, [])

  const syncOfflineOps = useCallback(async () => {
    if (isSyncing.current) return
    isSyncing.current = true

    const ops = await getAllOfflineOps()
    if (ops.length === 0) {
      isSyncing.current = false
      return
    }

    let synced = 0
    let failed = 0

    for (const op of ops) {
      try {
        await updateOfflineOpStatus(op.id, 'syncing')
        if (op.type === 'update') {
          await updateGameMutation({
            id: op.gameId as Id<'games'>,
            ...op.data,
          })
        } else if (op.type === 'delete') {
          await deleteGameMutation({ id: op.gameId as Id<'games'> })
        }
        await removeOfflineOp(op.id)
        synced++
      } catch {
        await updateOfflineOpStatus(op.id, 'failed')
        failed++
      }
    }

    if (synced > 0) {
      toast.success(`Synced ${synced} offline change${synced > 1 ? 's' : ''}`)
    }
    if (failed > 0) {
      toast.error(`Failed to sync ${failed} change${failed > 1 ? 's' : ''}`)
    }

    await refreshOps()
    isSyncing.current = false
  }, [updateGameMutation, deleteGameMutation, refreshOps])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineOps.length > 0) {
      syncOfflineOps()
    }
  }, [isOnline, syncOfflineOps, offlineOps.length])

  return { offlineOps, refreshOps, syncOfflineOps }
}
