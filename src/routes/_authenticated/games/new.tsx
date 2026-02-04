import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { toast } from 'sonner'
import { GameForm, type GameFormData } from '@/components/games/game-form'
import { PageHeader } from '@/components/ui/page-header'
import { useOnlineStatus } from '@/hooks'
import { usePendingGames } from '@/hooks/use-offline-games'
import { transformGameFormToPayload } from '@/lib/game-form-utils'

export const Route = createFileRoute('/_authenticated/games/new')({
  component: NewGamePage,
})

function NewGamePage() {
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()
  const { saveOfflineGame } = usePendingGames()

  const createGame = useMutation({
    mutationFn: useConvexMutation(api.games.createGame),
    onSuccess: () => {
      navigate({ to: '/games' })
    },
    onError: (error) => {
      toast.error(`Failed to save game: ${error.message}`)
    },
  })

  const handleSubmit = async (data: GameFormData) => {
    // Filter out spirits without a spiritId selected (new games require picking from dropdown)
    const hasValidSpirits = data.spirits.some((s) => s.spiritId !== null)
    if (!hasValidSpirits) {
      toast.error('Please select at least one spirit')
      return
    }

    if (!isOnline) {
      await saveOfflineGame(data)
      toast.success('Game saved offline. Will sync when you reconnect.')
      navigate({ to: '/games' })
      return
    }

    await createGame.mutateAsync(transformGameFormToPayload(data))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/games" title="New Game" />
      <GameForm
        isSubmitting={createGame.isPending}
        onSubmit={handleSubmit}
        submitLabel={isOnline ? 'Log Game' : 'Save Offline'}
      />
    </div>
  )
}
