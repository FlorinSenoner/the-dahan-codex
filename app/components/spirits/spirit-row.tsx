import { Link } from "@tanstack/react-router";
import type { Doc } from "convex/_generated/dataModel";
import { ArrowDown, ArrowUp, Equal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  complexityBadgeColors,
  modifierColors,
  PLACEHOLDER_GRADIENT,
} from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";

interface SpiritRowProps {
  spirit: Doc<"spirits"> & { isAspect: boolean };
  isAspect: boolean;
}

// Map complexity modifier to icon (icons kept here to avoid lucide-react in lib/)
const modifierIcons: Record<string, typeof ArrowUp> = {
  easier: ArrowDown,
  same: Equal,
  harder: ArrowUp,
};

export function SpiritRow({ spirit, isAspect }: SpiritRowProps) {
  const [imgError, setImgError] = useState(false);

  // Build the URL - aspects use query param
  const href = isAspect
    ? `/spirits/${spirit.slug}?aspect=${spirit.aspectName?.toLowerCase()}`
    : `/spirits/${spirit.slug}`;

  // Display name includes aspect name if applicable
  const displayName = isAspect ? `${spirit.aspectName}` : spirit.name;

  const viewTransitionName = isAspect
    ? `spirit-aspect-${spirit.aspectName?.toLowerCase()}`
    : `spirit-image-${spirit.slug}`;

  return (
    <Link
      to={href}
      viewTransition
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer",
        "active:bg-muted/50 transition-colors duration-150",
        isAspect && "pl-8 bg-muted/10", // Indent aspects
      )}
    >
      {/* Spirit image */}
      <div
        className={cn(
          "relative shrink-0 contain-[layout] overflow-hidden rounded-lg",
          isAspect ? "w-[80px] h-[80px]" : "w-[100px] h-[100px]",
        )}
        style={{ viewTransitionName }}
      >
        {imgError || !spirit.imageUrl ? (
          <div
            className="w-full h-full flex items-center justify-center text-muted-foreground"
            style={{ background: PLACEHOLDER_GRADIENT }}
          >
            <span className="text-2xl font-headline">
              {(isAspect ? spirit.aspectName?.[0] : spirit.name[0]) || "?"}
            </span>
          </div>
        ) : (
          <img
            src={spirit.imageUrl}
            alt={spirit.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {isAspect && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <span className="text-[10px] text-accent-foreground font-bold">
              A
            </span>
          </div>
        )}
      </div>

      {/* Spirit info */}
      <div className="flex-1 min-w-0">
        {/* Name row with complexity indicator */}
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "font-headline font-semibold text-foreground truncate contain-[layout]",
              isAspect ? "text-base" : "text-lg",
            )}
            style={{
              viewTransitionName: isAspect
                ? undefined
                : `spirit-name-${spirit.slug}`,
            }}
          >
            {displayName}
          </h3>

          {/* Complexity badge for base spirits, modifier icon for aspects */}
          {isAspect && spirit.complexityModifier ? (
            <span
              className={cn(
                "flex-shrink-0",
                modifierColors[spirit.complexityModifier]?.color,
              )}
              title={modifierColors[spirit.complexityModifier]?.label}
            >
              {(() => {
                const colors = modifierColors[spirit.complexityModifier];
                const Icon = modifierIcons[spirit.complexityModifier];
                if (!colors || !Icon) return null;
                return (
                  <>
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{colors.label}</span>
                  </>
                );
              })()}
            </span>
          ) : !isAspect ? (
            <Badge
              variant="outline"
              className={cn(
                "flex-shrink-0 text-xs",
                complexityBadgeColors[spirit.complexity] || "",
              )}
            >
              {spirit.complexity}
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
          {spirit.summary}
        </p>
      </div>
    </Link>
  );
}
