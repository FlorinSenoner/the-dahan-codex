import type * as React from 'react'
import { cn } from '@/lib/utils'
import { Heading } from './typography'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <Heading
      as="h3"
      className={cn(
        'font-semibold text-sm text-muted-foreground uppercase tracking-wide',
        className,
      )}
      variant="h4"
    >
      {children}
    </Heading>
  )
}
