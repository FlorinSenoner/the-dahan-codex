import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Gamepad2, Plus } from "lucide-react";
import { GameRow } from "@/components/games/game-row";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/games/")({
  component: GamesIndex,
});

function GamesIndex() {
  const { data: games } = useSuspenseQuery(
    convexQuery(api.games.listGames, {}),
  );

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No games recorded yet</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Start tracking your Spirit Island games to see your history and stats.
        </p>
        <Button asChild>
          {/* @ts-ignore - Route /games/new will be added in 06-04 */}
          <Link to="/games/new">
            <Plus className="h-4 w-4 mr-2" />
            Log Your First Game
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Action bar */}
      <div className="flex justify-end p-3 border-b border-border">
        <Button asChild size="sm">
          {/* @ts-ignore - Route /games/new will be added in 06-04 */}
          <Link to="/games/new">
            <Plus className="h-4 w-4 mr-2" />
            New Game
          </Link>
        </Button>
      </div>

      {/* Game list */}
      <div className="divide-y divide-border">
        {games.map((game) => (
          <GameRow key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
