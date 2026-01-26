import type { ComponentType } from "react";
import { AirIcon, type ElementIconProps } from "./air";
import { AnimalIcon } from "./animal";
import { EarthIcon } from "./earth";
import { FireIcon } from "./fire";
import { MoonIcon } from "./moon";
import { PlantIcon } from "./plant";
import { SunIcon } from "./sun";
import { WaterIcon } from "./water";

export type { ElementIconProps } from "./air";
export { AirIcon } from "./air";
export { AnimalIcon } from "./animal";
export { EarthIcon } from "./earth";
export { FireIcon } from "./fire";
export { MoonIcon } from "./moon";
export { PlantIcon } from "./plant";
export { SunIcon } from "./sun";
export { WaterIcon } from "./water";

/**
 * Mapping of element names to their icon components.
 * Enables dynamic rendering: ElementIcon["Sun"] returns SunIcon
 */
export const ElementIcon: Record<string, ComponentType<ElementIconProps>> = {
  Sun: SunIcon,
  Moon: MoonIcon,
  Fire: FireIcon,
  Air: AirIcon,
  Water: WaterIcon,
  Earth: EarthIcon,
  Plant: PlantIcon,
  Animal: AnimalIcon,
};
