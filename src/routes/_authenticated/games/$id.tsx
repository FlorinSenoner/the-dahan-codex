import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
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
import { transformGameFormToPayload } from '@/lib/game-form-utils'

export const Route = createFileRoute('/_authenticated/games/$id')({
  component: GameDetailPage,
})

function GameDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const { data: game } = useSuspenseQuery(convexQuery(api.games.getGame, { id: id as Id<'games'> }))

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

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/games" title="Game Not Found" />
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Game not found</p>
          <Button asChild variant="link">
            <Link to="/games">Back to Games</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    await deleteGameMutation.mutateAsync({ id: game._id })
    navigate({ to: '/games' })
  }

  const handleSubmit = async (data: GameFormData) => {
    await updateGame.mutateAsync({
      id: game._id,
      ...transformGameFormToPayload(data),
    })
  }

  // Transform game data to form data for editing
  const formInitialData: Partial<GameFormData> = {
    date: game.date,
    result: game.result,
    spirits: game.spirits.map((s) => ({
      spiritId: s.spiritId ?? null,
      name: s.name,
      variant: s.variant,
      player: s.player,
    })),
    adversary: game.adversary ?? null,
    secondaryAdversary: game.secondaryAdversary ?? null,
    scenario: game.scenario ?? null,
    winType: game.winType ?? '',
    invaderStage: game.invaderStage,
    blightCount: game.blightCount,
    dahanCount: game.dahanCount,
    cardsRemaining: game.cardsRemaining,
    score: game.score,
    notes: game.notes ?? '',
  }

  const dateStr = format(new Date(game.date), 'MMMM d, yyyy')

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
    game.blightCount !== undefined ||
    game.dahanCount !== undefined ||
    game.cardsRemaining !== undefined ||
    game.invaderStage !== undefined

  // View mode
  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader backHref="/games" title={dateStr} />

      <div className="p-4 space-y-6">
        {/* Result Badge - top left with win/loss type inline */}
        <div className="flex items-center gap-2">
          <Badge
            className="text-base px-3 py-1"
            variant={game.result === 'win' ? 'default' : 'secondary'}
          >
            {game.result === 'win' ? 'Victory' : 'Defeat'}
          </Badge>
          {game.winType && <span className="text-muted-foreground">- {game.winType}</span>}
        </div>

        {/* Spirits */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Spirits
          </h3>
          <div className="space-y-2">
            {game.spirits.map((spirit, idx) => (
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
        {game.adversary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Adversary
            </h3>
            <p>
              {game.adversary.name} Level {game.adversary.level}
            </p>
          </div>
        )}

        {/* Secondary Adversary */}
        {game.secondaryAdversary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Secondary Adversary
            </h3>
            <p>
              {game.secondaryAdversary.name} Level {game.secondaryAdversary.level}
            </p>
          </div>
        )}

        {/* Scenario */}
        {game.scenario && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Scenario
            </h3>
            <p>
              {game.scenario.name}
              {game.scenario.difficulty !== undefined && ` (+${game.scenario.difficulty})`}
            </p>
          </div>
        )}

        {/* Game Stats - order: Stage, Cards Left, Blight, Dahan */}
        {hasStats && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Game Stats
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {game.invaderStage !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{stageToRoman(game.invaderStage)}</p>
                  <p className="text-xs text-muted-foreground">Stage</p>
                </div>
              )}
              {game.cardsRemaining !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{game.cardsRemaining}</p>
                  <p className="text-xs text-muted-foreground">Cards Left</p>
                </div>
              )}
              {game.blightCount !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{game.blightCount}</p>
                  <p className="text-xs text-muted-foreground">Blight</p>
                </div>
              )}
              {game.dahanCount !== undefined && (
                <div>
                  <p className="text-2xl font-bold">{game.dahanCount}</p>
                  <p className="text-xs text-muted-foreground">Dahan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score with calculation breakdown */}
        {game.score !== undefined && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Score
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold">{game.score}</p>
              <GameScoreBreakdown game={game} />
            </div>
          </div>
        )}

        {/* Notes */}
        {game.notes && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Notes
            </h3>
            <p className="whitespace-pre-wrap">{game.notes}</p>
          </div>
        )}
      </div>

      {/* Edit and Delete buttons at bottom */}
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
