import { convexQuery } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import type { Doc } from 'convex/_generated/dataModel'
import {
  fetchPublicSnapshot,
  PUBLIC_SNAPSHOT_GC_TIME,
  PUBLIC_SNAPSHOT_QUERY_KEY,
  PUBLIC_SNAPSHOT_STALE_TIME,
} from '@/data/public-snapshot'

/**
 * Seed individual getGame cache entries from a list of game documents.
 * This makes every game detail page work offline without requiring prior visits.
 */
export function seedGameCaches(queryClient: QueryClient, games: Doc<'games'>[]) {
  for (const game of games) {
    queryClient.setQueryData(convexQuery(api.games.getGame, { id: game._id }).queryKey, game)
  }
}

/** Fetch all games and seed individual game caches. */
export async function syncGames(queryClient: QueryClient) {
  const games = await queryClient.fetchQuery(convexQuery(api.games.listGames, {}))
  if (games) {
    seedGameCaches(queryClient, games)
  }
}

/** Sync public reference snapshot via plain HTTP endpoint (non-realtime). */
export async function syncPublicReferenceData(
  queryClient: QueryClient,
  options?: { force?: boolean },
) {
  const force = options?.force === true
  await queryClient.fetchQuery({
    queryKey: [...PUBLIC_SNAPSHOT_QUERY_KEY],
    queryFn: () => fetchPublicSnapshot({ force }),
    staleTime: force ? 0 : PUBLIC_SNAPSHOT_STALE_TIME,
    gcTime: PUBLIC_SNAPSHOT_GC_TIME,
  })
}
