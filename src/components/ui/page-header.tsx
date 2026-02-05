import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  /** Page title displayed in the header */
  title: string
  /** Optional href for back button - renders ArrowLeft icon when provided */
  backHref?: string
  /** Optional content rendered in the center of the header (e.g. search bar) */
  center?: React.ReactNode
  /** Optional action elements (filter buttons, etc.) rendered on the right */
  children?: React.ReactNode
  /** Additional className for the header */
  className?: string
}

export function PageHeader({ title, backHref, center, children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3',
        className,
      )}
      style={{ viewTransitionName: 'page-header' }}
    >
      <div className="flex items-center gap-4 min-h-[44px]">
        <div className="flex items-center gap-3 shrink-0">
          {backHref && (
            <Link to={backHref} viewTransition>
              <Button
                aria-label="Go back"
                className="min-w-[44px] min-h-[44px] hover:bg-transparent hover:ring-1 hover:ring-border dark:hover:ring-muted-foreground dark:hover:text-foreground"
                size="icon"
                variant="ghost"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Heading className="text-foreground" variant="h2">
            {title}
          </Heading>
        </div>
        {center && <div className="flex-1 min-w-0">{center}</div>}
        {!center && <div className="flex-1" />}
        {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
      </div>
    </header>
  )
}
