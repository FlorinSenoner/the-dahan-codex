import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { GameForm, type GameFormData } from "@/components/games/game-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export const Route = createFileRoute("/_authenticated/games/$id")({
  component: GameDetailPage,
});

/**
 * Display score calculation breakdown
 * Victory: (5 x Difficulty) + 10 + (2 x cards) + (dahan / players) - (blight / players)
 * Defeat: (2 x Difficulty) + cards used + (dahan / players) - (blight / players)
 */
function ScoreBreakdown({
  game,
}: {
  game: {
    result: "win" | "loss";
    spirits: unknown[];
    adversary?: { level: number } | null;
    secondaryAdversary?: { level: number } | null;
    scenario?: { difficulty?: number } | null;
    cardsRemaining?: number;
    dahanCount?: number;
    blightCount?: number;
  };
}) {
  const playerCount = game.spirits.length || 1;
  const difficulty =
    (game.adversary?.level ?? 0) +
    (game.secondaryAdversary?.level ?? 0) +
    (game.scenario?.difficulty ?? 0);

  const cards = game.cardsRemaining ?? 0;
  const dahan = game.dahanCount ?? 0;
  const blight = game.blightCount ?? 0;

  const dahanScore = Math.floor(dahan / playerCount);
  const blightPenalty = Math.floor(blight / playerCount);

  if (game.result === "win") {
    // Victory: (5 x Difficulty) + 10 + (2 x cards) + dahanScore - blightPenalty
    const diffPart = 5 * difficulty;
    const cardsPart = 2 * cards;

    const parts: string[] = [];
    if (diffPart > 0) parts.push(`${diffPart}`);
    parts.push("10");
    if (cardsPart > 0) parts.push(`${cardsPart}`);
    if (dahanScore > 0) parts.push(`${dahanScore}`);

    let formula = parts.join(" + ");
    if (blightPenalty > 0) formula += ` − ${blightPenalty}`;

    return <p className="text-sm text-muted-foreground">= {formula}</p>;
  }

  // Defeat: (2 x Difficulty) + cards used + dahanScore - blightPenalty
  const diffPart = 2 * difficulty;
  const cardsUsed = 12 - cards;

  const parts: string[] = [];
  if (diffPart > 0) parts.push(`${diffPart}`);
  if (cardsUsed > 0) parts.push(`${cardsUsed}`);
  if (dahanScore > 0) parts.push(`${dahanScore}`);

  let formula = parts.length > 0 ? parts.join(" + ") : "0";
  if (blightPenalty > 0) formula += ` − ${blightPenalty}`;

  return <p className="text-sm text-muted-foreground">= {formula}</p>;
}

function GameDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

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

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Game Not Found" backHref="/games" />
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Game not found</p>
          <Button variant="link" asChild>
            <Link to="/games">Back to Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await deleteGameMutation.mutateAsync({ id: game._id });
    navigate({ to: "/games" });
    toast.success("Game deleted");
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
      scenario: data.scenario ?? undefined,
      winType: data.winType || undefined,
      invaderStage: data.invaderStage,
      blightCount: data.blightCount,
      dahanCount: data.dahanCount,
      cardsRemaining: data.cardsRemaining,
      score: data.score,
      notes: data.notes || undefined,
    });
  };

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
    winType: game.winType ?? "",
    invaderStage: game.invaderStage,
    blightCount: game.blightCount,
    dahanCount: game.dahanCount,
    cardsRemaining: game.cardsRemaining,
    score: game.score,
    notes: game.notes ?? "",
  };

  const dateStr = format(new Date(game.date), "MMMM d, yyyy");

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Edit Game" backHref="/games" />

        <GameForm
          initialData={formInitialData}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save Changes"
          isSubmitting={updateGame.isPending}
        />
      </div>
    );
  }

  // Helper to convert invader stage to Roman numerals
  const stageToRoman = (stage: number) => {
    const romans = ["I", "II", "III"];
    return romans[stage - 1] || stage.toString();
  };

  // Check if we have any stats to show
  const hasStats =
    game.blightCount !== undefined ||
    game.dahanCount !== undefined ||
    game.cardsRemaining !== undefined ||
    game.invaderStage !== undefined;

  // View mode
  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title={dateStr} backHref="/games" />

      <div className="p-4 space-y-6">
        {/* Result Badge - top left with win/loss type inline */}
        <div className="flex items-center gap-2">
          <Badge
            variant={game.result === "win" ? "default" : "secondary"}
            className="text-base px-3 py-1"
          >
            {game.result === "win" ? "Victory" : "Defeat"}
          </Badge>
          {game.winType && (
            <span className="text-muted-foreground">- {game.winType}</span>
          )}
        </div>

        {/* Spirits */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Spirits
          </h3>
          <div className="space-y-2">
            {game.spirits.map((spirit, idx) => (
              <div
                key={spirit.spiritId ?? `spirit-${idx}`}
                className="flex items-center gap-2"
              >
                <span className="font-medium">
                  {spirit.variant
                    ? `${spirit.name} (${spirit.variant})`
                    : spirit.name}
                </span>
                {spirit.player && (
                  <span className="text-muted-foreground">
                    — {spirit.player}
                  </span>
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
              {game.secondaryAdversary.name} Level{" "}
              {game.secondaryAdversary.level}
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
              {game.scenario.difficulty !== undefined &&
                ` (+${game.scenario.difficulty})`}
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
                  <p className="text-2xl font-bold">
                    {stageToRoman(game.invaderStage)}
                  </p>
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
            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-bold">{game.score}</p>
              <ScoreBreakdown game={game} />
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
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the game from {dateStr}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
