import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { FilterChips } from "@/components/spirits/filter-chips";
import { FilterSheet } from "@/components/spirits/filter-sheet";
import { SpiritList } from "@/components/spirits/spirit-list";

// Filter schema for URL search params (prepared for Plan 04)
const spiritFilterSchema = z.object({
  complexity: z.array(z.string()).optional().catch([]),
  expansion: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  sort: z.enum(["alpha", "complexity"]).optional().catch("alpha"),
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
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-2xl font-semibold text-foreground">
            Spirits
          </h1>
          <FilterSheet
            currentFilters={{
              complexity: filters.complexity,
              elements: filters.elements,
            }}
            activeCount={activeFilterCount}
          />
        </div>
      </header>

      {/* Active filter chips */}
      <FilterChips filters={filters} />

      {/* Spirit list */}
      <main className="pb-20">
        {/* pb-20 for bottom nav space */}
        <SpiritList filters={filters} />
      </main>
    </div>
  );
}
