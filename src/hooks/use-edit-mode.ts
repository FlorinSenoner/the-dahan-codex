import { useCallback } from 'react'
import { useEditModeContext } from '@/contexts/edit-mode-context'
import { useAdmin } from './use-admin'

interface EditModeState {
  isEditing: boolean
  toggleEdit: () => void
  setEditing: (editing: boolean) => void
}

export function useEditMode(): EditModeState {
  const { isEditMode, setEditMode } = useEditModeContext()
  const isAdmin = useAdmin()

  // Only activate edit mode if user is admin AND context has edit=true
  const isEditing = isAdmin && isEditMode

  const setEditing = useCallback(
    (editing: boolean) => {
      setEditMode(editing)
    },
    [setEditMode],
  )

  const toggleEdit = useCallback(() => {
    setEditing(!isEditing)
  }, [isEditing, setEditing])

  return { isEditing, toggleEdit, setEditing }
}
