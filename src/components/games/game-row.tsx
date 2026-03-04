import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { selectAdversaryById } from '@/lib/reference-selectors'
import type { GameListItem } from '@/types/convex'
import { GameSummary } from './game-summary'

interface GameRowProps {
  game: GameListItem
}

export function GameRow({ game }: GameRowProps) {
  const snapshot = usePublicSnapshot()

  // Format date as "Jan 31, 2026"
  const dateStr = format(new Date(game.date), 'MMM d, yyyy')

  // Get first spirit name (with variant if applicable)
  const spiritDisplay =
    game.spirits.length > 0
      ? game.spirits[0].variant
        ? `${game.spirits[0].name} (${game.spirits[0].variant})`
        : game.spirits[0].name
      : 'Unknown Spirit'

  // Show "+N more" if multiple spirits
  const moreSpirits = game.spirits.length > 1 ? ` +${game.spirits.length - 1} more` : ''

  // Adversary display
  const adversaryName =
    snapshot && game.adversaryRef
      ? selectAdversaryById(snapshot, game.adversaryRef.adversaryId)?.name
      : null
  const adversaryDisplay = game.adversaryRef
    ? `${adversaryName ?? 'Unknown adversary'} L${game.adversaryRef.level}`
    : null

  return (
    <Link
      className="flex items-center gap-3 p-3 cursor-default hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
      params={{ id: game._id }}
      to="/games/$id"
    >
      {/* Date column */}
      <div className="w-24 shrink-0 text-sm text-muted-foreground">{dateStr}</div>

      <GameSummary
        adversaryDisplay={adversaryDisplay}
        moreSpirits={moreSpirits}
        spiritDisplay={spiritDisplay}
      />

      {/* Result badge */}
      <Badge variant={game.result === 'win' ? 'default' : 'secondary'}>
        {game.result === 'win' ? 'Win' : 'Loss'}
      </Badge>
    </Link>
  )
}
