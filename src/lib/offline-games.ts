import { clear, createStore, del, entries, get, set } from 'idb-keyval'
import type { GameFormData } from '@/components/games/game-form'

export type SyncStatus = 'pending' | 'syncing' | 'failed'

export interface PendingGame {
  id: string
  ownerId: string
  formData: GameFormData
  createdAt: number
  syncStatus: SyncStatus
}

// Separate IndexedDB database to avoid version conflicts with TanStack Query cache
const pendingGamesStore = createStore('dahan-codex-pending-games', 'outbox')

export async function savePendingGame(
  ownerId: string,
  formData: GameFormData,
): Promise<PendingGame> {
  const game: PendingGame = {
    id: crypto.randomUUID(),
    ownerId,
    formData,
    createdAt: Date.now(),
    syncStatus: 'pending',
  }
  await set(game.id, game, pendingGamesStore)
  return game
}

export async function getAllPendingGames(ownerId: string): Promise<PendingGame[]> {
  const all = await entries<string, PendingGame | Omit<PendingGame, 'ownerId'>>(pendingGamesStore)
  const owned: PendingGame[] = []

  for (const [id, value] of all) {
    if (!('ownerId' in value) || typeof value.ownerId !== 'string') {
      // One-time migration policy: purge legacy owner-less records immediately.
      await del(id, pendingGamesStore)
      continue
    }
    if (value.ownerId === ownerId) {
      owned.push(value)
    }
  }

  return owned.sort((a, b) => b.createdAt - a.createdAt)
}

export async function removePendingGame(id: string, ownerId: string): Promise<void> {
  const game = await get<PendingGame>(id, pendingGamesStore)
  if (!game || game.ownerId !== ownerId) {
    return
  }
  await del(id, pendingGamesStore)
}

export async function updatePendingGameStatus(
  id: string,
  ownerId: string,
  syncStatus: SyncStatus,
): Promise<void> {
  const game = await get<PendingGame>(id, pendingGamesStore)
  if (game && game.ownerId === ownerId) {
    await set(id, { ...game, syncStatus }, pendingGamesStore)
  }
}

// --- Offline operations outbox (update + delete) ---

export type OfflineOperation =
  | {
      id: string
      ownerId: string
      type: 'update'
      gameId: string
      data: Record<string, unknown>
      createdAt: number
      syncStatus: SyncStatus
    }
  | {
      id: string
      ownerId: string
      type: 'delete'
      gameId: string
      createdAt: number
      syncStatus: SyncStatus
    }

type NewOfflineOp =
  | { type: 'update'; gameId: string; data: Record<string, unknown> }
  | { type: 'delete'; gameId: string }

const offlineOpsStore = createStore('dahan-codex-offline-ops', 'operations')

export async function saveOfflineOp(ownerId: string, op: NewOfflineOp): Promise<OfflineOperation> {
  const full = {
    ...op,
    id: crypto.randomUUID(),
    ownerId,
    createdAt: Date.now(),
    syncStatus: 'pending' as const,
  } as OfflineOperation
  await set(full.id, full, offlineOpsStore)
  return full
}

export async function getAllOfflineOps(ownerId: string): Promise<OfflineOperation[]> {
  const all = await entries<string, OfflineOperation | Omit<OfflineOperation, 'ownerId'>>(
    offlineOpsStore,
  )
  const owned: OfflineOperation[] = []

  for (const [id, value] of all) {
    if (!('ownerId' in value) || typeof value.ownerId !== 'string') {
      // One-time migration policy: purge legacy owner-less records immediately.
      await del(id, offlineOpsStore)
      continue
    }
    if (value.ownerId === ownerId) {
      owned.push(value)
    }
  }

  return owned.sort((a, b) => a.createdAt - b.createdAt)
}

export async function removeOfflineOp(id: string, ownerId: string): Promise<void> {
  const op = await get<OfflineOperation>(id, offlineOpsStore)
  if (!op || op.ownerId !== ownerId) {
    return
  }
  await del(id, offlineOpsStore)
}

export async function updateOfflineOpStatus(
  id: string,
  ownerId: string,
  syncStatus: SyncStatus,
): Promise<void> {
  const op = await get<OfflineOperation>(id, offlineOpsStore)
  if (op && op.ownerId === ownerId) {
    await set(id, { ...op, syncStatus }, offlineOpsStore)
  }
}

export async function clearOfflineData(): Promise<void> {
  await Promise.all([clear(pendingGamesStore), clear(offlineOpsStore)])
}
