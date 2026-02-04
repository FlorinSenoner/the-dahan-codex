import type { Doc } from 'convex/_generated/dataModel'
import { Plus, Trash2 } from 'lucide-react'
import { useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { EditableText } from './editable-text'

interface Turn {
  turn: number
  title?: string
  instructions: string
}

export interface OpeningFormData {
  name: string
  description: string
  turns: Turn[]
  author: string
  sourceUrl: string
}

interface EditableOpeningProps {
  opening: Doc<'openings'> | null
  formData: OpeningFormData
  onChange: (data: OpeningFormData) => void
  onDelete?: () => void
  isNew?: boolean
}

export function EditableOpening({
  opening: _opening,
  formData,
  onChange,
  onDelete,
  isNew = false,
}: EditableOpeningProps) {
  // Stable callback for updating a single field
  const updateField = useCallback(
    <K extends keyof OpeningFormData>(field: K, value: OpeningFormData[K]) => {
      onChange({ ...formData, [field]: value })
    },
    [formData, onChange],
  )

  // Stable callback for updating a turn
  const updateTurn = useCallback(
    (index: number, updates: Partial<Turn>) => {
      const newTurns = [...formData.turns]
      newTurns[index] = { ...newTurns[index], ...updates }
      onChange({ ...formData, turns: newTurns })
    },
    [formData, onChange],
  )

  // Stable callback for adding a turn
  const addTurn = useCallback(() => {
    const nextTurn = formData.turns.length + 1
    onChange({
      ...formData,
      turns: [...formData.turns, { turn: nextTurn, title: '', instructions: '' }],
    })
  }, [formData, onChange])

  // Stable callback for deleting a turn
  const deleteTurn = useCallback(
    (index: number) => {
      const newTurns = formData.turns
        .filter((_, i) => i !== index)
        .map((t, i) => ({ ...t, turn: i + 1 })) // Renumber turns
      onChange({ ...formData, turns: newTurns })
    },
    [formData, onChange],
  )

  return (
    <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-4 ring-1 ring-primary/20">
      {/* Opening Name */}
      <div>
        <Text className="text-muted-foreground mb-1" variant="small">
          Opening Name *
        </Text>
        <EditableText
          className="font-semibold text-lg"
          isEditing={true}
          onChange={(v) => updateField('name', v)}
          placeholder="e.g., Standard Opening"
          required
          value={formData.name}
        />
      </div>

      {/* Description */}
      <div>
        <Text className="text-muted-foreground mb-1" variant="small">
          Description
        </Text>
        <EditableText
          isEditing={true}
          multiline
          onChange={(v) => updateField('description', v)}
          placeholder="Brief strategy overview..."
          value={formData.description}
        />
      </div>

      {/* Turns */}
      <div className="space-y-3">
        <Text className="text-muted-foreground" variant="small">
          Turns
        </Text>
        {formData.turns.map((turn, index) => (
          <div
            className="border border-border rounded-lg p-3 space-y-2 bg-muted/10"
            key={turn.turn}
          >
            <div className="flex items-center justify-between">
              <Text className="font-medium" variant="small">
                Turn {turn.turn}
              </Text>
              {formData.turns.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      aria-label={`Delete turn ${turn.turn}`}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Turn {turn.turn}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The turn content will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => deleteTurn(index)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <EditableText
              className="text-sm"
              isEditing={true}
              onChange={(v) => updateTurn(index, { title: v })}
              placeholder="Turn title *"
              required
              value={turn.title || ''}
            />
            <EditableText
              isEditing={true}
              multiline
              onChange={(v) => updateTurn(index, { instructions: v })}
              placeholder="Instructions for this turn..."
              required
              value={turn.instructions}
            />
          </div>
        ))}
        <Button className="w-full" onClick={addTurn} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Turn
        </Button>
      </div>

      {/* Attribution */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text className="text-muted-foreground mb-1" variant="small">
            Author
          </Text>
          <EditableText
            isEditing={true}
            onChange={(v) => updateField('author', v)}
            placeholder="Author name"
            value={formData.author}
          />
        </div>
        <div>
          <Text className="text-muted-foreground mb-1" variant="small">
            Source URL
          </Text>
          <EditableText
            isEditing={true}
            onChange={(v) => updateField('sourceUrl', v)}
            placeholder="https://..."
            value={formData.sourceUrl}
          />
        </div>
      </div>

      {/* Delete Opening */}
      {!isNew && onDelete && (
        <div className="pt-4 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Opening
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Opening?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The opening "{formData.name || 'Untitled'}" and all
                  its turns will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
