import { Link } from '@tanstack/react-router'
import type { Doc } from 'convex/_generated/dataModel'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface GameRowProps {
  game: Doc<'games'>
}

export function GameRow({ game }: GameRowProps) {
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
  const adversaryDisplay = game.adversary ? `${game.adversary.name} L${game.adversary.level}` : null

  return (
    <Link
      className="flex items-center gap-3 p-3 cursor-default hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
      params={{ id: game._id }}
      to="/games/$id"
    >
      {/* Date column */}
      <div className="w-24 shrink-0 text-sm text-muted-foreground">{dateStr}</div>

      {/* Spirit info - grows to fill */}
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium">
          {spiritDisplay}
          {moreSpirits && <span className="text-muted-foreground font-normal">{moreSpirits}</span>}
        </div>
        {adversaryDisplay && (
          <div className="text-sm text-muted-foreground truncate">vs {adversaryDisplay}</div>
        )}
      </div>

      {/* Result badge */}
      <Badge variant={game.result === 'win' ? 'default' : 'secondary'}>
        {game.result === 'win' ? 'Win' : 'Loss'}
      </Badge>
    </Link>
  )
}
