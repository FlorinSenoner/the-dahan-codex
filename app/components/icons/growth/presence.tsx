import type { SVGProps } from "react";

export interface GrowthIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Presence icon - disc/token representing spirit presence
 * Used for "Add Presence" growth actions
 */
export function PresenceIcon({
  size = 20,
  className = "text-white",
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
      {/* Filled circle - presence token */}
      <circle cx="12" cy="12" r="10" />
      {/* Inner highlight for depth */}
      <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
