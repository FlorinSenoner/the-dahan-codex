import { Check, Loader2, Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin, useEditMode } from '@/hooks'

interface EditFabProps {
  onSave?: () => void
  hasChanges?: boolean
  isSaving?: boolean
  isValid?: boolean
  showPublishButton?: boolean
  publishStatus?: 'idle' | 'queued' | 'running' | 'succeeded' | 'failed'
  publishError?: string
  onPublish?: () => Promise<void> | void
  isPublishing?: boolean
}

export function EditFab({
  onSave,
  hasChanges,
  isSaving,
  isValid,
  showPublishButton,
  publishStatus = 'idle',
  publishError,
  onPublish,
  isPublishing,
}: EditFabProps) {
  const isAdmin = useAdmin()
  const { isEditing, toggleEdit } = useEditMode()

  // Don't render for non-admins
  if (!isAdmin) {
    return null
  }

  const publishInFlight = isPublishing || publishStatus === 'queued' || publishStatus === 'running'
  const publishButtonText = publishInFlight
    ? 'Publishing...'
    : publishStatus === 'failed'
      ? 'Retry Publish'
      : 'Publish Site'

  return (
    <div className="fixed bottom-20 right-4 z-50 flex gap-2">
      {showPublishButton && (
        <Button
          aria-label="Publish public site"
          className="h-14 rounded-full shadow-lg px-5"
          disabled={publishInFlight}
          onClick={onPublish}
          title={publishError || undefined}
          variant={publishStatus === 'failed' ? 'destructive' : 'default'}
        >
          {publishInFlight ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {publishButtonText}
        </Button>
      )}
      {isEditing && hasChanges && (
        <Button
          aria-label="Save changes"
          className="h-14 w-14 rounded-full shadow-lg"
          disabled={isSaving || !isValid}
          onClick={onSave}
          size="icon"
        >
          {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Check className="h-6 w-6" />}
        </Button>
      )}
      <Button
        aria-label={isEditing ? 'Exit edit mode' : 'Enter edit mode'}
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={toggleEdit}
        size="icon"
        variant={isEditing ? 'secondary' : 'default'}
      >
        {isEditing ? <X className="h-6 w-6" /> : <Pencil className="h-6 w-6" />}
      </Button>
    </div>
  )
}
