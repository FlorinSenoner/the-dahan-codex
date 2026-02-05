import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Doc, Id } from 'convex/_generated/dataModel'
import { useConvexAuth } from 'convex/react'
import { format } from 'date-fns'
import { Pencil, Trash2, WifiOff } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { GameForm, type GameFormData } from '@/components/games/game-form'
import { GameScoreBreakdown } from '@/components/games/score-breakdown'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { useOnlineStatus } from '@/hooks'
import { useOfflineOps } from '@/hooks/use-offline-games'
import { transformGameFormToPayload } from '@/lib/game-form-utils'
import { saveOfflineOp } from '@/lib/offline-games'

export const Route = createFileRoute('/games/$id')({
  component: GameDetailPage,
})

function GameDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const {
    data: game,
    isPending,
    isError,
  } = useQuery(convexQuery(api.games.getGame, { id: id as Id<'games'> }))

  // Fallback: look up game from the cached listGames data
  const { data: gamesList } = useQuery(convexQuery(api.games.listGames, {}))

  const { offlineOps, refreshOps } = useOfflineOps()

  const updateGame = useMutation({
    mutationFn: useConvexMutation(api.games.updateGame),
    onSuccess: () => {
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  })

  const deleteGameMutation = useMutation({
    mutationFn: useConvexMutation(api.games.deleteGame),
  })

  // Resolve game: primary query → list cache fallback → null
  const gameFromList = gamesList?.find((g) => g._id === id)
  const baseGame = game ?? gameFromList ?? null

  // Apply pending outbox operations on top of server data
  const opsForThisGame = offlineOps.filter((op) => op.gameId === id)
  const hasPendingDelete = opsForThisGame.some((op) => op.type === 'delete')
  const pendingUpdate = opsForThisGame.find((op) => op.type === 'update')

  // Redirect if there's a pending delete for this game
  React.useEffect(() => {
    if (hasPendingDelete) {
      navigate({ to: '/games' })
    }
  }, [hasPendingDelete, navigate])

  // Merge outbox update data over server data (cast since shapes match)
  const resolvedGame: Doc<'games'> | null = React.useMemo(() => {
    if (!baseGame) return null
    if (pendingUpdate?.type === 'update') {
      return { ...baseGame, ...pendingUpdate.data } as Doc<'games'>
    }
    return baseGame
  }, [baseGame, pendingUpdate])

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/games' })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (!isAuthenticated) return null

  if (isPending && !resolvedGame) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/games" title="Game" />
      </div>
    )
  }

  if ((isError && !resolvedGame) || (!isPending && !resolvedGame)) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/games" title="Game" />
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Game unavailable offline</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            This game isn't cached yet. It will be available after your next sync.
          </p>
          <Button asChild variant="link">
            <Link to="/games">Back to Games</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!resolvedGame) return null

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    if (!isOnline) {
      await saveOfflineOp({ type: 'delete', gameId: id })
      await refreshOps()
      toast.success('Game deleted.')
      navigate({ to: '/games' })
      return
    }
    await deleteGameMutation.mutateAsync({ id: resolvedGame._id })
    navigate({ to: '/games' })
  }

  const handleSubmit = async (data: GameFormData) => {
    const payload = transformGameFormToPayload(data)
    if (!isOnline) {
      await saveOfflineOp({ type: 'update', gameId: id, data: payload })
      await refreshOps()
      queryClient.setQueryData(convexQuery(api.games.getGame, { id: id as Id<'games'> }).queryKey, {
        ...resolvedGame,
        ...payload,
      })
      setIsEditing(false)
      toast.success('Changes saved. Will sync when you reconnect.')
      return
    }
    await updateGame.mutateAsync({
      id: resolvedGame._id,
      ...payload,
    })
  }

  // Transform game data to form data for editing
  const formInitialData: Partial<GameFormData> = {
    date: resolvedGame.date,
    result: resolvedGame.result,
    spirits: resolvedGame.spirits.map((s) => ({
      spiritId: s.spiritId ?? null,
      name: s.name,
      variant: s.variant,
      player: s.player,
    })),
    adversary: resolvedGame.adversary ?? null,
    secondaryAdversary: resolvedGame.secondaryAdversary ?? null,
    scenario: resolvedGame.scenario ?? null,
    winType: resolvedGame.winType ?? '',
    invaderStage: resolvedGame.invaderStage,
    blightCount: resolvedGame.blightCount,
    dahanCount: resolvedGame.dahanCount,
    cardsRemaining: resolvedGame.cardsRemaining,
    score: resolvedGame.score,
    notes: resolvedGame.notes ?? '',
  }

  const dateStr = format(new Date(resolvedGame.date), 'MMMM d, yyyy')

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader backHref="/games" title="Edit Game" />

        <GameForm
          initialData={formInitialData}
          isSubmitting={updateGame.isPending}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    )
  }

  // Helper to convert invader stage to Roman numerals
  const stageToRoman = (stage: number) => {
    const romans = ['I', 'II', 'III']
    return romans[stage - 1] || stage.toString()
  }

  // Check if we have any stats to show
  const hasStats =
    resolvedGame.blightCount !== undefined ||
    resolvedGame.dahanCount !== undefined ||
    resolvedGame.cardsRemaining !== undefined ||
    resolvedGame.invaderStage !== undefined

  // View mode
  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader backHref="/games" title={dateStr}>
        <div className="flex items-center gap-2">
          {resolvedGame.winType && (
            <span className="text-muted-foreground text-sm">{resolvedGame.winType}</span>
          )}
          <Badge
            className="text-base px-3 py-1"
            variant={resolvedGame.result === 'win' ? 'default' : 'secondary'}
          >
            {resolvedGame.result === 'win' ? 'Victory' : 'Defeat'}
          </Badge>
        </div>
      </PageHeader>

      <div className="p-4 space-y-6">
        {/* Spirits */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Spirits
          </h3>
          <div className="space-y-2">
            {resolvedGame.spirits.map((spirit, idx) => (
              <div className="flex items-center gap-2" key={spirit.spiritId ?? `spirit-${idx}`}>
                <span className="font-medium">
                  {spirit.variant ? `${spirit.name} (${spirit.variant})` : spirit.name}
                </span>
                {spirit.player && <span className="text-muted-foreground">— {spirit.player}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Adversary */}
        {resolvedGame.adversary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Adversary
            </h3>
            <p>
              {resolvedGame.adversary.name} Level {resolvedGame.adversary.level}
            </p>
          </div>
        )}

        {/* Secondary Adversary */}
        {resolvedGame.secondaryAdversary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Secondary Adversary
            </h3>
            <p>
              {resolvedGame.secondaryAdversary.name} Level {resolvedGame.secondaryAdversary.level}
            </p>
          </div>
        )}

        {/* Scenario */}
        {resolvedGame.scenario && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Scenario
            </h3>
            <p>
              {resolvedGame.scenario.name}
              {resolvedGame.scenario.difficulty !== undefined &&
                ` (+${resolvedGame.scenario.difficulty})`}
            </p>
          </div>
        )}

        {/* Game Stats */}
        {hasStats && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Game Stats
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {resolvedGame.invaderStage !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{stageToRoman(resolvedGame.invaderStage)}</p>
                  <p className="text-xs text-muted-foreground">Stage</p>
                </div>
              )}
              {resolvedGame.cardsRemaining !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{resolvedGame.cardsRemaining}</p>
                  <p className="text-xs text-muted-foreground">Cards Left</p>
                </div>
              )}
              {resolvedGame.blightCount !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{resolvedGame.blightCount}</p>
                  <p className="text-xs text-muted-foreground">Blight</p>
                </div>
              )}
              {resolvedGame.dahanCount !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{resolvedGame.dahanCount}</p>
                  <p className="text-xs text-muted-foreground">Dahan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score with calculation breakdown */}
        {resolvedGame.score !== undefined && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Score
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold">{resolvedGame.score}</p>
              <GameScoreBreakdown game={resolvedGame} />
            </div>
          </div>
        )}

        {/* Notes */}
        {resolvedGame.notes && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Notes
            </h3>
            <p className="whitespace-pre-wrap">{resolvedGame.notes}</p>
          </div>
        )}
      </div>

      {/* Edit and Delete buttons at bottom - always visible */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => setIsEditing(true)} variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            className="flex-1"
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog onOpenChange={setShowDeleteConfirm} open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the game from {dateStr}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
