import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { requireAuth } from './lib/auth'

// Reusable validators for game mutations
const spiritEntryValidator = v.object({
  spiritId: v.optional(v.id('spirits')),
  name: v.string(),
  variant: v.optional(v.string()),
  player: v.optional(v.string()),
})

const spiritEntryImportValidator = v.object({
  name: v.string(),
  variant: v.optional(v.string()),
  player: v.optional(v.string()),
})

const adversaryValidator = v.object({
  name: v.string(),
  level: v.number(),
})

const scenarioValidator = v.object({
  name: v.string(),
  difficulty: v.optional(v.number()),
})

// Shared optional game field validators (reused across mutations)
const optionalGameFields = {
  adversary: v.optional(adversaryValidator),
  secondaryAdversary: v.optional(adversaryValidator),
  scenario: v.optional(scenarioValidator),
  winType: v.optional(v.string()),
  invaderStage: v.optional(v.number()),
  blightCount: v.optional(v.number()),
  dahanCount: v.optional(v.number()),
  cardsRemaining: v.optional(v.number()),
  score: v.optional(v.number()),
  notes: v.optional(v.string()),
}

// Helper to get a game owned by the authenticated user (throws if not found)
async function requireOwnedGame(ctx: QueryCtx | MutationCtx, id: Id<'games'>) {
  const identity = await requireAuth(ctx)
  const game = await ctx.db.get(id)
  if (!game || game.userId !== identity.tokenIdentifier) {
    throw new Error('Game not found')
  }
  return { identity, game }
}

// Query to list all non-deleted games for the authenticated user
export const listGames = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx)
    return await ctx.db
      .query('games')
      .withIndex('by_user', (q) => q.eq('userId', identity.tokenIdentifier))
      .filter((q) => q.eq(q.field('deletedAt'), undefined))
      .order('desc')
      .collect()
  },
})

// Query to get a single game by ID (with ownership check)
export const getGame = query({
  args: { id: v.id('games') },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const game = await ctx.db.get(args.id)
    if (!game || game.userId !== identity.tokenIdentifier) {
      return null
    }
    return game
  },
})

// Mutation to create a new game
export const createGame = mutation({
  args: {
    date: v.string(),
    result: v.union(v.literal('win'), v.literal('loss')),
    spirits: v.array(spiritEntryValidator),
    ...optionalGameFields,
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const now = Date.now()

    // Validate at least one spirit
    if (args.spirits.length === 0) {
      throw new Error('At least one spirit is required')
    }
    if (args.spirits.length > 6) {
      throw new Error('Maximum 6 spirits allowed')
    }

    return await ctx.db.insert('games', {
      ...args,
      userId: identity.tokenIdentifier,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Mutation to update an existing game
export const updateGame = mutation({
  args: {
    id: v.id('games'),
    date: v.optional(v.string()),
    result: v.optional(v.union(v.literal('win'), v.literal('loss'))),
    spirits: v.optional(v.array(spiritEntryValidator)),
    ...optionalGameFields,
  },
  handler: async (ctx, args) => {
    await requireOwnedGame(ctx, args.id)
    const { id, ...updates } = args

    // Validate spirits if provided
    if (updates.spirits !== undefined) {
      if (updates.spirits.length === 0) {
        throw new Error('At least one spirit is required')
      }
      if (updates.spirits.length > 6) {
        throw new Error('Maximum 6 spirits allowed')
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

// Mutation to soft-delete a game
export const deleteGame = mutation({
  args: { id: v.id('games') },
  handler: async (ctx, args) => {
    await requireOwnedGame(ctx, args.id)
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
    })
  },
})

// Mutation to import games from CSV (upsert by ID)
export const importGames = mutation({
  args: {
    games: v.array(
      v.object({
        existingId: v.optional(v.string()), // Original game ID if updating
        date: v.string(),
        result: v.union(v.literal('win'), v.literal('loss')),
        spirits: v.array(spiritEntryImportValidator),
        ...optionalGameFields,
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const now = Date.now()

    let created = 0
    let updated = 0

    for (const gameData of args.games) {
      const { existingId, spirits, ...data } = gameData

      // Note: Import doesn't link to spirit IDs since CSV uses names
      // Create spirit entries with undefined spiritId (will show name but not link)
      const spiritsWithNullIds = spirits.map((s) => ({
        spiritId: undefined,
        name: s.name,
        variant: s.variant,
        player: s.player,
      }))

      if (existingId) {
        // Try to find and update existing game
        const existingGame = await ctx.db.get(existingId as Id<'games'>)
        if (existingGame && existingGame.userId === identity.tokenIdentifier) {
          // Full replacement per CONTEXT.md
          await ctx.db.replace(existingId as Id<'games'>, {
            ...data,
            spirits: spiritsWithNullIds,
            userId: identity.tokenIdentifier,
            createdAt: existingGame.createdAt,
            updatedAt: now,
          })
          updated++
          continue
        }
      }

      // Create new game
      await ctx.db.insert('games', {
        ...data,
        spirits: spiritsWithNullIds,
        userId: identity.tokenIdentifier,
        createdAt: now,
        updatedAt: now,
      })
      created++
    }

    return { created, updated }
  },
})
