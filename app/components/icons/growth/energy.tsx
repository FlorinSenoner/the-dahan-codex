import type { SVGProps } from "react";

export interface GrowthIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Energy icon - lightning bolt symbol
 * Used for "Gain Energy" growth actions
 */
export function EnergyIcon({
  size = 20,
  className = "text-amber-400",
  ...props
}: GrowthIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Lightning bolt - energy symbol */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
