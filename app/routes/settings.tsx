import { createFileRoute } from "@tanstack/react-router";
import { useConvex } from "convex/react";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Heading, Text } from "@/components/ui/typography";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const convex = useConvex();

  // State for Download for Offline
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);

  // State for Refresh Data
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for Clear Cache
  const [isClearing, setIsClearing] = useState(false);

  async function downloadForOffline() {
    setIsDownloading(true);
    setDownloadProgress("Loading spirits...");
    try {
      // Fetch all spirits to populate Convex cache
      const spirits = await convex.query(api.spirits.listSpirits, {});

      // Fetch each spirit's detail data (triggers cache population)
      setDownloadProgress(`Loading spirit details (0/${spirits.length})...`);
      for (let i = 0; i < spirits.length; i++) {
        await convex.query(api.spirits.getSpiritBySlug, {
          slug: spirits[i].slug,
        });
        setDownloadProgress(
          `Loading spirit details (${i + 1}/${spirits.length})...`,
        );
      }

      // Fetch openings for each spirit
      setDownloadProgress("Loading openings...");
      for (const spirit of spirits) {
        await convex.query(api.openings.listBySpirit, { spiritId: spirit._id });
      }

      setDownloadProgress("Download complete!");
    } catch (error) {
      console.error("Failed to download for offline:", error);
      setDownloadProgress("Download failed. Check your connection.");
    } finally {
      setIsDownloading(false);
    }
  }

  async function refreshData() {
    setIsRefreshing(true);
    try {
      // Clear the Convex API cache if it exists
      await caches.delete("convex-api-cache");
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setIsRefreshing(false);
    }
  }

  async function clearCache() {
    setIsClearing(true);
    try {
      // Delete all caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister service worker to force full refresh
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to clear cache:", error);
      setIsClearing(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Settings" backHref="/spirits" />

      <main className="p-4 max-w-lg mx-auto">
        {/* Offline Access Section */}
        <section className="mt-6">
          <Heading variant="h3" className="text-foreground">
            Offline Access
          </Heading>
          <div className="mt-4 space-y-3">
            <Text variant="muted">
              Download all spirit data and openings for offline use. Required
              for full offline access.
            </Text>
            <Button
              onClick={downloadForOffline}
              disabled={isDownloading || isRefreshing || isClearing}
              className="w-full"
            >
              <Download className="h-4 w-4" />
              {isDownloading
                ? downloadProgress || "Downloading..."
                : "Download for Offline"}
            </Button>
            {downloadProgress && !isDownloading && (
              <Text
                variant="small"
                className={
                  downloadProgress.includes("failed")
                    ? "text-destructive"
                    : "text-green-500"
                }
              >
                {downloadProgress}
              </Text>
            )}
          </div>
        </section>

        {/* Cache Management Section */}
        <section className="mt-8">
          <Heading variant="h3" className="text-foreground">
            Cache Management
          </Heading>
          <div className="mt-4 space-y-4">
            {/* Refresh Data */}
            <div className="space-y-2">
              <Text variant="muted">
                Fetch fresh data while keeping app files cached.
              </Text>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isDownloading || isRefreshing || isClearing}
                className="w-full"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>

            {/* Clear Cache */}
            <div className="space-y-2">
              <Text variant="muted">
                Remove all cached data and app files. Useful if something seems
                broken.
              </Text>
              <Button
                variant="destructive"
                onClick={clearCache}
                disabled={isDownloading || isRefreshing || isClearing}
                className="w-full"
              >
                <Trash2 className="h-4 w-4" />
                {isClearing ? "Clearing..." : "Clear Cache"}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
