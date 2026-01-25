export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported");
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service worker registered:", registration.scope);

      // Check for updates periodically (every hour)
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000,
      );

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New version available - will implement update banner in Phase 4
            console.log("New version available");
          }
        });
      });
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
