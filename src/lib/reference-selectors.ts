import { toAspectSlug } from '@/lib/slug'
import type {
  PublicAdversary,
  PublicOpening,
  PublicSnapshot,
  PublicSpirit,
} from '@/types/reference'

interface SpiritFilters {
  complexity?: string[]
  elements?: string[]
}

export function selectSpiritList(
  snapshot: PublicSnapshot,
  filters: SpiritFilters = {},
): PublicSpirit[] {
  const { complexity, elements } = filters

  return snapshot.spirits.filter((spirit) => {
    if (complexity && complexity.length > 0 && !complexity.includes(spirit.complexity)) {
      return false
    }

    if (elements && elements.length > 0 && !elements.every((el) => spirit.elements.includes(el))) {
      return false
    }

    return true
  })
}

export function selectSpiritWithAspects(
  snapshot: PublicSnapshot,
  slug: string,
): { base: PublicSpirit; aspects: PublicSpirit[] } | null {
  const base = snapshot.spirits.find((spirit) => !spirit.isAspect && spirit.slug === slug)
  if (!base) return null

  const aspects = snapshot.spirits.filter((spirit) => spirit.baseSpirit === base._id)
  return { base, aspects }
}

export function selectSpiritBySlug(
  snapshot: PublicSnapshot,
  slug: string,
  aspect?: string,
): PublicSpirit | null {
  const spiritWithAspects = selectSpiritWithAspects(snapshot, slug)
  if (!spiritWithAspects) return null

  if (!aspect) {
    return spiritWithAspects.base
  }

  const aspectSlug = toAspectSlug(aspect)
  const matchingAspect = spiritWithAspects.aspects.find(
    (candidate) => candidate.aspectName && toAspectSlug(candidate.aspectName) === aspectSlug,
  )

  return matchingAspect ?? spiritWithAspects.base
}

export function selectOpeningsBySpiritId(
  snapshot: PublicSnapshot,
  spiritId: PublicSpirit['_id'],
): PublicOpening[] {
  return snapshot.openings
    .filter((opening) => opening.spiritId === spiritId)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function selectAdversaryList(snapshot: PublicSnapshot): PublicAdversary[] {
  return snapshot.adversaries.slice().sort((a, b) => {
    const orderDiff = a.displayOrder - b.displayOrder
    if (orderDiff !== 0) return orderDiff
    return a.name.localeCompare(b.name)
  })
}

export function selectAdversaryBySlug(
  snapshot: PublicSnapshot,
  slug: string,
): PublicAdversary | null {
  return snapshot.adversaries.find((adversary) => adversary.slug === slug) ?? null
}

export function selectAdversaryByName(
  snapshot: PublicSnapshot,
  name: string,
): PublicAdversary | null {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return null

  return (
    snapshot.adversaries.find((adversary) => {
      if (adversary.name.toLowerCase() === normalized) return true
      return adversary.aliases.some((alias) => alias.toLowerCase() === normalized)
    }) ?? null
  )
}

export function selectAdversaryLevelDifficulty(
  adversary: PublicAdversary | null | undefined,
  level: number,
): number | null {
  if (!adversary) return null
  const match = adversary.levels.find((item) => item.level === level)
  return match?.difficulty ?? null
}
