import { useNavigate } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// Filter options
const COMPLEXITY_OPTIONS = ["Low", "Moderate", "High", "Very High"] as const;
const ELEMENT_OPTIONS = [
  "Sun",
  "Moon",
  "Fire",
  "Air",
  "Water",
  "Earth",
  "Plant",
  "Animal",
] as const;

// Element color mapping for filter pills
const elementColors: Record<string, { selected: string; unselected: string }> =
  {
    Sun: {
      selected:
        "bg-element-sun/30 text-element-sun border-element-sun/50 hover:bg-element-sun/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Moon: {
      selected:
        "bg-element-moon/30 text-element-moon border-element-moon/50 hover:bg-element-moon/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Fire: {
      selected:
        "bg-element-fire/30 text-element-fire border-element-fire/50 hover:bg-element-fire/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Air: {
      selected:
        "bg-element-air/30 text-element-air border-element-air/50 hover:bg-element-air/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Water: {
      selected:
        "bg-element-water/30 text-element-water border-element-water/50 hover:bg-element-water/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Earth: {
      selected:
        "bg-element-earth/30 text-element-earth border-element-earth/50 hover:bg-element-earth/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Plant: {
      selected:
        "bg-element-plant/30 text-element-plant border-element-plant/50 hover:bg-element-plant/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
    Animal: {
      selected:
        "bg-element-animal/30 text-element-animal border-element-animal/50 hover:bg-element-animal/40",
      unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
    },
  };

// Complexity color mapping for filter pills
const complexityColors: Record<
  string,
  { selected: string; unselected: string }
> = {
  Low: {
    selected:
      "bg-element-plant/30 text-element-plant border-element-plant/50 hover:bg-element-plant/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  Moderate: {
    selected:
      "bg-element-sun/30 text-element-sun border-element-sun/50 hover:bg-element-sun/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  High: {
    selected:
      "bg-element-fire/30 text-element-fire border-element-fire/50 hover:bg-element-fire/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  "Very High": {
    selected:
      "bg-destructive/30 text-destructive border-destructive/50 hover:bg-destructive/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
};

interface FilterSheetProps {
  currentFilters: {
    complexity?: string[];
    elements?: string[];
  };
  activeCount: number;
}

export function FilterSheet({ currentFilters, activeCount }: FilterSheetProps) {
  const navigate = useNavigate({ from: "/spirits/" });
  const [open, setOpen] = useState(false);

  // Local state for pending filter changes
  const [pendingComplexity, setPendingComplexity] = useState<string[]>(
    currentFilters.complexity || [],
  );
  const [pendingElements, setPendingElements] = useState<string[]>(
    currentFilters.elements || [],
  );

  // Reset pending state when drawer opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setPendingComplexity(currentFilters.complexity || []);
      setPendingElements(currentFilters.elements || []);
    }
    setOpen(isOpen);
  };

  // Toggle a filter option
  const toggleComplexity = (value: string) => {
    setPendingComplexity((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const toggleElement = (value: string) => {
    setPendingElements((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  // Apply filters
  const applyFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        complexity:
          pendingComplexity.length > 0 ? pendingComplexity : undefined,
        elements: pendingElements.length > 0 ? pendingElements : undefined,
      }),
      replace: true,
    });
    setOpen(false);
  };

  const pendingCount = pendingComplexity.length + pendingElements.length;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative min-w-[44px] min-h-[44px] cursor-pointer"
          aria-label="Filter"
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-headline">Filter Spirits</DrawerTitle>
            {pendingCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPendingComplexity([]);
                  setPendingElements([]);
                }}
                className="text-muted-foreground cursor-pointer"
              >
                Clear all
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 py-6 space-y-6 overflow-y-auto" data-vaul-no-drag>
          {/* Complexity filter */}
          <div>
            <h3 className="font-headline font-medium text-sm text-foreground mb-3">
              Complexity
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMPLEXITY_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  selected={pendingComplexity.includes(option)}
                  onClick={() => toggleComplexity(option)}
                  selectedClass={complexityColors[option].selected}
                  unselectedClass={complexityColors[option].unselected}
                />
              ))}
            </div>
          </div>

          {/* Elements filter */}
          <div>
            <h3 className="font-headline font-medium text-sm text-foreground mb-3">
              Elements
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Spirit must have ALL selected elements
            </p>
            <div className="flex flex-wrap gap-2">
              {ELEMENT_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  selected={pendingElements.includes(option)}
                  onClick={() => toggleElement(option)}
                  selectedClass={elementColors[option].selected}
                  unselectedClass={elementColors[option].unselected}
                />
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-border">
          <div className="flex gap-3">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 cursor-pointer">
                Cancel
              </Button>
            </DrawerClose>
            <Button onClick={applyFilters} className="flex-1 cursor-pointer">
              Apply Filters
              {pendingCount > 0 && ` (${pendingCount})`}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Reusable filter pill component
export function FilterPill({
  label,
  selected,
  onClick,
  selectedClass,
  unselectedClass,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  selectedClass?: string;
  unselectedClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
        "border",
        selected
          ? selectedClass || "bg-primary text-primary-foreground border-primary"
          : unselectedClass ||
              "bg-muted/30 text-foreground border-border hover:bg-muted/50",
      )}
    >
      {label}
      {children}
    </button>
  );
}

// Export color mappings for use in filter-chips.tsx
export { elementColors, complexityColors };
