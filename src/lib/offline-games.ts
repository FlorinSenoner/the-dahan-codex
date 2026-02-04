import { createStore, del, entries, get, set } from 'idb-keyval'
import type { GameFormData } from '@/components/games/game-form'

export type SyncStatus = 'pending' | 'syncing' | 'failed'

export interface PendingGame {
  id: string
  formData: GameFormData
  createdAt: number
  syncStatus: SyncStatus
}

// Separate IndexedDB database to avoid version conflicts with TanStack Query cache
const pendingGamesStore = createStore('dahan-codex-pending-games', 'outbox')

export async function savePendingGame(formData: GameFormData): Promise<PendingGame> {
  const game: PendingGame = {
    id: crypto.randomUUID(),
    formData,
    createdAt: Date.now(),
    syncStatus: 'pending',
  }
  await set(game.id, game, pendingGamesStore)
  return game
}

export async function getAllPendingGames(): Promise<PendingGame[]> {
  const all = await entries<string, PendingGame>(pendingGamesStore)
  return all.map(([, value]) => value).sort((a, b) => b.createdAt - a.createdAt)
}

export async function removePendingGame(id: string): Promise<void> {
  await del(id, pendingGamesStore)
}

export async function updatePendingGameStatus(id: string, syncStatus: SyncStatus): Promise<void> {
  const game = await get<PendingGame>(id, pendingGamesStore)
  if (game) {
    await set(id, { ...game, syncStatus }, pendingGamesStore)
  }
}

// --- Offline operations outbox (update + delete) ---

export type OfflineOperation =
  | {
      id: string
      type: 'update'
      gameId: string
      data: Record<string, unknown>
      createdAt: number
      syncStatus: SyncStatus
    }
  | { id: string; type: 'delete'; gameId: string; createdAt: number; syncStatus: SyncStatus }

type NewOfflineOp =
  | { type: 'update'; gameId: string; data: Record<string, unknown> }
  | { type: 'delete'; gameId: string }

const offlineOpsStore = createStore('dahan-codex-offline-ops', 'operations')

export async function saveOfflineOp(op: NewOfflineOp): Promise<OfflineOperation> {
  const full = {
    ...op,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    syncStatus: 'pending' as const,
  } as OfflineOperation
  await set(full.id, full, offlineOpsStore)
  return full
}

export async function getAllOfflineOps(): Promise<OfflineOperation[]> {
  const all = await entries<string, OfflineOperation>(offlineOpsStore)
  return all.map(([, value]) => value).sort((a, b) => a.createdAt - b.createdAt)
}

export async function removeOfflineOp(id: string): Promise<void> {
  await del(id, offlineOpsStore)
}

export async function updateOfflineOpStatus(id: string, syncStatus: SyncStatus): Promise<void> {
  const op = await get<OfflineOperation>(id, offlineOpsStore)
  if (op) {
    await set(id, { ...op, syncStatus }, offlineOpsStore)
  }
}
