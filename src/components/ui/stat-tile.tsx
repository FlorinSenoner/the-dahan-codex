import type * as React from 'react'
import { cn } from '@/lib/utils'
import { Text } from './typography'

interface StatTileProps {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
}

export function StatTile({ label, value, className }: StatTileProps) {
  return (
    <div className={cn('text-center', className)}>
      <Text as="p" className="text-2xl font-bold">
        {value}
      </Text>
      <Text as="p" className="text-xs text-muted-foreground">
        {label}
      </Text>
    </div>
  )
}
