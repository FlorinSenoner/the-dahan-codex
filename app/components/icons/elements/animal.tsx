import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function AnimalIcon({
  size = 20,
  className = "text-element-animal",
  ...props
}: ElementIconProps) {
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
      {/* Paw print - main pad */}
      <ellipse cx="12" cy="15" rx="4" ry="3.5" />
      {/* Toe pads */}
      <circle cx="7.5" cy="10" r="2" />
      <circle cx="16.5" cy="10" r="2" />
      <circle cx="10" cy="6.5" r="1.8" />
      <circle cx="14" cy="6.5" r="1.8" />
    </svg>
  );
}
