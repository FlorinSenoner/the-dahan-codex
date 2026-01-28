import { createFileRoute } from "@tanstack/react-router";
import { useConvex } from "convex/react";
import { del } from "idb-keyval";
import { RefreshCw, Trash2 } from "lucide-react";
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

  // State for Sync Data
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // State for Clear Cache
  const [isClearing, setIsClearing] = useState(false);

  async function syncData() {
    setIsSyncing(true);
    setSyncStatus("Loading spirits...");
    try {
      // Fetch all spirits
      const spirits = await convex.query(api.spirits.listSpirits, {});

      // Get unique base spirit slugs (filter out aspects)
      const baseSpiritSlugs = spirits
        .filter((s) => !s.isAspect)
        .map((s) => s.slug);

      // Fetch each base spirit AND its aspects via getSpiritWithAspects
      setSyncStatus(`Syncing spirits (0/${baseSpiritSlugs.length})...`);
      for (let i = 0; i < baseSpiritSlugs.length; i++) {
        // This fetches base spirit AND all its aspects in one query
        await convex.query(api.spirits.getSpiritWithAspects, {
          slug: baseSpiritSlugs[i],
        });
        setSyncStatus(
          `Syncing spirits (${i + 1}/${baseSpiritSlugs.length})...`,
        );
      }

      // Also fetch individual spirit pages to cache getSpiritBySlug responses
      for (const spirit of spirits) {
        if (spirit.isAspect) {
          // For aspects, need to call with aspect parameter
          const baseSpirit = spirits.find((s) => s._id === spirit.baseSpirit);
          if (baseSpirit && spirit.aspectName) {
            await convex.query(api.spirits.getSpiritBySlug, {
              slug: baseSpirit.slug,
              aspect: spirit.aspectName,
            });
          }
        } else {
          await convex.query(api.spirits.getSpiritBySlug, {
            slug: spirit.slug,
          });
        }
      }

      // Fetch openings for each spirit
      setSyncStatus("Syncing openings...");
      for (const spirit of spirits) {
        await convex.query(api.openings.listBySpirit, { spiritId: spirit._id });
      }

      setSyncStatus("Sync complete!");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (error) {
      console.error("Failed to sync data:", error);
      setSyncStatus("Sync failed. Check your connection.");
    } finally {
      setIsSyncing(false);
    }
  }

  async function clearCache() {
    setIsClearing(true);
    try {
      // Delete TanStack Query IndexedDB cache
      await del("tanstack-query-cache");

      // Delete all service worker caches
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
        {/* Cache Management Section */}
        <section className="mt-6">
          <Heading variant="h3" className="text-foreground">
            Cache Management
          </Heading>
          <Text variant="muted" className="mt-2">
            Sync spirit data for offline access or clear cached data if
            something seems broken.
          </Text>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={syncData}
              disabled={isSyncing || isClearing}
              className="flex-1"
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? syncStatus || "Syncing..." : "Sync Data"}
            </Button>
            <Button
              variant="outline"
              onClick={clearCache}
              disabled={isSyncing || isClearing}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear Cache"}
            </Button>
          </div>
          {syncStatus && !isSyncing && (
            <Text variant="small" className="mt-2 text-muted-foreground">
              {syncStatus}
            </Text>
          )}
        </section>
      </main>
    </div>
  );
}
