import { convexQuery } from '@convex-dev/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Doc } from 'convex/_generated/dataModel'
import { useConvexAuth } from 'convex/react'
import { Download, Gamepad2, LogIn, Plus, Upload, WifiOff } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { GameRow } from '@/components/games/game-row'
import { PendingGameRow } from '@/components/games/pending-game-row'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { useOnlineStatus, usePageMeta } from '@/hooks'
import { useOfflineOps, usePendingGames } from '@/hooks/use-offline-games'
import { exportGamesToCSV } from '@/lib/csv-export'
import { seedGameCaches } from '@/lib/sync'

export const Route = createFileRoute('/games/')({
  component: GamesIndex,
})

function GamesIndex() {
  usePageMeta('Games', 'Track your Spirit Island game history and stats.')

  const { isAuthenticated } = useConvexAuth()

  if (!isAuthenticated) {
    return <GamesSignInPrompt />
  }

  return <AuthenticatedGames />
}

function GamesSignInPrompt() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" title="Games" />
      <main className="pb-20">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Track your games</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Sign in to log your Spirit Island games and sync them across devices.
          </p>
          <Button asChild>
            <Link params={{ _splat: '' }} to="/sign-in/$">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

function AuthenticatedGames() {
  const { data: games, isError } = useQuery(convexQuery(api.games.listGames, {}))
  const isOnline = useOnlineStatus()
  const { pendingGames } = usePendingGames()
  const { offlineOps } = useOfflineOps()
  const queryClient = useQueryClient()

  // Seed individual game caches from list data for offline detail pages
  useEffect(() => {
    if (games) {
      seedGameCaches(queryClient, games)
    }
  }, [games, queryClient])

  // Merge outbox operations: filter deletes, apply updates
  const displayGames = useMemo(() => {
    if (!games) return undefined
    const deleteIds = new Set(
      offlineOps.filter((op) => op.type === 'delete').map((op) => op.gameId),
    )
    const updatesByGameId = new Map(
      offlineOps.filter((op) => op.type === 'update').map((op) => [op.gameId, op]),
    )
    return games
      .filter((g) => !deleteIds.has(g._id))
      .map((g) => {
        const update = updatesByGameId.get(g._id)
        if (update?.type === 'update') {
          return { ...g, ...update.data } as Doc<'games'>
        }
        return g
      })
  }, [games, offlineOps])

  const hasGames = (displayGames && displayGames.length > 0) || pendingGames.length > 0

  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" title="Games">
        {isOnline && (
          <Button asChild size="sm" variant="outline">
            <Link to="/games/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Link>
          </Button>
        )}
        {games && games.length > 0 && (
          <Button onClick={() => exportGamesToCSV(games)} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
        <Button asChild size="sm">
          <Link to="/games/new">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Link>
        </Button>
      </PageHeader>

      <main className="pb-20">
        {isError && !games ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Games unavailable offline</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Visit this page while online to cache your games for offline access.
            </p>
          </div>
        ) : !hasGames ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No games recorded yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start tracking your Spirit Island games to see your history and stats.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pendingGames.map((game) => (
              <PendingGameRow game={game} key={game.id} />
            ))}
            {displayGames?.map((game) => (
              <GameRow game={game} key={game._id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
