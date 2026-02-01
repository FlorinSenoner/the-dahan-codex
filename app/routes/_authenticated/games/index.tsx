import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Download, Gamepad2, Plus, Upload } from "lucide-react";
import { GameRow } from "@/components/games/game-row";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { exportGamesToCSV } from "@/lib/csv-export";

export const Route = createFileRoute("/_authenticated/games/")({
  component: GamesIndex,
});

function GamesIndex() {
  const { data: games } = useSuspenseQuery(
    convexQuery(api.games.listGames, {}),
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Games" backHref="/">
        <Button asChild variant="outline" size="sm">
          <Link to="/games/import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Link>
        </Button>
        {games.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportGamesToCSV(games)}
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
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              No games recorded yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start tracking your Spirit Island games to see your history and
              stats.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {games.map((game) => (
              <GameRow key={game._id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
