/**
 * Centralized color mappings for Spirit Island elements and complexity levels.
 * Single source of truth for consistent styling across the app.
 */

/** Placeholder gradient for spirits without images */
export const PLACEHOLDER_GRADIENT =
  "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--accent)) 100%)";

/**
 * Badge colors for complexity levels (used on spirit detail and list views)
 * Uses neutral grayscale progression separate from element colors
 */
export const complexityBadgeColors: Record<string, string> = {
  Low: "bg-complexity-low/20 text-complexity-low border-complexity-low/30",
  Moderate:
    "bg-complexity-moderate/20 text-complexity-moderate border-complexity-moderate/30",
  High: "bg-complexity-high/20 text-complexity-high border-complexity-high/30",
  "Very High":
    "bg-complexity-very-high/20 text-complexity-very-high border-complexity-very-high/30",
};

/**
 * Badge colors for elements (used on spirit detail view)
 */
export const elementBadgeColors: Record<string, string> = {
  Sun: "bg-element-sun/20 text-element-sun border-element-sun/30",
  Moon: "bg-element-moon/20 text-element-moon border-element-moon/30",
  Fire: "bg-element-fire/20 text-element-fire border-element-fire/30",
  Air: "bg-element-air/20 text-element-air border-element-air/30",
  Water: "bg-element-water/20 text-element-water border-element-water/30",
  Earth: "bg-element-earth/20 text-element-earth border-element-earth/30",
  Plant: "bg-element-plant/20 text-element-plant border-element-plant/30",
  Animal: "bg-element-animal/20 text-element-animal border-element-animal/30",
};

/**
 * Filter pill colors with selected/unselected states (used in filter-sheet)
 */
export const elementFilterColors: Record<
  string,
  { selected: string; unselected: string }
> = {
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

/**
 * Complexity filter colors with selected/unselected states (used in filter-sheet)
 * Uses neutral grayscale progression separate from element colors
 */
export const complexityFilterColors: Record<
  string,
  { selected: string; unselected: string }
> = {
  Low: {
    selected:
      "bg-complexity-low/30 text-complexity-low border-complexity-low/50 hover:bg-complexity-low/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  Moderate: {
    selected:
      "bg-complexity-moderate/30 text-complexity-moderate border-complexity-moderate/50 hover:bg-complexity-moderate/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  High: {
    selected:
      "bg-complexity-high/30 text-complexity-high border-complexity-high/50 hover:bg-complexity-high/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  "Very High": {
    selected:
      "bg-complexity-very-high/30 text-complexity-very-high border-complexity-very-high/50 hover:bg-complexity-very-high/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
};

/**
 * Modifier colors for aspect complexity indicators (text colors only)
 * Uses complexity colors to maintain visual separation from elements
 * Icons are defined in the component to avoid lucide-react dependency here
 */
export const modifierColors: Record<string, { color: string; label: string }> =
  {
    easier: { color: "text-complexity-low", label: "Easier" },
    same: { color: "text-muted-foreground", label: "Same complexity" },
    harder: { color: "text-complexity-very-high", label: "Harder" },
  };
