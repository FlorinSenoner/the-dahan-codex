import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCENARIOS } from "@/lib/game-data";

interface ScenarioPickerProps {
  value: { name: string; difficulty?: number } | null;
  onChange: (scenario: { name: string; difficulty?: number } | null) => void;
  placeholder?: string;
}

export function ScenarioPicker({
  value,
  onChange,
  placeholder = "Select scenario...",
}: ScenarioPickerProps) {
  const handleChange = (name: string) => {
    const scenario = SCENARIOS.find((s) => s.name === name);
    if (scenario) {
      onChange({
        name: scenario.name,
        difficulty: scenario.difficulty > 0 ? scenario.difficulty : undefined,
      });
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={value?.name ?? ""} onValueChange={handleChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {SCENARIOS.map((scenario) => (
            <SelectItem key={scenario.name} value={scenario.name}>
              {scenario.name}
              {scenario.difficulty > 0 && ` (+${scenario.difficulty})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value?.name && value.name !== "No Scenario" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          aria-label="Clear scenario"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
