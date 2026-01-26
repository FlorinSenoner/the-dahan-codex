import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { CardHand } from "@/components/spirits/card-hand";
import { GrowthPanel } from "@/components/spirits/growth-panel";
import { InnatePowers } from "@/components/spirits/innate-powers";
import { OverviewSection } from "@/components/spirits/overview-section";
import { PresenceTrack } from "@/components/spirits/presence-track";
import { SpecialRules } from "@/components/spirits/special-rules";
import { VariantTabs } from "@/components/spirits/variant-tabs";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { PLACEHOLDER_GRADIENT } from "@/lib/spirit-colors";

export const Route = createFileRoute("/spirits/$slug")({
  loader: async ({ context, params }) => {
    // Preload both queries in parallel
    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.spirits.getSpiritBySlug, {
          slug: params.slug,
        }),
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.spirits.getSpiritWithAspects, {
          slug: params.slug,
        }),
      ),
    ]);
  },
  component: SpiritDetailLayout,
});

function SpiritDetailLayout() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const matches = useMatches();

  // Check if we have a child route (aspect)
  const hasChildRoute = matches.some(
    (m) => m.routeId === "/spirits/$slug/$aspect",
  );

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
          <span className="font-serif text-lg font-medium truncate">
            {base.name}
          </span>
        </div>
      </header>

      {hasAspects && <VariantTabs base={base} aspects={aspects} />}

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
    <main className="p-4">
      <div className="flex justify-center mb-6">
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
        <Text variant="muted" className="text-center mb-4">
          Aspect of {spirit.name}
        </Text>
      )}

      <Text className="text-muted-foreground text-center max-w-md mx-auto mb-4">
        {spirit.summary}
      </Text>

      {spirit.description && (
        <Text
          variant="muted"
          className="text-foreground/80 text-center max-w-lg mx-auto mb-6 leading-relaxed"
        >
          {spirit.description}
        </Text>
      )}

      <OverviewSection spirit={spirit} />

      {spirit.specialRules && spirit.specialRules.length > 0 && (
        <SpecialRules rules={spirit.specialRules} />
      )}

      {spirit.growth && <GrowthPanel growth={spirit.growth} />}

      {spirit.presenceTracks && (
        <PresenceTrack presenceTracks={spirit.presenceTracks} />
      )}

      {spirit.innates && <InnatePowers innates={spirit.innates} />}

      {spirit.uniquePowers && <CardHand uniquePowers={spirit.uniquePowers} />}
    </main>
  );
}
