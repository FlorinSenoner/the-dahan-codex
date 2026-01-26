import type { Doc } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

interface GrowthPanelProps {
  growth: NonNullable<Doc<"spirits">["growth"]>;
}

export function GrowthPanel({ growth }: GrowthPanelProps) {
  if (!growth || growth.length === 0) {
    return (
      <section className="space-y-3">
        <Heading variant="h3" as="h2">
          Growth
        </Heading>
        <Text variant="muted">Growth data coming soon.</Text>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <Heading variant="h3" as="h2">
        Growth
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {growth.map((growthOption, idx) => (
          <Card key={idx} className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                {growthOption.title || `Option ${idx + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {growthOption.options.map((option, optIdx) => (
                  <li key={optIdx} className="text-sm text-muted-foreground">
                    {option.actions.join(" + ")}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
