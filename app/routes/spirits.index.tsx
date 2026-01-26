import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ClientOnly } from "@/components/client-only";
import { FilterChips } from "@/components/spirits/filter-chips";
import { FilterSheet } from "@/components/spirits/filter-sheet";
import {
  SpiritList,
  SpiritListSkeleton,
} from "@/components/spirits/spirit-list";
import { PageHeader } from "@/components/ui/page-header";

// Filter schema for URL search params (prepared for Plan 04)
const spiritFilterSchema = z.object({
  complexity: z.array(z.string()).optional().catch([]),
  expansion: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  sort: z.enum(["alpha", "complexity"]).optional().catch("alpha"),
  // For view transitions: tracks which spirit we're returning from
  returning: z.string().optional(),
  returningAspect: z.string().optional(),
});

export const Route = createFileRoute("/spirits/")({
  validateSearch: spiritFilterSchema,
  component: SpiritsPage,
});

function SpiritsPage() {
  const filters = Route.useSearch();

  // Calculate active filter count
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
        <ClientOnly
          fallback={
            <SpiritListSkeleton
              returning={filters.returning}
              returningAspect={filters.returningAspect}
            />
          }
        >
          <SpiritList filters={filters} />
        </ClientOnly>
      </main>
    </div>
  );
}
