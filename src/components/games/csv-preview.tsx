import { AlertCircle, Check, CheckCircle, Plus, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ValidatedGame } from '@/lib/csv-import'

interface CSVPreviewProps {
  games: ValidatedGame[]
}

export function CSVPreview({ games }: CSVPreviewProps) {
  const validCount = games.filter((g) => g.isValid).length
  const invalidCount = games.length - validCount
  const newCount = games.filter((g) => g.isValid && g.isNew).length
  const unchangedCount = games.filter((g) => g.isValid && !g.isNew && g.isUnchanged).length
  const updateCount = games.filter((g) => g.isValid && !g.isNew && !g.isUnchanged).length

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">{games.length} games in file</span>
        {validCount > 0 && (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            {validCount} valid
          </span>
        )}
        {invalidCount > 0 && (
          <span className="text-destructive flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {invalidCount} invalid
          </span>
        )}
      </div>

      {/* Action breakdown */}
      <div className="flex gap-4 text-sm">
        {newCount > 0 && (
          <Badge className="gap-1" variant="secondary">
            <Plus className="h-3 w-3" />
            {newCount} new
          </Badge>
        )}
        {updateCount > 0 && (
          <Badge className="gap-1" variant="secondary">
            <RefreshCw className="h-3 w-3" />
            {updateCount} updates
          </Badge>
        )}
        {unchangedCount > 0 && (
          <Badge className="gap-1" variant="outline">
            <Check className="h-3 w-3" />
            {unchangedCount} unchanged
          </Badge>
        )}
      </div>

      {/* Game list */}
      <div className="border rounded-lg divide-y max-h-96 overflow-auto">
        {games.map((game, i) => (
          <div
            className={`p-3 ${!game.isValid ? 'bg-destructive/10' : ''}`}
            key={game.row.id || `${game.row.date}-${game.row.spirit1}-${i}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {game.row.date} — {game.row.spirit1}
                  {game.row.spirit2 &&
                    ` +${[game.row.spirit2, game.row.spirit3, game.row.spirit4, game.row.spirit5, game.row.spirit6].filter(Boolean).length} more`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {game.row.adversary
                    ? `vs ${game.row.adversary} L${game.row.adversary_level}`
                    : 'No adversary'}
                  {' • '}
                  {game.row.result === 'win' ? 'Win' : 'Loss'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {game.isNew ? (
                  <Badge className="text-xs" variant="outline">
                    New
                  </Badge>
                ) : game.isUnchanged ? (
                  <Badge className="text-xs text-muted-foreground" variant="outline">
                    Unchanged
                  </Badge>
                ) : (
                  <Badge className="text-xs" variant="outline">
                    Update
                  </Badge>
                )}
                {!game.isValid && (
                  <Badge className="text-xs" variant="destructive">
                    Invalid
                  </Badge>
                )}
              </div>
            </div>
            {game.errors.length > 0 && (
              <div className="mt-2 text-sm text-destructive">{game.errors.join(', ')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
