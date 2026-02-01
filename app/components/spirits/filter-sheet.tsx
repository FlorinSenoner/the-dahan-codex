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
import {
  complexityFilterColors,
  elementFilterColors,
} from "@/lib/spirit-colors";
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
          className="relative min-w-[44px] min-h-[44px]"
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
                className="text-muted-foreground"
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
                  selectedClass={complexityFilterColors[option].selected}
                  unselectedClass={complexityFilterColors[option].unselected}
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
                  selectedClass={elementFilterColors[option].selected}
                  unselectedClass={elementFilterColors[option].unselected}
                />
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-border">
          <div className="flex gap-3">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
            <Button onClick={applyFilters} className="flex-1">
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
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto px-3 py-1.5 rounded-full text-sm font-medium",
        selected
          ? selectedClass || "bg-primary text-primary-foreground border-primary"
          : unselectedClass ||
              "bg-muted/30 text-foreground border-border hover:bg-muted/50",
      )}
    >
      {label}
      {children}
    </Button>
  );
}
