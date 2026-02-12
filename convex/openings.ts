import { v } from 'convex/values'
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

type OpeningTurn = {
  turn: number
  title?: string
  instructions: string
}

function validateTurns(turns: OpeningTurn[]) {
  if (turns.length === 0) {
    throw new Error('At least one turn is required')
  }
  if (turns.length > MAX_TURNS_PER_OPENING) {
    throw new Error(`Openings are limited to ${MAX_TURNS_PER_OPENING} turns`)
  }

  for (const turn of turns) {
    validateIntegerRange(turn.turn, 'turn number', 1, MAX_TURNS_PER_OPENING)
    validateStringLength(turn.title, 'turn title', MAX_TURN_TITLE_LENGTH)
    validateRequiredString(turn.instructions, 'turn instructions', MAX_TURN_INSTRUCTIONS_LENGTH)
  }
}

/**
 * Generate a URL-friendly slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// List all openings for a specific spirit
export const listBySpirit = query({
  args: { spiritId: v.id('spirits') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('openings')
      .withIndex('by_spirit', (q) => q.eq('spiritId', args.spiritId))
      .collect()
  },
})

// Get a single opening by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('openings')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()
  },
})

// Create a new opening (admin only)
export const createOpening = mutation({
  args: {
    spiritId: v.id('spirits'),
    name: v.string(),
    description: v.optional(v.string()),
    turns: v.array(
      v.object({
        turn: v.number(),
        title: v.optional(v.string()),
        instructions: v.string(),
      }),
    ),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
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

// Update an existing opening (admin only)
export const updateOpening = mutation({
  args: {
    id: v.id('openings'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    turns: v.optional(
      v.array(
        v.object({
          turn: v.number(),
          title: v.optional(v.string()),
          instructions: v.string(),
        }),
      ),
    ),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
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

    // Build patch object with only provided fields
    const patch: Record<string, unknown> = {
      updatedAt: Date.now(),
    }

    if (updates.name !== undefined) {
      patch.name = updates.name
      patch.slug = generateSlug(updates.name)
    }
    if (updates.description !== undefined) {
      patch.description = updates.description
    }
    if (updates.turns !== undefined) {
      patch.turns = updates.turns
    }
    if (updates.author !== undefined) {
      patch.author = updates.author
    }
    if (updates.sourceUrl !== undefined) {
      patch.sourceUrl = updates.sourceUrl
    }

    await ctx.db.patch(id, patch)
    await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
  },
})

// Delete an opening (admin only)
export const deleteOpening = mutation({
  args: {
    id: v.id('openings'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.delete(args.id)
    await ctx.scheduler.runAfter(0, internal.publishAuto.markDirtyInternal, {})
  },
})
