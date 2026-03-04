import type { QueryClient } from '@tanstack/react-query'
import { createStore, del } from 'idb-keyval'

export const IDB_CACHE_KEY = 'tanstack-query-cache'
export const idbStore = createStore('the-dahan-codex', 'cache')

/**
 * Clear both in-memory and persisted query caches.
 * Used when auth identity changes or when users manually clear cache.
 */
export async function clearPersistedQueryCache(queryClient?: QueryClient) {
  queryClient?.clear()
  await del(IDB_CACHE_KEY, idbStore)
}
