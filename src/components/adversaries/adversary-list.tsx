import { EmptyState } from '@/components/ui/empty-state'
import { Text } from '@/components/ui/typography'
import type { PublicAdversary } from '@/types/reference'
import { AdversaryRow } from './adversary-row'

interface AdversaryListProps {
  adversaries: PublicAdversary[]
}

export function AdversaryList({ adversaries }: AdversaryListProps) {
  if (adversaries.length === 0) {
    return (
      <EmptyState className="p-8" description={<Text variant="muted">No adversaries found</Text>} />
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
