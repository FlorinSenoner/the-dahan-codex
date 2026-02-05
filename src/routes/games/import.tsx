import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useConvexAuth } from 'convex/react'
import { Loader2, Upload } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { CSVPreview } from '@/components/games/csv-preview'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import {
  parseGamesCSV,
  rowToGameData,
  type ValidatedGame,
  validateParsedGame,
} from '@/lib/csv-import'

/** Count of games that will actually be imported (excludes unchanged) */
function getImportableCount(games: ValidatedGame[]): number {
  return games.filter((g) => g.isValid && !g.isUnchanged).length
}

export const Route = createFileRoute('/games/import')({
  component: ImportPage,
})

function ImportPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useConvexAuth()
  const [validatedGames, setValidatedGames] = React.useState<ValidatedGame[] | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Get existing games for validation (used to detect unchanged games)
  const { data: existingGames } = useSuspenseQuery(convexQuery(api.games.listGames, {}))

  const importGamesMutation = useConvexMutation(api.games.importGames)
  const importGames = useMutation({
    mutationFn: importGamesMutation,
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`)
    },
  })

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/games' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const rows = await parseGamesCSV(file)
      const validated = rows.map((row) => validateParsedGame(row, existingGames))
      setValidatedGames(validated)
    } catch (error) {
      toast.error(
        `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  const handleImport = async () => {
    if (!validatedGames) return

    // Only import games that are valid AND have changes (skip unchanged)
    const gamesToImport = validatedGames
      .filter((g) => g.isValid && !g.isUnchanged)
      .map((g) => rowToGameData(g.row))

    if (gamesToImport.length === 0) {
      // All games are unchanged, just navigate back
      navigate({ to: '/games' })
      return
    }

    await importGames.mutateAsync({ games: gamesToImport })
    navigate({ to: '/games' })
  }

  const importableCount = validatedGames ? getImportableCount(validatedGames) : 0

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/games" title="Import Games" />

      <div className="p-4 space-y-6">
        <p className="text-muted-foreground">
          Upload a CSV file exported from The Dahan Codex or a compatible format. Games with
          matching IDs will be replaced; new IDs will create new games.
        </p>

        {/* File upload */}
        <div className="space-y-4">
          <input
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
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
                disabled={importableCount === 0 || importGames.isPending}
                onClick={handleImport}
              >
                {importGames.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : importableCount === 0 ? (
                  'No Changes to Import'
                ) : (
                  `Import ${importableCount} Game${importableCount === 1 ? '' : 's'}`
                )}
              </Button>
              <Button onClick={() => setValidatedGames(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
