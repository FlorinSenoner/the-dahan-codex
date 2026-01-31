import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADVERSARIES } from "@/lib/game-data";

interface AdversaryPickerProps {
  value: { name: string; level: number } | null;
  onChange: (adversary: { name: string; level: number } | null) => void;
  placeholder?: string;
}

export function AdversaryPicker({
  value,
  onChange,
  placeholder = "Select adversary...",
}: AdversaryPickerProps) {
  const handleNameChange = (name: string) => {
    onChange({ name, level: value?.level ?? 0 });
  };

  const handleLevelChange = (levelStr: string) => {
    if (value?.name) {
      onChange({ name: value.name, level: Number(levelStr) });
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={value?.name ?? ""} onValueChange={handleNameChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {ADVERSARIES.map((adv) => (
            <SelectItem key={adv.name} value={adv.name}>
              {adv.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value?.name && (
        <>
          <Select value={String(value.level)} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((l) => (
                <SelectItem key={l} value={String(l)}>
                  L{l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            aria-label="Clear adversary"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
