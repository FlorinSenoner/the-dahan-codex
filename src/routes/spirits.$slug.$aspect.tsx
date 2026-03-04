import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/ui/empty-state'
import { Heading, Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectSpiritBySlug } from '@/lib/reference-selectors'
import { SITE_URL } from '@/lib/site-url'
import { createBreadcrumbStructuredData } from '@/lib/structured-data'
import { SpiritDetailContent } from './spirits.$slug'

export const Route = createFileRoute('/spirits/$slug/$aspect')({
  component: AspectDetailPage,
})

function AspectDetailPage() {
  const { slug, aspect } = Route.useParams()
  const snapshot = usePublicSnapshot()

  const spirit = snapshot ? selectSpiritBySlug(snapshot, slug, aspect) : undefined

  usePageMeta({
    title: spirit?.aspectName ? `${spirit.name} — ${spirit.aspectName}` : spirit?.name,
    description: spirit?.summary,
    canonicalPath: `/spirits/${slug}/${aspect}`,
    ogType: 'article',
  })

  useStructuredData(
    'ld-article',
    spirit?.aspectName
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${spirit.name} — ${spirit.aspectName} — Spirit Island Spirit Guide`,
          description: spirit.summary || '',
          image: spirit.imageUrl ? `${SITE_URL}${spirit.imageUrl}` : undefined,
          url: `${SITE_URL}/spirits/${slug}/${aspect}`,
          author: { '@type': 'Organization', name: 'The Dahan Codex' },
          publisher: { '@type': 'Organization', name: 'The Dahan Codex' },
          mainEntityOfPage: `${SITE_URL}/spirits/${slug}/${aspect}`,
          keywords: [
            'Spirit Island',
            spirit.name,
            spirit.aspectName,
            `${spirit.complexity} complexity`,
            ...spirit.elements,
            'opening guide',
          ],
        }
      : null,
  )

  useStructuredData(
    'ld-breadcrumb',
    spirit
      ? createBreadcrumbStructuredData([
          { name: 'Home', item: SITE_URL },
          { name: 'Spirits', item: `${SITE_URL}/spirits` },
          { name: spirit.name, item: `${SITE_URL}/spirits/${slug}` },
          ...(spirit.aspectName
            ? [{ name: spirit.aspectName, item: `${SITE_URL}/spirits/${slug}/${aspect}` }]
            : []),
        ])
      : null,
  )

  if (!snapshot || spirit === undefined) {
    return null
  }

  if (spirit === null || (spirit && !spirit.aspectName)) {
    return (
      <EmptyState
        action={
          <Link
            className="text-primary hover:underline cursor-pointer"
            params={{ slug }}
            search={{ opening: undefined }}
            to="/spirits/$slug"
            viewTransition
          >
            Back to Base Spirit
          </Link>
        }
        className="p-8 min-h-[60vh]"
        description={
          <Text as="p" className="text-muted-foreground mb-4">
            The aspect "{aspect}" of "{slug}" doesn&apos;t exist.
          </Text>
        }
        title={
          <Heading as="h1" className="text-xl text-foreground mb-2" variant="h2">
            Aspect Not Found
          </Heading>
        }
      />
    )
  }

  return <SpiritDetailContent aspect={aspect} slug={slug} spirit={spirit} />
}
