import type { Doc } from 'convex/_generated/dataModel'
import { SpiritRow } from './spirit-row'

type Spirit = Doc<'spirits'> & { isAspect: boolean }

interface SpiritListProps {
  spirits: Spirit[]
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
        <SpiritRow isAspect={spirit.isAspect} key={spirit._id} spirit={spirit} />
      ))}
    </div>
  )
}
