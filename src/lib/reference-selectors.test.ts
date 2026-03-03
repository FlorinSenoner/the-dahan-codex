import { describe, expect, it } from 'vitest'
import {
  selectAdversaryByName,
  selectAdversaryBySlug,
  selectAdversaryLevelDifficulty,
  selectAdversaryList,
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
  adversaries: [
    {
      _id: 'adv_bp',
      _creationTime: 1,
      name: 'Brandenburg-Prussia',
      slug: 'brandenburg-prussia',
      wikiUrl: 'https://spiritislandwiki.com/index.php?title=Brandenburg-Prussia',
      displayOrder: 1,
      aliases: [],
      imageUrl: '/adversaries/brandenburg-prussia.png',
      imageSourceUrl: 'https://spiritislandwiki.com/images/2/24/Brandenburg-Prussia_Map.png',
      baseDifficulty: 1,
      additionalLossCondition: 'None',
      escalation: 'Land Rush',
      levels: [
        {
          level: 1,
          difficulty: 2,
          fearCards: '9 (3/3/3)',
          effectName: 'Fast Start',
          effectText: 'Setup effect.',
          phases: {
            setup: ['Setup effect.'],
            explore: [],
            build: [],
            ravage: [],
            escalation: [],
            fearInvaderDeck: [],
            other: [],
          },
          cumulativePhases: {
            setup: ['Setup effect.'],
            explore: [],
            build: [],
            ravage: [],
            escalation: [],
            fearInvaderDeck: [],
            other: [],
          },
        },
      ],
      strategy: {
        overview: 'Fast adversary.',
        tips: [],
        sources: [],
        coverage: {
          totalSources: 0,
          bySourceType: {},
        },
      },
    },
    {
      _id: 'adv_fr',
      _creationTime: 2,
      name: 'France (Plantation Colony)',
      slug: 'france-plantation-colony',
      wikiUrl: 'https://spiritislandwiki.com/index.php?title=France_(Plantation_Colony)',
      displayOrder: 4,
      aliases: ['France'],
      imageUrl: '/adversaries/france-plantation-colony.png',
      imageSourceUrl:
        'https://spiritislandwiki.com/images/8/81/France_%28Plantation_Colony%29_Map.png',
      baseDifficulty: 2,
      additionalLossCondition: 'Town cap.',
      escalation: 'Demand for cash crops.',
      levels: [
        {
          level: 1,
          difficulty: 3,
          fearCards: '9 (3/3/3)',
          effectName: 'Frontier Explorers',
          effectText: 'Explore effect.',
          phases: {
            setup: [],
            explore: ['Explore effect.'],
            build: [],
            ravage: [],
            escalation: [],
            fearInvaderDeck: [],
            other: [],
          },
          cumulativePhases: {
            setup: [],
            explore: ['Explore effect.'],
            build: [],
            ravage: [],
            escalation: [],
            fearInvaderDeck: [],
            other: [],
          },
        },
      ],
      strategy: {
        overview: 'Town pressure.',
        tips: [],
        sources: [],
        coverage: {
          totalSources: 0,
          bySourceType: {},
        },
      },
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

  it('selects adversaries in display order and resolves by slug/name aliases', () => {
    const list = selectAdversaryList(snapshot)
    const bySlug = selectAdversaryBySlug(snapshot, 'france-plantation-colony')
    const byAlias = selectAdversaryByName(snapshot, 'France')

    expect(list.map((item) => item.slug)).toEqual([
      'brandenburg-prussia',
      'france-plantation-colony',
    ])
    expect(bySlug?.name).toBe('France (Plantation Colony)')
    expect(byAlias?.slug).toBe('france-plantation-colony')
  })

  it('reads level difficulty from adversary data', () => {
    const adversary = selectAdversaryBySlug(snapshot, 'brandenburg-prussia')
    expect(selectAdversaryLevelDifficulty(adversary, 1)).toBe(2)
    expect(selectAdversaryLevelDifficulty(adversary, 6)).toBeNull()
  })
})
