import { useAuth } from '@clerk/clerk-react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { Download, Gamepad2, LoaderCircle, LogIn, Plus, Upload, WifiOff } from 'lucide-react'
import { type ReactNode, useEffect, useMemo } from 'react'
import { GameRow } from '@/components/games/game-row'
import { PendingGameRow } from '@/components/games/pending-game-row'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { useOnlineStatus, usePageMeta, useStructuredData } from '@/hooks'
import { useOfflineOps, usePendingGames } from '@/hooks/use-offline-games'
import { exportGamesToCSV } from '@/lib/csv-export'
import { shouldRenderAuthenticatedGames } from '@/lib/games-auth-gate'
import { SITE_URL } from '@/lib/site-url'
import { createBreadcrumbStructuredData } from '@/lib/structured-data'
import { seedGameCaches } from '@/lib/sync'

export const Route = createFileRoute('/games/')({
  component: GamesIndex,
})

function GamesEmptyState({
  icon,
  title,
  description,
  action,
  descriptionClassName = 'text-muted-foreground max-w-sm',
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  descriptionClassName?: string
}) {
  return (
    <EmptyState
      action={action}
      description={
        <Text as="p" className={descriptionClassName}>
          {description}
        </Text>
      }
      icon={icon}
      title={
        <Heading as="h2" className="text-xl mb-2" variant="h2">
          {title}
        </Heading>
      }
    />
  )
}

function GamesIndex() {
  usePageMeta({
    title: 'Games',
    description: 'Track your Spirit Island game history and stats.',
    canonicalPath: '/games',
    ogType: 'website',
    robots: 'noindex,follow',
  })

  useStructuredData(
    'ld-breadcrumb',
    createBreadcrumbStructuredData([
      { name: 'Home', item: SITE_URL },
      { name: 'Games', item: `${SITE_URL}/games` },
    ]),
  )

  const { isLoaded, isSignedIn } = useAuth()
  const isOnline = useOnlineStatus()

  if (!shouldRenderAuthenticatedGames({ isLoaded, isOnline, isSignedIn })) {
    return <GamesSignInPrompt />
  }

  return <AuthenticatedGames />
}

function GamesSignInPrompt() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" title="Games" />
      <main className="pb-20">
        <GamesEmptyState
          action={
            <Button asChild>
              <Link params={{ _splat: '' }} to="/sign-in/$">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          }
          description="Sign in to log your Spirit Island games and sync them across devices."
          descriptionClassName="text-muted-foreground mb-6 max-w-sm"
          icon={<Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />}
          title="Track your games"
        />
      </main>
    </div>
  )
}

function AuthenticatedGames() {
  const { data: games, isPending } = useQuery(convexQuery(api.games.listGames, {}))
  const snapshot = usePublicSnapshot()
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
          return { ...g, ...update.data }
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
          <Button
            disabled={!snapshot}
            onClick={() => exportGamesToCSV(games, snapshot)}
            size="sm"
            variant="outline"
          >
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
        {!isOnline && !games && pendingGames.length === 0 ? (
          <GamesEmptyState
            description="Visit this page while online to cache your games for offline access."
            descriptionClassName="text-muted-foreground mb-6 max-w-sm"
            icon={<WifiOff className="h-16 w-16 text-muted-foreground mb-4" />}
            title="Games unavailable offline"
          />
        ) : isPending && !games ? (
          <GamesEmptyState
            description="Fetching your latest game data."
            icon={
              <LoaderCircle
                aria-hidden
                className="h-10 w-10 text-muted-foreground mb-4 animate-spin"
              />
            }
            title="Loading games"
          />
        ) : !hasGames ? (
          <GamesEmptyState
            description="Start tracking your Spirit Island games to see your history and stats."
            descriptionClassName="text-muted-foreground mb-6 max-w-sm"
            icon={<Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />}
            title="No games recorded yet"
          />
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
