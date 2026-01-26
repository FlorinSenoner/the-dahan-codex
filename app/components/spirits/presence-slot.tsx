import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PresenceSlotProps {
  slot: {
    value: number | string;
    elements?: string[];
    reclaim?: boolean;
    innateUnlock?: string;
    specialAbility?: string;
  };
  index: number;
  trackColor?: "amber" | "blue" | "purple" | "emerald";
  trackType?: string;
}

// Border colors based on track color
const borderColors: Record<string, string> = {
  amber: "border-amber-500/50",
  blue: "border-blue-500/50",
  purple: "border-purple-500/50",
  emerald: "border-emerald-500/50",
};

// Hover border colors based on track color
const hoverBorderColors: Record<string, string> = {
  amber: "hover:border-amber-400",
  blue: "hover:border-blue-400",
  purple: "hover:border-purple-400",
  emerald: "hover:border-emerald-400",
};

export function PresenceSlot({
  slot,
  index,
  trackColor = "amber",
  trackType,
}: PresenceSlotProps) {
  const { value, elements, reclaim, innateUnlock, specialAbility } = slot;

  // Build tooltip content
  const tooltipLines: string[] = [];

  if (trackType === "energy") {
    tooltipLines.push("Gain " + value + " Energy per turn");
  } else if (trackType === "cardPlays") {
    tooltipLines.push(
      "Play " + value + " Card" + (value !== 1 ? "s" : "") + " per turn",
    );
  } else {
    tooltipLines.push(String(value));
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
              "w-11 h-11 min-w-[44px] min-h-[44px] rounded-full",
              "border-2 flex items-center justify-center",
              "text-sm font-medium transition-colors",
              "cursor-pointer",
              "bg-muted/50 text-foreground",
              "hover:bg-muted/80",
              borderColors[trackColor] || borderColors.amber,
              hoverBorderColors[trackColor] || hoverBorderColors.amber,
              reclaim && "border-amber-500 bg-amber-500/20 text-amber-300",
              elements &&
                elements.length > 0 &&
                !reclaim &&
                "border-primary/70",
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
