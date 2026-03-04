import { Text } from '@/components/ui/typography'
import type { PublicAdversary } from '@/types/reference'
import { AdversaryRow } from './adversary-row'

interface AdversaryListProps {
  adversaries: PublicAdversary[]
}

export function AdversaryList({ adversaries }: AdversaryListProps) {
  if (adversaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Text variant="muted">No adversaries found</Text>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {adversaries.map((adversary) => (
        <AdversaryRow adversary={adversary} key={adversary._id} />
      ))}
    </div>
  )
}
