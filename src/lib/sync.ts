import { convexQuery } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import type { Doc } from 'convex/_generated/dataModel'
import { persistQueryCache } from '@/router'

/**
 * Seed individual getGame cache entries from a list of game documents.
 * This makes every game detail page work offline without requiring prior visits.
 */
export function seedGameCaches(queryClient: QueryClient, games: Doc<'games'>[]) {
  for (const game of games) {
    queryClient.setQueryData(convexQuery(api.games.getGame, { id: game._id }).queryKey, game)
  }
}

/**
 * Fetch all games and seed individual game caches, then persist to IndexedDB.
 */
export async function syncGames(queryClient: QueryClient) {
  const games = await queryClient.fetchQuery(convexQuery(api.games.listGames, {}))
  if (games) {
    seedGameCaches(queryClient, games)
  }
  await persistQueryCache(queryClient)
}
