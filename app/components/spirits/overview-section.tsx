import type { Doc } from "convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Heading } from "@/components/ui/typography";
import { complexityBadgeColors, elementBadgeColors } from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";
import { PowerRadarChart } from "./power-radar-chart";

interface OverviewSectionProps {
  spirit: Doc<"spirits">;
}

export function OverviewSection({ spirit }: OverviewSectionProps) {
  const hasStrengths = spirit.strengths && spirit.strengths.length > 0;
  const hasWeaknesses = spirit.weaknesses && spirit.weaknesses.length > 0;
  const hasContent =
    spirit.powerRatings || hasStrengths || hasWeaknesses || spirit.description;

  if (!hasContent) {
    return null;
  }

  const content = (
    <div className="space-y-6">
      {/* Complexity and Elements Row */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-center">
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

      {/* Power Ratings Radar Chart */}
      {spirit.powerRatings && (
        <div className="py-4">
          <PowerRadarChart ratings={spirit.powerRatings} />
        </div>
      )}

      {/* Strengths and Weaknesses */}
      <div className="space-y-4">
        {hasStrengths && (
          <div className="space-y-2">
            <Heading variant="h4" as="h3" className="text-green-400">
              Strengths
            </Heading>
            <ul className="space-y-1 pl-4">
              {spirit.strengths?.map((strength) => (
                <li
                  key={strength}
                  className="text-sm text-muted-foreground list-disc"
                >
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasWeaknesses && (
          <div className="space-y-2">
            <Heading variant="h4" as="h3" className="text-red-400">
              Weaknesses
            </Heading>
            <ul className="space-y-1 pl-4">
              {spirit.weaknesses?.map((weakness) => (
                <li
                  key={weakness}
                  className="text-sm text-muted-foreground list-disc"
                >
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Collapsible */}
      <Collapsible defaultOpen={false} className="lg:hidden">
        <CollapsibleTrigger className="w-full flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg cursor-pointer min-h-[44px]">
          <span className="font-medium">Overview</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">{content}</CollapsibleContent>
      </Collapsible>

      {/* Desktop: Always visible in sidebar */}
      <div className="hidden lg:block">{content}</div>
    </>
  );
}
