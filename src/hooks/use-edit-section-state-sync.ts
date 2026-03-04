import { useEffect } from 'react'

interface UseEditSectionStateSyncParams {
  hasChanges: boolean
  isValid: boolean
  onHasChangesChange?: (hasChanges: boolean) => void
  onIsValidChange?: (isValid: boolean) => void
}

export function useEditSectionStateSync({
  hasChanges,
  isValid,
  onHasChangesChange,
  onIsValidChange,
}: UseEditSectionStateSyncParams) {
  useEffect(() => {
    onHasChangesChange?.(hasChanges)
  }, [hasChanges, onHasChangesChange])

  useEffect(() => {
    onIsValidChange?.(isValid)
  }, [isValid, onIsValidChange])
}
