import { v } from 'convex/values'
import { query } from './_generated/server'

const complexityValidator = v.union(
  v.literal('Low'),
  v.literal('Moderate'),
  v.literal('High'),
  v.literal('Very High'),
)

const complexityModifierValidator = v.union(
  v.literal('easier'),
  v.literal('same'),
  v.literal('harder'),
)

const powerRatingsValidator = v.object({
  offense: v.number(),
  defense: v.number(),
  control: v.number(),
  fear: v.number(),
  utility: v.number(),
})

const spiritFieldsValidator = {
  name: v.string(),
  slug: v.string(),
  complexity: complexityValidator,
  summary: v.string(),
  imageUrl: v.optional(v.string()),
  expansionId: v.id('expansions'),
  elements: v.array(v.string()),
  baseSpirit: v.optional(v.id('spirits')),
  aspectName: v.optional(v.string()),
  complexityModifier: v.optional(complexityModifierValidator),
  description: v.optional(v.string()),
  setup: v.optional(v.string()),
  strengths: v.optional(v.array(v.string())),
  weaknesses: v.optional(v.array(v.string())),
  powerRatings: v.optional(powerRatingsValidator),
  wikiUrl: v.optional(v.string()),
  specialRules: v.optional(
    v.array(
      v.object({
        name: v.string(),
        description: v.string(),
      }),
    ),
  ),
}

const spiritSnapshotValidator = v.object({
  _id: v.id('spirits'),
  _creationTime: v.number(),
  ...spiritFieldsValidator,
  isAspect: v.boolean(),
})

const openingTurnValidator = v.object({
  turn: v.number(),
  title: v.optional(v.string()),
  instructions: v.string(),
})

const openingSnapshotValidator = v.object({
  _id: v.id('openings'),
  _creationTime: v.number(),
  spiritId: v.id('spirits'),
  slug: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  turns: v.array(openingTurnValidator),
  author: v.optional(v.string()),
  sourceUrl: v.optional(v.string()),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
  difficulty: v.optional(
    v.union(v.literal('Beginner'), v.literal('Intermediate'), v.literal('Advanced')),
  ),
})

const phaseRulesValidator = v.object({
  setup: v.array(v.string()),
  explore: v.array(v.string()),
  build: v.array(v.string()),
  ravage: v.array(v.string()),
  escalation: v.array(v.string()),
  fearInvaderDeck: v.array(v.string()),
  other: v.array(v.string()),
})

const adversaryLevelValidator = v.object({
  level: v.number(),
  difficulty: v.number(),
  fearCards: v.optional(v.string()),
  effectName: v.string(),
  effectText: v.string(),
  phases: phaseRulesValidator,
  cumulativePhases: phaseRulesValidator,
})

const adversaryTipValidator = v.object({
  id: v.string(),
  title: v.string(),
  summary: v.string(),
  levelFocus: v.array(v.number()),
  phaseFocus: v.array(v.string()),
  sourceIds: v.array(v.string()),
  confidence: v.number(),
})

const adversarySourceValidator = v.object({
  id: v.string(),
  sourceType: v.string(),
  url: v.string(),
  title: v.string(),
  author: v.optional(v.string()),
  publishedAt: v.optional(v.string()),
  confidence: v.number(),
  excerpt: v.string(),
})

const adversarySnapshotValidator = v.object({
  _id: v.id('adversaries'),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  wikiTitle: v.optional(v.string()),
  wikiUrl: v.string(),
  displayOrder: v.number(),
  aliases: v.array(v.string()),
  imageUrl: v.string(),
  imageSourceUrl: v.string(),
  baseDifficulty: v.number(),
  additionalLossCondition: v.string(),
  escalation: v.string(),
  levels: v.array(adversaryLevelValidator),
  strategy: v.object({
    overview: v.string(),
    tips: v.array(adversaryTipValidator),
    sources: v.array(adversarySourceValidator),
    coverage: v.object({
      totalSources: v.number(),
      bySourceType: v.object({
        reddit: v.optional(v.number()),
        bgg: v.optional(v.number()),
        github: v.optional(v.number()),
        web: v.optional(v.number()),
      }),
    }),
  }),
})

export const getPublicSnapshot = query({
  args: {},
  returns: v.object({
    generatedAt: v.number(),
    spirits: v.array(spiritSnapshotValidator),
    openings: v.array(openingSnapshotValidator),
    adversaries: v.array(adversarySnapshotValidator),
  }),
  handler: async (ctx) => {
    const spirits = await ctx.db.query('spirits').collect()

    const baseSpirits = spirits
      .filter((spirit) => !spirit.baseSpirit)
      .sort((a, b) => a.name.localeCompare(b.name))

    const aspectsByBaseSpirit = new Map<string, Array<(typeof spirits)[number]>>()
    for (const spirit of spirits) {
      if (!spirit.baseSpirit) continue
      const key = spirit.baseSpirit.toString()
      const existing = aspectsByBaseSpirit.get(key)
      if (existing) {
        existing.push(spirit)
      } else {
        aspectsByBaseSpirit.set(key, [spirit])
      }
    }

    const orderedSpirits: Array<(typeof spirits)[number] & { isAspect: boolean }> = []
    for (const baseSpirit of baseSpirits) {
      orderedSpirits.push({ ...baseSpirit, isAspect: false })

      const aspects = aspectsByBaseSpirit.get(baseSpirit._id.toString()) ?? []
      aspects.sort((a, b) => (a.aspectName ?? '').localeCompare(b.aspectName ?? ''))
      for (const aspect of aspects) {
        orderedSpirits.push({ ...aspect, isAspect: true })
      }
    }

    const openings = await ctx.db.query('openings').collect()
    openings.sort((a, b) => {
      const spiritCompare = a.spiritId.toString().localeCompare(b.spiritId.toString())
      if (spiritCompare !== 0) return spiritCompare

      const nameCompare = a.name.localeCompare(b.name)
      if (nameCompare !== 0) return nameCompare

      return a.slug.localeCompare(b.slug)
    })

    const adversaries = await ctx.db.query('adversaries').collect()
    adversaries.sort((a, b) => {
      const orderDiff = a.displayOrder - b.displayOrder
      if (orderDiff !== 0) return orderDiff
      return a.name.localeCompare(b.name)
    })

    return {
      generatedAt: Date.now(),
      spirits: orderedSpirits,
      openings,
      adversaries,
    }
  },
})
