import { createFileRoute, Link } from '@tanstack/react-router'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectSpiritBySlug } from '@/lib/reference-selectors'
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

  const SITE_URL = 'https://dahan-codex.com'

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
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Spirits', item: `${SITE_URL}/spirits` },
            {
              '@type': 'ListItem',
              position: 3,
              name: spirit.name,
              item: `${SITE_URL}/spirits/${slug}`,
            },
            ...(spirit.aspectName
              ? [
                  {
                    '@type': 'ListItem' as const,
                    position: 4,
                    name: spirit.aspectName,
                    item: `${SITE_URL}/spirits/${slug}/${aspect}`,
                  },
                ]
              : []),
          ],
        }
      : null,
  )

  if (!snapshot || spirit === undefined) {
    return null
  }

  if (spirit === null || (spirit && !spirit.aspectName)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <p className="text-xl font-serif text-foreground mb-2">Aspect Not Found</p>
        <p className="text-muted-foreground mb-4">
          The aspect "{aspect}" of "{slug}" doesn't exist.
        </p>
        <Link
          className="text-primary hover:underline cursor-pointer"
          params={{ slug }}
          search={{ opening: undefined }}
          to="/spirits/$slug"
          viewTransition
        >
          Back to Base Spirit
        </Link>
      </div>
    )
  }

  return <SpiritDetailContent aspect={aspect} slug={slug} spirit={spirit} />
}
