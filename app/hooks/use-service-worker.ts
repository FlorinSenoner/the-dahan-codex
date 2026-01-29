import { useCallback, useEffect, useState } from "react";
import { Workbox } from "workbox-window";

interface UseServiceWorkerResult {
  /** Whether a new service worker is waiting to activate */
  isUpdateAvailable: boolean;
  /** Trigger the waiting service worker to activate and reload */
  triggerUpdate: () => void;
}

/**
 * Hook to manage service worker updates using workbox-window.
 * Detects when a new SW is waiting and provides a function to trigger the update.
 *
 * @returns { isUpdateAvailable, triggerUpdate }
 */
export function useServiceWorker(): UseServiceWorkerResult {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [workbox, setWorkbox] = useState<Workbox | null>(null);

  useEffect(() => {
    // Skip in development mode
    if (import.meta.env.DEV) {
      return;
    }

    // Skip if service workers not supported
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const wb = new Workbox("/sw.js");

    // Listen for waiting event - new SW ready to activate
    wb.addEventListener("waiting", () => {
      setIsUpdateAvailable(true);
    });

    // Listen for controlling event - new SW has taken over
    wb.addEventListener("controlling", () => {
      // Reload to ensure fresh content
      window.location.reload();
    });

    // Register the service worker
    wb.register();

    setWorkbox(wb);
  }, []);

  const triggerUpdate = useCallback(() => {
    if (workbox) {
      // Tell the waiting SW to skip waiting and become active
      workbox.messageSkipWaiting();
    }
  }, [workbox]);

  return {
    isUpdateAvailable,
    triggerUpdate,
  };
}
