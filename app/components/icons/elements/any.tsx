import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Any Element icon - wildcard that can be any element.
 * Design: Circle with multicolor gradient representing all elements.
 */
export function AnyIcon({
  size = 20,
  className,
  ...props
}: ElementIconProps) {
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
      {/* Multicolor gradient circle representing "any element" */}
      <defs>
        <linearGradient
          id="any-element-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f59e0b" /> {/* Sun/amber */}
          <stop offset="16%" stopColor="#8b5cf6" /> {/* Moon/violet */}
          <stop offset="33%" stopColor="#f97316" /> {/* Fire/orange */}
          <stop offset="50%" stopColor="#8b5cf6" /> {/* Air/violet */}
          <stop offset="66%" stopColor="#3b82f6" /> {/* Water/blue */}
          <stop offset="83%" stopColor="#78716c" /> {/* Earth/stone */}
          <stop offset="100%" stopColor="#22c55e" /> {/* Plant/green */}
        </linearGradient>
      </defs>

      {/* Outer circle with gradient */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#any-element-gradient)"
        strokeWidth="8"
      />

      {/* Question mark in center */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="40"
        fontWeight="bold"
        fill="currentColor"
      >
        ?
      </text>
    </svg>
  );
}
