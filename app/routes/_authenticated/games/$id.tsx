import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { format } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { GameForm, type GameFormData } from "@/components/games/game-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/games/$id")({
  component: GameDetailPage,
});

function GameDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: game } = useSuspenseQuery(
    convexQuery(api.games.getGame, { id: id as Id<"games"> }),
  );

  const updateGame = useMutation({
    mutationFn: useConvexMutation(api.games.updateGame),
    onSuccess: () => {
      toast.success("Game updated!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: useConvexMutation(api.games.deleteGame),
  });

  const restoreGameMutation = useMutation({
    mutationFn: useConvexMutation(api.games.restoreGame),
  });

  if (!game) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Game not found</p>
        <Button variant="link" onClick={() => navigate({ to: "/games" })}>
          Back to Games
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    const gameId = game._id;
    await deleteGameMutation.mutateAsync({ id: gameId });
    navigate({ to: "/games" });
    toast("Game deleted", {
      action: {
        label: "Undo",
        onClick: async () => {
          await restoreGameMutation.mutateAsync({ id: gameId });
          toast.success("Game restored!");
        },
      },
      duration: 5000,
    });
  };

  const handleSubmit = async (data: GameFormData) => {
    const validSpirits = data.spirits.filter(
      (s): s is typeof s & { spiritId: Id<"spirits"> } => s.spiritId !== null,
    );

    await updateGame.mutateAsync({
      id: game._id,
      date: data.date,
      result: data.result,
      spirits: validSpirits.map((s) => ({
        spiritId: s.spiritId,
        name: s.name,
        variant: s.variant,
        player: s.player,
      })),
      adversary: data.adversary ?? undefined,
      secondaryAdversary: data.secondaryAdversary ?? undefined,
      notes: data.notes || undefined,
    });
  };

  // Transform game data to form data for editing
  const formInitialData: Partial<GameFormData> = {
    date: game.date,
    result: game.result,
    spirits: game.spirits.map((s) => ({
      spiritId: s.spiritId,
      name: s.name,
      variant: s.variant,
      player: s.player,
    })),
    adversary: game.adversary ?? null,
    secondaryAdversary: game.secondaryAdversary ?? null,
    notes: game.notes ?? "",
  };

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="font-semibold">Edit Game</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <GameForm
          initialData={formInitialData}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isSubmitting={updateGame.isPending}
        />
      </div>
    );
  }

  // View mode
  const dateStr = format(new Date(game.date), "MMMM d, yyyy");

  return (
    <div className="p-4 space-y-6">
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Date and Result */}
      <div className="flex items-center justify-between">
        <span className="text-lg">{dateStr}</span>
        <Badge
          variant={game.result === "win" ? "default" : "secondary"}
          className="text-base px-3 py-1"
        >
          {game.result === "win" ? "Victory" : "Defeat"}
        </Badge>
      </div>

      {/* Spirits */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Spirits
        </h3>
        <div className="space-y-2">
          {game.spirits.map((spirit) => (
            <div key={spirit.spiritId} className="flex items-center gap-2">
              <span className="font-medium">
                {spirit.variant
                  ? `${spirit.name} (${spirit.variant})`
                  : spirit.name}
              </span>
              {spirit.player && (
                <span className="text-muted-foreground">— {spirit.player}</span>
              )}
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

      {/* Score */}
      {game.score !== undefined && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Score
          </h3>
          <p className="text-2xl font-bold">{game.score}</p>
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
  );
}
