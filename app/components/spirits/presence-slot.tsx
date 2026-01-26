import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PresenceSlotProps {
  value: number | string;
  elements?: string[];
  reclaim?: boolean;
  innateUnlock?: string;
  specialAbility?: string;
  type: "energy" | "cardPlays";
  index: number;
}

export function PresenceSlot({
  value,
  elements,
  reclaim,
  innateUnlock,
  specialAbility,
  type,
  index,
}: PresenceSlotProps) {
  // Build tooltip content
  const tooltipLines: string[] = [];

  if (type === "energy") {
    tooltipLines.push("Gain " + value + " Energy per turn");
  } else {
    tooltipLines.push("Play " + value + " Card" + (value !== 1 ? "s" : "") + " per turn");
  }

  if (reclaim) {
    tooltipLines.push("Reclaim One");
  }

  if (elements && elements.length > 0) {
    tooltipLines.push("+" + elements.join(", "));
  }

  if (innateUnlock) {
    tooltipLines.push("Unlocks: " + innateUnlock);
  }

  if (specialAbility) {
    tooltipLines.push(specialAbility);
  }

  // Determine display value
  const displayValue = reclaim ? "R" : value;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors cursor-default",
              "bg-muted/50 border-border text-foreground",
              "hover:bg-muted hover:border-primary/50",
              reclaim && "border-amber-500/50 bg-amber-500/10",
              elements &&
                elements.length > 0 &&
                !reclaim &&
                "border-primary/50",
            )}
            aria-label={tooltipLines.join(". ")}
          >
            {displayValue}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="space-y-1">
            {tooltipLines.map((line) => (
              <p key={line} className="text-xs">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Slot {index + 1}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
