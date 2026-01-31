import type { Id } from "convex/_generated/dataModel";
import { Loader2, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AdversaryPicker } from "./adversary-picker";
import { SpiritPicker } from "./spirit-picker";

export interface SpiritEntry {
  spiritId: Id<"spirits"> | null;
  name: string;
  variant?: string;
  player?: string;
}

export interface GameFormData {
  date: string;
  result: "win" | "loss";
  spirits: SpiritEntry[];
  adversary: { name: string; level: number } | null;
  secondaryAdversary: { name: string; level: number } | null;
  notes: string;
}

interface GameFormProps {
  initialData?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const defaultFormData: GameFormData = {
  date: new Date().toISOString().split("T")[0],
  result: "win",
  spirits: [
    { spiritId: null, name: "", variant: undefined, player: undefined },
  ],
  adversary: null,
  secondaryAdversary: null,
  notes: "",
};

export function GameForm({
  initialData,
  onSubmit,
  submitLabel = "Save Game",
  isSubmitting = false,
}: GameFormProps) {
  const [formData, setFormData] = React.useState<GameFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const isValid = formData.spirits.some((s) => s.spiritId !== null);

  const handleSpiritChange = (
    index: number,
    spiritId: Id<"spirits">,
    name: string,
    variant?: string,
  ) => {
    const newSpirits = [...formData.spirits];
    newSpirits[index] = { ...newSpirits[index], spiritId, name, variant };
    setFormData({ ...formData, spirits: newSpirits });
  };

  const handlePlayerChange = (index: number, player: string) => {
    const newSpirits = [...formData.spirits];
    newSpirits[index] = { ...newSpirits[index], player: player || undefined };
    setFormData({ ...formData, spirits: newSpirits });
  };

  const addSpirit = () => {
    if (formData.spirits.length < 6) {
      setFormData({
        ...formData,
        spirits: [
          ...formData.spirits,
          { spiritId: null, name: "", variant: undefined, player: undefined },
        ],
      });
    }
  };

  const removeSpirit = (index: number) => {
    if (formData.spirits.length > 1) {
      const newSpirits = formData.spirits.filter((_, i) => i !== index);
      setFormData({ ...formData, spirits: newSpirits });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {/* Result */}
      <div className="space-y-2">
        <Label>Result</Label>
        <RadioGroup
          value={formData.result}
          onValueChange={(v) =>
            setFormData({ ...formData, result: v as "win" | "loss" })
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="win" id="win" />
            <Label htmlFor="win" className="cursor-pointer">
              Win
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="loss" id="loss" />
            <Label htmlFor="loss" className="cursor-pointer">
              Loss
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Spirits */}
      <div className="space-y-3">
        <Label>Spirits</Label>
        {formData.spirits.map((spirit, index) => (
          <div
            key={spirit.spiritId ?? `slot-${index}`}
            className="flex gap-2 items-start"
          >
            <div className="flex-1 space-y-2">
              <SpiritPicker
                value={spirit.spiritId}
                onChange={(id, name, variant) =>
                  handleSpiritChange(index, id, name, variant)
                }
                placeholder={`Spirit ${index + 1}`}
              />
              <Input
                placeholder="Player name (optional)"
                value={spirit.player ?? ""}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
              />
            </div>
            {formData.spirits.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSpirit(index)}
                aria-label={`Remove spirit ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {formData.spirits.length < 6 && (
          <Button type="button" variant="outline" size="sm" onClick={addSpirit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Spirit
          </Button>
        )}
      </div>

      {/* Adversary */}
      <div className="space-y-2">
        <Label>Adversary (optional)</Label>
        <AdversaryPicker
          value={formData.adversary}
          onChange={(adv) => setFormData({ ...formData, adversary: adv })}
        />
      </div>

      {/* Secondary Adversary */}
      <div className="space-y-2">
        <Label>Secondary Adversary (optional)</Label>
        <AdversaryPicker
          value={formData.secondaryAdversary}
          onChange={(adv) =>
            setFormData({ ...formData, secondaryAdversary: adv })
          }
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any notes about the game..."
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
