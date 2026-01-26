import type { SVGProps } from "react";

export interface GrowthIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Reclaim icon - circular arrow indicating card reclamation
 * Used for "Reclaim All" and "Reclaim One" growth actions
 */
export function ReclaimIcon({
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Circular arrow - reclaim/return symbol */}
      <path d="M3 12a9 9 0 1 0 9-9" />
      <polyline points="3 3 3 9 9 9" />
    </svg>
  );
}
