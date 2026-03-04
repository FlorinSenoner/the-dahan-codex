import { createFileRoute } from '@tanstack/react-router'
import { AdversaryList } from '@/components/adversaries/adversary-list'
import { PageHeader } from '@/components/ui/page-header'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectAdversaryList } from '@/lib/reference-selectors'
import { SITE_URL } from '@/lib/site-url'
import { createBreadcrumbStructuredData } from '@/lib/structured-data'

export const Route = createFileRoute('/adversaries/')({
  component: AdversariesPage,
})

function AdversariesPage() {
  usePageMeta({
    title: 'Adversaries',
    description: 'Browse Spirit Island adversaries with level-by-level rules and strategy notes.',
    canonicalPath: '/adversaries',
    ogType: 'website',
  })

  const snapshot = usePublicSnapshot()
  const adversaries = snapshot ? selectAdversaryList(snapshot) : []

  useStructuredData(
    'ld-itemlist-adversaries',
    adversaries.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Spirit Island Adversaries',
          numberOfItems: adversaries.length,
          itemListElement: adversaries.map((adversary, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: adversary.name,
            url: `${SITE_URL}/adversaries/${adversary.slug}`,
          })),
        }
      : null,
  )

  useStructuredData(
    'ld-breadcrumb-adversaries',
    createBreadcrumbStructuredData([
      { name: 'Home', item: SITE_URL },
      { name: 'Adversaries', item: `${SITE_URL}/adversaries` },
    ]),
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" title="Adversaries" />

      <main className="pb-20">
        <AdversaryList adversaries={adversaries} />
      </main>
    </div>
  )
}
