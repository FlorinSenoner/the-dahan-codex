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
 * Uses vibrant element colors (plant green, fire orange) for clear visual feedback
 * Icons are defined in the component to avoid lucide-react dependency here
 */
export const modifierColors: Record<string, { color: string; label: string }> =
  {
    easier: { color: "text-element-plant", label: "Easier" },
    same: { color: "text-element-sun", label: "Same complexity" },
    harder: { color: "text-element-animal", label: "Harder" },
  };

/**
 * Spirit-specific presence track color palettes
 * Based on primary/secondary elements of each spirit
 */
export const spiritTrackColors: Record<
  string,
  { energy: string; cardPlays: string }
> = {
  "river-surges-in-sunlight": { energy: "cyan", cardPlays: "amber" }, // Water/Sun
  "lightnings-swift-strike": { energy: "orange", cardPlays: "violet" }, // Fire/Air
  "fractured-days-split-the-sky": { energy: "indigo", cardPlays: "violet" }, // Moon/Air
  "starlight-seeks-its-form": { energy: "indigo", cardPlays: "amber" }, // Moon/Sun
  "finder-of-paths-unseen": { energy: "violet", cardPlays: "emerald" }, // Air/Plant
  "serpent-slumbering-beneath-the-island": {
    energy: "orange",
    cardPlays: "stone",
  }, // Fire/Earth
};

/**
 * Tailwind gradient classes for track colors
 * Pattern: "bg-gradient-to-r from-{color}-500/15 via-{color}-500/5 to-transparent"
 */
export const trackGradientClasses: Record<string, string> = {
  amber: "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent",
  blue: "bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent",
  cyan: "bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent",
  orange: "bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent",
  violet: "bg-gradient-to-r from-violet-500/15 via-violet-500/5 to-transparent",
  indigo: "bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent",
  emerald:
    "bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent",
  stone: "bg-gradient-to-r from-stone-500/15 via-stone-500/5 to-transparent",
  purple: "bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent",
};

/**
 * Get spirit-specific track colors with fallback to defaults
 * @param slug - Spirit slug
 * @returns Object with energy and cardPlays color names
 */
export function getSpiritTrackColors(slug: string): {
  energy: string;
  cardPlays: string;
} {
  return spiritTrackColors[slug] ?? { energy: "amber", cardPlays: "blue" };
}
