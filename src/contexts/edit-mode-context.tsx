import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

interface EditModeContextValue {
  isEditMode: boolean
  setEditMode: (editing: boolean) => void
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

interface EditModeProviderProps {
  children: ReactNode
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false)

  const setEditMode = useCallback((editing: boolean) => {
    setIsEditMode(editing)
  }, [])

  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditModeContext(): EditModeContextValue {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditModeContext must be used within EditModeProvider')
  }
  return context
}
