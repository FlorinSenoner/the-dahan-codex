import type { Doc } from "convex/_generated/dataModel";
import { Sprout } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading, Text } from "@/components/ui/typography";
import {
  getSpiritTrackColors,
  trackGradientClasses,
} from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";
import { PresenceSlot } from "./presence-slot";

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

interface PresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
  spiritSlug?: string; // For getting spirit-specific colors
}

// Label colors for each track color
const trackLabelColors: Record<string, string> = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  orange: "text-orange-400",
  violet: "text-violet-400",
  indigo: "text-indigo-400",
  stone: "text-stone-400",
};

export function PresenceTrack({
  presenceTracks,
  spiritSlug,
}: PresenceTrackProps) {
  const { nodes } = presenceTracks;

  // Get spirit-specific colors (defaults to amber/blue if not mapped)
  const spiritColors = spiritSlug
    ? getSpiritTrackColors(spiritSlug)
    : { energy: "amber", cardPlays: "blue" };

  if (!nodes || nodes.length === 0) {
    return (
      <section className="space-y-4 mt-6">
        <Heading variant="h3" as="h2">
          Presence Tracks
        </Heading>
        <Text variant="muted">Presence track data coming soon.</Text>
      </section>
    );
  }

  /**
   * Get the color for a node based on trackType and spirit
   * Priority: spiritColors[trackType] > fallback by trackType
   */
  const getNodeColor = (node: (typeof nodes)[number]): TrackColor => {
    const trackType = node.trackType;

    // Use spirit-specific colors for standard track types
    if (trackType === "energy" || trackType === "energyMod")
      return spiritColors.energy as TrackColor;
    if (trackType === "cardPlays" || trackType === "cardPlaysMod")
      return spiritColors.cardPlays as TrackColor;

    // Fallback for other track types
    return "purple";
  };

  // Group nodes by row for rendering
  const nodesByRow = nodes.reduce(
    (acc, node) => {
      if (!acc[node.row]) acc[node.row] = [];
      acc[node.row].push(node);
      return acc;
    },
    {} as Record<number, typeof nodes>,
  );

  // Sort nodes within each row by column
  for (const row of Object.keys(nodesByRow)) {
    nodesByRow[Number(row)].sort((a, b) => a.col - b.col);
  }

  // Get row label based on first node's trackType
  const getRowLabel = (rowNodes: typeof nodes): string => {
    const firstNode = rowNodes[0];
    if (!firstNode?.trackType) return "Track";
    switch (firstNode.trackType) {
      case "energy":
        return "Energy/Turn";
      case "cardPlays":
        return "Card Plays";
      case "energyMod":
        return "Energy Modifier";
      case "cardPlaysMod":
        return "Card Plays Modifier";
      case "elements":
        return "Elements";
      case "special":
        return "Special";
      default:
        return "Track";
    }
  };

  return (
    <section className="space-y-4 mt-6">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      <div className="space-y-3">
        {Object.entries(nodesByRow)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([rowIndex, rowNodes]) => {
            const firstNode = rowNodes[0];
            const color = getNodeColor(firstNode);
            const gradient =
              trackGradientClasses[color] || trackGradientClasses.amber;
            const labelColor =
              trackLabelColors[color] || trackLabelColors.amber;

            return (
              <div
                key={`row-${rowIndex}`}
                className={cn("rounded-lg p-3", gradient)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Text
                    variant="small"
                    className={cn(
                      "font-medium uppercase tracking-wider",
                      labelColor,
                    )}
                  >
                    {getRowLabel(rowNodes)}
                  </Text>
                  {/* Unlocks growth indicator (Starlight) */}
                  {firstNode.unlocksGrowth && (
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <span className="text-emerald-400 cursor-help">
                          <Sprout className="w-3.5 h-3.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Unlocks growth options when emptied
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {rowNodes.map((node) => {
                    // Create slot object compatible with PresenceSlot
                    const slot = {
                      value: node.value ?? 0,
                      elements: node.elements,
                      reclaim: node.reclaim,
                      specialAbility: node.specialAbility,
                      presenceCap: node.presenceCap,
                    };
                    return (
                      <PresenceSlot
                        key={node.id}
                        slot={slot}
                        index={node.col}
                        trackColor={color}
                        trackType={node.trackType ?? "energy"}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
