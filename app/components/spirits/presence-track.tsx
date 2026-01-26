import type { Doc } from "convex/_generated/dataModel";
import { Heading, Text } from "@/components/ui/typography";
import { PresenceSlot } from "./presence-slot";

interface PresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
}

// Map track colors to Tailwind classes
function getTrackColorClass(color?: string, type?: string): string {
  if (color === "amber") return "text-amber-400";
  if (color === "blue") return "text-blue-400";
  if (color === "purple") return "text-purple-400";
  // Fallback based on type
  if (type === "energy") return "text-amber-400";
  if (type === "cardPlays") return "text-blue-400";
  return "text-muted-foreground";
}

export function PresenceTrack({ presenceTracks }: PresenceTrackProps) {
  const { tracks } = presenceTracks;

  if (!tracks || tracks.length === 0) {
    return (
      <section className="space-y-4">
        <Heading variant="h3" as="h2">
          Presence Tracks
        </Heading>
        <Text variant="muted">Presence track data coming soon.</Text>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      {tracks.map((track, trackIdx) => {
        const colorClass = getTrackColorClass(track.color, track.type);
        const trackKey = track.type + "-" + trackIdx;

        return (
          <div key={trackKey} className="space-y-2">
            <Text variant="small" className={"font-medium " + colorClass}>
              {track.label}
            </Text>
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              {track.slots.map((slot, slotIdx) => {
                const slotKey = trackKey + "-" + slot.value + "-" + (slot.reclaim ? "R" : "") + "-" + slotIdx;
                return (
                  <PresenceSlot
                    key={slotKey}
                    value={slot.value}
                    elements={slot.elements}
                    reclaim={slot.reclaim}
                    innateUnlock={slot.innateUnlock}
                    specialAbility={slot.specialAbility}
                    type={track.type as "energy" | "cardPlays"}
                    index={slotIdx}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
