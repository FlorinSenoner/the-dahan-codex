import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useBlocker,
  useMatches,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EditFab } from "@/components/admin/edit-fab";
import { ExternalLinks } from "@/components/spirits/external-links";
import { OpeningSection } from "@/components/spirits/opening-section";
import { OverviewSection } from "@/components/spirits/overview-section";
import { VariantTabs } from "@/components/spirits/variant-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { useAdmin } from "@/hooks";
import {
  complexityBadgeColors,
  elementBadgeColors,
  PLACEHOLDER_GRADIENT,
} from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";

/**
 * Spirit detail page
 *
 * Offline behavior: This page works offline for spirits that have been
 * synced via Settings > Sync Data. Without prior sync, the page will
 * show a loading state while waiting for Convex connection.
 */
export const Route = createFileRoute("/spirits/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: search.edit === true || search.edit === "true",
    opening: typeof search.opening === "string" ? search.opening : undefined,
  }),
  loader: async ({ context, params }) => {
    // Use prefetchQuery to avoid blocking when offline
    // The component's useSuspenseQuery will use cached data if available
    try {
      await Promise.all([
        context.queryClient.prefetchQuery(
          convexQuery(api.spirits.getSpiritBySlug, {
            slug: params.slug,
          }),
        ),
        context.queryClient.prefetchQuery(
          convexQuery(api.spirits.getSpiritWithAspects, {
            slug: params.slug,
          }),
        ),
      ]);
    } catch {
      // Ignore fetch errors - component will use cached data or show error state
    }
  },
  component: SpiritDetailLayout,
});

