import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { FilterChips } from '@/components/spirits/filter-chips'
import { FilterSheet } from '@/components/spirits/filter-sheet'
import { SpiritList } from '@/components/spirits/spirit-list'
import { SpiritSearch } from '@/components/spirits/spirit-search'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectSpiritList } from '@/lib/reference-selectors'
import { toAspectSlug } from '@/lib/slug'

const spiritFilterSchema = z.object({
  complexity: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  search: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/spirits/')({
  validateSearch: spiritFilterSchema,
  component: SpiritsPage,
})

function SpiritsPage() {
  usePageMeta({
    title: 'Spirits',
    description: 'Browse all Spirit Island spirits with filters for complexity and elements.',
    canonicalPath: '/spirits',
    ogType: 'website',
  })

  useEffect(() => {
    const lastViewed = sessionStorage.getItem('lastViewedSpirit')
    if (lastViewed) {
      sessionStorage.removeItem('lastViewedSpirit')
      requestAnimationFrame(() => {
        document.getElementById(`spirit-${lastViewed}`)?.scrollIntoView({ block: 'center' })
      })
    }
  }, [])

  const filters = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const snapshot = usePublicSnapshot()

  const spirits = useMemo(() => {
    if (!snapshot) return []
    return selectSpiritList(snapshot, {
      complexity: filters.complexity,
      elements: filters.elements,
    })
  }, [snapshot, filters.complexity, filters.elements])

  const SITE_URL = 'https://dahan-codex.com'

  useStructuredData(
    'ld-itemlist',
    spirits.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Spirit Island Spirits',
          description: `Complete list of all ${spirits.length} Spirit Island spirits with complexity ratings and elemental affinities.`,
          numberOfItems: spirits.length,
          itemListElement: spirits.map((spirit, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: spirit.aspectName ? `${spirit.name} — ${spirit.aspectName}` : spirit.name,
            url: spirit.aspectName
              ? `${SITE_URL}/spirits/${spirit.slug}/${toAspectSlug(spirit.aspectName)}`
              : `${SITE_URL}/spirits/${spirit.slug}`,
          })),
        }
      : null,
  )

  useStructuredData('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Spirits', item: `${SITE_URL}/spirits` },
    ],
  })

  const filteredSpirits = useMemo(() => {
    if (!filters.search) return spirits
    const lower = filters.search.toLowerCase()
    return spirits.filter(
      (spirit) =>
        spirit.name.toLowerCase().includes(lower) ||
        spirit.aspectName?.toLowerCase().includes(lower) ||
        spirit.summary?.toLowerCase().includes(lower) ||
        spirit.description?.toLowerCase().includes(lower),
    )
  }, [spirits, filters.search])

  const handleSearchChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: value || undefined }),
      replace: true,
    })
  }

  const activeFilterCount = (filters.complexity?.length || 0) + (filters.elements?.length || 0)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        backHref="/"
        center={<SpiritSearch onChange={handleSearchChange} value={filters.search || ''} />}
        title="Spirits"
      >
        <FilterSheet
          activeCount={activeFilterCount}
          currentFilters={{
            complexity: filters.complexity,
            elements: filters.elements,
          }}
        />
      </PageHeader>

      <FilterChips filters={filters} />

      {filters.search && (
        <Text className="px-4 text-sm" variant="muted">
          {filteredSpirits.length} spirit
          {filteredSpirits.length !== 1 ? 's' : ''} found
        </Text>
      )}

      <main className="pb-20">
        <SpiritList spirits={filteredSpirits} />
      </main>
    </div>
  )
}
