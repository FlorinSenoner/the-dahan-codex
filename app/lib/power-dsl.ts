/**
 * Power DSL - Typed structures for Spirit Island growth actions and power targeting.
 * Used by growth panels, innate powers, and power cards.
 */

// ============================================================================
// Element Constants
// ============================================================================

export const ELEMENTS = [
  "Sun",
  "Moon",
  "Fire",
  "Air",
  "Water",
  "Earth",
  "Plant",
  "Animal",
] as const;

export type Element = (typeof ELEMENTS)[number];

// ============================================================================
// Growth Action Types (Discriminated Union)
// ============================================================================

export type GrowthAction =
  | { type: "reclaim"; variant: "all" | "one" }
  | { type: "gainEnergy"; amount: number }
  | { type: "gainPowerCard"; cardType?: "minor" | "major" }
  | { type: "addPresence"; range: number; terrain?: string }
  | { type: "pushFromLands"; count: number; pieceType: string }
  | { type: "damage"; amount: number; target: string }
  | { type: "gainElement"; element: Element };

// ============================================================================
// Power Targeting Types
// ============================================================================

export interface PowerRange {
  type: "numeric" | "spirit" | "none";
  value?: number;
  fromSacredSite?: boolean;
  terrain?: string;
}

export interface PowerTarget {
  type: "land" | "spirit" | "invaders" | "dahan" | "any";
  restrictions?: string[];
}

export interface PowerTargeting {
  speed: "Fast" | "Slow";
  range: PowerRange;
  target: PowerTarget;
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format a growth action as human-readable text.
 */
export function formatGrowthAction(action: GrowthAction): string {
  switch (action.type) {
    case "reclaim":
      return action.variant === "all" ? "Reclaim All" : "Reclaim One";

    case "gainEnergy":
      return `+${action.amount} Energy`;

    case "gainPowerCard":
      if (action.cardType === "minor") return "Gain Minor Power";
      if (action.cardType === "major") return "Gain Major Power";
      return "Gain Power Card";

    case "addPresence": {
      const terrain = action.terrain ? ` (${action.terrain})` : "";
      return `Add Presence Range ${action.range}${terrain}`;
    }

    case "pushFromLands":
      return `Push ${action.count} ${action.pieceType}`;

    case "damage":
      return `${action.amount} Damage to ${action.target}`;

    case "gainElement":
      return `+1 ${action.element}`;

    default: {
      // Type-safe exhaustive check
      const _exhaustive: never = action;
      return String(_exhaustive);
    }
  }
}

/**
 * Format a power range as human-readable text.
 */
export function formatRange(range: PowerRange): string {
  switch (range.type) {
    case "none":
      return "None";

    case "spirit":
      return "Any Spirit";

    case "numeric": {
      const base = range.fromSacredSite ? "Sacred Site" : String(range.value);
      const terrain = range.terrain ? ` (${range.terrain})` : "";
      return `${base}${terrain}`;
    }

    default: {
      const _exhaustive: never = range.type;
      return String(_exhaustive);
    }
  }
}

/**
 * Format a power target as human-readable text.
 */
export function formatTarget(target: PowerTarget): string {
  const base = (() => {
    switch (target.type) {
      case "land":
        return "Any Land";
      case "spirit":
        return "Any Spirit";
      case "invaders":
        return "Land with Invaders";
      case "dahan":
        return "Land with Dahan";
      case "any":
        return "Any";
      default: {
        const _exhaustive: never = target.type;
        return String(_exhaustive);
      }
    }
  })();

  if (target.restrictions && target.restrictions.length > 0) {
    return `${base} (${target.restrictions.join(", ")})`;
  }

  return base;
}
