import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { requireAuth } from './lib/auth'
import {
  validateIntegerRange,
  validateRequiredString,
  validateStringLength,
} from './lib/validators'

const MAX_SPIRITS_PER_GAME = 6
const MAX_IMPORT_BATCH_SIZE = 500
const MAX_SPIRIT_NAME_LENGTH = 120
const MAX_SPIRIT_VARIANT_LENGTH = 120
const MAX_PLAYER_NAME_LENGTH = 120
const MAX_NOTES_LENGTH = 5000
const MAX_WIN_TYPE_LENGTH = 64
const MAX_ADVERSARY_NAME_LENGTH = 100
const MAX_SCENARIO_NAME_LENGTH = 120
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

type SpiritEntry = {
  name: string
  variant?: string
  player?: string
}

type OptionalGameValues = {
  adversary?: { name: string; level: number }
  secondaryAdversary?: { name: string; level: number }
  scenario?: { name: string; difficulty?: number }
  winType?: string
  invaderStage?: number
  blightCount?: number
  dahanCount?: number
  cardsRemaining?: number
  score?: number
  notes?: string
}

function validateDate(date: string) {
  if (!ISO_DATE_REGEX.test(date)) {
    throw new Error('date must be in YYYY-MM-DD format')
  }
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    throw new Error('date must be a valid calendar date')
  }
}

function validateSpirits(spirits: SpiritEntry[]) {
  if (spirits.length === 0) {
    throw new Error('At least one spirit is required')
  }
  if (spirits.length > MAX_SPIRITS_PER_GAME) {
    throw new Error(`Maximum ${MAX_SPIRITS_PER_GAME} spirits allowed`)
  }

  for (const spirit of spirits) {
    validateRequiredString(spirit.name, 'spirit name', MAX_SPIRIT_NAME_LENGTH)
    validateStringLength(spirit.variant, 'spirit variant', MAX_SPIRIT_VARIANT_LENGTH)
    validateStringLength(spirit.player, 'player name', MAX_PLAYER_NAME_LENGTH)
  }
}

function validateOptionalFields(fields: OptionalGameValues) {
  const adversary = fields.adversary
  if (adversary) {
    validateRequiredString(adversary.name, 'adversary name', MAX_ADVERSARY_NAME_LENGTH)
    validateIntegerRange(adversary.level, 'adversary level', 0, 6)
  }

  const secondaryAdversary = fields.secondaryAdversary
  if (secondaryAdversary) {
    validateRequiredString(
      secondaryAdversary.name,
      'secondary adversary name',
      MAX_ADVERSARY_NAME_LENGTH,
    )
    validateIntegerRange(secondaryAdversary.level, 'secondary adversary level', 0, 6)
  }

  const scenario = fields.scenario
  if (scenario) {
    validateRequiredString(scenario.name, 'scenario name', MAX_SCENARIO_NAME_LENGTH)
    validateIntegerRange(scenario.difficulty, 'scenario difficulty', -20, 20)
  }

  validateStringLength(fields.winType, 'winType', MAX_WIN_TYPE_LENGTH)
  validateStringLength(fields.notes, 'notes', MAX_NOTES_LENGTH)
  validateIntegerRange(fields.invaderStage, 'invaderStage', 1, 3)
  validateIntegerRange(fields.blightCount, 'blightCount', 0, 99)
  validateIntegerRange(fields.dahanCount, 'dahanCount', 0, 99)
  validateIntegerRange(fields.cardsRemaining, 'cardsRemaining', 0, 200)
  validateIntegerRange(fields.score, 'score', -500, 1000)
}

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

    validateDate(args.date)
    validateSpirits(args.spirits)
    validateOptionalFields(args)

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

    if (updates.date !== undefined) {
      validateDate(updates.date)
    }
    if (updates.spirits !== undefined) {
      validateSpirits(updates.spirits)
    }
    validateOptionalFields(updates)

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

    if (args.games.length > MAX_IMPORT_BATCH_SIZE) {
      throw new Error(`Cannot import more than ${MAX_IMPORT_BATCH_SIZE} games at once`)
    }

    let created = 0
    let updated = 0

    for (const gameData of args.games) {
      const { existingId, spirits, ...data } = gameData

      validateDate(data.date)
      validateSpirits(spirits)
      validateOptionalFields(data)
      validateStringLength(existingId, 'existingId', 128)

      // Note: Import doesn't link to spirit IDs since CSV uses names.
      const spiritsWithNullIds = spirits.map((s) => ({
        spiritId: undefined,
        name: s.name,
        variant: s.variant,
        player: s.player,
      }))

      if (existingId) {
        // Try to find and update existing game
        // CSV import uses string IDs that may not be valid Convex IDs
        let existingGame: Doc<'games'> | null = null
        try {
          existingGame = await ctx.db.get(existingId as Id<'games'>)
        } catch {
          // Invalid ID format from CSV — treat as new game.
        }
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
