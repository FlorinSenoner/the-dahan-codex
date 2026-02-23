import { queryOptions } from '@tanstack/react-query'
import type { Doc, Id } from 'convex/_generated/dataModel'
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

async function loadPublicSnapshot(): Promise<PublicSnapshot> {
  if (!snapshotPromise) {
    snapshotPromise = fetch('/public-snapshot.json', { cache: 'force-cache' }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to load public snapshot (${res.status})`)
      }
      return (await res.json()) as PublicSnapshot
    })
  }
  return snapshotPromise
}

export function publicSnapshotQueryOptions() {
  return queryOptions({
    queryKey: ['publicSnapshot'],
    queryFn: loadPublicSnapshot,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
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
