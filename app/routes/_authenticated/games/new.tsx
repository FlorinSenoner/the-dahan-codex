import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { GameForm, type GameFormData } from "@/components/games/game-form";
import { PageHeader } from "@/components/ui/page-header";

export const Route = createFileRoute("/_authenticated/games/new")({
  component: NewGamePage,
});

function NewGamePage() {
  const navigate = useNavigate();

  const createGame = useMutation({
    mutationFn: useConvexMutation(api.games.createGame),
    onSuccess: () => {
      navigate({ to: "/games" });
    },
    onError: (error) => {
      toast.error(`Failed to save game: ${error.message}`);
    },
  });

  const handleSubmit = async (data: GameFormData) => {
    // Filter out spirits without a spiritId selected (new games require picking from dropdown)
    const validSpirits = data.spirits.filter(
      (s): s is typeof s & { spiritId: NonNullable<typeof s.spiritId> } =>
        s.spiritId !== null,
    );

    if (validSpirits.length === 0) {
      toast.error("Please select at least one spirit");
      return;
    }

    await createGame.mutateAsync({
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="New Game" backHref="/games" />
      <GameForm
        onSubmit={handleSubmit}
        submitLabel="Log Game"
        isSubmitting={createGame.isPending}
      />
    </div>
  );
}
