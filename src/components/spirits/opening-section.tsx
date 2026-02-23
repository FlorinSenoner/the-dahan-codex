import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Doc, Id } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { BookOpen, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { EditableOpening, type OpeningFormData } from '@/components/admin/editable-opening'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heading, Text } from '@/components/ui/typography'
import { useEditMode } from '@/hooks/use-edit-mode'
import {
  publicSnapshotQueryKey,
  publicSnapshotQueryOptions,
  selectOpeningsBySpirit,
} from '@/lib/public-snapshot'
import { TurnAccordion } from './turn-accordion'

// Helper to create form data from an opening document
function createFormDataFromOpening(opening: Doc<'openings'>): OpeningFormData {
  return {
    name: opening.name,
    description: opening.description || '',
    turns: opening.turns.map((t) => ({
      turn: t.turn,
      title: t.title || '',
      instructions: t.instructions,
    })),
    author: opening.author || '',
    sourceUrl: opening.sourceUrl || '',
  }
}

// Helper to transform turns for save (converts empty strings to undefined)
function transformTurnsForSave(turns: OpeningFormData['turns']) {
  return turns.map((t) => ({
    turn: t.turn,
    title: t.title || undefined,
    instructions: t.instructions,
  }))
}

interface OpeningSectionProps {
  spiritId: Id<'spirits'>
  onSaveHandlerReady?: (saveHandler: (() => Promise<void>) | null) => void
  onHasChangesChange?: (hasChanges: boolean) => void
  onIsValidChange?: (isValid: boolean) => void
}

