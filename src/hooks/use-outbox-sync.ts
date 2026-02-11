import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { transformGameFormToPayload } from '@/lib/game-form-utils'
import {
  getAllOfflineOps,
  getAllPendingGames,
  removeOfflineOp,
  removePendingGame,
  updateOfflineOpStatus,
  updatePendingGameStatus,
} from '@/lib/offline-games'

/**
 * Layout-level hook that flushes both outboxes (pending games + offline ops)
 * when the user is authenticated and back online.
 *
 * Dispatches a `outbox-synced` CustomEvent on window so route-level hooks
 * can refresh their IndexedDB state for display purposes.
 */
export function useOutboxSync(isAuthReady: boolean) {
  const isOnline = useOnlineStatus()
  const isSyncing = useRef(false)

  const createGame = useMutation(api.games.createGame)
  const updateGameMutation = useMutation(api.games.updateGame)
  const deleteGameMutation = useMutation(api.games.deleteGame)

  useEffect(() => {
    if (!isAuthReady || !isOnline || isSyncing.current) return

    async function sync() {
      const pendingGames = await getAllPendingGames()
      const offlineOps = await getAllOfflineOps()

      if (pendingGames.length === 0 && offlineOps.length === 0) return

      isSyncing.current = true

      // --- Sync pending game creations ---
      let gamesSynced = 0
      let gamesFailed = 0

      for (const game of pendingGames) {
        try {
          await updatePendingGameStatus(game.id, 'syncing')
          await createGame(transformGameFormToPayload(game.formData))
          await removePendingGame(game.id)
          gamesSynced++
        } catch {
          await updatePendingGameStatus(game.id, 'failed')
          gamesFailed++
        }
      }

      if (gamesSynced > 0) {
        toast.success(`Synced ${gamesSynced} offline game${gamesSynced > 1 ? 's' : ''}`)
      }
      if (gamesFailed > 0) {
        toast.error(`Failed to sync ${gamesFailed} game${gamesFailed > 1 ? 's' : ''}`)
      }

      // --- Sync offline ops (updates + deletes) ---
      let opsSynced = 0
      let opsFailed = 0

      for (const op of offlineOps) {
        try {
          await updateOfflineOpStatus(op.id, 'syncing')
          if (op.type === 'update') {
            // Cast is safe: gameId originates from a Convex document _id
            await updateGameMutation({
              id: op.gameId as Id<'games'>,
              ...op.data,
            })
          } else if (op.type === 'delete') {
            await deleteGameMutation({ id: op.gameId as Id<'games'> })
          }
          await removeOfflineOp(op.id)
          opsSynced++
        } catch {
          await updateOfflineOpStatus(op.id, 'failed')
          opsFailed++
        }
      }

      if (opsSynced > 0) {
        toast.success(`Synced ${opsSynced} offline change${opsSynced > 1 ? 's' : ''}`)
      }
      if (opsFailed > 0) {
        toast.error(`Failed to sync ${opsFailed} change${opsFailed > 1 ? 's' : ''}`)
      }

      isSyncing.current = false

      // Notify route-level hooks to refresh their IndexedDB state
      window.dispatchEvent(new CustomEvent('outbox-synced'))
    }

    sync()
  }, [isAuthReady, isOnline, createGame, updateGameMutation, deleteGameMutation])
}
