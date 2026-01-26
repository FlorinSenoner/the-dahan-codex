import type { Doc } from "convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { complexityBadgeColors, elementBadgeColors } from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";
import { PowerRadarChart } from "./power-radar-chart";

interface OverviewSectionProps {
  spirit: Doc<"spirits">;
}

export function OverviewSection({ spirit }: OverviewSectionProps) {
  const hasStrengths = spirit.strengths && spirit.strengths.length > 0;
  const hasWeaknesses = spirit.weaknesses && spirit.weaknesses.length > 0;

  return (
    <section className="space-y-6">
      {/* Complexity and Elements Row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Fallback for spirits without data */}
      {!spirit.powerRatings && !hasStrengths && !hasWeaknesses && (
        <Text variant="muted" className="text-center py-4">
          Detailed overview data coming soon.
        </Text>
      )}
    </section>
  );
}
