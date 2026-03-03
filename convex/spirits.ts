import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import { mutation } from './_generated/server'
import { requireAdmin } from './lib/auth'
import { validateRequiredString } from './lib/validators'

const MAX_SETUP_LENGTH = 4000

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
