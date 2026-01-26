import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ClientOnly } from "@/components/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import {
  complexityBadgeColors,
  elementBadgeColors,
  PLACEHOLDER_GRADIENT,
} from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";

const detailSearchSchema = z.object({
  aspect: z.string().optional(),
});

export const Route = createFileRoute("/spirits/$slug")({
  validateSearch: detailSearchSchema,
  component: SpiritDetailPage,
});

function SpiritDetailPage() {
  const { slug } = Route.useParams();
  const { aspect } = Route.useSearch();

  return (
    <ClientOnly fallback={<SpiritDetailSkeleton slug={slug} aspect={aspect} />}>
      <SpiritDetailContent slug={slug} aspect={aspect} />
    </ClientOnly>
  );
}

interface SpiritDetailSkeletonProps {
  slug: string;
  aspect?: string;
}

function SpiritDetailSkeleton({ slug, aspect }: SpiritDetailSkeletonProps) {
  const navigate = useNavigate();

  const loadingImageVTN = aspect
    ? `spirit-aspect-${aspect.toLowerCase()}`
    : `spirit-image-${slug}`;
  const loadingTitleVTN = aspect ? undefined : `spirit-name-${slug}`;

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
              search: { returning: slug, returningAspect: aspect },
              viewTransition: true,
            })
          }
          aria-label="Back to spirits"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>
      <div className="p-4 animate-pulse">
        <div className="flex justify-center">
          <div
            className="h-[300px] aspect-3/2 bg-muted rounded-xl contain-[layout] overflow-hidden"
            style={{ viewTransitionName: loadingImageVTN }}
          />
        </div>
        <div
          className="h-8 bg-muted rounded w-3/4 mx-auto mb-2 contain-[layout]"
          style={{ viewTransitionName: loadingTitleVTN }}
        />
        <div className="h-4 bg-muted rounded w-full mb-4" />
        <div className="flex justify-center gap-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

interface SpiritDetailContentProps {
  slug: string;
  aspect?: string;
}

function SpiritDetailContent({ slug, aspect }: SpiritDetailContentProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const spirit = useQuery(api.spirits.getSpiritBySlug, { slug, aspect });

  const imageUrl = spirit?.imageUrl;
  // biome-ignore lint/correctness/useExhaustiveDependencies: imageUrl triggers reset intentionally
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  if (spirit === undefined) {
    return <SpiritDetailSkeleton slug={slug} aspect={aspect} />;
  }

  if (spirit === null) {
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
                search: { returning: slug, returningAspect: aspect },
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

  const isAspect = !!spirit.aspectName;
  const displayName = isAspect ? spirit.aspectName : spirit.name;
  const viewTransitionName = isAspect
    ? `spirit-aspect-${spirit.aspectName?.toLowerCase()}`
    : `spirit-image-${slug}`;

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
                search: { returning: slug, returningAspect: aspect },
                viewTransition: true,
              })
            }
            aria-label="Back to spirits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif text-lg font-medium truncate">
            {spirit.name}
          </span>
        </div>
      </header>

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
          className="text-foreground text-center mb-2 contain-[layout]"
          style={{
            viewTransitionName: isAspect ? undefined : `spirit-name-${slug}`,
          }}
        >
          {displayName}
        </Heading>

        {isAspect && (
          <Text variant="muted" className="text-center mb-4">
            Aspect of {spirit.name}
          </Text>
        )}

        <div className="flex justify-center mb-4">
          <Badge
            variant="outline"
            className={cn(
              "text-sm",
              complexityBadgeColors[spirit.complexity] || "",
            )}
          >
            {spirit.complexity} Complexity
          </Badge>
        </div>

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

        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        <div className="border border-border rounded-lg p-4 bg-card">
          <Text variant="muted" className="text-center">
            Overview, Growth, and Presence tracks coming in Phase 3
          </Text>
        </div>
      </main>
    </div>
  );
}
