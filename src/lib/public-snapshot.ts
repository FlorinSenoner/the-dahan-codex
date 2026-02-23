import { queryOptions } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import type { Doc, Id } from 'convex/_generated/dataModel'
import { ConvexHttpClient } from 'convex/browser'
import { toAspectSlug } from '@/lib/slug'

interface SnapshotSpirit extends Doc<'spirits'> {
  isAspect: boolean
}

interface PublicSnapshot {
  schemaVersion: number
  generatedAt: number
  spirits: SnapshotSpirit[]
  openingsBySpiritId: Record<string, Doc<'openings'>[]>
}

interface SpiritFilters {
  complexity?: string[]
  elements?: string[]
}

let snapshotPromise: Promise<PublicSnapshot> | null = null
const USE_CONVEX_PUBLIC_DATA = import.meta.env.DEV
let convexSnapshotClient: ConvexHttpClient | null = null
let convexSnapshotClientUrl: string | null = null
const PRODUCTION_SNAPSHOT_STALE_TIME_MS = 5 * 60 * 1000
const PRODUCTION_SNAPSHOT_GC_TIME_MS = 24 * 60 * 60 * 1000

async function fetchPublicSnapshot(cacheMode: RequestCache): Promise<PublicSnapshot> {
  const response = await fetch('/public-snapshot.json', { cache: cacheMode })
  if (!response.ok) {
    throw new Error(`Failed to load public snapshot (${response.status})`)
  }
  return (await response.json()) as PublicSnapshot
}

async function loadPublicSnapshot(): Promise<PublicSnapshot> {
  if (!snapshotPromise) {
    snapshotPromise = fetchPublicSnapshot('no-cache')
      .catch(async (error) => {
        try {
          return await fetchPublicSnapshot('force-cache')
        } catch {
          throw error
        }
      })
      .catch((error) => {
        // Allow retries after transient bootstrap/network failures.
        snapshotPromise = null
        throw error
      })
  }
  return snapshotPromise
}

async function loadPublicSnapshotFromConvex(): Promise<PublicSnapshot> {
  const convexUrl = import.meta.env.VITE_CONVEX_URL
  if (!convexUrl) {
    throw new Error('Missing VITE_CONVEX_URL in dev mode')
  }

  if (!convexSnapshotClient || convexSnapshotClientUrl !== convexUrl) {
    convexSnapshotClient = new ConvexHttpClient(convexUrl)
    convexSnapshotClientUrl = convexUrl
  }

  return await convexSnapshotClient.query(api.publicSnapshot.get, {})
}

export function publicSnapshotQueryOptions() {
  if (USE_CONVEX_PUBLIC_DATA) {
    return queryOptions({
      queryKey: ['publicSnapshot', 'convex', import.meta.env.VITE_CONVEX_URL ?? ''],
      queryFn: loadPublicSnapshotFromConvex,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
    })
  }

  return queryOptions({
    queryKey: ['publicSnapshot'],
    queryFn: loadPublicSnapshot,
    staleTime: PRODUCTION_SNAPSHOT_STALE_TIME_MS,
    gcTime: PRODUCTION_SNAPSHOT_GC_TIME_MS,
  })
}

export function selectSpiritList(
  snapshot: PublicSnapshot,
  filters: SpiritFilters,
): SnapshotSpirit[] {
  const { complexity, elements } = filters

  return snapshot.spirits.filter((spirit) => {
    if (complexity && complexity.length > 0 && !complexity.includes(spirit.complexity)) {
      return false
    }
    if (
      elements &&
      elements.length > 0 &&
      !elements.every((element) => spirit.elements.includes(element))
    ) {
      return false
    }
    return true
  })
}

export function selectSpiritWithAspects(
  snapshot: PublicSnapshot,
  slug: string,
): { base: SnapshotSpirit; aspects: SnapshotSpirit[] } | null {
  const base = snapshot.spirits.find((spirit) => !spirit.isAspect && spirit.slug === slug)
  if (!base) return null

  const aspects = snapshot.spirits
    .filter((spirit) => spirit.isAspect && spirit.baseSpirit === base._id)
    .sort((a, b) => (a.aspectName ?? '').localeCompare(b.aspectName ?? ''))

  return { base, aspects }
}

export function selectSpiritBySlug(
  snapshot: PublicSnapshot,
  slug: string,
  aspect?: string,
): SnapshotSpirit | null {
  const spiritData = selectSpiritWithAspects(snapshot, slug)
  if (!spiritData) return null
  if (!aspect) return spiritData.base

  const normalizedAspect = toAspectSlug(aspect)
  const matchingAspect = spiritData.aspects.find(
    (entry) => entry.aspectName && toAspectSlug(entry.aspectName) === normalizedAspect,
  )
  return matchingAspect ?? spiritData.base
}

export function selectOpeningsBySpirit(
  snapshot: PublicSnapshot,
  spiritId: Id<'spirits'>,
): Doc<'openings'>[] {
  return snapshot.openingsBySpiritId[spiritId.toString()] ?? []
}
