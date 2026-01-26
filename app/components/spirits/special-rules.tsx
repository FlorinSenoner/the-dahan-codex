import type { Doc } from "convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SpecialRulesProps {
  rules: NonNullable<Doc<"spirits">["specialRules"]>;
}

export function SpecialRules({ rules }: SpecialRulesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!rules || rules.length === 0) {
    return null; // Don't show section if no special rules
  }

  return (
    <section className="space-y-3 mt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group cursor-pointer min-h-[44px]">
          <Heading
            variant="h3"
            as="h2"
            className="group-hover:text-primary transition-colors"
          >
            Special Rules
          </Heading>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.name}
              className="p-3 bg-muted/30 rounded-lg border border-border"
            >
              <Text className="font-medium text-primary mb-1">{rule.name}</Text>
              <Text variant="small" className="text-muted-foreground">
                {rule.description}
              </Text>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
