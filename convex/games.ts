import { ConvexError, v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { requireAdmin, requireAuth } from './lib/auth'
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
const MAX_ADVERSARY_NAME_SNAPSHOT_LENGTH = 120
const MAX_SCENARIO_NAME_LENGTH = 120
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

type SpiritEntry = {
  name: string
  variant?: string
  player?: string
}

type OptionalGameValues = {
  adversary?: { name: string; level: number }
  adversaryRef?: {
    adversaryId: Id<'adversaries'>
    level: number
    difficulty: number
    nameSnapshot: string
  }
  secondaryAdversary?: { name: string; level: number }
  secondaryAdversaryRef?: {
    adversaryId: Id<'adversaries'>
    level: number
    difficulty: number
    nameSnapshot: string
  }
  scenario?: { name: string; difficulty?: number }
  winType?: string
  invaderStage?: number
  blightCount?: number
  dahanCount?: number
  cardsRemaining?: number
  score?: number
  notes?: string
}

type AdversaryRefValue = NonNullable<OptionalGameValues['adversaryRef']>
type AdversaryLookup = Map<string, Doc<'adversaries'>>

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

const adversaryRefValidator = v.object({
  adversaryId: v.id('adversaries'),
  level: v.number(),
  difficulty: v.number(),
  nameSnapshot: v.string(),
})

const scenarioValidator = v.object({
  name: v.string(),
  difficulty: v.optional(v.number()),
})

const optionalGameFieldValidators = {
  adversary: v.optional(adversaryValidator),
  adversaryRef: v.optional(adversaryRefValidator),
  secondaryAdversary: v.optional(adversaryValidator),
  secondaryAdversaryRef: v.optional(adversaryRefValidator),
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

  if (fields.adversaryRef) {
    validateIntegerRange(fields.adversaryRef.level, 'adversaryRef level', 0, 6)
    validateIntegerRange(fields.adversaryRef.difficulty, 'adversaryRef difficulty', 0, 20)
    validateRequiredString(
      fields.adversaryRef.nameSnapshot,
      'adversaryRef nameSnapshot',
      MAX_ADVERSARY_NAME_SNAPSHOT_LENGTH,
    )
  }

  if (fields.secondaryAdversaryRef) {
    validateIntegerRange(fields.secondaryAdversaryRef.level, 'secondaryAdversaryRef level', 0, 6)
    validateIntegerRange(
      fields.secondaryAdversaryRef.difficulty,
      'secondaryAdversaryRef difficulty',
      0,
      20,
    )
    validateRequiredString(
      fields.secondaryAdversaryRef.nameSnapshot,
      'secondaryAdversaryRef nameSnapshot',
      MAX_ADVERSARY_NAME_SNAPSHOT_LENGTH,
    )
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

function normalizeAdversaryName(name: string) {
  return name.trim().toLowerCase()
}

async function loadAdversaryLookup(ctx: QueryCtx | MutationCtx) {
  const adversaries = await ctx.db.query('adversaries').collect()
  const byName: AdversaryLookup = new Map()

  for (const adversary of adversaries) {
    byName.set(normalizeAdversaryName(adversary.name), adversary)
    for (const alias of adversary.aliases) {
      byName.set(normalizeAdversaryName(alias), adversary)
    }
  }

  return byName
}

function toLegacyAdversaryFromRef(ref?: OptionalGameValues['adversaryRef']) {
  if (!ref) return undefined
  return {
    name: ref.nameSnapshot,
    level: ref.level,
  }
}

function toAdversaryRefFromLegacy(
  adversary: OptionalGameValues['adversary'] | undefined,
  lookup: AdversaryLookup,
): AdversaryRefValue | undefined {
  if (!adversary) return undefined

  const matched = lookup.get(normalizeAdversaryName(adversary.name))
  if (!matched) return undefined

  const level = Math.max(0, Math.min(6, adversary.level))
  const levelData = matched.levels.find((item) => item.level === level)

  return {
    adversaryId: matched._id,
    level,
    difficulty: level === 0 ? matched.baseDifficulty : (levelData?.difficulty ?? level),
    nameSnapshot: matched.name,
  }
}

async function hydrateAdversaryFields(
  ctx: QueryCtx | MutationCtx,
  fields: Pick<
    OptionalGameValues,
    'adversary' | 'adversaryRef' | 'secondaryAdversary' | 'secondaryAdversaryRef'
  >,
  lookup?: AdversaryLookup,
) {
  const adversaryLookup = lookup ?? (await loadAdversaryLookup(ctx))

  const adversaryRef =
    fields.adversaryRef ?? toAdversaryRefFromLegacy(fields.adversary, adversaryLookup)
  const secondaryAdversaryRef =
    fields.secondaryAdversaryRef ??
    toAdversaryRefFromLegacy(fields.secondaryAdversary, adversaryLookup)

  const adversary = fields.adversary ?? toLegacyAdversaryFromRef(adversaryRef)
  const secondaryAdversary =
    fields.secondaryAdversary ?? toLegacyAdversaryFromRef(secondaryAdversaryRef)

  return {
    adversary,
    adversaryRef,
    secondaryAdversary,
    secondaryAdversaryRef,
  }
}

type AdversaryFieldInput = Pick<
  OptionalGameValues,
  'adversary' | 'adversaryRef' | 'secondaryAdversary' | 'secondaryAdversaryRef'
>

function hasAdversaryFieldInput(fields: AdversaryFieldInput) {
  return (
    fields.adversary !== undefined ||
    fields.adversaryRef !== undefined ||
    fields.secondaryAdversary !== undefined ||
    fields.secondaryAdversaryRef !== undefined
  )
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

    const adversaryInput: AdversaryFieldInput = {
      adversary: args.adversary,
      adversaryRef: args.adversaryRef,
      secondaryAdversary: args.secondaryAdversary,
      secondaryAdversaryRef: args.secondaryAdversaryRef,
    }
    const adversaryFields = hasAdversaryFieldInput(adversaryInput)
      ? await hydrateAdversaryFields(ctx, adversaryInput)
      : {}

    return ctx.db.insert('games', {
      ...args,
      ...adversaryFields,
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

    let normalizedAdversaryFields: Partial<
      Pick<
        OptionalGameValues,
        'adversary' | 'adversaryRef' | 'secondaryAdversary' | 'secondaryAdversaryRef'
      >
    > = {}

    const adversaryInput: AdversaryFieldInput = {
      adversary: updates.adversary,
      adversaryRef: updates.adversaryRef,
      secondaryAdversary: updates.secondaryAdversary,
      secondaryAdversaryRef: updates.secondaryAdversaryRef,
    }

    if (hasAdversaryFieldInput(adversaryInput)) {
      normalizedAdversaryFields = await hydrateAdversaryFields(ctx, {
        adversary: adversaryInput.adversary,
        adversaryRef: adversaryInput.adversaryRef,
        secondaryAdversary: adversaryInput.secondaryAdversary,
        secondaryAdversaryRef: adversaryInput.secondaryAdversaryRef,
      })
    }

    await ctx.db.patch(id, {
      ...updates,
      ...normalizedAdversaryFields,
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
    let adversaryLookup: AdversaryLookup | undefined

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

      const adversaryInput: AdversaryFieldInput = {
        adversary: data.adversary,
        adversaryRef: data.adversaryRef,
        secondaryAdversary: data.secondaryAdversary,
        secondaryAdversaryRef: data.secondaryAdversaryRef,
      }

      const hasAdversaryInput = hasAdversaryFieldInput(adversaryInput)
      if (hasAdversaryInput && !adversaryLookup) {
        adversaryLookup = await loadAdversaryLookup(ctx)
      }

      const adversaryFields = hasAdversaryInput
        ? await hydrateAdversaryFields(ctx, adversaryInput, adversaryLookup)
        : {}

      if (existingId) {
        const normalizedId = ctx.db.normalizeId('games', existingId)
        if (normalizedId) {
          const existingGame = await ctx.db.get(normalizedId)
          if (existingGame && existingGame.userId === identity.tokenIdentifier) {
            await ctx.db.replace(normalizedId, {
              ...data,
              ...adversaryFields,
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
        ...adversaryFields,
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

const adversaryMigrationResultValidator = v.object({
  status: v.literal('migrated'),
  scanned: v.number(),
  updated: v.number(),
  unresolved: v.number(),
  message: v.string(),
})

function refsEqual(a: AdversaryRefValue | undefined, b: AdversaryRefValue | undefined) {
  if (!a && !b) return true
  if (!a || !b) return false
  return (
    a.adversaryId === b.adversaryId &&
    a.level === b.level &&
    a.difficulty === b.difficulty &&
    a.nameSnapshot === b.nameSnapshot
  )
}

function legacyAdversariesEqual(
  a: OptionalGameValues['adversary'] | undefined,
  b: OptionalGameValues['adversary'] | undefined,
) {
  return a?.name === b?.name && a?.level === b?.level
}

// Use: npx convex run games:migrateAdversaryRefs
export const migrateAdversaryRefs = mutation({
  args: {},
  returns: adversaryMigrationResultValidator,
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const games = await ctx.db.query('games').collect()
    const adversaryLookup = await loadAdversaryLookup(ctx)

    let scanned = 0
    let updated = 0
    let unresolved = 0

    for (const game of games) {
      scanned++

      const normalized = await hydrateAdversaryFields(
        ctx,
        {
          adversary: game.adversary,
          adversaryRef: game.adversaryRef,
          secondaryAdversary: game.secondaryAdversary,
          secondaryAdversaryRef: game.secondaryAdversaryRef,
        },
        adversaryLookup,
      )

      if (game.adversary && !normalized.adversaryRef) {
        unresolved++
      }
      if (game.secondaryAdversary && !normalized.secondaryAdversaryRef) {
        unresolved++
      }

      const needsPatch =
        !refsEqual(game.adversaryRef, normalized.adversaryRef) ||
        !refsEqual(game.secondaryAdversaryRef, normalized.secondaryAdversaryRef) ||
        !legacyAdversariesEqual(game.adversary, normalized.adversary) ||
        !legacyAdversariesEqual(game.secondaryAdversary, normalized.secondaryAdversary)

      if (!needsPatch) {
        continue
      }

      await ctx.db.patch(game._id, {
        adversary: normalized.adversary,
        adversaryRef: normalized.adversaryRef,
        secondaryAdversary: normalized.secondaryAdversary,
        secondaryAdversaryRef: normalized.secondaryAdversaryRef,
        updatedAt: Date.now(),
      })
      updated++
    }

    return {
      status: 'migrated' as const,
      scanned,
      updated,
      unresolved,
      message: `Scanned ${scanned} games, updated ${updated}, unresolved legacy mappings ${unresolved}.`,
    }
  },
})
