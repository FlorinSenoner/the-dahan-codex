import { convexQuery } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import type { Doc } from 'convex/_generated/dataModel'
import { toAspectSlug } from '@/lib/slug'
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

/**
 * Process items in batches of `size` using Promise.all.
 * Respects Convex rate limits while being ~10x faster than sequential.
 */
async function batchPrefetch<T>(items: T[], fn: (item: T) => Promise<unknown>, size = 10) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn))
  }
}

/**
 * Sync spirits and openings data for offline access.
 * This is the heavy sync — should be run during idle time.
 */
export async function syncSpiritsAndOpenings(queryClient: QueryClient) {
  const spirits = await queryClient.fetchQuery(convexQuery(api.spirits.listSpirits, {}))

  // Fetch each base spirit with aspects (batched)
  const baseSpiritSlugs = spirits.filter((s) => !s.isAspect).map((s) => s.slug)
  await batchPrefetch(baseSpiritSlugs, (slug) =>
    queryClient.prefetchQuery(convexQuery(api.spirits.getSpiritWithAspects, { slug })),
  )

  // Fetch individual spirit pages for getSpiritBySlug cache (batched)
  await batchPrefetch(spirits, (spirit) => {
    if (spirit.isAspect) {
      const baseSpirit = spirits.find((s) => s._id === spirit.baseSpirit)
      if (baseSpirit && spirit.aspectName) {
        return queryClient.prefetchQuery(
          convexQuery(api.spirits.getSpiritBySlug, {
            slug: baseSpirit.slug,
            aspect: toAspectSlug(spirit.aspectName),
          }),
        )
      }
      return Promise.resolve()
    }
    return queryClient.prefetchQuery(
      convexQuery(api.spirits.getSpiritBySlug, { slug: spirit.slug }),
    )
  })

  // Fetch openings for each spirit (batched)
  await batchPrefetch(spirits, (spirit) =>
    queryClient.prefetchQuery(convexQuery(api.openings.listBySpirit, { spiritId: spirit._id })),
  )

  await persistQueryCache(queryClient)
}
