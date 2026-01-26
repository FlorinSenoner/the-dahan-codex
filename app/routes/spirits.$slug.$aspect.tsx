import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import {
  complexityBadgeColors,
  elementBadgeColors,
  PLACEHOLDER_GRADIENT,
} from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spirits/$slug/$aspect")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.spirits.getSpiritBySlug, {
        slug: params.slug,
        aspect: params.aspect,
      }),
    );
  },
  component: AspectDetailPage,
});

function AspectDetailPage() {
  const { slug, aspect } = Route.useParams();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { data: spirit } = useSuspenseQuery(
    convexQuery(api.spirits.getSpiritBySlug, { slug, aspect }),
  );

  const imageUrl = spirit?.imageUrl;
  // biome-ignore lint/correctness/useExhaustiveDependencies: imageUrl triggers reset intentionally
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  // Not found state
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
                to: "/spirits/$slug",
                params: { slug },
                viewTransition: true,
              })
            }
            aria-label="Back to spirit"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
          <p className="text-xl font-serif text-foreground mb-2">
            Aspect Not Found
          </p>
          <p className="text-muted-foreground mb-4">
            The aspect "{aspect}" of "{slug}" doesn't exist.
          </p>
          <Link
            to="/spirits/$slug"
            params={{ slug }}
            viewTransition
            className="text-primary hover:underline cursor-pointer"
          >
            Back to Spirit
          </Link>
        </div>
      </div>
    );
  }

  const displayName = spirit.aspectName || spirit.name;
  // View transition name matches spirit-row.tsx for aspects
  const viewTransitionName = `spirit-image-${slug}-${aspect}`;

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
                to: "/spirits/$slug",
                params: { slug },
                viewTransition: true,
              })
            }
            aria-label="Back to spirit"
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
          className="text-foreground text-center mb-2"
          style={{
            viewTransitionName: `spirit-name-${slug}-${aspect}`,
          }}
        >
          {displayName}
        </Heading>

        <Text variant="muted" className="text-center mb-4">
          Aspect of {spirit.name}
        </Text>

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