// Design: Each spirit (base or aspect) queries openings by its own _id.
// Aspects never inherit openings from their base spirit.
export function OpeningSection({
  spiritId,
  onSaveHandlerReady,
  onHasChangesChange,
  onIsValidChange,
}: OpeningSectionProps) {
  const { isEditing } = useEditMode()
  const queryClient = useQueryClient()

  const { data: snapshot } = useQuery(publicSnapshotQueryOptions())
  const openings = useMemo(
    () => (snapshot ? selectOpeningsBySpirit(snapshot, spiritId) : undefined),
    [snapshot, spiritId],
  )
  const isLoading = !snapshot

  // URL-synced tab selection
  const search = useSearch({ strict: false }) as { opening?: string }
  const navigate = useNavigate()
  const openingParam = search.opening

  // Convex mutations
  const createOpeningMutation = useMutation(api.openings.createOpening)
  const updateOpeningMutation = useMutation(api.openings.updateOpening)
  const deleteOpeningMutation = useMutation(api.openings.deleteOpening)

  // Find selected opening from URL or default to first
  const selectedOpening = useMemo(() => {
    if (!openings || openings.length === 0) return null
    if (openingParam) {
      const found = openings.find((o) => o._id === openingParam)
      if (found) return found
    }
    return openings[0]
  }, [openings, openingParam])

  // Form data state for edit mode
  const [formData, setFormData] = useState<OpeningFormData | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [_isSaving, setIsSaving] = useState(false)

  // Handle tab change - update URL
  // resetScroll: false prevents TanStack Router from scrolling to top on URL change
  const handleTabChange = useCallback(
    (openingId: string) => {
      if (openingId === 'new') {
        // Don't update URL for new opening tab, it's handled separately
        return
      }
      navigate({
        search: { ...search, opening: openingId } as never,
        replace: true,
        resetScroll: false,
      })
    },
    [navigate, search],
  )

  // Create empty form data for new opening
  const createEmptyFormData = useCallback((): OpeningFormData => {
    return {
      name: '',
      description: '',
      turns: [{ turn: 1, title: '', instructions: '' }],
      author: '',
      sourceUrl: '',
    }
  }, [])

  // Initialize form data from selected opening when entering edit mode
  useEffect(() => {
    if (isEditing && selectedOpening && !isCreatingNew) {
      setFormData(createFormDataFromOpening(selectedOpening))
    } else if (!isEditing) {
      // Reset form data when exiting edit mode
      setFormData(null)
      setIsCreatingNew(false)
    }
  }, [isEditing, selectedOpening, isCreatingNew])

  // Calculate if form is valid (all required fields filled)
  const isValid = useMemo(() => {
    if (!formData) return false
    if (!formData.name.trim()) return false
    if (formData.turns.length === 0) return false
    for (const turn of formData.turns) {
      if (!turn.title?.trim()) return false
      if (!turn.instructions.trim()) return false
    }
    return true
  }, [formData])

  // Calculate if there are changes
  const hasChanges = useMemo(() => {
    if (!formData) return false

    // New opening - has changes if name is filled
    if (isCreatingNew) {
      return formData.name.trim().length > 0
    }

    // Existing opening - compare with original
    if (!selectedOpening) return false

    if (formData.name !== selectedOpening.name) return true
    if (formData.description !== (selectedOpening.description || '')) return true
    if (formData.author !== (selectedOpening.author || '')) return true
    if (formData.sourceUrl !== (selectedOpening.sourceUrl || '')) return true
    if (formData.turns.length !== selectedOpening.turns.length) return true

    for (let i = 0; i < formData.turns.length; i++) {
      const formTurn = formData.turns[i]
      const origTurn = selectedOpening.turns[i]
      if (formTurn.turn !== origTurn.turn) return true
      if (formTurn.title !== (origTurn.title || '')) return true
      if (formTurn.instructions !== origTurn.instructions) return true
    }

    return false
  }, [formData, selectedOpening, isCreatingNew])

  // Notify parent of changes
  useEffect(() => {
    onHasChangesChange?.(hasChanges)
  }, [hasChanges, onHasChangesChange])

  // Notify parent of validity changes
  useEffect(() => {
    onIsValidChange?.(isValid)
  }, [isValid, onIsValidChange])

  // Save handler for creating or updating opening
  const handleSave = useCallback(async () => {
    if (!formData) return
    setIsSaving(true)
    try {
      if (isCreatingNew) {
        const newId = await createOpeningMutation({
          spiritId,
          name: formData.name,
          description: formData.description || undefined,
          turns: transformTurnsForSave(formData.turns),
          author: formData.author || undefined,
          sourceUrl: formData.sourceUrl || undefined,
        })
        // Navigate to the newly created opening
        // resetScroll: false prevents scroll jump when updating URL
        navigate({
          search: { ...search, opening: newId } as never,
          replace: true,
          resetScroll: false,
        })
      } else if (selectedOpening) {
        await updateOpeningMutation({
          id: selectedOpening._id,
          name: formData.name,
          description: formData.description || undefined,
          turns: transformTurnsForSave(formData.turns),
          author: formData.author || undefined,
          sourceUrl: formData.sourceUrl || undefined,
        })
      }
      await queryClient.invalidateQueries({ queryKey: publicSnapshotQueryKey() })
      // Data will refresh via query invalidation
      setIsCreatingNew(false)
      // Reset form state to trigger re-initialization from query data.
      // Setting formData to null causes the useEffect (lines ~91-109) to detect
      // that formData is null while selectedOpening exists, which re-initializes
      // formData from the query-refetched selectedOpening. This ensures hasChanges
      // becomes false (since formData will match the saved data) and prevents
      // false "unsaved changes" warnings after save.
      if (!isCreatingNew && selectedOpening) {
        setFormData(null)
      }
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [
    formData,
    isCreatingNew,
    spiritId,
    selectedOpening,
    createOpeningMutation,
    updateOpeningMutation,
    queryClient,
    navigate,
    search,
  ])

  // Delete handler for removing opening
  const handleDelete = useCallback(async () => {
    if (!selectedOpening) return
    try {
      await deleteOpeningMutation({ id: selectedOpening._id })
      await queryClient.invalidateQueries({ queryKey: publicSnapshotQueryKey() })
      // Clear URL opening param to go back to first opening, but preserve edit mode
      // resetScroll: false prevents scroll jump when updating URL
      navigate({
        search: { ...search, opening: undefined } as never,
        replace: true,
        resetScroll: false,
      })
      setFormData(null)
      setIsCreatingNew(false)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }, [selectedOpening, deleteOpeningMutation, queryClient, navigate, search])

  // Expose save handler to parent when there are changes (isValid controls disabled state in EditFab)
  useEffect(() => {
    onSaveHandlerReady?.(formData && hasChanges ? handleSave : null)
  }, [formData, hasChanges, handleSave, onSaveHandlerReady])

  // Handle form data change
  const handleFormDataChange = useCallback((data: OpeningFormData) => {
    setFormData(data)
  }, [])

  // Handle creating new opening
  const handleCreateNew = useCallback(() => {
    setIsCreatingNew(true)
    setFormData(createEmptyFormData())
  }, [createEmptyFormData])

  // Cancel creating new opening
  const handleCancelNew = useCallback(() => {
    setIsCreatingNew(false)
    setFormData(null)
    // Re-initialize form data for selected opening
    if (selectedOpening) {
      setFormData(createFormDataFromOpening(selectedOpening))
    }
  }, [selectedOpening])

  // Render opening content (shared between tabs and single opening display)
  const renderOpeningContent = (opening: Doc<'openings'>) => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <Heading as="h3" variant="h3">
        {opening.name}
      </Heading>

      {opening.description && <Text variant="muted">{opening.description}</Text>}

      <TurnAccordion turns={opening.turns} />

      {(opening.author || opening.sourceUrl) && (
        <div className="pt-2 border-t border-border text-xs text-muted-foreground">
          {opening.author && <span>By {opening.author}</span>}
          {opening.author && opening.sourceUrl && <span> · </span>}
          {opening.sourceUrl && (
            <a
              className="text-primary hover:underline"
              href={opening.sourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Source
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      )}
    </div>
  )

  // Render opening editor
  const renderOpeningEditor = (
    opening: Doc<'openings'> | null,
    isNew: boolean,
    data: OpeningFormData,
  ) => (
    <EditableOpening
      formData={data}
      isNew={isNew}
      onChange={handleFormDataChange}
      onDelete={isNew ? handleCancelNew : handleDelete}
      opening={opening}
    />
  )

  // Render content based on state
  // Use single section wrapper to prevent layout shifts when toggling edit mode
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return <div className="animate-pulse bg-muted/30 rounded-lg h-32" />
    }

    const hasOpenings = openings && openings.length > 0

    // Edit mode
    if (isEditing) {
      // Creating new opening
      if (isCreatingNew) {
        return (
          <div className="space-y-4">
            {hasOpenings && (
              <div className="flex flex-wrap gap-2">
                {openings.map((o) => (
                  <Button
                    className="opacity-50"
                    key={o._id}
                    onClick={() => {
                      handleCancelNew()
                      handleTabChange(o._id)
                    }}
                    size="sm"
                    variant="outline"
                  >
                    {o.name}
                  </Button>
                ))}
                <Button disabled size="sm" variant="default">
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </div>
            )}
            {formData && renderOpeningEditor(null, true, formData)}
          </div>
        )
      }

      // Has openings - show tabs with editor
      if (hasOpenings && selectedOpening && formData) {
        return (
          <Tabs className="space-y-4" onValueChange={handleTabChange} value={selectedOpening._id}>
            <div className="flex items-center gap-2">
              <div className="overflow-x-auto flex-1 -mx-4 px-4">
                <TabsList variant="line">
                  {openings.map((o) => (
                    <TabsTrigger key={o._id} value={o._id}>
                      {o.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <Button
                className="h-8 flex-shrink-0"
                onClick={handleCreateNew}
                size="sm"
                variant="outline"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Opening
              </Button>
            </div>
            {openings.map((o) => (
              <TabsContent key={o._id} value={o._id}>
                {o._id === selectedOpening._id
                  ? renderOpeningEditor(o, false, formData)
                  : renderOpeningContent(o)}
              </TabsContent>
            ))}
          </Tabs>
        )
      }

      // No openings - show create button
      return (
        <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
          <Text className="mb-4" variant="muted">
            No openings yet for this spirit.
          </Text>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Opening
          </Button>
        </div>
      )
    }

    // Read-only mode: no content if no openings exist
    if (!hasOpenings) {
      return null
    }

    // Read-only mode with multiple openings - show tabs
    if (openings.length > 1 && selectedOpening) {
      return (
        <Tabs className="space-y-4" onValueChange={handleTabChange} value={selectedOpening._id}>
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList variant="line">
              {openings.map((o) => (
                <TabsTrigger key={o._id} value={o._id}>
                  {o.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {openings.map((o) => (
            <TabsContent key={o._id} value={o._id}>
              {renderOpeningContent(o)}
            </TabsContent>
          ))}
        </Tabs>
      )
    }

    // Read-only mode with single opening - show without tabs
    if (selectedOpening) {
      return renderOpeningContent(selectedOpening)
    }

    return null
  }

  const content = renderContent()

  // In read-only mode with no openings, don't render the section at all
  // But always render when editing (to show create button) or loading
  if (!isEditing && !isLoading && (!openings || openings.length === 0)) {
    return null
  }

  return (
    <section className="space-y-4">
      <Heading as="h2" className="flex items-center gap-2" variant="h2">
        <BookOpen className="h-5 w-5" />
        Openings
      </Heading>
      {content}
    </section>
  )
}
