import { api } from 'convex/_generated/api'
import type { Doc } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { Wrench } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EditableText } from '@/components/admin/editable-text'
import { Heading, Text } from '@/components/ui/typography'
import { useEditMode } from '@/hooks/use-edit-mode'

const MAX_SETUP_LENGTH = 4000

interface SetupSectionProps {
  spirit: Doc<'spirits'>
  onSaveHandlerReady?: (saveHandler: (() => Promise<void>) | null) => void
  onHasChangesChange?: (hasChanges: boolean) => void
  onIsValidChange?: (isValid: boolean) => void
}

export function SetupSection({
  spirit,
  onSaveHandlerReady,
  onHasChangesChange,
  onIsValidChange,
}: SetupSectionProps) {
  const { isEditing } = useEditMode()
  const updateSetupMutation = useMutation(api.spirits.updateSpiritSetup)
  const [baselineSetup, setBaselineSetup] = useState(spirit.setup || '')
  const [setupText, setSetupText] = useState(spirit.setup || '')
  const isEditingRef = useRef(isEditing)
  isEditingRef.current = isEditing

  useEffect(() => {
    const nextSetup = spirit.setup || ''
    setBaselineSetup(nextSetup)
    setSetupText((current) => (isEditingRef.current ? current : nextSetup))
  }, [spirit.setup])

  useEffect(() => {
    if (!isEditing) {
      setSetupText(baselineSetup)
    }
  }, [isEditing, baselineSetup])

  const hasChanges = useMemo(
    () => isEditing && setupText.trim() !== baselineSetup.trim(),
    [isEditing, setupText, baselineSetup],
  )

  const isValid = useMemo(() => {
    const trimmed = setupText.trim()
    return trimmed.length > 0 && trimmed.length <= MAX_SETUP_LENGTH
  }, [setupText])

  useEffect(() => {
    onHasChangesChange?.(hasChanges)
  }, [hasChanges, onHasChangesChange])

  useEffect(() => {
    onIsValidChange?.(isValid)
  }, [isValid, onIsValidChange])

  const handleSave = useCallback(async () => {
    const trimmed = setupText.trim()
    await updateSetupMutation({
      spiritId: spirit._id,
      setup: trimmed,
    })
    setBaselineSetup(trimmed)
    setSetupText(trimmed)
  }, [setupText, spirit._id, updateSetupMutation])

  useEffect(() => {
    onSaveHandlerReady?.(hasChanges && isValid ? handleSave : null)
  }, [hasChanges, isValid, handleSave, onSaveHandlerReady])

  if (!isEditing && !setupText.trim()) {
    return null
  }

  return (
    <section className="space-y-4">
      <Heading as="h2" className="flex items-center gap-2" variant="h2">
        <Wrench className="h-5 w-5" />
        Setup
      </Heading>

      {isEditing ? (
        <div className="bg-card border border-primary/30 rounded-lg p-4 ring-1 ring-primary/20">
          <EditableText
            className="min-h-[140px]"
            isEditing={true}
            multiline
            onChange={setSetupText}
            placeholder="Spirit setup instructions..."
            required
            value={setupText}
          />
          <Text className="mt-2" variant="small">
            {setupText.trim().length}/{MAX_SETUP_LENGTH}
          </Text>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-4">
          <Text className="whitespace-pre-line leading-relaxed">{setupText}</Text>
        </div>
      )}
    </section>
  )
}
