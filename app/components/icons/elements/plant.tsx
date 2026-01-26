import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function PlantIcon({
  size = 20,
  className = "text-element-plant",
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
      {/* Leaf shape */}
      <path d="M6.5 12c0-5.5 4.5-10 10-10-.5 5.5-5 10-10 10z" />
      <path d="M6.5 12c5.5 0 10 4.5 10 10-5.5-.5-10-5-10-10z" />
      {/* Stem */}
      <path
        d="M12 22V12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
