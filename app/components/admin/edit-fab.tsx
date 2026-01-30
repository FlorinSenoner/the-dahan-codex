import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin, useEditMode } from "@/hooks";

interface EditFabProps {
  onSave?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
}

export function EditFab({ onSave, hasChanges, isSaving }: EditFabProps) {
  const isAdmin = useAdmin();
  const { isEditing, toggleEdit } = useEditMode();

  // Don't render for non-admins
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex gap-2">
      {isEditing && hasChanges && onSave && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="Save changes"
        >
          <Check className="h-6 w-6" />
        </Button>
      )}
      <Button
        onClick={toggleEdit}
        variant={isEditing ? "secondary" : "default"}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        aria-label={isEditing ? "Exit edit mode" : "Enter edit mode"}
      >
        {isEditing ? <X className="h-6 w-6" /> : <Pencil className="h-6 w-6" />}
      </Button>
    </div>
  );
}
