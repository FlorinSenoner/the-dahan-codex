import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { z } from "zod";
import { FilterChips } from "@/components/spirits/filter-chips";
import { FilterSheet } from "@/components/spirits/filter-sheet";
import { SpiritList } from "@/components/spirits/spirit-list";
import { PageHeader } from "@/components/ui/page-header";

const spiritFilterSchema = z.object({
  complexity: z.array(z.string()).optional().catch([]),
  expansion: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  sort: z.enum(["alpha", "complexity"]).optional().catch("alpha"),
  returning: z.string().optional(),
  returningAspect: z.string().optional(),
});

export const Route = createFileRoute("/spirits/")({
  validateSearch: spiritFilterSchema,
  loaderDeps: ({ search }) => ({
    complexity: search.complexity,
    elements: search.elements,
  }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.spirits.listSpirits, {
        complexity: deps.complexity,
        elements: deps.elements,
      }),
    );
  },
  component: SpiritsPage,
});

function SpiritsPage() {
  const filters = Route.useSearch();

  const { data: spirits } = useSuspenseQuery(
    convexQuery(api.spirits.listSpirits, {
      complexity: filters.complexity,
      elements: filters.elements,
    }),
  );

  const activeFilterCount =
    (filters.complexity?.length || 0) + (filters.elements?.length || 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Spirits" viewTransitionName="list-header">
        <FilterSheet
          currentFilters={{
            complexity: filters.complexity,
            elements: filters.elements,
          }}
          activeCount={activeFilterCount}
        />
      </PageHeader>

      <FilterChips filters={filters} />

      <main className="pb-20">
        <SpiritList spirits={spirits} />
      </main>
    </div>
  );
}
