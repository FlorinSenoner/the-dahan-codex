import type { Doc } from "convex/_generated/dataModel";
import { ElementIcon } from "@/components/icons/elements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
}: {
  elements: Innate["thresholds"][number]["elements"];
}) {
  // Convert elements object to array of {element, count}
  const elementCounts = ELEMENT_ORDER.filter(
    (el) => elements[el as keyof typeof elements],
  ).map((el) => ({
    element: el,
    count: elements[el as keyof typeof elements] || 0,
  }));

  return (
    <div className="flex items-center gap-2">
      {elementCounts.map(({ element, count }) => {
        const Icon = ElementIcon[element];
        return (
          <div key={element} className="flex items-center gap-0.5">
            <span className="text-sm font-medium text-muted-foreground">
              {count}
            </span>
            {Icon && <Icon size={18} />}
          </div>
        );
      })}
    </div>
  );
}

function PowerHeader({
  speed,
  range,
  target,
}: {
  speed: "Fast" | "Slow";
  range?: string;
  target?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
      <Badge
        variant="outline"
        className={cn(
          speed === "Fast"
            ? "border-amber-500/50 text-amber-400"
            : "border-blue-500/50 text-blue-400",
        )}
      >
        {speed}
      </Badge>
      {range && (
        <span>
          <span className="text-muted-foreground/70">Range:</span> {range}
        </span>
      )}
      {target && (
        <span>
          <span className="text-muted-foreground/70">Target:</span> {target}
        </span>
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
      <Accordion type="multiple" className="w-full space-y-2">
        {innates.map((innate, idx) => (
          <AccordionItem
            key={innate.name}
            value={`innate-${idx}`}
            className="border border-border rounded-lg bg-muted/20 px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <span className="font-medium text-left">{innate.name}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <PowerHeader
                speed={innate.speed}
                range={innate.range}
                target={innate.target}
              />
              <div className="space-y-3">
                {innate.thresholds.map((threshold) => (
                  <div
                    key={getThresholdKey(threshold.elements)}
                    className="p-3 bg-background/50 rounded-md space-y-2"
                  >
                    <ElementThreshold elements={threshold.elements} />
                    <Text variant="small">{threshold.effect}</Text>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
