import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function EarthIcon({
  size = 20,
  className = "text-element-earth",
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
      {/* Mountain/triangle shape with layered peaks */}
      <path d="M12 4L3 20h18L12 4z" />
      {/* Secondary peak detail */}
      <path d="M12 4L8 12l4-3 4 3-4-8z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
