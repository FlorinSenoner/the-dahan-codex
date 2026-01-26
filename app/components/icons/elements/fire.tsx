import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function FireIcon({
  size = 20,
  className = "text-element-fire",
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
      {/* Flame shape */}
      <path d="M12 2c-1 4-4 6-4 10a4 4 0 0 0 8 0c0-4-3-6-4-10zm0 16a2 2 0 1 1 0-4c.5 2 1.5 3 0 4z" />
      {/* Secondary flame tongues */}
      <path
        d="M8.5 8c-.5 2-1.5 3-1.5 5a5 5 0 0 0 2 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8c.5 2 1.5 3 1.5 5a5 5 0 0 1-2 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
