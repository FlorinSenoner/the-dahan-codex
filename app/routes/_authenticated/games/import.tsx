import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { CSVPreview } from "@/components/games/csv-preview";
import { Button } from "@/components/ui/button";
import {
  parseGamesCSV,
  rowToGameData,
  type ValidatedGame,
  validateParsedGame,
} from "@/lib/csv-import";

export const Route = createFileRoute("/_authenticated/games/import")({
  component: ImportPage,
});

function ImportPage() {
  const navigate = useNavigate();
  const [validatedGames, setValidatedGames] = React.useState<
    ValidatedGame[] | null
  >(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get existing game IDs for validation
  const { data: existingGames } = useSuspenseQuery(
    convexQuery(api.games.listGames, {}),
  );
  const existingIds = new Set(existingGames.map((g) => g._id));

  const importGamesMutation = useConvexMutation(api.games.importGames);
  const importGames = useMutation({
    mutationFn: importGamesMutation,
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseGamesCSV(file);
      const validated = rows.map((row) => validateParsedGame(row, existingIds));
      setValidatedGames(validated);
    } catch (error) {
      toast.error(
        `Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleImport = async () => {
    if (!validatedGames) return;

    const validGames = validatedGames
      .filter((g) => g.isValid)
      .map((g) => rowToGameData(g.row));

    if (validGames.length === 0) {
      toast.error("No valid games to import");
      return;
    }

    const result = await importGames.mutateAsync({ games: validGames });
    toast.success(
      `Imported ${result.created} new, updated ${result.updated} existing`,
    );
    navigate({ to: "/games" });
  };

  const validCount = validatedGames?.filter((g) => g.isValid).length ?? 0;

  return (
    <div className="p-4 space-y-6">
      {/* Back link */}
      <Link
        to="/games"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Games
      </Link>

      <h2 className="text-xl font-semibold">Import Games from CSV</h2>

      <p className="text-muted-foreground">
        Upload a CSV file exported from The Dahan Codex or a compatible format.
        Games with matching IDs will be replaced; new IDs will create new games.
      </p>

      {/* File upload */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Select CSV File
        </Button>
      </div>

      {/* Preview */}
      {validatedGames && (
        <div className="space-y-4">
          <h3 className="font-semibold">Preview</h3>
          <CSVPreview games={validatedGames} />

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || importGames.isPending}
            >
              {importGames.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${validCount} Game${validCount === 1 ? "" : "s"}`
              )}
            </Button>
            <Button variant="outline" onClick={() => setValidatedGames(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
