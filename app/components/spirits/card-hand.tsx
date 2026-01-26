import type { Doc } from "convex/_generated/dataModel";
import { ElementIcon } from "@/components/icons/elements";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type UniquePower = NonNullable<Doc<"spirits">["uniquePowers"]>[number];

interface CardHandProps {
  uniquePowers: NonNullable<Doc<"spirits">["uniquePowers"]>;
}

function PowerCard({ power }: { power: UniquePower }) {
  return (
    <div
      className={cn(
        "min-w-[200px] max-w-[280px] p-3 rounded-lg shrink-0",
        "border-2",
        power.speed === "Fast"
          ? "border-amber-500/60 bg-amber-500/5"
          : "border-blue-500/60 bg-blue-500/5",
      )}
    >
      {/* Card title and cost */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-medium leading-tight">{power.name}</span>
        <Badge
          variant="outline"
          className="shrink-0 text-xs px-1.5 py-0 text-amber-400 border-amber-500/50"
        >
          {power.cost}
        </Badge>
      </div>

      <div className="space-y-2">
        {/* Line 1: Speed/Range/Target */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
          {power.range && <span>R: {power.range}</span>}
          {power.target && <span>T: {power.target}</span>}
        </div>

        {/* Line 2: Element icons */}
        <div className="flex items-center gap-1">
          {power.elements.map((element) => {
            const Icon = ElementIcon[element];
            return Icon ? <Icon key={element} size={16} /> : null;
          })}
        </div>
      </div>
    </div>
  );
}

export function CardHand({ uniquePowers }: CardHandProps) {
  if (!uniquePowers || uniquePowers.length === 0) {
    return (
      <section className="space-y-3 mt-8">
        <Heading variant="h3" as="h2">
          Cards
        </Heading>
        <Text variant="muted">Card data coming soon.</Text>
      </section>
    );
  }

  return (
    <section className="space-y-3 mt-8">
      <Heading variant="h3" as="h2">
        Cards
      </Heading>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {uniquePowers.map((power) => (
          <PowerCard key={power.name} power={power} />
        ))}
      </div>
    </section>
  );
}
