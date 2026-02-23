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

let convexSnapshotClient: ConvexHttpClient | null = null
let convexSnapshotClientUrl: string | null = null
const SNAPSHOT_STALE_TIME_MS = 60 * 1000
const SNAPSHOT_GC_TIME_MS = 5 * 60 * 1000

function getConvexUrl() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL
  if (!convexUrl) {
    throw new Error('Missing VITE_CONVEX_URL')
  }
  return convexUrl
}

export function publicSnapshotQueryKey() {
  return ['publicSnapshot', getConvexUrl()] as const
}

async function loadPublicSnapshotFromConvex(): Promise<PublicSnapshot> {
  const convexUrl = getConvexUrl()
  if (!convexSnapshotClient || convexSnapshotClientUrl !== convexUrl) {
    convexSnapshotClient = new ConvexHttpClient(convexUrl)
    convexSnapshotClientUrl = convexUrl
  }

  return await convexSnapshotClient.query(api.publicSnapshot.get, {})
}

export function publicSnapshotQueryOptions() {
  return queryOptions({
    queryKey: publicSnapshotQueryKey(),
    queryFn: loadPublicSnapshotFromConvex,
    staleTime: SNAPSHOT_STALE_TIME_MS,
    gcTime: SNAPSHOT_GC_TIME_MS,
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
