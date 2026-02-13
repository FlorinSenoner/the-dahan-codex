import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { usePageMeta, useStructuredData } from '@/hooks'
import { SpiritDetailContent } from './spirits.$slug'

/**
 * Spirit detail page
 *
 * Offline behavior: This page works offline after background spirit sync
 * has populated local cache. Manual Settings > Sync Data can be used to
 * force a full refresh.
 */
export const Route = createFileRoute('/spirits/$slug/$aspect')({
  loader: async ({ context, params }) => {
    // Use prefetchQuery to avoid blocking when offline
    // The component's useSuspenseQuery will use cached data if available
    try {
      await context.queryClient.prefetchQuery(
        convexQuery(api.spirits.getSpiritBySlug, {
          slug: params.slug,
          aspect: params.aspect,
        }),
      )
    } catch (e) {
      if (e instanceof Error && !e.message.includes('Failed to fetch'))
        console.warn('Loader error:', e)
    }
  },
  component: AspectDetailPage,
})

function AspectDetailPage() {
  const { slug, aspect } = Route.useParams()

  const { data: spirit } = useSuspenseQuery(
    convexQuery(api.spirits.getSpiritBySlug, { slug, aspect }),
  )

  usePageMeta({
    title: spirit?.aspectName ? `${spirit.name} — ${spirit.aspectName}` : spirit?.name,
    description: spirit?.summary,
    canonicalPath: `/spirits/${slug}/${aspect}`,
    ogType: 'article',
  })

  const SITE_URL = 'https://dahan-codex.com'

  // Article structured data for the aspect
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

  // BreadcrumbList structured data
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

  // Not found state - aspect doesn't exist
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
