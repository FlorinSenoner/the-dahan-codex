import { ConvexError, v } from 'convex/values'
import type { Id } from './_generated/dataModel'
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

const gameResultValidator = v.union(v.literal('win'), v.literal('loss'))

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

const optionalGameFieldValidators = {
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

const gameDocValidator = v.object({
  _id: v.id('games'),
  _creationTime: v.number(),
  userId: v.string(),
  date: v.string(),
  result: gameResultValidator,
  spirits: v.array(spiritEntryValidator),
  ...optionalGameFieldValidators,
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})

function validateDate(date: string) {
  if (!ISO_DATE_REGEX.test(date)) {
    throw new ConvexError({
      code: 'INVALID_DATE_FORMAT',
      message: 'date must be in YYYY-MM-DD format',
    })
  }

  const [year, month, day] = date.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new ConvexError({
      code: 'INVALID_DATE_VALUE',
      message: 'date must be a valid calendar date',
    })
  }
}

function validateSpirits(spirits: SpiritEntry[]) {
  if (spirits.length === 0) {
    throw new ConvexError({
      code: 'SPIRITS_REQUIRED',
      message: 'At least one spirit is required',
    })
  }

  if (spirits.length > MAX_SPIRITS_PER_GAME) {
    throw new ConvexError({
      code: 'TOO_MANY_SPIRITS',
      message: `Maximum ${MAX_SPIRITS_PER_GAME} spirits allowed`,
    })
  }

  for (const spirit of spirits) {
    validateRequiredString(spirit.name, 'spirit name', MAX_SPIRIT_NAME_LENGTH)
    validateStringLength(spirit.variant, 'spirit variant', MAX_SPIRIT_VARIANT_LENGTH)
    validateStringLength(spirit.player, 'player name', MAX_PLAYER_NAME_LENGTH)
  }
}

function validateOptionalFields(fields: OptionalGameValues) {
  if (fields.adversary) {
    validateRequiredString(fields.adversary.name, 'adversary name', MAX_ADVERSARY_NAME_LENGTH)
    validateIntegerRange(fields.adversary.level, 'adversary level', 0, 6)
  }

  if (fields.secondaryAdversary) {
    validateRequiredString(
      fields.secondaryAdversary.name,
      'secondary adversary name',
      MAX_ADVERSARY_NAME_LENGTH,
    )
    validateIntegerRange(fields.secondaryAdversary.level, 'secondary adversary level', 0, 6)
  }

  if (fields.scenario) {
    validateRequiredString(fields.scenario.name, 'scenario name', MAX_SCENARIO_NAME_LENGTH)
    validateIntegerRange(fields.scenario.difficulty, 'scenario difficulty', -20, 20)
  }

  validateStringLength(fields.winType, 'winType', MAX_WIN_TYPE_LENGTH)
  validateStringLength(fields.notes, 'notes', MAX_NOTES_LENGTH)
  validateIntegerRange(fields.invaderStage, 'invaderStage', 1, 3)
  validateIntegerRange(fields.blightCount, 'blightCount', 0, 99)
  validateIntegerRange(fields.dahanCount, 'dahanCount', 0, 99)
  validateIntegerRange(fields.cardsRemaining, 'cardsRemaining', 0, 200)
  validateIntegerRange(fields.score, 'score', -500, 1000)
}

async function requireOwnedGame(ctx: QueryCtx | MutationCtx, id: Id<'games'>) {
  const identity = await requireAuth(ctx)
  const game = await ctx.db.get(id)
  if (!game || game.userId !== identity.tokenIdentifier) {
    throw new ConvexError({
      code: 'GAME_NOT_FOUND',
      message: 'Game not found',
    })
  }
  return { identity, game }
}

export const listGames = query({
  args: {},
  returns: v.array(gameDocValidator),
  handler: async (ctx) => {
    const identity = await requireAuth(ctx)
    return ctx.db
      .query('games')
      .withIndex('by_user_deleted', (q) =>
        q.eq('userId', identity.tokenIdentifier).eq('deletedAt', undefined),
      )
      .order('desc')
      .collect()
  },
})

export const getGame = query({
  args: { id: v.id('games') },
  returns: v.union(gameDocValidator, v.null()),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const game = await ctx.db.get(args.id)
    if (!game || game.userId !== identity.tokenIdentifier) {
      return null
    }
    return game
  },
})

export const createGame = mutation({
  args: {
    date: v.string(),
    result: gameResultValidator,
    spirits: v.array(spiritEntryValidator),
    ...optionalGameFieldValidators,
  },
  returns: v.id('games'),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const now = Date.now()

    validateDate(args.date)
    validateSpirits(args.spirits)
    validateOptionalFields(args)

    return ctx.db.insert('games', {
      ...args,
      userId: identity.tokenIdentifier,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateGame = mutation({
  args: {
    id: v.id('games'),
    date: v.optional(v.string()),
    result: v.optional(gameResultValidator),
    spirits: v.optional(v.array(spiritEntryValidator)),
    ...optionalGameFieldValidators,
  },
  returns: v.null(),
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

    return null
  },
})

export const deleteGame = mutation({
  args: { id: v.id('games') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwnedGame(ctx, args.id)
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
    return null
  },
})

export const importGames = mutation({
  args: {
    games: v.array(
      v.object({
        existingId: v.optional(v.string()),
        date: v.string(),
        result: gameResultValidator,
        spirits: v.array(spiritEntryImportValidator),
        ...optionalGameFieldValidators,
      }),
    ),
  },
  returns: v.object({
    created: v.number(),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx)
    const now = Date.now()

    if (args.games.length > MAX_IMPORT_BATCH_SIZE) {
      throw new ConvexError({
        code: 'IMPORT_BATCH_TOO_LARGE',
        message: `Cannot import more than ${MAX_IMPORT_BATCH_SIZE} games at once`,
      })
    }

    let created = 0
    let updated = 0

    for (const gameData of args.games) {
      const { existingId, spirits, ...data } = gameData
      validateDate(data.date)
      validateSpirits(spirits)
      validateOptionalFields(data)
      validateStringLength(existingId, 'existingId', 128)

      const spiritsWithNullIds = spirits.map((spirit) => ({
        spiritId: undefined,
        name: spirit.name,
        variant: spirit.variant,
        player: spirit.player,
      }))

      if (existingId) {
        const normalizedId = ctx.db.normalizeId('games', existingId)
        if (normalizedId) {
          const existingGame = await ctx.db.get(normalizedId)
          if (existingGame && existingGame.userId === identity.tokenIdentifier) {
            await ctx.db.replace(normalizedId, {
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
      }

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
