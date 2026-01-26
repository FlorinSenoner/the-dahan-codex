import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Page title displayed in the header */
  title: string;
  /** Optional href for back button - renders ArrowLeft icon when provided */
  backHref?: string;
  /** Optional view transition name for the header element */
  viewTransitionName?: string;
  /** Optional action elements (filter buttons, etc.) rendered on the right */
  children?: React.ReactNode;
  /** Additional className for the header */
  className?: string;
}

export function PageHeader({
  title,
  backHref,
  viewTransitionName,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3",
        className,
      )}
      style={viewTransitionName ? { viewTransitionName } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link to={backHref}>
              <Button
                variant="ghost"
                size="icon"
                className="min-w-[44px] min-h-[44px] cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Heading variant="h2" className="text-foreground">
            {title}
          </Heading>
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
