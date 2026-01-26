import type { Doc } from "convex/_generated/dataModel";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { PresenceSlot } from "./presence-slot";

interface PresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
}

// Gradient backgrounds for each track color
const trackGradients: Record<string, string> = {
  amber: "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent",
  blue: "bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent",
  purple: "bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent",
  emerald:
    "bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent",
};

// Label colors for each track color
const trackLabelColors: Record<string, string> = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  emerald: "text-emerald-400",
};

export function PresenceTrack({ presenceTracks }: PresenceTrackProps) {
  const { tracks } = presenceTracks;

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

  return (
    <section className="space-y-4 mt-6">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      <div className="space-y-3">
        {tracks.map((track) => {
          const color = track.color || "amber";
          const gradient = trackGradients[color] || trackGradients.amber;
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
                      trackColor={
                        color as "amber" | "blue" | "purple" | "emerald"
                      }
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
