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
import { PresenceNode } from "./presence-node";

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

// Label colors for each track color
const trackLabelColors: Record<TrackColor, string> = {
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

interface GraphPresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
  spiritSlug?: string;
}

export function GraphPresenceTrack({
  presenceTracks,
  spiritSlug,
}: GraphPresenceTrackProps) {
  const { rows, cols, nodes } = presenceTracks;

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
    if (trackType === "special") return "stone";
    if (trackType === "elements") return "purple";

    return "amber";
  };

  // Group nodes by row for visual organization
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
      case "start":
        return "Starting Position";
      default:
        return "Track";
    }
  };

  return (
    <section className="space-y-4 mt-6">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      {/* Relative container for future edge overlay (Plan 03) */}
      <div className="relative space-y-3">
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

                {/* CSS Grid layout for nodes */}
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(44px, 1fr))`,
                  }}
                >
                  {rowNodes.map((node) => (
                    <PresenceNode
                      key={node.id}
                      node={node}
                      color={color}
                      style={{
                        gridColumn: node.col + 1, // CSS Grid is 1-indexed
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

        {/* Edge overlay placeholder - SVG lines will be added in Plan 03 */}
      </div>
    </section>
  );
}
