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

export const getPublicSnapshot = query({
  args: {},
  returns: v.object({
    generatedAt: v.number(),
    spirits: v.array(spiritSnapshotValidator),
    openings: v.array(openingSnapshotValidator),
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

    return {
      generatedAt: Date.now(),
      spirits: orderedSpirits,
      openings,
    }
  },
})
