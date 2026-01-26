import type { Doc } from "convex/_generated/dataModel";
import { GrowthIcon } from "@/components/icons/growth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

// Type for growth action from schema
type GrowthAction = NonNullable<
  Doc<"spirits">["growth"]
>["options"][0]["actions"][0];

// Type for growth option from schema
type GrowthOption = NonNullable<Doc<"spirits">["growth"]>["options"][0];

// Type for full growth data
type GrowthData = NonNullable<Doc<"spirits">["growth"]>;

/**
 * Type guard to check if growth data is in the new format (has options array)
 */
function isNewGrowthFormat(growth: unknown): growth is GrowthData {
  return (
    growth !== null &&
    typeof growth === "object" &&
    "options" in growth &&
    Array.isArray((growth as Record<string, unknown>).options)
  );
}

/**
 * Format a growth action into short, readable text
 */
function formatGrowthActionShort(action: GrowthAction): string {
  switch (action.type) {
    case "reclaim":
      return action.variant === "all" ? "Reclaim All" : "Reclaim One";
    case "gainEnergy": {
      const amt = action.amount ?? 1;
      return `+${amt} Energy`;
    }
    case "gainPowerCard":
      return action.cardType === "major" ? "Gain Major" : "Gain Card";
    case "addPresence": {
      const range = action.range ?? 0;
      const terrain = action.terrain ? ` (${action.terrain})` : "";
      return `+Presence R${range}${terrain}`;
    }
    case "push": {
      const count = action.count ?? 1;
      const piece = action.pieceType ?? "Invader";
      return `Push ${count} ${piece}`;
    }
    case "damage": {
      const amount = action.amount ?? 1;
      return `${amount} Damage`;
    }
    case "gainElement":
      return `+${action.element}`;
    default:
      return action.type;
  }
}

/**
 * Individual action badge with icon and label
 */
function GrowthActionBadge({ action }: { action: GrowthAction }) {
  const Icon = GrowthIcon[action.type];
  const label = formatGrowthActionShort(action);

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/50 border border-border/50">
      {Icon && <Icon size={16} className="text-primary shrink-0" />}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Single growth option card (G1, G2, G3, etc.)
 */
function GrowthOptionCard({ option }: { option: GrowthOption }) {
  return (
    <Card className="bg-muted/30 group relative">
      {/* G1/G2/G3 label - visible on hover */}
      <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Badge variant="secondary" className="text-xs">
          {option.id}
        </Badge>
      </div>

      {/* Cost badge if present */}
      {option.cost !== undefined && option.cost > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge
            variant="outline"
            className="text-xs text-amber-400 border-amber-400/50"
          >
            {option.cost} Energy
          </Badge>
        </div>
      )}

      <CardContent className="p-3 flex flex-wrap gap-2">
        {option.actions.map((action, idx) => {
          const actionKey = `${option.id}-${action.type}-${idx}`;
          return <GrowthActionBadge key={actionKey} action={action} />;
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Growth panel content for valid growth data
 */
function GrowthPanelContent({ growth }: { growth: GrowthData }) {
  const { type, options } = growth;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        {type && (
          <Badge variant="outline" className="text-xs">
            {type === "pick-two" ? "Pick Two" : "Pick One"}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => (
          <GrowthOptionCard key={option.id} option={option} />
        ))}
      </div>
    </section>
  );
}

interface GrowthPanelProps {
  growth: unknown;
}

/**
 * Growth panel component with backward compatibility
 * Handles both new format (options array) and old format (graceful fallback)
 */
export function GrowthPanel({ growth }: GrowthPanelProps) {
  // Handle missing growth data
  if (!growth) {
    return (
      <section className="space-y-3">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <Text variant="muted">Growth data coming soon.</Text>
      </section>
    );
  }

  // Handle old format gracefully
  if (!isNewGrowthFormat(growth)) {
    return (
      <section className="space-y-3">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <Text variant="small" className="text-muted-foreground">
          Growth data is in legacy format. Please reseed spirits to see updated
          growth options.
        </Text>
      </section>
    );
  }

  // Handle empty options
  if (!growth.options || growth.options.length === 0) {
    return (
      <section className="space-y-3">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <Text variant="muted">Growth data coming soon.</Text>
      </section>
    );
  }

  // Render new format
  return <GrowthPanelContent growth={growth} />;
}
