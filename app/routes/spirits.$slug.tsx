import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Search params for aspect selection
const detailSearchSchema = z.object({
  aspect: z.string().optional(),
});

export const Route = createFileRoute("/spirits/$slug")({
  validateSearch: detailSearchSchema,
  component: SpiritDetailPage,
});

// Complexity badge colors (same as spirit-row)
const complexityColors: Record<string, string> = {
  Low: "bg-element-plant/20 text-element-plant border-element-plant/30",
  Moderate: "bg-element-sun/20 text-element-sun border-element-sun/30",
  High: "bg-element-fire/20 text-element-fire border-element-fire/30",
  "Very High": "bg-destructive/20 text-destructive border-destructive/30",
};

// Element badge colors
const elementColors: Record<string, string> = {
  Sun: "bg-element-sun/20 text-element-sun border-element-sun/30",
  Moon: "bg-element-moon/20 text-element-moon border-element-moon/30",
  Fire: "bg-element-fire/20 text-element-fire border-element-fire/30",
  Air: "bg-element-air/20 text-element-air border-element-air/30",
  Water: "bg-element-water/20 text-element-water border-element-water/30",
  Earth: "bg-element-earth/20 text-element-earth border-element-earth/30",
  Plant: "bg-element-plant/20 text-element-plant border-element-plant/30",
  Animal: "bg-element-animal/20 text-element-animal border-element-animal/30",
};

function SpiritDetailPage() {
  const { slug } = Route.useParams();
  const { aspect } = Route.useSearch();
  const navigate = useNavigate();

  // Client-only rendering to avoid SSR issues with Convex provider
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const spirit = useQuery(
    api.spirits.getSpiritBySlug,
    isClient ? { slug, aspect } : "skip",
  );

  // Loading state
  if (spirit === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[44px] min-h-[44px] cursor-pointer"
            onClick={() => navigate({ to: "/spirits" })}
            aria-label="Back to spirits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-4 animate-pulse">
          <div className="w-full h-[200px] bg-muted rounded-lg mb-4" />
          <div className="h-8 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-full mb-4" />
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-16" />
            <div className="h-6 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (spirit === null) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[44px] min-h-[44px] cursor-pointer"
            onClick={() => navigate({ to: "/spirits" })}
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
            className="text-primary hover:underline cursor-pointer"
          >
            Back to Spirits
          </Link>
        </div>
      </div>
    );
  }

  // Determine if showing an aspect
  // For aspects, show just the aspect name as the main title
  // The subtitle will show "Aspect of [Base Spirit Name]"
  const isAspect = !!spirit.aspectName;
  const displayName = isAspect ? spirit.aspectName : spirit.name;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[44px] min-h-[44px] cursor-pointer"
            onClick={() => navigate({ to: "/spirits" })}
            aria-label="Back to spirits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif text-lg font-medium truncate">
            {spirit.name}
          </span>
        </div>
      </header>

      {/* Spirit content */}
      <main className="p-4">
        {/* Hero image */}
        <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-6">
          <img
            src={spirit.imageUrl}
            alt={displayName}
            className="w-full h-full object-cover rounded-xl"
            style={{
              viewTransitionName: isAspect
                ? `spirit-aspect-${spirit.aspectName?.toLowerCase()}`
                : `spirit-image-${slug}`,
            }}
          />
        </div>

        {/* Spirit name */}
        <h1
          className="font-serif text-2xl font-bold text-foreground text-center mb-2"
          style={{
            viewTransitionName: isAspect ? undefined : `spirit-name-${slug}`,
          }}
        >
          {displayName}
        </h1>

        {/* Aspect indicator */}
        {isAspect && (
          <p className="text-center text-muted-foreground text-sm mb-4">
            Aspect of {spirit.name}
          </p>
        )}

        {/* Complexity badge */}
        <div className="flex justify-center mb-4">
          <Badge
            variant="outline"
            className={cn("text-sm", complexityColors[spirit.complexity] || "")}
          >
            {spirit.complexity} Complexity
          </Badge>
        </div>

        {/* Summary */}
        <p className="text-muted-foreground text-center max-w-md mx-auto mb-4">
          {spirit.summary}
        </p>

        {/* Detailed description (if available) */}
        {spirit.description && (
          <p className="text-foreground/80 text-center max-w-lg mx-auto mb-6 text-sm leading-relaxed">
            {spirit.description}
          </p>
        )}

        {/* Elements */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {spirit.elements.map((element) => (
            <Badge
              key={element}
              variant="outline"
              className={cn("text-xs", elementColors[element] || "")}
            >
              {element}
            </Badge>
          ))}
        </div>

        {/* Placeholder for future content (Phase 3) */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground text-center">
            Overview, Growth, and Presence tracks coming in Phase 3
          </p>
        </div>
      </main>
    </div>
  );
}