function SpiritDetailLayout() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const matches = useMatches();
  const params = useParams({ strict: false });

  // Track tabs visibility for header aspect name display
  const [tabsVisible, setTabsVisible] = useState(true);
  const handleVisibilityChange = useCallback((visible: boolean) => {
    setTabsVisible(visible);
  }, []);

  // Check if we have a child route (aspect)
  const hasChildRoute = matches.some(
    (m) => m.routeId === "/spirits/$slug/$aspect",
  );

  // Get current aspect from URL params
  const currentAspect = (params as { aspect?: string }).aspect;

  // Get base spirit with aspects for the tabs
  const { data: spiritData } = useSuspenseQuery(
    convexQuery(api.spirits.getSpiritWithAspects, { slug }),
  );

  // Not found state
  if (spiritData === null) {
    return (
      <div className="min-h-screen bg-background">
        <header
          className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3"
          style={{ viewTransitionName: "detail-header" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[44px] min-h-[44px] cursor-pointer"
            onClick={() =>
              navigate({
                to: "/spirits",
                viewTransition: true,
              })
            }
            aria-label="Back to spirits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
          <p className="text-xl font-serif text-foreground mb-2">
            Spirit Not Found
          </p>
          <p className="text-muted-foreground mb-4">
            The spirit "{slug}" doesn't exist.
          </p>
          <Link
            to="/spirits"
            viewTransition
            className="text-primary hover:underline cursor-pointer"
          >
            Back to Spirits
          </Link>
        </div>
      </div>
    );
  }

  const { base, aspects } = spiritData;
  const hasAspects = aspects.length > 0;

  // Find current aspect display name
  const currentAspectData = currentAspect
    ? aspects.find((a) => a.aspectName?.toLowerCase() === currentAspect)
    : null;
  const aspectDisplayName = currentAspectData?.aspectName;

  // Show aspect name in header when tabs are scrolled out of view
  const showAspectInHeader = !tabsVisible && aspectDisplayName;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header
        className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3"
        style={{ viewTransitionName: "detail-header" }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[44px] min-h-[44px] cursor-pointer"
            onClick={() =>
              navigate({
                to: "/spirits",
                viewTransition: true,
              })
            }
            aria-label="Back to spirits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-lg font-medium truncate">
              {base.name}
            </span>
            {showAspectInHeader && (
              <span className="text-xs text-muted-foreground truncate">
                {aspectDisplayName}
              </span>
            )}
          </div>
        </div>
      </header>

      {hasAspects && (
        <VariantTabs
          base={base}
          aspects={aspects}
          onVisibilityChange={handleVisibilityChange}
        />
      )}

      {hasChildRoute ? (
        <Outlet />
      ) : (
        <SpiritDetailContent spirit={base} slug={slug} />
      )}
    </div>
  );
}

interface SpiritDetailContentProps {
  spirit: Doc<"spirits">;
  slug: string;
  aspect?: string;
}

export function SpiritDetailContent({
  spirit,
  slug,
  aspect,
}: SpiritDetailContentProps) {
  const [imgError, setImgError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveHandler, setSaveHandler] = useState<(() => Promise<void>) | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const isAdmin = useAdmin();

  // Stable callback references to prevent child re-renders
  const handleHasChangesChange = useCallback((value: boolean) => {
    setHasChanges(value);
  }, []);

  const handleSaveHandlerReady = useCallback(
    (handler: (() => Promise<void>) | null) => {
      setSaveHandler(() => handler);
    },
    [],
  );

  // Block navigation when there are unsaved changes
  // VERIFIED: TanStack Router v1.157.9 uses shouldBlockFn API (v1.40+)
  useBlocker({
    shouldBlockFn: () => {
      if (!hasChanges) return false;
      return !confirm("You have unsaved changes. Leave anyway?");
    },
    enableBeforeUnload: hasChanges,
  });

  // Wrap save handler to track saving state
  const handleSave = useCallback(async () => {
    if (!saveHandler) return;
    setIsSaving(true);
    try {
      await saveHandler();
    } finally {
      setIsSaving(false);
    }
  }, [saveHandler]);

  const imageUrl = spirit.imageUrl;
  // biome-ignore lint/correctness/useExhaustiveDependencies: imageUrl triggers reset intentionally
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const displayName = spirit.aspectName || spirit.name;
  // Use aspect-specific view transition name if aspect, otherwise base
  const viewTransitionName = aspect
    ? `spirit-image-${slug}-${aspect}`
    : `spirit-image-${slug}`;
  const nameTransitionName = aspect
    ? `spirit-name-${slug}-${aspect}`
    : `spirit-name-${slug}`;

  return (
    <main className="p-4 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:max-w-6xl lg:mx-auto">
      {/* Left column: Main board content */}
      <div className="space-y-6">
        <div className="flex justify-center">
          <div
            className="h-[300px] aspect-3/2 contain-[layout] overflow-hidden rounded-xl"
            style={{ viewTransitionName }}
          >
            {imgError || !spirit.imageUrl ? (
              <div
                className="w-full h-full flex items-center justify-center text-muted-foreground"
                style={{ background: PLACEHOLDER_GRADIENT }}
              >
                <span className="text-6xl font-headline">
                  {displayName?.[0] || "?"}
                </span>
              </div>
            ) : (
              <img
                src={spirit.imageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        <div>
          <Heading
            variant="h1"
            as="h1"
            className="text-foreground text-center mb-2 w-fit mx-auto"
            style={{
              viewTransitionName: nameTransitionName,
            }}
          >
            {displayName}
          </Heading>

          {spirit.aspectName && (
            <Text variant="muted" className="text-center mb-2">
              Aspect of {spirit.name}
            </Text>
          )}

          {/* Pills below name - always visible */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
            <Badge
              variant="outline"
              className={cn(
                "text-sm",
                complexityBadgeColors[spirit.complexity] || "",
              )}
            >
              {spirit.complexity} Complexity
            </Badge>
            {spirit.elements.map((element) => (
              <Badge
                key={element}
                variant="outline"
                className={cn("text-xs", elementBadgeColors[element] || "")}
              >
                {element}
              </Badge>
            ))}
          </div>

          <Text className="text-muted-foreground text-center max-w-md mx-auto">
            {spirit.summary}
          </Text>
        </div>

        {/* Mobile: Overview section appears here */}
        <div className="lg:hidden">
          <OverviewSection spirit={spirit} description={spirit.description} />
        </div>

        <OpeningSection
          spiritId={spirit._id}
          onSaveHandlerReady={handleSaveHandlerReady}
          onHasChangesChange={handleHasChangesChange}
        />

        <ExternalLinks spiritName={spirit.name} wikiUrl={spirit.wikiUrl} />
      </div>

      {/* Right column: Sidebar (overview) - desktop only */}
      <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
        <OverviewSection spirit={spirit} description={spirit.description} />
      </aside>

      {isAdmin && (
        <EditFab
          onSave={handleSave}
          hasChanges={hasChanges}
          isSaving={isSaving}
        />
      )}
    </main>
  );
}
