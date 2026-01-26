import type { Doc } from "convex/_generated/dataModel";
import { ElementIcon } from "@/components/icons/elements";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type Innate = NonNullable<Doc<"spirits">["innates"]>[number];

interface InnatePowersProps {
  innates: NonNullable<Doc<"spirits">["innates"]>;
}

// Element display order
const ELEMENT_ORDER = [
  "Sun",
  "Moon",
  "Fire",
  "Air",
  "Water",
  "Earth",
  "Plant",
  "Animal",
];

// Create a unique key from threshold elements
function getThresholdKey(
  elements: Innate["thresholds"][number]["elements"],
): string {
  return ELEMENT_ORDER.filter((el) => elements[el as keyof typeof elements])
    .map((el) => `${el}${elements[el as keyof typeof elements]}`)
    .join("-");
}

function ElementThreshold({
  elements,
  effect,
}: {
  elements: Innate["thresholds"][number]["elements"];
  effect: string;
}) {
  // Convert elements object to array of {element, count}
  const elementCounts = ELEMENT_ORDER.filter(
    (el) => elements[el as keyof typeof elements],
  ).map((el) => ({
    element: el,
    count: elements[el as keyof typeof elements] || 0,
  }));

  return (
    <div className="flex items-start gap-2 flex-wrap">
      {/* Element icons */}
      <div className="flex items-center gap-1 shrink-0">
        {elementCounts.map(({ element, count }) => {
          const Icon = ElementIcon[element];
          return (
            <span key={element} className="flex items-center gap-0.5">
              <span className="text-sm font-medium text-muted-foreground">
                {count}
              </span>
              {Icon && <Icon size={16} />}
            </span>
          );
        })}
      </div>
      {/* Effect text */}
      <span className="text-sm text-muted-foreground flex-1">{effect}</span>
    </div>
  );
}

function PowerHeader({
  name,
  range,
  target,
}: {
  name: string;
  range?: string;
  target?: string;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="font-medium">{name}</span>
      {range && (
        <span className="text-xs text-muted-foreground">Range: {range}</span>
      )}
      {target && (
        <span className="text-xs text-muted-foreground">Target: {target}</span>
      )}
    </div>
  );
}

export function InnatePowers({ innates }: InnatePowersProps) {
  if (!innates || innates.length === 0) {
    return (
      <section className="space-y-3 mt-8">
        <Heading variant="h3" as="h2">
          Innate Powers
        </Heading>
        <Text variant="muted">No innate power data available.</Text>
      </section>
    );
  }

  return (
    <section className="space-y-3 mt-8">
      <Heading variant="h3" as="h2">
        Innate Powers
      </Heading>
      <div className="space-y-4">
        {innates.map((innate) => (
          <div
            key={innate.name}
            className={cn(
              "border-l-4 pl-3 py-2 rounded-r-lg bg-muted/20",
              innate.speed === "Fast"
                ? "border-l-amber-500"
                : "border-l-blue-500",
            )}
          >
            {/* Power header with name, range, target */}
            <PowerHeader
              name={innate.name}
              range={innate.range}
              target={innate.target}
            />

            {/* Thresholds */}
            <div className="mt-3 space-y-2">
              {innate.thresholds.map((threshold, idx) => (
                <div
                  key={getThresholdKey(threshold.elements)}
                  className={cn(
                    "py-1.5",
                    idx > 0 && "border-t border-border/30",
                  )}
                >
                  <ElementThreshold
                    elements={threshold.elements}
                    effect={threshold.effect}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
