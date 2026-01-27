import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// All supported track colors
type TrackColor =
  | "amber"
  | "blue"
  | "purple"
  | "emerald"
  | "cyan"
  | "orange"
  | "violet"
  | "indigo"
  | "stone";

// Node data type from graph schema
interface PresenceNodeData {
  id: string;
  row: number;
  col: number;
  value?: number | string;
  trackType?:
    | "energy"
    | "cardPlays"
    | "energyMod"
    | "cardPlaysMod"
    | "elements"
    | "special"
    | "start";
  elements?: string[];
  reclaim?: boolean;
  specialAbility?: string;
  presenceCap?: number;
  unlocksGrowth?: boolean;
}

interface PresenceNodeProps {
  node: PresenceNodeData;
  style?: React.CSSProperties;
  color?: TrackColor;
}

// Border colors based on track color
const borderColors: Record<TrackColor, string> = {
  amber: "border-amber-500/50",
  blue: "border-blue-500/50",
  purple: "border-purple-500/50",
  emerald: "border-emerald-500/50",
  cyan: "border-cyan-500/50",
  orange: "border-orange-500/50",
  violet: "border-violet-500/50",
  indigo: "border-indigo-500/50",
  stone: "border-stone-500/50",
};

// Hover border colors based on track color
const hoverBorderColors: Record<TrackColor, string> = {
  amber: "hover:border-amber-400",
  blue: "hover:border-blue-400",
  purple: "hover:border-purple-400",
  emerald: "hover:border-emerald-400",
  cyan: "hover:border-cyan-400",
  orange: "hover:border-orange-400",
  violet: "hover:border-violet-400",
  indigo: "hover:border-indigo-400",
  stone: "hover:border-stone-400",
};

export function PresenceNode({
  node,
  style,
  color = "amber",
}: PresenceNodeProps) {
  const {
    value,
    trackType,
    elements,
    reclaim,
    specialAbility,
    presenceCap,
    unlocksGrowth,
    col,
  } = node;

  // Build tooltip content based on trackType
  const tooltipLines: string[] = [];

  switch (trackType) {
    case "energy":
      tooltipLines.push(`Gain ${value} Energy per turn`);
      break;
    case "cardPlays":
      tooltipLines.push(`Play ${value} Card${value !== 1 ? "s" : ""} per turn`);
      break;
    case "energyMod":
      tooltipLines.push(`${value} Energy modifier`);
      break;
    case "cardPlaysMod":
      tooltipLines.push(`${value} Card Plays modifier`);
      break;
    case "elements":
      // Elements-only slot - no base value text
      break;
    case "special":
      if (specialAbility) tooltipLines.push(specialAbility);
      break;
    case "start":
      tooltipLines.push("Starting position");
      break;
    default:
      if (value !== undefined) tooltipLines.push(String(value));
  }

  // Add reclaim info
  if (reclaim) {
    tooltipLines.push("Reclaim One");
  }

  // Add elements
  if (elements && elements.length > 0) {
    tooltipLines.push(`+${elements.join(", ")}`);
  }

  // Add presence cap
  if (presenceCap !== undefined) {
    tooltipLines.push(`Presence limit: ${presenceCap}`);
  }

  // Add unlocks growth indicator
  if (unlocksGrowth) {
    tooltipLines.push("Unlocks growth options when emptied");
  }

  // Add position info
  tooltipLines.push(`Position ${col + 1}`);

  // Determine display value
  // Priority: reclaim > presenceCap > value > elements indicator
  const displayValue = reclaim
    ? "R"
    : presenceCap !== undefined
      ? presenceCap
      : (value ?? (elements?.length ? "+" : ""));

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
              borderColors[color],
              hoverBorderColors[color],
              // Special styling for reclaim slots
              reclaim && "border-amber-500 bg-amber-500/20 text-amber-300",
              // Special styling for element-only slots (no reclaim override)
              elements &&
                elements.length > 0 &&
                !reclaim &&
                "border-primary/70",
              // Special styling for presence cap slots
              presenceCap !== undefined &&
                "border-stone-500/70 bg-stone-500/10 text-stone-300",
            )}
            style={style}
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
