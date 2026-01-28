import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks";

/**
 * Offline status indicator banner.
 * Only renders when the user is offline.
 * Uses accessible attributes for screen readers.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  // Only show when offline
  if (isOnline) {
    return null;
  }

  return (
    <output
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-600 py-2 text-sm text-white animate-in fade-in"
    >
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      <span>You're offline</span>
    </output>
  );
}
