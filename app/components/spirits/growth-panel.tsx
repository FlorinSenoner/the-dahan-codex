import type { Doc } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

interface GrowthPanelProps {
  growth: NonNullable<Doc<"spirits">["growth"]>;
}

// Format a growth action into human-readable text
function formatAction(
  action: NonNullable<Doc<"spirits">["growth"]>["options"][0]["actions"][0],
): string {
  switch (action.type) {
    case "reclaim":
      return action.variant === "all" ? "Reclaim All" : "Reclaim One";
    case "gainEnergy": {
      const amt = action.amount ?? 1;
      return "+" + amt + " Energy";
    }
    case "gainPowerCard":
      return action.cardType === "major"
        ? "Gain Major Power"
        : "Gain Power Card";
    case "addPresence": {
      const range = action.range ?? 0;
      const terrain = action.terrain ? ", " + action.terrain : "";
      return "Add Presence (Range " + range + terrain + ")";
    }
    case "push": {
      const count = action.count ?? 1;
      const piece = action.pieceType ?? "Invader";
      const target = action.target ? " " + action.target : "";
      return "Push " + count + " " + piece + target;
    }
    case "damage": {
      const amount = action.amount ?? 1;
      const target = action.target ?? "in one of your lands";
      return amount + " Damage " + target;
    }
    case "gainElement":
      return "Gain " + action.element;
    default:
      return action.type;
  }
}

export function GrowthPanel({ growth }: GrowthPanelProps) {
  if (!growth || !growth.options || growth.options.length === 0) {
    return (
      <section className="space-y-3">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <Text variant="muted">Growth data coming soon.</Text>
      </section>
    );
  }

  const { type, options } = growth;
  const pickLabel = type === "pick-two" ? "Pick Two" : "Pick One";

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <span className="text-xs text-muted-foreground">({pickLabel})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          return (
            <Card key={option.id} className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  {option.id}
                  {option.cost !== undefined && option.cost > 0 && (
                    <span className="ml-2 text-amber-400">
                      ({option.cost} Energy)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {option.actions.map((action, actionIdx) => {
                    const actionKey = option.id + "-" + action.type + "-" + actionIdx;
                    return (
                      <li
                        key={actionKey}
                        className="text-sm text-muted-foreground"
                      >
                        {formatAction(action)}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
