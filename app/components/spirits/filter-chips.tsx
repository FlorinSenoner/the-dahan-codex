import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { complexityColors, elementColors, FilterPill } from "./filter-sheet";

interface FilterChipsProps {
  filters: {
    complexity?: string[];
    elements?: string[];
  };
}

export function FilterChips({ filters }: FilterChipsProps) {
  const navigate = useNavigate({ from: "/spirits/" });

  const allFilters: Array<{ type: "complexity" | "elements"; value: string }> =
    [
      ...(filters.complexity || []).map((v) => ({
        type: "complexity" as const,
        value: v,
      })),
      ...(filters.elements || []).map((v) => ({
        type: "elements" as const,
        value: v,
      })),
    ];

  if (allFilters.length === 0) return null;

  const removeFilter = (type: "complexity" | "elements", value: string) => {
    navigate({
      search: (prev) => {
        const current = prev[type] || [];
        const updated = current.filter((v) => v !== value);
        return {
          ...prev,
          [type]: updated.length > 0 ? updated : undefined,
        };
      },
      replace: true,
    });
  };

  const clearAll = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        complexity: undefined,
        elements: undefined,
      }),
      replace: true,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {allFilters.map(({ type, value }) => {
          const colors =
            type === "complexity"
              ? complexityColors[value]
              : elementColors[value];
          return (
            <FilterPill
              key={`${type}-${value}`}
              label={value}
              selected={true}
              onClick={() => removeFilter(type, value)}
              selectedClass={colors?.selected}
            >
              <X className="h-3 w-3" />
            </FilterPill>
          );
        })}
      </div>
      <button
        type="button"
        onClick={clearAll}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1.5 px-2 ml-2 border-l border-border"
      >
        Clear all
      </button>
    </div>
  );
}
