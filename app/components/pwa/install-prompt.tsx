import { Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstallPrompt } from "@/hooks";

const DISMISSED_KEY = "pwa-install-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Install prompt banner for PWA installation.
 * Shows platform-appropriate UI:
 * - Chromium: "Install" button that triggers native prompt
 * - iOS: Manual instructions for Add to Home Screen
 */
export function InstallPrompt() {
  const { isInstallable, isIOS, isStandalone, promptInstall } =
    useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Check localStorage on mount to respect 7-day dismissal
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number.parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) {
        setDismissed(true);
        return;
      }
      // Clear expired dismissal
      localStorage.removeItem(DISMISSED_KEY);
    }

    // Delay showing to avoid flash on page load
    const timer = setTimeout(() => setShouldShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  };

  // Don't show if:
  // - Already installed as PWA
  // - User dismissed this session or within 7 days
  // - Not installable AND not iOS (nothing to show)
  // - Not ready to show yet (delay)
  if (isStandalone || dismissed || !shouldShow) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  // Chromium install prompt
  if (isInstallable) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-40 rounded-lg border bg-card p-4 shadow-lg animate-in slide-in-from-bottom">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-between gap-4 pr-6">
          <p className="text-sm text-foreground">Install for offline access</p>
          <button
            type="button"
            onClick={promptInstall}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Install
          </button>
        </div>
      </div>
    );
  }

  // iOS manual instructions
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 rounded-lg border bg-card p-4 shadow-lg animate-in slide-in-from-bottom">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss install prompt"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="pr-6">
        <p className="font-medium text-foreground">Install this app</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          Tap <Share className="inline h-4 w-4" aria-label="Share icon" /> then
          "Add to Home Screen"
        </p>
      </div>
    </div>
  );
}
