import type { Doc } from "convex/_generated/dataModel";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { EditableText } from "./editable-text";

interface Turn {
  turn: number;
  title?: string;
  instructions: string;
  notes?: string;
}

export interface OpeningFormData {
  name: string;
  description: string;
  turns: Turn[];
  author: string;
  sourceUrl: string;
}

interface EditableOpeningProps {
  opening: Doc<"openings"> | null;
  formData: OpeningFormData;
  onChange: (data: OpeningFormData) => void;
  onDelete?: () => void;
  isNew?: boolean;
}

export function EditableOpening({
  opening,
  formData,
  onChange,
  onDelete,
  isNew = false,
}: EditableOpeningProps) {
  const updateField = <K extends keyof OpeningFormData>(
    field: K,
    value: OpeningFormData[K],
  ) => {
    onChange({ ...formData, [field]: value });
  };

  const updateTurn = (index: number, updates: Partial<Turn>) => {
    const newTurns = [...formData.turns];
    newTurns[index] = { ...newTurns[index], ...updates };
    updateField("turns", newTurns);
  };

  const addTurn = () => {
    const nextTurn = formData.turns.length + 1;
    updateField("turns", [
      ...formData.turns,
      { turn: nextTurn, title: "", instructions: "", notes: "" },
    ]);
  };

  const deleteTurn = (index: number) => {
    if (!confirm("Delete this turn?")) return;
    const newTurns = formData.turns
      .filter((_, i) => i !== index)
      .map((t, i) => ({ ...t, turn: i + 1 })); // Renumber turns
    updateField("turns", newTurns);
  };

  return (
    <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-4 ring-1 ring-primary/20">
      {/* Opening Name */}
      <div>
        <Text variant="small" className="text-muted-foreground mb-1">
          Opening Name *
        </Text>
        <EditableText
          value={formData.name}
          onChange={(v) => updateField("name", v)}
          isEditing={true}
          placeholder="e.g., Standard Opening"
          required
          className="font-semibold text-lg"
        />
      </div>

      {/* Description */}
      <div>
        <Text variant="small" className="text-muted-foreground mb-1">
          Description
        </Text>
        <EditableText
          value={formData.description}
          onChange={(v) => updateField("description", v)}
          isEditing={true}
          multiline
          placeholder="Brief strategy overview..."
        />
      </div>

      {/* Turns */}
      <div className="space-y-3">
        <Text variant="small" className="text-muted-foreground">
          Turns
        </Text>
        {formData.turns.map((turn, index) => (
          <div
            key={turn.turn}
            className="border border-border rounded-lg p-3 space-y-2 bg-muted/10"
          >
            <div className="flex items-center justify-between">
              <Text variant="small" className="font-medium">
                Turn {turn.turn}
              </Text>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => deleteTurn(index)}
                aria-label={`Delete turn ${turn.turn}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <EditableText
              value={turn.title || ""}
              onChange={(v) => updateTurn(index, { title: v })}
              isEditing={true}
              placeholder="Turn title (optional)"
              className="text-sm"
            />
            <EditableText
              value={turn.instructions}
              onChange={(v) => updateTurn(index, { instructions: v })}
              isEditing={true}
              multiline
              placeholder="Instructions for this turn..."
              required
            />
            <EditableText
              value={turn.notes || ""}
              onChange={(v) => updateTurn(index, { notes: v })}
              isEditing={true}
              multiline
              placeholder="Additional notes (optional)"
              className="text-sm"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addTurn}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Turn
        </Button>
      </div>

      {/* Attribution */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="small" className="text-muted-foreground mb-1">
            Author
          </Text>
          <EditableText
            value={formData.author}
            onChange={(v) => updateField("author", v)}
            isEditing={true}
            placeholder="Author name"
          />
        </div>
        <div>
          <Text variant="small" className="text-muted-foreground mb-1">
            Source URL
          </Text>
          <EditableText
            value={formData.sourceUrl}
            onChange={(v) => updateField("sourceUrl", v)}
            isEditing={true}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Delete Opening */}
      {!isNew && onDelete && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Delete this opening? This cannot be undone.")) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Opening
          </Button>
        </div>
      )}
    </div>
  );
}
