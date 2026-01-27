import type { Doc } from "convex/_generated/dataModel";
import { GraphPresenceTrack } from "./graph-presence-track";

interface PresenceTrackProps {
  presenceTracks: NonNullable<Doc<"spirits">["presenceTracks"]>;
  spiritSlug?: string;
}

/**
 * PresenceTrack component - entry point for presence track rendering.
 * Delegates to GraphPresenceTrack for the unified Node-Edge Graph model.
 */
export function PresenceTrack({
  presenceTracks,
  spiritSlug,
}: PresenceTrackProps) {
  return (
    <GraphPresenceTrack
      presenceTracks={presenceTracks}
      spiritSlug={spiritSlug}
    />
  );
}
