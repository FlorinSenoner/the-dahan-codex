import { Link } from '@tanstack/react-router'
import { AdversaryImage } from '@/components/adversaries/adversary-image'
import { Badge } from '@/components/ui/badge'
import { Heading, Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import type { PublicAdversary } from '@/types/reference'

interface AdversaryRowProps {
  adversary: PublicAdversary
}

export function AdversaryRow({ adversary }: AdversaryRowProps) {
  return (
    <Link
      className={cn(
        'flex items-center gap-4 p-4 cursor-default',
        'hover:bg-muted/50 active:bg-muted/50 transition-colors duration-150',
      )}
      id={`adversary-${adversary.slug}`}
      params={{ slug: adversary.slug }}
      to="/adversaries/$slug"
      viewTransition
    >
      <AdversaryImage
        adversaryName={adversary.name}
        className="h-[100px] w-[100px] shrink-0"
        fallbackInitialClassName="text-2xl"
        height={100}
        imageUrl={adversary.imageUrl}
        slug={adversary.slug}
        width={100}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Heading
            as="h3"
            className="truncate text-lg"
            style={{ viewTransitionName: `adversary-name-${adversary.slug}` }}
            variant="h3"
          >
            {adversary.name}
          </Heading>
          <Badge className="flex-shrink-0 text-xs" variant="outline">
            Base {adversary.baseDifficulty}
          </Badge>
        </div>
        <Text className="line-clamp-2 mt-0.5" variant="muted">
          {adversary.strategy.overview}
        </Text>
      </div>
    </Link>
  )
}
