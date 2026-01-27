import type { Doc } from "convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";
import { ElementIcon } from "@/components/icons/elements";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
        "p-3 rounded-lg min-w-0 transition-colors",
        // Full border with speed-based color and hover effects
        "border",
        power.speed === "Fast"
          ? "border-amber-500/50 hover:border-amber-400 hover:bg-amber-500/10"
          : "border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10",
      )}
    >
      {/* Card title and cost */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4
          className="text-sm font-medium leading-tight truncate"
          title={power.name}
        >
          {power.name}
        </h4>
        <Badge
          variant="outline"
          className="shrink-0 text-xs px-1.5 py-0 text-amber-400 border-amber-500/50"
        >
          {power.cost}
        </Badge>
      </div>

      <div className="space-y-2">
        {/* Line 1: Range/Target (no speed badge - indicated by border) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {power.range && <span>R: {power.range}</span>}
          {power.target && <span className="truncate">T: {power.target}</span>}
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

  // For now, all uniquePowers are "hand" cards
  // Discard section will be added when discardPile field is added to schema
  const handCards = uniquePowers;

  return (
    <section className="space-y-3 mt-8">
      <Heading variant="h3" as="h2">
        Cards
      </Heading>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg cursor-pointer min-h-[44px]">
          <div className="flex items-center gap-2">
            <span className="font-medium">Hand</span>
            <span className="text-xs text-muted-foreground">
              ({handCards.length})
            </span>
          </div>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {handCards.map((power) => (
              <PowerCard key={power.name} power={power} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Discard section placeholder - will be populated when discardPile is added to schema
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 cursor-pointer">
          <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=closed]:-rotate-90" />
          <span className="font-medium">Discard</span>
          <span className="text-xs text-muted-foreground">(0)</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {discardCards.map((power) => (
              <PowerCard key={power.name} power={power} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      */}
    </section>
  );
}
