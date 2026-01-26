import type { Doc } from "convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { elementBadgeColors } from "@/lib/spirit-colors";
import { cn } from "@/lib/utils";

type UniquePower = NonNullable<Doc<"spirits">["uniquePowers"]>[number];

interface CardHandProps {
  uniquePowers: NonNullable<Doc<"spirits">["uniquePowers"]>;
}

function PowerCard({ power }: { power: UniquePower }) {
  return (
    <Card className="min-w-[160px] max-w-[200px] shrink-0 bg-muted/30">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-tight">
            {power.name}
          </CardTitle>
          <Badge
            variant="outline"
            className="shrink-0 text-xs px-1.5 py-0 text-amber-400 border-amber-500/50"
          >
            {power.cost}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-3 space-y-2">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            power.speed === "Fast"
              ? "border-amber-500/50 text-amber-400"
              : "border-blue-500/50 text-blue-400",
          )}
        >
          {power.speed}
        </Badge>
        <div className="flex flex-wrap gap-1">
          {power.elements.map((el) => (
            <Badge
              key={el}
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0",
                elementBadgeColors[el] || "",
              )}
            >
              {el}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CardHand({ uniquePowers }: CardHandProps) {
  if (!uniquePowers || uniquePowers.length === 0) {
    return (
      <section className="space-y-3 mt-8">
        <Heading variant="h3" as="h2">
          Starting Cards
        </Heading>
        <Text variant="muted">Card data coming soon.</Text>
      </section>
    );
  }

  return (
    <section className="space-y-3 mt-8">
      <Heading variant="h3" as="h2">
        Starting Cards
      </Heading>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {uniquePowers.map((power) => (
          <PowerCard key={power.name} power={power} />
        ))}
      </div>
    </section>
  );
}
