import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function SunIcon({
  size = 20,
  className = "text-element-sun",
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
      {/* Center circle */}
      <circle cx="12" cy="12" r="5" />
      {/* Radiating rays */}
      <rect x="11" y="1" width="2" height="4" rx="1" />
      <rect x="11" y="19" width="2" height="4" rx="1" />
      <rect x="1" y="11" width="4" height="2" rx="1" />
      <rect x="19" y="11" width="4" height="2" rx="1" />
      {/* Diagonal rays */}
      <rect
        x="4.22"
        y="4.22"
        width="2"
        height="4"
        rx="1"
        transform="rotate(-45 5.22 6.22)"
      />
      <rect
        x="17.78"
        y="17.78"
        width="2"
        height="4"
        rx="1"
        transform="rotate(-45 18.78 19.78)"
      />
      <rect
        x="4.22"
        y="17.78"
        width="2"
        height="4"
        rx="1"
        transform="rotate(45 5.22 19.78)"
      />
      <rect
        x="17.78"
        y="4.22"
        width="2"
        height="4"
        rx="1"
        transform="rotate(45 18.78 6.22)"
      />
    </svg>
  );
}
