import { AlertCircle, CheckCircle, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ValidatedGame } from "@/lib/csv-import";

interface CSVPreviewProps {
  games: ValidatedGame[];
}

export function CSVPreview({ games }: CSVPreviewProps) {
  const validCount = games.filter((g) => g.isValid).length;
  const invalidCount = games.length - validCount;
  const newCount = games.filter((g) => g.isValid && g.isNew).length;
  const updateCount = games.filter((g) => g.isValid && !g.isNew).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          {games.length} games in file
        </span>
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
          <Badge variant="secondary" className="gap-1">
            <Plus className="h-3 w-3" />
            {newCount} new
          </Badge>
        )}
        {updateCount > 0 && (
          <Badge variant="secondary" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            {updateCount} updates
          </Badge>
        )}
      </div>

      {/* Game list */}
      <div className="border rounded-lg divide-y max-h-96 overflow-auto">
        {games.map((game, i) => (
          <div
            key={game.row.id || `${game.row.date}-${game.row.spirit1}-${i}`}
            className={`p-3 ${!game.isValid ? "bg-destructive/10" : ""}`}
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
                    : "No adversary"}
                  {" • "}
                  {game.row.result === "win" ? "Win" : "Loss"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {game.isNew ? (
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Update
                  </Badge>
                )}
                {!game.isValid && (
                  <Badge variant="destructive" className="text-xs">
                    Invalid
                  </Badge>
                )}
              </div>
            </div>
            {game.errors.length > 0 && (
              <div className="mt-2 text-sm text-destructive">
                {game.errors.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
