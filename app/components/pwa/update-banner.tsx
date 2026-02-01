import { RefreshCw } from "lucide-react";

interface UpdateBannerProps {
  onReload: () => void;
}

/**
 * Subtle pill-style update notification shown when a new service worker is waiting.
 * Positioned top-right to avoid overlap with offline indicator (bottom-right).
 */
export function UpdateBanner({ onReload }: UpdateBannerProps) {
  return (
    <output
      aria-live="polite"
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-sm text-zinc-300 animate-in fade-in"
    >
      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Update available</span>
      <button
        type="button"
        onClick={onReload}
        className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        Reload
      </button>
    </output>
  );
}
