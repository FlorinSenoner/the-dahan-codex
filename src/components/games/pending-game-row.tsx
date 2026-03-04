import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import type { PendingGame } from '@/lib/offline-games'
import { GameSummary } from './game-summary'

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    className: 'border-element-sun text-element-sun',
  },
  syncing: {
    label: 'Syncing',
    variant: 'outline' as const,
    className: 'border-element-water text-element-water',
  },
  failed: {
    label: 'Failed',
    variant: 'outline' as const,
    className: 'border-element-animal text-element-animal',
  },
}

interface PendingGameRowProps {
  game: PendingGame
}

export function PendingGameRow({ game }: PendingGameRowProps) {
  const { formData, syncStatus } = game
  const dateStr = format(new Date(formData.date), 'MMM d, yyyy')
  const status = statusConfig[syncStatus]

  const spirit = formData.spirits[0]
  const spiritDisplay = spirit
    ? spirit.variant
      ? `${spirit.name} (${spirit.variant})`
      : spirit.name || 'Unknown Spirit'
    : 'Unknown Spirit'
  const moreSpirits = formData.spirits.length > 1 ? ` +${formData.spirits.length - 1} more` : ''

  const adversaryDisplay = formData.adversary
    ? `${formData.adversary.name} L${formData.adversary.level}`
    : null

  return (
    <div className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 bg-muted/30">
      <div className="w-24 shrink-0 text-sm text-muted-foreground">{dateStr}</div>
      <GameSummary
        adversaryDisplay={adversaryDisplay}
        moreSpirits={moreSpirits}
        spiritDisplay={spiritDisplay}
      />
      <Badge className={status.className} variant={status.variant}>
        {status.label}
      </Badge>
    </div>
  )
}
