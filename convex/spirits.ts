import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import type { QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/auth'
import { validateRequiredString } from './lib/validators'

const MAX_SETUP_LENGTH = 4000

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

const spiritFields = {
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

const spiritValidator = v.object({
  _id: v.id('spirits'),
  _creationTime: v.number(),
  ...spiritFields,
})

const spiritListItemValidator = v.object({
  _id: v.id('spirits'),
  _creationTime: v.number(),
  ...spiritFields,
  isAspect: v.boolean(),
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper: get base spirit by slug (no baseSpirit reference)
async function getBaseSpiritBySlug(ctx: QueryCtx, slug: string) {
  return ctx.db
    .query('spirits')
    .withIndex('by_slug_and_base_spirit', (q) => q.eq('slug', slug).eq('baseSpirit', undefined))
    .first()
}

export const listSpirits = query({
  args: {
    complexity: v.optional(v.array(v.string())),
    elements: v.optional(v.array(v.string())),
  },
  returns: v.array(spiritListItemValidator),
  handler: async (ctx, args) => {
    let spirits = await ctx.db.query('spirits').collect()

    if (args.complexity && args.complexity.length > 0) {
      spirits = spirits.filter((spirit) => args.complexity?.includes(spirit.complexity))
    }

    if (args.elements && args.elements.length > 0) {
      spirits = spirits.filter((spirit) =>
        args.elements?.every((el) => spirit.elements.includes(el)),
      )
    }

    spirits.sort((a, b) => a.name.localeCompare(b.name))

    const baseSpirits = spirits.filter((spirit) => !spirit.baseSpirit)
    const aspectMap = new Map<string, typeof spirits>()
    for (const spirit of spirits.filter((entry) => entry.baseSpirit)) {
      if (!spirit.baseSpirit) continue
      const key = spirit.baseSpirit.toString()
      const existing = aspectMap.get(key)
      if (existing) {
        existing.push(spirit)
      } else {
        aspectMap.set(key, [spirit])
      }
    }

    const result: Array<(typeof spirits)[0] & { isAspect: boolean }> = []
    for (const baseSpirit of baseSpirits) {
      result.push({ ...baseSpirit, isAspect: false })
      const aspects = aspectMap.get(baseSpirit._id.toString()) ?? []
      aspects.sort((a, b) => (a.aspectName ?? '').localeCompare(b.aspectName ?? ''))
      for (const aspect of aspects) {
        result.push({ ...aspect, isAspect: true })
      }
    }

    return result
  },
})

export const getSpiritWithAspects = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      base: spiritValidator,
      aspects: v.array(spiritValidator),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const baseSpirit = await getBaseSpiritBySlug(ctx, args.slug)
    if (!baseSpirit) return null

    const aspects = await ctx.db
      .query('spirits')
      .withIndex('by_base_spirit', (q) => q.eq('baseSpirit', baseSpirit._id))
      .collect()

    aspects.sort((a, b) => (a.aspectName ?? '').localeCompare(b.aspectName ?? ''))
    return {
      base: baseSpirit,
      aspects,
    }
  },
})

export const getSpiritBySlug = query({
  args: {
    slug: v.string(),
    aspect: v.optional(v.string()),
  },
  returns: v.union(spiritValidator, v.null()),
  handler: async (ctx, args) => {
    const baseSpirit = await getBaseSpiritBySlug(ctx, args.slug)
    if (!baseSpirit) return null

    if (!args.aspect) {
      return baseSpirit
    }

    const aspects = await ctx.db
      .query('spirits')
      .withIndex('by_base_spirit', (q) => q.eq('baseSpirit', baseSpirit._id))
      .collect()

    const requestedAspect = slugify(args.aspect)
    const matchingAspect = aspects.find(
      (aspect) => aspect.aspectName && slugify(aspect.aspectName) === requestedAspect,
    )

    return matchingAspect ?? baseSpirit
  },
})

export const updateSpiritSetup = mutation({
  args: {
    spiritId: v.id('spirits'),
    setup: v.string(),
  },
  returns: v.object({
    updated: v.number(),
    spiritId: v.id('spirits'),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    validateRequiredString(args.setup, 'setup', MAX_SETUP_LENGTH)

    const requestedSpirit = await ctx.db.get(args.spiritId)
    if (!requestedSpirit) {
      throw new ConvexError({
        code: 'SPIRIT_NOT_FOUND',
        message: 'Spirit not found',
      })
    }

    const baseSpirit = requestedSpirit.baseSpirit
      ? await ctx.db.get(requestedSpirit.baseSpirit)
      : requestedSpirit
    if (!baseSpirit) {
      throw new ConvexError({
        code: 'BASE_SPIRIT_NOT_FOUND',
        message: 'Base spirit not found',
      })
    }

    const setup = args.setup.trim()
    const aspects = await ctx.db
      .query('spirits')
      .withIndex('by_base_spirit', (q) => q.eq('baseSpirit', baseSpirit._id))
      .collect()

    let updated = 0
    const spiritsToPatch = [baseSpirit, ...aspects]
    for (const spirit of spiritsToPatch) {
      if (spirit.setup === setup) continue
      await ctx.db.patch(spirit._id, { setup })
      updated++
    }

    if (updated > 0) {
      await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
    }

    return {
      updated,
      spiritId: baseSpirit._id,
    }
  },
})
