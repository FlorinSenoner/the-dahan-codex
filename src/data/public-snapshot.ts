import { useQuery } from '@tanstack/react-query'
import type { PublicSnapshot } from '@/types/reference'

export const PUBLIC_SNAPSHOT_QUERY_KEY = ['public-snapshot'] as const
export const PUBLIC_SNAPSHOT_GC_TIME = 1000 * 60 * 60 * 24 * 7
export const PUBLIC_SNAPSHOT_STALE_TIME = 1000 * 60 * 30

function getConvexSiteUrl() {
  const explicit = (import.meta.env.VITE_CONVEX_SITE_URL as string | undefined)?.trim()
  if (explicit) {
    return explicit.replace(/\/+$/, '')
  }

  const cloud = (import.meta.env.VITE_CONVEX_URL as string | undefined)?.trim()
  if (!cloud) {
    throw new Error('Missing VITE_CONVEX_URL (or VITE_CONVEX_SITE_URL) for public snapshot fetch')
  }

  return cloud.replace(/\.convex\.cloud\/?$/, '.convex.site')
}

function getPublicSnapshotEndpoint() {
  return `${getConvexSiteUrl()}/public-snapshot`
}

export async function fetchPublicSnapshot(options?: { force?: boolean }): Promise<PublicSnapshot> {
  const force = options?.force === true
  const isDev = import.meta.env.DEV
  const endpoint = getPublicSnapshotEndpoint()
  const requestUrl = force || isDev ? `${endpoint}?force=1&t=${Date.now()}` : endpoint

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: force || isDev ? 'no-store' : 'default',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch public snapshot: ${response.status}`)
  }

  return (await response.json()) as PublicSnapshot
}

/**
 * Public snapshot source of truth for UI.
 * - Development: always refetch for immediate local updates.
 * - Production: cache-first with explicit manual refresh path.
 */
export function usePublicSnapshot(): PublicSnapshot | undefined {
  const isDev = import.meta.env.DEV
  const query = useQuery({
    queryKey: [...PUBLIC_SNAPSHOT_QUERY_KEY],
    queryFn: () => fetchPublicSnapshot(),
    staleTime: isDev ? 0 : PUBLIC_SNAPSHOT_STALE_TIME,
    gcTime: PUBLIC_SNAPSHOT_GC_TIME,
    refetchOnMount: isDev ? 'always' : false,
    refetchOnReconnect: isDev,
    refetchOnWindowFocus: isDev,
  })

  return query.data as PublicSnapshot | undefined
}
