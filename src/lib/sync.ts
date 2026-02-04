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

/**
 * Sync spirits and openings data for offline access.
 * This is the heavy sync — should be run during idle time.
 */
export async function syncSpiritsAndOpenings(queryClient: QueryClient) {
  const spirits = await queryClient.fetchQuery(convexQuery(api.spirits.listSpirits, {}))

  // Fetch each base spirit with aspects
  const baseSpiritSlugs = spirits.filter((s) => !s.isAspect).map((s) => s.slug)
  for (const slug of baseSpiritSlugs) {
    await queryClient.prefetchQuery(convexQuery(api.spirits.getSpiritWithAspects, { slug }))
  }

  // Fetch individual spirit pages for getSpiritBySlug cache
  for (const spirit of spirits) {
    if (spirit.isAspect) {
      const baseSpirit = spirits.find((s) => s._id === spirit.baseSpirit)
      if (baseSpirit && spirit.aspectName) {
        await queryClient.prefetchQuery(
          convexQuery(api.spirits.getSpiritBySlug, {
            slug: baseSpirit.slug,
            aspect: spirit.aspectName.toLowerCase(),
          }),
        )
      }
    } else {
      await queryClient.prefetchQuery(
        convexQuery(api.spirits.getSpiritBySlug, { slug: spirit.slug }),
      )
    }
  }

  // Fetch openings for each spirit
  for (const spirit of spirits) {
    await queryClient.prefetchQuery(
      convexQuery(api.openings.listBySpirit, { spiritId: spirit._id }),
    )
  }

  await persistQueryCache(queryClient)
}
