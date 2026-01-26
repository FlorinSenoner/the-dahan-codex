import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function WaterIcon({
  size = 20,
  className = "text-element-water",
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
      {/* Water droplet shape */}
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
    </svg>
  );
}
