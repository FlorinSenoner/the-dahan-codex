import type { ComponentType } from "react";
import { EnergyIcon, type GrowthIconProps } from "./energy";
import { PowerCardIcon } from "./power-card";
import { PresenceIcon } from "./presence";
import { ReclaimIcon } from "./reclaim";

export type { GrowthIconProps } from "./energy";
export { EnergyIcon } from "./energy";
export { PowerCardIcon } from "./power-card";
export { PresenceIcon } from "./presence";
export { ReclaimIcon } from "./reclaim";

/**
 * Mapping of growth action types to their icon components.
 * Enables dynamic rendering: GrowthIcon["reclaim"] returns ReclaimIcon
 */
export const GrowthIcon: Record<string, ComponentType<GrowthIconProps>> = {
  reclaim: ReclaimIcon,
  gainEnergy: EnergyIcon,
  gainPowerCard: PowerCardIcon,
  addPresence: PresenceIcon,
};
