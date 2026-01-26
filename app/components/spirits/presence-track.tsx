import type { Doc } from "convex/_generated/dataModel";
import { Heading, Text } from "@/components/ui/typography";
import { PresenceSlot } from "./presence-slot";

interface PresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
}

export function PresenceTrack({ presenceTracks }: PresenceTrackProps) {
  const { energy, cardPlays } = presenceTracks;

  return (
    <section className="space-y-4">
      <Heading variant="h3" as="h2">
        Presence Tracks
      </Heading>

      {/* Energy Track */}
      <div className="space-y-2">
        <Text variant="small" className="font-medium text-amber-400">
          Energy per Turn
        </Text>
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
          {energy.map((slot, idx) => {
            // Create stable key from slot properties
            const key = `energy-${slot.value}-${idx}`;
            return (
              <PresenceSlot
                key={key}
                value={slot.value}
                elements={slot.elements}
                type="energy"
                index={idx}
              />
            );
          })}
        </div>
      </div>

      {/* Card Plays Track */}
      <div className="space-y-2">
        <Text variant="small" className="font-medium text-blue-400">
          Card Plays per Turn
        </Text>
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
          {cardPlays.map((slot, idx) => {
            // Create stable key from slot properties
            const key = `cardPlays-${slot.value}-${slot.reclaim ? "R" : ""}-${idx}`;
            return (
              <PresenceSlot
                key={key}
                value={slot.value}
                elements={slot.elements}
                reclaim={slot.reclaim}
                type="cardPlays"
                index={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
