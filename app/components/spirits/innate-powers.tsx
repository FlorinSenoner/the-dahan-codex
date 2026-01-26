import type { Doc } from "convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { elementBadgeColors } from "@/lib/spirit-colors";
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
    <div className="flex flex-wrap gap-1">
      {elementCounts.map(({ element, count }) => (
        <Badge
          key={element}
          variant="outline"
          className={cn(
            "text-xs px-1.5 py-0",
            elementBadgeColors[element] || "",
          )}
        >
          {count} {element}
        </Badge>
      ))}
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
              <div className="flex items-center gap-2 text-left">
                <span className="font-medium">{innate.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    innate.speed === "Fast"
                      ? "border-amber-500/50 text-amber-400"
                      : "border-blue-500/50 text-blue-400",
                  )}
                >
                  {innate.speed}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              {innate.range && (
                <Text variant="small" className="text-muted-foreground">
                  Range: {innate.range}
                </Text>
              )}
              {innate.target && (
                <Text variant="small" className="text-muted-foreground">
                  Target: {innate.target}
                </Text>
              )}
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
