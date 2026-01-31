import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { BookOpen, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EditableOpening,
  type OpeningFormData,
} from "@/components/admin/editable-opening";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { useEditMode } from "@/hooks/use-edit-mode";
import { TurnAccordion } from "./turn-accordion";

interface OpeningSectionProps {
  spiritId: Id<"spirits">;
  onSaveHandlerReady?: (saveHandler: (() => Promise<void>) | null) => void;
  onHasChangesChange?: (hasChanges: boolean) => void;
}

// Design: Each spirit (base or aspect) queries openings by its own _id.
// Aspects never inherit openings from their base spirit.
export function OpeningSection({
  spiritId,
  onSaveHandlerReady,
  onHasChangesChange,
}: OpeningSectionProps) {
  const { data: openings, isLoading } = useQuery(
    convexQuery(api.openings.listBySpirit, { spiritId }),
  );
  const { isEditing } = useEditMode();

  // Convex mutations
  const createOpeningMutation = useMutation(api.openings.createOpening);
  const updateOpeningMutation = useMutation(api.openings.updateOpening);
  const deleteOpeningMutation = useMutation(api.openings.deleteOpening);

  // For now, just show the first opening
  // Future: add tabs for multiple openings
  const opening = openings?.[0] ?? null;

  // Form data state for edit mode
  const [formData, setFormData] = useState<OpeningFormData | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Create empty form data for new opening
  const createEmptyFormData = useCallback((): OpeningFormData => {
    return {
      name: "",
      description: "",
      turns: [{ turn: 1, title: "", instructions: "" }],
      author: "",
      sourceUrl: "",
    };
  }, []);

  // Initialize form data from opening when entering edit mode
  useEffect(() => {
    if (isEditing && opening && !isCreatingNew) {
      setFormData({
        name: opening.name,
        description: opening.description || "",
        turns: opening.turns.map((t) => ({
          turn: t.turn,
          title: t.title || "",
          instructions: t.instructions,
        })),
        author: opening.author || "",
        sourceUrl: opening.sourceUrl || "",
      });
    } else if (!isEditing) {
      // Reset form data when exiting edit mode
      setFormData(null);
      setIsCreatingNew(false);
    }
  }, [isEditing, opening, isCreatingNew]);

  // Calculate if there are changes
  const hasChanges = useMemo(() => {
    if (!formData) return false;

    // New opening - has changes if name is filled
    if (isCreatingNew) {
      return formData.name.trim().length > 0;
    }

    // Existing opening - compare with original
    if (!opening) return false;

    if (formData.name !== opening.name) return true;
    if (formData.description !== (opening.description || "")) return true;
    if (formData.author !== (opening.author || "")) return true;
    if (formData.sourceUrl !== (opening.sourceUrl || "")) return true;
    if (formData.turns.length !== opening.turns.length) return true;

    for (let i = 0; i < formData.turns.length; i++) {
      const formTurn = formData.turns[i];
      const origTurn = opening.turns[i];
      if (formTurn.turn !== origTurn.turn) return true;
      if (formTurn.title !== (origTurn.title || "")) return true;
      if (formTurn.instructions !== origTurn.instructions) return true;
    }

    return false;
  }, [formData, opening, isCreatingNew]);

  // Notify parent of changes
  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  // Save handler for creating or updating opening
  const handleSave = useCallback(async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      if (isCreatingNew) {
        await createOpeningMutation({
          spiritId,
          name: formData.name,
          description: formData.description || undefined,
          turns: formData.turns.map((t) => ({
            turn: t.turn,
            title: t.title || undefined,
            instructions: t.instructions,
          })),
          author: formData.author || undefined,
          sourceUrl: formData.sourceUrl || undefined,
        });
      } else if (opening) {
        await updateOpeningMutation({
          id: opening._id,
          name: formData.name,
          description: formData.description || undefined,
          turns: formData.turns.map((t) => ({
            turn: t.turn,
            title: t.title || undefined,
            instructions: t.instructions,
          })),
          author: formData.author || undefined,
          sourceUrl: formData.sourceUrl || undefined,
        });
      }
      // Data will refresh via query invalidation
      setIsCreatingNew(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    formData,
    isCreatingNew,
    spiritId,
    opening,
    createOpeningMutation,
    updateOpeningMutation,
  ]);

  // Delete handler for removing opening
  const handleDelete = useCallback(async () => {
    if (!opening) return;
    try {
      await deleteOpeningMutation({ id: opening._id });
      setFormData(null);
      setIsCreatingNew(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }, [opening, deleteOpeningMutation]);

  // Expose save handler to parent
  useEffect(() => {
    onSaveHandlerReady?.(formData && hasChanges ? handleSave : null);
  }, [formData, hasChanges, handleSave, onSaveHandlerReady]);

  // Handle form data change
  const handleFormDataChange = useCallback((data: OpeningFormData) => {
    setFormData(data);
  }, []);

  // Handle creating new opening
  const handleCreateNew = useCallback(() => {
    setIsCreatingNew(true);
    setFormData(createEmptyFormData());
  }, [createEmptyFormData]);

  // Render content based on state
  // Use single section wrapper to prevent layout shifts when toggling edit mode
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return <div className="animate-pulse bg-muted/30 rounded-lg h-32" />;
    }

    // Edit mode: show editor or create button
    if (isEditing) {
      // Has opening or creating new - show editor
      if ((opening && formData) || isCreatingNew) {
        return (
          <EditableOpening
            opening={opening}
            formData={formData!}
            onChange={handleFormDataChange}
            onDelete={handleDelete}
            isNew={isCreatingNew}
          />
        );
      }

      // No opening and not creating - show create button
      return (
        <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
          <Text variant="muted" className="mb-4">
            No openings yet for this spirit.
          </Text>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Opening
          </Button>
        </div>
      );
    }

    // Read-only mode: no content if no openings exist
    if (!opening) {
      return null;
    }

    // Read-only mode: show opening display
    return (
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <Heading variant="h3" as="h3">
          {opening.name}
        </Heading>

        {opening.description && (
          <Text variant="muted">{opening.description}</Text>
        )}

        <TurnAccordion turns={opening.turns} />

        {(opening.author || opening.sourceUrl) && (
          <div className="pt-2 border-t border-border text-xs text-muted-foreground">
            {opening.author && <span>By {opening.author}</span>}
            {opening.author && opening.sourceUrl && <span> · </span>}
            {opening.sourceUrl && (
              <a
                href={opening.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Source
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  const content = renderContent();

  // In read-only mode with no openings, don't render the section at all
  // But always render when editing (to show create button) or loading
  if (!isEditing && !isLoading && !opening) {
    return null;
  }

  return (
    <section className="space-y-4">
      <Heading variant="h2" as="h2" className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Openings
      </Heading>
      {content}
    </section>
  );
}
