import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { SpiritRow } from "./spirit-row";

interface SpiritListProps {
  filters: {
    complexity?: string[];
    expansion?: string[];
    elements?: string[];
    sort?: "alpha" | "complexity";
  };
  // For view transitions: tracks which spirit we're returning from
  returning?: string;
  returningAspect?: string;
}

export function SpiritList({
  filters,
  returning,
  returningAspect,
}: SpiritListProps) {
  // Client-only rendering to avoid SSR issues with Convex provider
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const spirits = useQuery(
    api.spirits.listSpirits,
    isClient
      ? { complexity: filters.complexity, elements: filters.elements }
      : "skip",
  );

  // Compute view-transition-names for loading skeleton (when returning from detail)
  const loadingImageVTN = returningAspect
    ? `spirit-aspect-${returningAspect}`
    : returning
      ? `spirit-image-${returning}`
      : undefined;
  const loadingTitleVTN =
    returning && !returningAspect ? `spirit-name-${returning}` : undefined;

  // Loading state - reserve space, no spinner per project requirements
  if (spirits === undefined) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div
                className="w-[100px] h-[100px] bg-muted rounded-lg contain-[layout]"
                style={{
                  viewTransitionName: i === 1 ? loadingImageVTN : undefined,
                }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-5 bg-muted rounded w-3/4 contain-[layout]"
                  style={{
                    viewTransitionName: i === 1 ? loadingTitleVTN : undefined,
                  }}
                />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (spirits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground text-lg">No spirits found</p>
        <p className="text-muted-foreground text-sm mt-2">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {spirits.map((spirit) => (
        <SpiritRow
          key={spirit._id}
          spirit={spirit}
          isAspect={spirit.isAspect}
        />
      ))}
    </div>
  );
}
