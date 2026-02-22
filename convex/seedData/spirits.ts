import rawAspects from '../../scripts/data/aspects.json'
import rawSpirits from '../../scripts/data/spirits.json'
import type { Doc } from '../_generated/dataModel'

export const EXPANSIONS = [
  { name: 'Base Game', slug: 'base-game', releaseYear: 2017 },
  { name: 'Branch & Claw', slug: 'branch-and-claw', releaseYear: 2017 },
  { name: 'Jagged Earth', slug: 'jagged-earth', releaseYear: 2020 },
  { name: 'Promo Pack 2', slug: 'promo-pack-2', releaseYear: 2021 },
  { name: 'Feather and Flame', slug: 'feather-and-flame', releaseYear: 2022 },
  { name: 'Horizons of Spirit Island', slug: 'horizons', releaseYear: 2022 },
  { name: 'Nature Incarnate', slug: 'nature-incarnate', releaseYear: 2023 },
] as const

export type ExpansionSlug = (typeof EXPANSIONS)[number]['slug']

type SpiritDoc = Doc<'spirits'>
type SpiritComplexity = SpiritDoc['complexity']
type AspectComplexityModifier = NonNullable<SpiritDoc['complexityModifier']>
type RawPowerRatings = NonNullable<SpiritDoc['powerRatings']>
type SpiritSeedBase = Pick<
  SpiritDoc,
  | 'name'
  | 'slug'
  | 'complexity'
  | 'summary'
  | 'description'
  | 'elements'
  | 'strengths'
  | 'weaknesses'
  | 'powerRatings'
  | 'wikiUrl'
>

interface RawSpiritData extends SpiritSeedBase {
  setup: string
  expansion: ExpansionSlug
}

export interface SpiritData extends Omit<RawSpiritData, 'complexity' | 'powerRatings'> {
  complexity: SpiritComplexity
  powerRatings?: RawPowerRatings
  imageUrl: string
}

interface RawAspectData {
  name: NonNullable<SpiritDoc['aspectName']>
  slug: SpiritDoc['slug']
  baseSpiritSlug: SpiritDoc['slug']
  summary: SpiritDoc['summary']
  setup?: string
  expansion: ExpansionSlug
  complexityModifier: AspectComplexityModifier
}

export interface AspectData extends RawAspectData {
  imageUrl: string
}

function spiritImageUrl(slug: string) {
  return `/spirits/${slug}.webp`
}

export const SPIRITS: SpiritData[] = (rawSpirits as RawSpiritData[]).map((spirit) => ({
  name: spirit.name,
  slug: spirit.slug,
  complexity: spirit.complexity,
  summary: spirit.summary,
  setup: spirit.setup,
  description: spirit.description,
  imageUrl: spiritImageUrl(spirit.slug),
  expansion: spirit.expansion,
  elements: spirit.elements,
  strengths: spirit.strengths,
  weaknesses: spirit.weaknesses,
  powerRatings: spirit.powerRatings,
  wikiUrl: spirit.wikiUrl,
}))

export const ASPECTS: AspectData[] = (rawAspects as RawAspectData[]).map((aspect) => ({
  name: aspect.name,
  slug: aspect.slug,
  baseSpiritSlug: aspect.baseSpiritSlug,
  summary: aspect.summary,
  setup: aspect.setup,
  imageUrl: spiritImageUrl(aspect.slug),
  expansion: aspect.expansion,
  complexityModifier: aspect.complexityModifier,
}))
