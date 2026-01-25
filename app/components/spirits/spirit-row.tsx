import { Link } from "@tanstack/react-router";
import type { Doc } from "convex/_generated/dataModel";
import { ArrowDown, ArrowUp, Equal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Placeholder gradient for spirits without images
const PLACEHOLDER_GRADIENT =
  "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--accent)) 100%)";

interface SpiritRowProps {
  spirit: Doc<"spirits"> & { isAspect: boolean };
  isAspect: boolean;
}

// Map complexity to badge variant/color
const complexityColors: Record<string, string> = {
  Low: "bg-element-plant/20 text-element-plant border-element-plant/30",
  Moderate: "bg-element-sun/20 text-element-sun border-element-sun/30",
  High: "bg-element-fire/20 text-element-fire border-element-fire/30",
  "Very High": "bg-destructive/20 text-destructive border-destructive/30",
};

// Map complexity modifier to icon and color
const modifierConfig: Record<
  string,
  { icon: typeof ArrowUp; color: string; label: string }
> = {
  easier: { icon: ArrowDown, color: "text-element-plant", label: "Easier" },
  same: {
    icon: Equal,
    color: "text-muted-foreground",
    label: "Same complexity",
  },
  harder: { icon: ArrowUp, color: "text-element-fire", label: "Harder" },
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
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer",
        "active:bg-muted/50 transition-colors duration-150",
        isAspect && "pl-8 bg-muted/10", // Indent aspects
      )}
    >
      {/* Spirit image */}
      <div
        className={cn(
          "relative flex-shrink-0",
          isAspect ? "w-[80px] h-[80px]" : "w-[100px] h-[100px]",
        )}
      >
        {imgError || !spirit.imageUrl ? (
          <div
            className="w-full h-full rounded-lg flex items-center justify-center text-muted-foreground"
            style={{
              background: PLACEHOLDER_GRADIENT,
              viewTransitionName,
            }}
          >
            <span className="text-2xl font-headline">
              {(isAspect ? spirit.aspectName?.[0] : spirit.name[0]) || "?"}
            </span>
          </div>
        ) : (
          <img
            src={spirit.imageUrl}
            alt={spirit.name}
            className="w-full h-full object-cover rounded-lg"
            style={{ viewTransitionName }}
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
        <h3
          className={cn(
            "font-headline font-semibold text-foreground truncate",
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

        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
          {spirit.summary}
        </p>

        {/* Complexity badge for base spirits, modifier for aspects */}
        {isAspect && spirit.complexityModifier ? (
          <div
            className="mt-2 flex items-center gap-1"
            title={modifierConfig[spirit.complexityModifier]?.label}
          >
            {(() => {
              const config = modifierConfig[spirit.complexityModifier];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    config.color,
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{config.label}</span>
                </span>
              );
            })()}
          </div>
        ) : !isAspect ? (
          <Badge
            variant="outline"
            className={cn(
              "mt-2 text-xs",
              complexityColors[spirit.complexity] || "",
            )}
          >
            {spirit.complexity}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}
