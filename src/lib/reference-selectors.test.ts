import { describe, expect, it } from 'vitest'
import {
  selectOpeningsBySpiritId,
  selectSpiritBySlug,
  selectSpiritList,
  selectSpiritWithAspects,
} from '@/lib/reference-selectors'
import type { PublicSnapshot } from '@/types/reference'

const snapshot = {
  generatedAt: 1,
  spirits: [
    {
      _id: 'spirit_base_1',
      _creationTime: 1,
      name: 'River Surges in Sunlight',
      slug: 'river-surges-in-sunlight',
      complexity: 'Low',
      summary: 'Fast control spirit.',
      imageUrl: '/spirits/river-surges-in-sunlight.webp',
      expansionId: 'exp_base',
      elements: ['Sun', 'Water'],
      isAspect: false,
    },
    {
      _id: 'aspect_1',
      _creationTime: 2,
      name: 'River Surges in Sunlight',
      slug: 'river-surges-in-sunlight',
      complexity: 'Low',
      summary: 'Travel aspect.',
      imageUrl: '/spirits/river-travel.webp',
      expansionId: 'exp_je',
      elements: ['Sun', 'Water'],
      baseSpirit: 'spirit_base_1',
      aspectName: 'Travel',
      complexityModifier: 'same',
      isAspect: true,
    },
    {
      _id: 'spirit_base_2',
      _creationTime: 3,
      name: "Lightning's Swift Strike",
      slug: 'lightnings-swift-strike',
      complexity: 'Moderate',
      summary: 'Fast powers spirit.',
      imageUrl: '/spirits/lightnings-swift-strike.webp',
      expansionId: 'exp_base',
      elements: ['Fire', 'Air'],
      isAspect: false,
    },
  ],
  openings: [
    {
      _id: 'opening_2',
      _creationTime: 10,
      spiritId: 'spirit_base_1',
      slug: 'b-opening',
      name: 'B Opening',
      turns: [{ turn: 1, instructions: 'Do B first.' }],
    },
    {
      _id: 'opening_1',
      _creationTime: 9,
      spiritId: 'spirit_base_1',
      slug: 'a-opening',
      name: 'A Opening',
      turns: [{ turn: 1, instructions: 'Do A first.' }],
    },
  ],
} as unknown as PublicSnapshot

describe('reference-selectors', () => {
  it('filters spirits by complexity and elements', () => {
    const filtered = selectSpiritList(snapshot, {
      complexity: ['Low'],
      elements: ['Water'],
    })

    expect(filtered).toHaveLength(2)
    expect(filtered.every((spirit) => spirit.complexity === 'Low')).toBe(true)
    expect(filtered.every((spirit) => spirit.elements.includes('Water'))).toBe(true)
  })

  it('returns base spirit with linked aspects', () => {
    const spirit = selectSpiritWithAspects(snapshot, 'river-surges-in-sunlight')

    expect(spirit).not.toBeNull()
    expect(spirit?.base.isAspect).toBe(false)
    expect(spirit?.aspects).toHaveLength(1)
    expect(spirit?.aspects[0]?.aspectName).toBe('Travel')
  })

  it('resolves aspect by slug and falls back to base spirit when aspect is missing', () => {
    const foundAspect = selectSpiritBySlug(snapshot, 'river-surges-in-sunlight', 'travel')
    const fallback = selectSpiritBySlug(snapshot, 'river-surges-in-sunlight', 'not-real')

    expect(foundAspect?.aspectName).toBe('Travel')
    expect(fallback?.isAspect).toBe(false)
  })

  it('returns openings grouped by spirit id and sorted by name', () => {
    const openings = selectOpeningsBySpiritId(snapshot, 'spirit_base_1' as never)

    expect(openings).toHaveLength(2)
    expect(openings.map((opening) => opening.name)).toEqual(['A Opening', 'B Opening'])
  })
})
