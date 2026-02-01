import type { Id } from "convex/_generated/dataModel";
import { Loader2, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LOSS_TYPES, WIN_TYPES } from "@/lib/game-data";
import { AdversaryPicker } from "./adversary-picker";
import { ScenarioPicker } from "./scenario-picker";
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
  scenario: { name: string; difficulty?: number } | null;
  winType: string;
  invaderStage?: number;
  blightCount?: number;
  dahanCount?: number;
  cardsRemaining?: number;
  score?: number;
  notes: string;
}

interface GameFormProps {
  initialData?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => Promise<void>;
  onCancel?: () => void;
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
  scenario: null,
  winType: "",
  invaderStage: undefined,
  blightCount: undefined,
  dahanCount: undefined,
  cardsRemaining: undefined,
  score: undefined,
  notes: "",
};

/**
 * Calculate Spirit Island game score
 *
 * Victory: (5 x Difficulty) + 10 + (2 x cards remaining) + (dahan / players) - (blight / players)
 * Defeat: (2 x Difficulty) + cards used + (dahan / players) - (blight / players)
 *
 * Note: cards used for defeat = total invader deck cards - cards remaining
 * Standard invader deck has 12 cards (3 per stage)
 */
function calculateScore(
  result: "win" | "loss",
  difficulty: number,
  playerCount: number,
  cardsRemaining?: number,
  dahanCount?: number,
  blightCount?: number,
): number | undefined {
  // All required values must be present to calculate score
  if (
    cardsRemaining === undefined ||
    dahanCount === undefined ||
    blightCount === undefined
  ) {
    return undefined;
  }

  // Dahan and blight are divided by player count and floored
  const dahanScore = Math.floor(dahanCount / playerCount);
  const blightPenalty = Math.floor(blightCount / playerCount);

  if (result === "win") {
    // Victory formula
    return (
      5 * difficulty + 10 + 2 * cardsRemaining + dahanScore - blightPenalty
    );
  }
  // Defeat formula - cards used is 12 (standard deck) minus remaining
  const cardsUsed = 12 - cardsRemaining;
  return 2 * difficulty + cardsUsed + dahanScore - blightPenalty;
}

function calculateDifficulty(
  adversaryLevel: number = 0,
  secondaryAdversaryLevel: number = 0,
  scenarioDifficulty: number = 0,
): number {
  return adversaryLevel + secondaryAdversaryLevel + scenarioDifficulty;
}

export function GameForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Game",
  isSubmitting = false,
}: GameFormProps) {
  const [formData, setFormData] = React.useState<GameFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const isValid = formData.spirits.some((s) => s.spiritId !== null);
  const playerCount = formData.spirits.filter(
    (s) => s.spiritId !== null,
  ).length;

  // Calculate difficulty and score
  const difficulty = calculateDifficulty(
    formData.adversary?.level,
    formData.secondaryAdversary?.level,
    formData.scenario?.difficulty,
  );

  const calculatedScore = calculateScore(
    formData.result,
    difficulty,
    Math.max(playerCount, 1),
    formData.cardsRemaining,
    formData.dahanCount,
    formData.blightCount,
  );

  // Update score when inputs change
  React.useEffect(() => {
    if (calculatedScore !== formData.score) {
      setFormData((prev) => ({ ...prev, score: calculatedScore }));
    }
  }, [calculatedScore, formData.score]);

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

  const handleNumberInput = (
    field: "invaderStage" | "blightCount" | "dahanCount" | "cardsRemaining",
    value: string,
  ) => {
    const num = value === "" ? undefined : Number(value);
    setFormData({ ...formData, [field]: num });
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
            setFormData({
              ...formData,
              result: v as "win" | "loss",
              winType: "",
            })
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

      {/* Win Type (only for wins) */}
      {formData.result === "win" && (
        <div className="space-y-2">
          <Label>Win Type (optional)</Label>
          <Select
            value={formData.winType}
            onValueChange={(v) => setFormData({ ...formData, winType: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select win type..." />
            </SelectTrigger>
            <SelectContent>
              {WIN_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Loss Type (only for losses) */}
      {formData.result === "loss" && (
        <div className="space-y-2">
          <Label>Loss Type (optional)</Label>
          <Select
            value={formData.winType}
            onValueChange={(v) => setFormData({ ...formData, winType: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select loss type..." />
            </SelectTrigger>
            <SelectContent>
              {LOSS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

      {/* Scenario */}
      <div className="space-y-2">
        <Label>Scenario (optional)</Label>
        <ScenarioPicker
          value={formData.scenario}
          onChange={(scenario) => setFormData({ ...formData, scenario })}
        />
      </div>

      {/* Outcome Details Section */}
      <div className="space-y-4">
        <Label className="text-base">Game Stats (optional)</Label>
        <p className="text-sm text-muted-foreground -mt-2">
          Fill in these values to calculate your score
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Invader Stage */}
          <div className="space-y-2">
            <Label htmlFor="invaderStage">Invader Stage</Label>
            <Select
              value={formData.invaderStage?.toString() ?? ""}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  invaderStage: v === "" ? undefined : Number(v),
                })
              }
            >
              <SelectTrigger id="invaderStage">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Stage I</SelectItem>
                <SelectItem value="2">Stage II</SelectItem>
                <SelectItem value="3">Stage III</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cards Remaining */}
          <div className="space-y-2">
            <Label htmlFor="cardsRemaining">Cards Left</Label>
            <Input
              id="cardsRemaining"
              type="number"
              min="0"
              max="12"
              placeholder="0-12"
              value={formData.cardsRemaining ?? ""}
              onChange={(e) =>
                handleNumberInput("cardsRemaining", e.target.value)
              }
            />
          </div>

          {/* Blight Count */}
          <div className="space-y-2">
            <Label htmlFor="blightCount">Blight Count</Label>
            <Input
              id="blightCount"
              type="number"
              min="0"
              placeholder="Blight"
              value={formData.blightCount ?? ""}
              onChange={(e) => handleNumberInput("blightCount", e.target.value)}
            />
          </div>

          {/* Dahan Count */}
          <div className="space-y-2">
            <Label htmlFor="dahanCount">Dahan Count</Label>
            <Input
              id="dahanCount"
              type="number"
              min="0"
              placeholder="Dahan"
              value={formData.dahanCount ?? ""}
              onChange={(e) => handleNumberInput("dahanCount", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Calculated Score Display */}
      {calculatedScore !== undefined && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Calculated Score</p>
              <p className="text-sm text-muted-foreground">
                Difficulty: {difficulty}
              </p>
            </div>
            <p className="text-3xl font-bold">{calculatedScore}</p>
          </div>
        </div>
      )}

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

      {/* Submit / Cancel */}
      <div className={onCancel ? "flex gap-2" : ""}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={onCancel ? "flex-1" : "w-full"}
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
      </div>
    </form>
  );
}
