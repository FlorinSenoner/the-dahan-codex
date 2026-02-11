import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { FilterChips } from '@/components/spirits/filter-chips'
import { FilterSheet } from '@/components/spirits/filter-sheet'
import { SpiritList } from '@/components/spirits/spirit-list'
import { SpiritSearch } from '@/components/spirits/spirit-search'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/typography'
import { usePageMeta } from '@/hooks'

const spiritFilterSchema = z.object({
  complexity: z.array(z.string()).optional().catch([]),
  expansion: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  sort: z.enum(['alpha', 'complexity']).optional().catch('alpha'),
  search: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/spirits/')({
  validateSearch: spiritFilterSchema,
  loaderDeps: ({ search }) => ({
    complexity: search.complexity,
    elements: search.elements,
  }),
  loader: async ({ context, deps }) => {
    // Use prefetchQuery instead of ensureQueryData to avoid blocking when offline
    // The component's useSuspenseQuery will use cached data if available
    try {
      await context.queryClient.prefetchQuery(
        convexQuery(api.spirits.listSpirits, {
          complexity: deps.complexity,
          elements: deps.elements,
        }),
      )
    } catch (e) {
      if (e instanceof Error && !e.message.includes('Failed to fetch'))
        console.warn('Loader error:', e)
    }
  },
  component: SpiritsPage,
})

function SpiritsPage() {
  usePageMeta(
    'Spirits',
    'Browse all Spirit Island spirits with filters for complexity and elements.',
  )

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
  const { data: spirits } = useSuspenseQuery(
    convexQuery(api.spirits.listSpirits, {
      complexity: filters.complexity,
      elements: filters.elements,
    }),
  )

  // Search filters AFTER existing backend filters (complexity/elements)
  const filteredSpirits = useMemo(() => {
    if (!filters.search) return spirits
    const lower = filters.search.toLowerCase()
    return spirits.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.aspectName?.toLowerCase().includes(lower) ||
        s.summary?.toLowerCase().includes(lower) ||
        s.description?.toLowerCase().includes(lower),
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
