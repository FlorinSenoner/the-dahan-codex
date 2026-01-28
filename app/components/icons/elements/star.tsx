import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Star Element icon - special element that appears on some spirit tracks.
 * Design: 5-pointed star in gold.
 */
export function StarIcon({ size = 20, className, ...props }: ElementIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id="star-element-gradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fcd34d" /> {/* Light gold */}
          <stop offset="100%" stopColor="#f59e0b" /> {/* Amber */}
        </linearGradient>
      </defs>

      {/* 5-pointed star */}
      <polygon
        points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
        fill="url(#star-element-gradient)"
        stroke="#d97706"
        strokeWidth="2"
      />
    </svg>
  );
}
