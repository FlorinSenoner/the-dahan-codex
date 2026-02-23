import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/auth'
import {
  validateHttpUrl,
  validateIntegerRange,
  validateRequiredString,
  validateStringLength,
} from './lib/validators'

const MAX_OPENING_NAME_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 2000
const MAX_AUTHOR_LENGTH = 120
const MAX_TURNS_PER_OPENING = 20
const MAX_TURN_TITLE_LENGTH = 120
const MAX_TURN_INSTRUCTIONS_LENGTH = 4000

const openingTurnValidator = v.object({
  turn: v.number(),
  title: v.optional(v.string()),
  instructions: v.string(),
})

const openingFields = {
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
}

const openingValidator = v.object({
  _id: v.id('openings'),
  _creationTime: v.number(),
  ...openingFields,
})

function validateTurns(turns: Array<{ turn: number; title?: string; instructions: string }>) {
  if (turns.length === 0) {
    throw new ConvexError({
      code: 'OPENING_TURNS_REQUIRED',
      message: 'At least one turn is required',
    })
  }

  if (turns.length > MAX_TURNS_PER_OPENING) {
    throw new ConvexError({
      code: 'OPENING_TURNS_TOO_MANY',
      message: `Openings are limited to ${MAX_TURNS_PER_OPENING} turns`,
    })
  }

  for (const turn of turns) {
    validateIntegerRange(turn.turn, 'turn number', 1, MAX_TURNS_PER_OPENING)
    validateStringLength(turn.title, 'turn title', MAX_TURN_TITLE_LENGTH)
    validateRequiredString(turn.instructions, 'turn instructions', MAX_TURN_INSTRUCTIONS_LENGTH)
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const listBySpirit = query({
  args: { spiritId: v.id('spirits') },
  returns: v.array(openingValidator),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    return ctx.db
      .query('openings')
      .withIndex('by_spirit', (q) => q.eq('spiritId', args.spiritId))
      .collect()
  },
})

export const createOpening = mutation({
  args: {
    spiritId: v.id('spirits'),
    name: v.string(),
    description: v.optional(v.string()),
    turns: v.array(openingTurnValidator),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  returns: v.id('openings'),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    validateRequiredString(args.name, 'name', MAX_OPENING_NAME_LENGTH)
    validateStringLength(args.description, 'description', MAX_DESCRIPTION_LENGTH)
    validateStringLength(args.author, 'author', MAX_AUTHOR_LENGTH)
    validateHttpUrl(args.sourceUrl, 'sourceUrl')
    validateTurns(args.turns)

    const now = Date.now()
    const slug = generateSlug(args.name)
    const id = await ctx.db.insert('openings', {
      spiritId: args.spiritId,
      slug,
      name: args.name,
      description: args.description,
      turns: args.turns,
      author: args.author,
      sourceUrl: args.sourceUrl,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
    return id
  },
})

export const updateOpening = mutation({
  args: {
    id: v.id('openings'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    turns: v.optional(v.array(openingTurnValidator)),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    if (args.name !== undefined) {
      validateRequiredString(args.name, 'name', MAX_OPENING_NAME_LENGTH)
    }
    validateStringLength(args.description, 'description', MAX_DESCRIPTION_LENGTH)
    validateStringLength(args.author, 'author', MAX_AUTHOR_LENGTH)
    validateHttpUrl(args.sourceUrl, 'sourceUrl')
    if (args.turns !== undefined) {
      validateTurns(args.turns)
    }

    const { id, ...updates } = args
    const patch: Record<string, unknown> = {
      updatedAt: Date.now(),
    }

    if (updates.name !== undefined) {
      patch.name = updates.name
      patch.slug = generateSlug(updates.name)
    }
    if (updates.description !== undefined) patch.description = updates.description
    if (updates.turns !== undefined) patch.turns = updates.turns
    if (updates.author !== undefined) patch.author = updates.author
    if (updates.sourceUrl !== undefined) patch.sourceUrl = updates.sourceUrl

    await ctx.db.patch(id, patch)
    await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
    return null
  },
})

export const deleteOpening = mutation({
  args: {
    id: v.id('openings'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.delete(args.id)
    await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
    return null
  },
})
