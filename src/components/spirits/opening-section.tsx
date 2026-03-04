import { useNavigate, useSearch } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { BookOpen, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EditableOpening, type OpeningFormData } from '@/components/admin/editable-opening'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heading, Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { useEditMode } from '@/hooks/use-edit-mode'
import { useEditSectionStateSync } from '@/hooks/use-edit-section-state-sync'
import { selectOpeningsBySpiritId } from '@/lib/reference-selectors'
import type { PublicOpening, PublicSpirit } from '@/types/reference'
import { TurnAccordion } from './turn-accordion'

function createFormDataFromOpening(opening: PublicOpening): OpeningFormData {
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

function transformTurnsForSave(turns: OpeningFormData['turns']) {
  return turns.map((t) => ({
    turn: t.turn,
    title: t.title || undefined,
    instructions: t.instructions,
  }))
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function createOpeningDraft(formData: OpeningFormData) {
  return {
    name: formData.name,
    description: formData.description || undefined,
    turns: transformTurnsForSave(formData.turns),
    author: formData.author || undefined,
    sourceUrl: formData.sourceUrl || undefined,
  }
}

function createStoredOpening({
  id,
  spiritId,
  createdAt,
  draft,
}: {
  id: PublicOpening['_id']
  spiritId: PublicSpirit['_id']
  createdAt: number
  draft: ReturnType<typeof createOpeningDraft>
}): PublicOpening {
  return {
    _id: id,
    _creationTime: createdAt,
    spiritId,
    slug: toSlug(draft.name),
    createdAt,
    updatedAt: createdAt,
    ...draft,
  }
}

function sortOpeningsByName(openings: PublicOpening[]) {
  return openings.sort((a, b) => a.name.localeCompare(b.name))
}

function OpeningTabsNavigation({
  openings,
  className,
}: {
  openings: PublicOpening[]
  className?: string
}) {
  return (
    <div className={['overflow-x-auto -mx-4 px-4', className].filter(Boolean).join(' ')}>
      <TabsList variant="line">
        {openings.map((opening) => (
          <TabsTrigger key={opening._id} value={opening._id}>
            {opening.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}

interface OpeningSectionProps {
  spiritId: PublicSpirit['_id']
  onSaveHandlerReady?: (saveHandler: (() => Promise<void>) | null) => void
  onHasChangesChange?: (hasChanges: boolean) => void
  onIsValidChange?: (isValid: boolean) => void
}

export function OpeningSection({
  spiritId,
  onSaveHandlerReady,
  onHasChangesChange,
  onIsValidChange,
}: OpeningSectionProps) {
  const { isEditing } = useEditMode()
  const snapshot = usePublicSnapshot()
  const snapshotOpenings = useMemo(
    () => (snapshot ? selectOpeningsBySpiritId(snapshot, spiritId) : []),
    [snapshot, spiritId],
  )
  const [openings, setOpenings] = useState<PublicOpening[]>(snapshotOpenings)
  const isEditingRef = useRef(isEditing)
  const pendingSnapshotOpeningsRef = useRef<PublicOpening[] | null>(null)
  const hasLocalMutationRef = useRef(false)

  useEffect(() => {
    const wasEditing = isEditingRef.current
    isEditingRef.current = isEditing

    if (!wasEditing && isEditing) {
      hasLocalMutationRef.current = false
      return
    }

    if (wasEditing && !isEditing) {
      if (hasLocalMutationRef.current) {
        pendingSnapshotOpeningsRef.current = null
        hasLocalMutationRef.current = false
        return
      }
      if (!pendingSnapshotOpeningsRef.current) return
      setOpenings(pendingSnapshotOpeningsRef.current)
      pendingSnapshotOpeningsRef.current = null
      hasLocalMutationRef.current = false
    }
  }, [isEditing])

  useEffect(() => {
    if (isEditingRef.current) {
      pendingSnapshotOpeningsRef.current = snapshotOpenings
      return
    }

    pendingSnapshotOpeningsRef.current = null
    hasLocalMutationRef.current = false
    setOpenings(snapshotOpenings)
  }, [snapshotOpenings])

  const search = useSearch({ strict: false }) as { opening?: string }
  const navigate = useNavigate()
  const openingParam = search.opening

  const createOpeningMutation = useMutation(api.openings.createOpening)
  const updateOpeningMutation = useMutation(api.openings.updateOpening)
  const deleteOpeningMutation = useMutation(api.openings.deleteOpening)

  const selectedOpening = useMemo(() => {
    if (!openings || openings.length === 0) return null
    if (openingParam) {
      const found = openings.find((o) => o._id === openingParam)
      if (found) return found
    }
    return openings[0]
  }, [openings, openingParam])

  const [formData, setFormData] = useState<OpeningFormData | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  const handleTabChange = useCallback(
    (openingId: string) => {
      if (openingId === 'new') {
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

  const createEmptyFormData = useCallback((): OpeningFormData => {
    return {
      name: '',
      description: '',
      turns: [{ turn: 1, title: '', instructions: '' }],
      author: '',
      sourceUrl: '',
    }
  }, [])

  useEffect(() => {
    if (isEditing && selectedOpening && !isCreatingNew) {
      setFormData(createFormDataFromOpening(selectedOpening))
    } else if (!isEditing) {
      setFormData(null)
      setIsCreatingNew(false)
    }
  }, [isEditing, selectedOpening, isCreatingNew])

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

  const hasChanges = useMemo(() => {
    if (!formData) return false

    if (isCreatingNew) {
      return formData.name.trim().length > 0
    }

    if (!selectedOpening) return false

    if (formData.name !== selectedOpening.name) return true
    if (formData.description !== (selectedOpening.description || '')) return true
    if (formData.author !== (selectedOpening.author || '')) return true
    if (formData.sourceUrl !== (selectedOpening.sourceUrl || '')) return true
    if (formData.turns.length !== selectedOpening.turns.length) return true

    for (let i = 0; i < formData.turns.length; i++) {
      const formTurn = formData.turns[i]
      const originalTurn = selectedOpening.turns[i]
      if (formTurn.turn !== originalTurn.turn) return true
      if (formTurn.title !== (originalTurn.title || '')) return true
      if (formTurn.instructions !== originalTurn.instructions) return true
    }

    return false
  }, [formData, selectedOpening, isCreatingNew])

  useEditSectionStateSync({
    hasChanges,
    isValid,
    onHasChangesChange,
    onIsValidChange,
  })

  const handleSave = useCallback(async () => {
    if (!formData) return
    const draft = createOpeningDraft(formData)

    try {
      if (isCreatingNew) {
        const now = Date.now()
        const newId = await createOpeningMutation({ spiritId, ...draft })

        setOpenings((previous) =>
          sortOpeningsByName([
            ...previous,
            createStoredOpening({
              id: newId,
              spiritId,
              createdAt: now,
              draft,
            }),
          ]),
        )
        hasLocalMutationRef.current = true

        navigate({
          search: { ...search, opening: newId } as never,
          replace: true,
          resetScroll: false,
        })
      } else if (selectedOpening) {
        await updateOpeningMutation({ id: selectedOpening._id, ...draft })
        const now = Date.now()

        setOpenings((previous) =>
          sortOpeningsByName(
            previous.map((opening) =>
              opening._id === selectedOpening._id
                ? {
                    ...opening,
                    ...draft,
                    slug: toSlug(draft.name),
                    updatedAt: now,
                  }
                : opening,
            ),
          ),
        )
        hasLocalMutationRef.current = true
      }

      setIsCreatingNew(false)
      if (!isCreatingNew && selectedOpening) {
        setFormData(null)
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }, [
    formData,
    isCreatingNew,
    spiritId,
    selectedOpening,
    createOpeningMutation,
    updateOpeningMutation,
    navigate,
    search,
  ])

  const handleDelete = useCallback(async () => {
    if (!selectedOpening) return
    try {
      await deleteOpeningMutation({ id: selectedOpening._id })
      setOpenings((previous) => previous.filter((opening) => opening._id !== selectedOpening._id))
      hasLocalMutationRef.current = true
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
  }, [selectedOpening, deleteOpeningMutation, navigate, search])

  useEffect(() => {
    onSaveHandlerReady?.(formData && hasChanges ? handleSave : null)
  }, [formData, hasChanges, handleSave, onSaveHandlerReady])

  const handleFormDataChange = useCallback((data: OpeningFormData) => {
    setFormData(data)
  }, [])

  const handleCreateNew = useCallback(() => {
    setIsCreatingNew(true)
    setFormData(createEmptyFormData())
  }, [createEmptyFormData])

  const handleCancelNew = useCallback(() => {
    setIsCreatingNew(false)
    setFormData(null)
    if (selectedOpening) {
      setFormData(createFormDataFromOpening(selectedOpening))
    }
  }, [selectedOpening])

  const renderOpeningContent = (opening: PublicOpening) => (
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

  const renderOpeningEditor = (
    opening: PublicOpening | null,
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

  const renderContent = () => {
    const hasOpenings = openings.length > 0

    if (isEditing) {
      if (isCreatingNew) {
        return (
          <div className="space-y-4">
            {hasOpenings && (
              <div className="flex flex-wrap gap-2">
                {openings.map((opening) => (
                  <Button
                    className="opacity-50"
                    key={opening._id}
                    onClick={() => {
                      handleCancelNew()
                      handleTabChange(opening._id)
                    }}
                    size="sm"
                    variant="outline"
                  >
                    {opening.name}
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

      if (hasOpenings && selectedOpening && formData) {
        return (
          <Tabs className="space-y-4" onValueChange={handleTabChange} value={selectedOpening._id}>
            <div className="flex items-center gap-2">
              <OpeningTabsNavigation className="flex-1" openings={openings} />
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
            {openings.map((opening) => (
              <TabsContent key={opening._id} value={opening._id}>
                {opening._id === selectedOpening._id
                  ? renderOpeningEditor(opening, false, formData)
                  : renderOpeningContent(opening)}
              </TabsContent>
            ))}
          </Tabs>
        )
      }

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

    if (!hasOpenings) {
      return null
    }

    if (openings.length > 1 && selectedOpening) {
      return (
        <Tabs className="space-y-4" onValueChange={handleTabChange} value={selectedOpening._id}>
          <OpeningTabsNavigation openings={openings} />
          {openings.map((opening) => (
            <TabsContent key={opening._id} value={opening._id}>
              {renderOpeningContent(opening)}
            </TabsContent>
          ))}
        </Tabs>
      )
    }

    if (selectedOpening) {
      return renderOpeningContent(selectedOpening)
    }

    return null
  }

  const content = renderContent()

  if (!isEditing && openings.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <SectionHeading icon={<BookOpen className="h-5 w-5" />} title="Openings" />
      {content}
    </section>
  )
}
