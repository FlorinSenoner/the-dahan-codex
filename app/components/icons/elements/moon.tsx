import type { SVGProps } from "react";

export interface ElementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function MoonIcon({
  size = 20,
  className = "text-element-moon",
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
      {/* Crescent moon shape using a path */}
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}
