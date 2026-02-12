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
interface UseOutboxSyncOptions {
  isAuthReady: boolean
  ownerId: string | null | undefined
}

export function useOutboxSync({ isAuthReady, ownerId }: UseOutboxSyncOptions) {
  const isOnline = useOnlineStatus()
  const isSyncing = useRef(false)

  const createGame = useMutation(api.games.createGame)
  const updateGameMutation = useMutation(api.games.updateGame)
  const deleteGameMutation = useMutation(api.games.deleteGame)

  useEffect(() => {
    if (!isAuthReady || !ownerId || !isOnline || isSyncing.current) return
    const currentOwnerId = ownerId

    async function sync() {
      const pendingGames = await getAllPendingGames(currentOwnerId)
      const offlineOps = await getAllOfflineOps(currentOwnerId)

      if (pendingGames.length === 0 && offlineOps.length === 0) return

      isSyncing.current = true
      try {
        // --- Sync pending game creations ---
        let gamesSynced = 0
        let gamesFailed = 0

        for (const game of pendingGames) {
          try {
            await updatePendingGameStatus(game.id, currentOwnerId, 'syncing')
            await createGame(transformGameFormToPayload(game.formData))
            await removePendingGame(game.id, currentOwnerId)
            gamesSynced++
          } catch {
            await updatePendingGameStatus(game.id, currentOwnerId, 'failed')
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
            await updateOfflineOpStatus(op.id, currentOwnerId, 'syncing')
            if (op.type === 'update') {
              // Cast is safe: gameId originates from a Convex document _id
              await updateGameMutation({
                id: op.gameId as Id<'games'>,
                ...op.data,
              })
            } else if (op.type === 'delete') {
              await deleteGameMutation({ id: op.gameId as Id<'games'> })
            }
            await removeOfflineOp(op.id, currentOwnerId)
            opsSynced++
          } catch {
            await updateOfflineOpStatus(op.id, currentOwnerId, 'failed')
            opsFailed++
          }
        }

        if (opsSynced > 0) {
          toast.success(`Synced ${opsSynced} offline change${opsSynced > 1 ? 's' : ''}`)
        }
        if (opsFailed > 0) {
          toast.error(`Failed to sync ${opsFailed} change${opsFailed > 1 ? 's' : ''}`)
        }

        // Notify route-level hooks to refresh their IndexedDB state
        window.dispatchEvent(new CustomEvent('outbox-synced'))
      } finally {
        isSyncing.current = false
      }
    }

    sync()
  }, [isAuthReady, ownerId, isOnline, createGame, updateGameMutation, deleteGameMutation])
}
