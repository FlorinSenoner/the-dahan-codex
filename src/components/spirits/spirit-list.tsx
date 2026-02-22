import type { SpiritListItem } from '@/types/convex'
import { SpiritRow } from './spirit-row'

interface SpiritListProps {
  spirits: SpiritListItem[]
}

export function SpiritList({ spirits }: SpiritListProps) {
  if (spirits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground text-lg">No spirits found</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters</p>
      </div>
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
