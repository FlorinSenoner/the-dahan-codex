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
      <TabsList className="sticky top-[57px] z-10 w-full h-auto min-h-[44px] justify-start overflow-x-auto bg-background/95 backdrop-blur border-b border-border rounded-none px-4 gap-1">
        <TabsTrigger
          value="base"
          className="min-w-fit min-h-[44px] shrink-0 cursor-pointer data-[state=active]:bg-primary/10"
        >
          {base.name.split(" ").slice(0, 2).join(" ")}
        </TabsTrigger>
        {aspects.map((a) => (
          <TabsTrigger
            key={a.aspectName}
            value={a.aspectName?.toLowerCase() || ""}
            className="min-w-fit min-h-[44px] shrink-0 cursor-pointer data-[state=active]:bg-primary/10"
          >
            {a.aspectName}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
