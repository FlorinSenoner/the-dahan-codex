import type { Doc } from "convex/_generated/dataModel";
import { GitBranch, Sprout } from "lucide-react";
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

// Fallback colors for multi-track spirits without specific mappings
const fallbackColors: TrackColor[] = [
  "amber",
  "blue",
  "purple",
  "emerald",
  "indigo",
  "cyan",
];

export function PresenceTrack({
  presenceTracks,
  spiritSlug,
}: PresenceTrackProps) {
  const { tracks } = presenceTracks;

  // Get spirit-specific colors (defaults to amber/blue if not mapped)
  const spiritColors = spiritSlug
    ? getSpiritTrackColors(spiritSlug)
    : { energy: "amber", cardPlays: "blue" };

  if (!tracks || tracks.length === 0) {
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
   * Get the color for a track based on type and spirit
   * Priority: track.color > spiritColors[track.type] > fallback by index
   */
  const getTrackColor = (
    track: (typeof tracks)[number],
    index: number,
  ): TrackColor => {
    // Explicit color in data takes precedence
    if (track.color) return track.color as TrackColor;

    // Use spirit-specific colors for standard track types
    if (track.type === "energy") return spiritColors.energy as TrackColor;
    if (track.type === "cardPlays") return spiritColors.cardPlays as TrackColor;

    // Fallback for custom tracks (cycle through palette)
    return fallbackColors[index % fallbackColors.length];
  };

  return (
    <section className="space-y-4 mt-6">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      <div className="space-y-3">
        {tracks.map((track, trackIndex) => {
          const color = getTrackColor(track, trackIndex);
          const gradient =
            trackGradientClasses[color] || trackGradientClasses.amber;
          const labelColor = trackLabelColors[color] || trackLabelColors.amber;

          return (
            <div key={track.type} className={cn("rounded-lg p-3", gradient)}>
              <div className="flex items-center gap-2 mb-2">
                <Text
                  variant="small"
                  className={cn(
                    "font-medium uppercase tracking-wider",
                    labelColor,
                  )}
                >
                  {track.label}
                </Text>
                {/* Branching track indicator (Finder) */}
                {track.connectsTo && (
                  <span
                    className="text-muted-foreground"
                    title={`Connects to ${track.connectsTo} track`}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                  </span>
                )}
                {/* Unlocks growth indicator (Starlight) */}
                {track.unlocksGrowth && (
                  <span
                    className="text-emerald-400"
                    title="Unlocks growth options when emptied"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {track.slots.map((slot, idx) => {
                  // Create unique key from slot content to avoid array index warning
                  const slotKey = `${track.type}-${slot.value}-${slot.reclaim ? "R" : ""}-${idx}`;
                  return (
                    <PresenceSlot
                      key={slotKey}
                      slot={slot}
                      index={idx}
                      trackColor={color}
                      trackType={track.type}
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
