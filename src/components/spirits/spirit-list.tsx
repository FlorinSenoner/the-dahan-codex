import type { SpiritListItem } from '@/types/convex'
import { EmptyState } from '../ui/empty-state'
import { Text } from '../ui/typography'
import { SpiritRow } from './spirit-row'

interface SpiritListProps {
  spirits: SpiritListItem[]
}

export function SpiritList({ spirits }: SpiritListProps) {
  if (spirits.length === 0) {
    return (
      <EmptyState
        className="p-8"
        description={
          <Text as="p" className="text-muted-foreground text-sm mt-2">
            Try adjusting your filters
          </Text>
        }
        title={
          <Text as="p" className="text-muted-foreground text-lg">
            No spirits found
          </Text>
        }
      />
    )
  }

  return (
    <div className="divide-y divide-border">
      {spirits.map((spirit) => (
        <SpiritRow key={spirit._id} spirit={spirit} />
      ))}
    </div>
  )
}
