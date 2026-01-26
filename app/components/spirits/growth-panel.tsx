import type { Doc } from "convex/_generated/dataModel";
import { GrowthIcon } from "@/components/icons/growth";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading, Text } from "@/components/ui/typography";

// Type for growth action from schema
type GrowthAction = NonNullable<
  Doc<"spirits">["growth"]
>["options"][0]["actions"][0];

// Type for orActions option
type OrActionOption = NonNullable<
  NonNullable<Doc<"spirits">["growth"]>["options"][0]["orActions"]
>[0];

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
 * Get short modifier text for an action (e.g., "+2", "Range 1", "Major")
 * Returns null for actions that don't need modifier text
 */
function getActionModifier(action: GrowthAction): string | null {
  switch (action.type) {
    case "reclaim":
      return null; // Icon is self-explanatory
    case "gainEnergy":
      return action.amount !== undefined ? `+${action.amount}` : null;
    case "addPresence": {
      const range = action.range ?? 0;
      const terrain = action.terrain ? ` ${action.terrain}` : "";
      return `R${range}${terrain}`;
    }
    case "gainPowerCard":
      return action.cardType === "major" ? "Major" : null;
    case "push":
      return action.count !== undefined ? `${action.count}` : null;
    case "damage":
      return action.amount !== undefined ? `${action.amount}` : null;
    case "gainElement":
      return action.element ?? null;
    default:
      return null;
  }
}

/**
 * Get full action description for tooltip
 */
function getActionDescription(action: GrowthAction): string {
  switch (action.type) {
    case "reclaim":
      return action.variant === "all"
        ? "Reclaim All Cards"
        : "Reclaim One Card";
    case "gainEnergy": {
      const amt = action.amount ?? 1;
      return `Gain ${amt} Energy`;
    }
    case "gainPowerCard":
      return action.cardType === "major"
        ? "Gain Major Power"
        : "Gain Power Card";
    case "addPresence": {
      const range = action.range ?? 0;
      const terrain = action.terrain ? ` (${action.terrain})` : "";
      return `Add Presence at Range ${range}${terrain}`;
    }
    case "push": {
      const count = action.count ?? 1;
      const piece = action.pieceType ?? "Invaders";
      const target = action.target ? ` from ${action.target}` : "";
      return `Push ${count} ${piece}${target}`;
    }
    case "damage": {
      const amount = action.amount ?? 1;
      const target = action.target ?? "in a land";
      return `Deal ${amount} Damage ${target}`;
    }
    case "gainElement":
      return `Gain ${action.element} Element`;
    default:
      return action.type;
  }
}

/**
 * Individual action icon with tooltip
 */
function GrowthActionIcon({ action }: { action: GrowthAction }) {
  const Icon = GrowthIcon[action.type];
  const modifier = getActionModifier(action);
  const description = getActionDescription(action);

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 cursor-default">
          {Icon && (
            <Icon size={32} className="text-muted-foreground shrink-0" />
          )}
          {modifier && (
            <span className="text-sm font-medium text-muted-foreground">
              {modifier}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Render orActions as "Option A OR Option B" with visual separator
 */
function OrActionsGroup({ orActions }: { orActions: OrActionOption[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {orActions.map((orOption, idx) => (
        <div key={orOption.label} className="flex items-center gap-2">
          {idx > 0 && (
            <span className="text-xs font-semibold text-amber-500 uppercase">
              or
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/50 border border-border/50">
            <span className="text-xs text-muted-foreground mr-1">
              {orOption.label}:
            </span>
            {orOption.actions.map((action, actionIdx) => {
              const actionKey = `${orOption.label}-${action.type}-${actionIdx}`;
              return <GrowthActionIcon key={actionKey} action={action} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Single growth option card (G1, G2, G3, etc.) with subgrid layout
 */
function GrowthOptionCard({ option }: { option: GrowthOption }) {
  const hasOrActions = option.orActions && option.orActions.length > 0;

  return (
    <div className="row-span-2 grid grid-rows-subgrid gap-2 bg-muted/30 rounded-lg p-3 group relative">
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

      {/* Row 1: Actions with icons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Repeat badge if present */}
        {option.repeat && option.repeat > 1 && (
          <Badge variant="secondary" className="text-xs">
            x{option.repeat}
          </Badge>
        )}

        {/* Regular actions */}
        {option.actions.map((action, idx) => {
          const actionKey = `${option.id}-${action.type}-${idx}`;
          return <GrowthActionIcon key={actionKey} action={action} />;
        })}

        {/* Or actions for complex spirits */}
        {hasOrActions && <OrActionsGroup orActions={option.orActions!} />}
      </div>

      {/* Row 2: Option ID (hover reveal) */}
      <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {option.id}
      </div>
    </div>
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
            {type === "pick-two"
              ? "Pick Two"
              : type === "pick-any"
                ? "Pick Any"
                : "Pick One"}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 grid-rows-[repeat(2,auto)]">
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
