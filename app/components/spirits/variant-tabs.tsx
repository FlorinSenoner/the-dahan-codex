import { useNavigate, useParams } from "@tanstack/react-router";
import type { Doc } from "convex/_generated/dataModel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VariantTabsProps {
  base: Doc<"spirits">;
  aspects: Doc<"spirits">[];
}

export function VariantTabs({ base, aspects }: VariantTabsProps) {
  const params = useParams({ strict: false });
  const navigate = useNavigate();

  // Determine current tab from URL
  const aspect = (params as { aspect?: string }).aspect;
  const currentValue = aspect || "base";

  const tabTriggerClassName =
    "min-w-fit min-h-[44px] shrink-0 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/20 data-[state=active]:to-transparent data-[state=active]:border-primary";

  return (
    <Tabs
      value={currentValue}
      onValueChange={(value) => {
        const path =
          value === "base"
            ? `/spirits/${base.slug}`
            : `/spirits/${base.slug}/${value}`;
        navigate({ to: path, viewTransition: true });
      }}
      className="w-full"
    >
      <TabsList className="sticky top-[57px] z-10 w-full h-auto min-h-[44px] justify-start overflow-x-auto overflow-y-hidden bg-background/95 backdrop-blur border-b border-border rounded-none gap-0">
        <TabsTrigger value="base" className={tabTriggerClassName}>
          Base
        </TabsTrigger>
        {aspects.map((a) => (
          <TabsTrigger
            key={a.aspectName}
            value={a.aspectName?.toLowerCase() || ""}
            className={tabTriggerClassName}
          >
            {a.aspectName}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
