import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterPill } from "@/components/ui/filter-pill";
import {
  complexityFilterColors,
  elementFilterColors,
} from "@/lib/spirit-colors";

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
              ? complexityFilterColors[value]
              : elementFilterColors[value];
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
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAll}
        className="text-xs text-muted-foreground hover:text-foreground ml-2 h-auto py-1.5 px-2"
      >
        Clear all
      </Button>
    </div>
  );
}
