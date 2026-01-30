import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { useAdmin } from "./use-admin";

interface EditModeState {
  isEditing: boolean;
  toggleEdit: () => void;
  setEditing: (editing: boolean) => void;
}

export function useEditMode(): EditModeState {
  // Get edit param from URL - use strict: false to work on any route
  const search = useSearch({ strict: false }) as { edit?: boolean };
  const navigate = useNavigate();
  const isAdmin = useAdmin();

  // Only activate edit mode if user is admin AND URL has edit=true
  const isEditing = isAdmin && search.edit === true;

  const setEditing = useCallback(
    (editing: boolean) => {
      // Merge current search params with edit state
      const newSearch = { ...search, edit: editing || undefined };
      navigate({
        // biome-ignore lint/suspicious/noExplicitAny: TanStack Router search typing is complex with strict: false
        search: newSearch as any,
        replace: true,
      });
    },
    [navigate, search],
  );

  const toggleEdit = useCallback(() => {
    setEditing(!isEditing);
  }, [isEditing, setEditing]);

  return { isEditing, toggleEdit, setEditing };
}
