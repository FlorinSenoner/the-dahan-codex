import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { TurnAccordion } from "./turn-accordion";

interface OpeningSectionProps {
  spiritId: Id<"spirits">;
}

export function OpeningSection({ spiritId }: OpeningSectionProps) {
  const { data: openings, isLoading } = useQuery(
    convexQuery(api.openings.listBySpirit, { spiritId }),
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        <Heading variant="h2" as="h2" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Openings
        </Heading>
        <div className="animate-pulse bg-muted/30 rounded-lg h-32" />
      </section>
    );
  }

  // Don't render section if no openings exist
  if (!openings || openings.length === 0) {
    return null;
  }

  // For now, just show the first opening
  // Future: add tabs for multiple openings
  const opening = openings[0];

  return (
    <section className="space-y-4">
      <Heading variant="h2" as="h2" className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Openings
      </Heading>

      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Heading variant="h3" as="h3">
            {opening.name}
          </Heading>
          {opening.difficulty && (
            <Badge variant="outline" className="text-xs">
              {opening.difficulty}
            </Badge>
          )}
        </div>

        {opening.description && (
          <Text variant="muted">{opening.description}</Text>
        )}

        <TurnAccordion turns={opening.turns} />

        {(opening.author || opening.sourceUrl) && (
          <div className="pt-2 border-t border-border text-xs text-muted-foreground">
            {opening.author && <span>By {opening.author}</span>}
            {opening.author && opening.sourceUrl && <span> · </span>}
            {opening.sourceUrl && (
              <a
                href={opening.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Source
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
