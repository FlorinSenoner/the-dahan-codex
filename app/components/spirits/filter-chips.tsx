import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {allFilters.map(({ type, value }) => (
        <button
          key={`${type}-${value}`}
          type="button"
          onClick={() => removeFilter(type, value)}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            "bg-primary/10 text-primary border border-primary/20",
            "hover:bg-primary/20 transition-colors",
          )}
        >
          {value}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
