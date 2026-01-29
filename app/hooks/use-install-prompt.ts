import { useCallback, useEffect, useState } from "react";

/**
 * BeforeInstallPromptEvent interface for PWA installation.
 * This event fires on Chromium browsers when PWA install criteria are met.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface UseInstallPromptResult {
  /** Whether the app can be installed (beforeinstallprompt fired) */
  isInstallable: boolean;
  /** Whether running on iOS (for manual install instructions) */
  isIOS: boolean;
  /** Whether already running as installed PWA */
  isStandalone: boolean;
  /** Trigger the install prompt (Chromium only) */
  promptInstall: () => Promise<void>;
}

/**
 * Hook to handle PWA installation prompts.
 * Captures the beforeinstallprompt event on Chromium and detects iOS for manual instructions.
 *
 * @returns { isInstallable, isIOS, isStandalone, promptInstall }
 */
export function useInstallPrompt(): UseInstallPromptResult {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Detect iOS
    const iosDetected = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iosDetected);

    // Detect standalone mode (already installed)
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const iosStandalone =
      "standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneQuery.matches || iosStandalone);

    // Listen for display-mode changes
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    standaloneQuery.addEventListener("change", handleDisplayModeChange);

    // Capture beforeinstallprompt event (Chromium only)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user choice (optional - could log analytics here)
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the prompt regardless of outcome (can only be used once)
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    isInstallable: deferredPrompt !== null,
    isIOS,
    isStandalone,
    promptInstall,
  };
}
