import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { internalMutation } from './_generated/server'
import { OPENINGS } from './seedData/openings'
import { ASPECTS, EXPANSIONS, type ExpansionSlug, SPIRITS } from './seedData/spirits'

interface OpeningBackup {
  spiritSlug: string
  data: Omit<Doc<'openings'>, '_id' | '_creationTime' | 'spiritId'>
}

type ExpansionIds = Record<ExpansionSlug, Id<'expansions'>>

interface SeedStats {
  expansions: number
  spirits: number
  aspects: number
  openings: number
}

interface InsertSeedResult {
  spiritIdsBySlug: Map<string, Id<'spirits'>>
  stats: SeedStats
}

function aspectSetupKey(baseSpiritSlug: string, aspectName?: string) {
  return `${baseSpiritSlug}::${aspectName ?? ''}`
}

async function backupOpenings(ctx: MutationCtx): Promise<OpeningBackup[]> {
  const spirits = await ctx.db.query('spirits').collect()
  const spiritSlugById = new Map(spirits.map((spirit) => [spirit._id.toString(), spirit.slug]))

  const openings = await ctx.db.query('openings').collect()
  const backups: OpeningBackup[] = []

  for (const opening of openings) {
    const spiritSlug = spiritSlugById.get(opening.spiritId.toString())
    if (!spiritSlug) continue

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _creationTime, spiritId, ...data } = opening
    backups.push({ spiritSlug, data })
  }

  return backups
}

async function restoreOpenings(
  ctx: MutationCtx,
  backups: OpeningBackup[],
  spiritIdsBySlug: Map<string, Id<'spirits'>>,
) {
  let restored = 0
  let skipped = 0
  let orphaned = 0

  for (const backup of backups) {
    const spiritId = spiritIdsBySlug.get(backup.spiritSlug)
    if (!spiritId) {
      orphaned++
      continue
    }

    const existingForSlug = await ctx.db
      .query('openings')
      .withIndex('by_slug', (q) => q.eq('slug', backup.data.slug))
      .collect()

    if (existingForSlug.some((opening) => opening.spiritId === spiritId)) {
      skipped++
      continue
    }

    await ctx.db.insert('openings', { spiritId, ...backup.data })
    restored++
  }

  return { restored, skipped, orphaned }
}

async function clearExistingData(ctx: MutationCtx) {
  const openings = await ctx.db.query('openings').collect()
  for (const opening of openings) {
    await ctx.db.delete(opening._id)
  }

  const spirits = await ctx.db.query('spirits').collect()
  for (const spirit of spirits) {
    await ctx.db.delete(spirit._id)
  }

  const expansions = await ctx.db.query('expansions').collect()
  for (const expansion of expansions) {
    await ctx.db.delete(expansion._id)
  }
}

async function seedExpansions(ctx: MutationCtx): Promise<ExpansionIds> {
  const expansionIds: Partial<ExpansionIds> = {}

  for (const expansion of EXPANSIONS) {
    const id = await ctx.db.insert('expansions', expansion)
    expansionIds[expansion.slug] = id
  }

  return expansionIds as ExpansionIds
}

async function seedSpiritsAndAspects(ctx: MutationCtx, expansionIds: ExpansionIds) {
  const spiritIdsBySlug = new Map<string, Id<'spirits'>>()
  const seedSpiritsBySlug = new Map(SPIRITS.map((spirit) => [spirit.slug, spirit]))

  for (const spirit of SPIRITS) {
    const spiritId = await ctx.db.insert('spirits', {
      name: spirit.name,
      slug: spirit.slug,
      complexity: spirit.complexity,
      summary: spirit.summary,
      setup: spirit.setup,
      description: spirit.description,
      imageUrl: spirit.imageUrl,
      expansionId: expansionIds[spirit.expansion],
      elements: spirit.elements,
      strengths: spirit.strengths,
      weaknesses: spirit.weaknesses,
      powerRatings: spirit.powerRatings,
      wikiUrl: spirit.wikiUrl,
    })
    spiritIdsBySlug.set(spirit.slug, spiritId)
  }

  for (const aspect of ASPECTS) {
    const baseSpiritId = spiritIdsBySlug.get(aspect.baseSpiritSlug)
    const baseSpirit = seedSpiritsBySlug.get(aspect.baseSpiritSlug)
    if (!baseSpiritId || !baseSpirit) continue

    await ctx.db.insert('spirits', {
      name: baseSpirit.name,
      slug: baseSpirit.slug,
      complexity: baseSpirit.complexity,
      summary: aspect.summary,
      setup: aspect.setup ?? baseSpirit.setup,
      imageUrl: aspect.imageUrl || baseSpirit.imageUrl,
      expansionId: expansionIds[aspect.expansion],
      elements: baseSpirit.elements,
      baseSpirit: baseSpiritId,
      aspectName: aspect.name,
      complexityModifier: aspect.complexityModifier,
    })
  }

  return {
    spiritIdsBySlug,
    spiritCount: SPIRITS.length,
    aspectCount: ASPECTS.length,
  }
}

async function seedOpenings(ctx: MutationCtx, spiritIdsBySlug: Map<string, Id<'spirits'>>) {
  const now = Date.now()
  let count = 0

  for (const opening of OPENINGS) {
    const spiritId = spiritIdsBySlug.get(opening.spiritSlug)
    if (!spiritId) continue

    await ctx.db.insert('openings', {
      spiritId,
      slug: opening.slug,
      name: opening.name,
      description: opening.description,
      turns: opening.turns,
      author: opening.author,
      sourceUrl: opening.sourceUrl,
      createdAt: now,
      updatedAt: now,
    })

    count++
  }

  return count
}

async function insertSeedData(ctx: MutationCtx): Promise<InsertSeedResult> {
  const expansionIds = await seedExpansions(ctx)
  const { spiritIdsBySlug, spiritCount, aspectCount } = await seedSpiritsAndAspects(
    ctx,
    expansionIds,
  )
  const openingsCount = await seedOpenings(ctx, spiritIdsBySlug)

  return {
    spiritIdsBySlug,
    stats: {
      expansions: EXPANSIONS.length,
      spirits: spiritCount,
      aspects: aspectCount,
      openings: openingsCount,
    },
  }
}

export const seedSpirits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingSpirits = await ctx.db.query('spirits').first()
    if (existingSpirits) {
      return { status: 'skipped', message: 'Data already seeded' }
    }

    const { stats } = await insertSeedData(ctx)

    return {
      status: 'seeded',
      message: `Created ${stats.expansions} expansions, ${stats.spirits} base spirits, ${stats.aspects} aspects, ${stats.openings} openings`,
    }
  },
})

export const reseedSpirits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const openingBackups = await backupOpenings(ctx)

    await clearExistingData(ctx)

    const { spiritIdsBySlug, stats } = await insertSeedData(ctx)

    const { restored, skipped, orphaned } = await restoreOpenings(
      ctx,
      openingBackups,
      spiritIdsBySlug,
    )

    return {
      status: 'reseeded',
      message:
        `Created ${stats.expansions} expansions, ${stats.spirits} base spirits, ${stats.aspects} aspects. ` +
        `Openings: ${restored} restored, ${skipped} skipped (duplicates), ${orphaned} orphaned (missing spirit)`,
    }
  },
})

// Backfill canonical setup/summary/description on existing spirit/aspect docs.
// Use: npx convex run seed:backfillSpiritSetup
export const backfillSpiritSetup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const spirits = await ctx.db.query('spirits').collect()
    const spiritById = new Map(spirits.map((spirit) => [spirit._id.toString(), spirit]))

    const seedSpiritBySlug = new Map(SPIRITS.map((spirit) => [spirit.slug, spirit]))
    const seedAspectByKey = new Map(
      ASPECTS.map((aspect) => [aspectSetupKey(aspect.baseSpiritSlug, aspect.name), aspect]),
    )

    let updated = 0
    let missing = 0

    for (const spirit of spirits) {
      const patch: Partial<Pick<Doc<'spirits'>, 'setup' | 'summary' | 'description' | 'imageUrl'>> =
        {}

      if (spirit.baseSpirit) {
        const baseSpirit = spiritById.get(spirit.baseSpirit.toString())
        if (!baseSpirit || !spirit.aspectName) {
          missing++
          continue
        }

        const seedBase = seedSpiritBySlug.get(baseSpirit.slug)
        const seedAspect = seedAspectByKey.get(aspectSetupKey(baseSpirit.slug, spirit.aspectName))
        if (!seedBase || !seedAspect) {
          missing++
          continue
        }

        const expectedSetup = seedAspect.setup ?? seedBase.setup
        if (spirit.setup !== expectedSetup) {
          patch.setup = expectedSetup
        }
        if (spirit.summary !== seedAspect.summary) {
          patch.summary = seedAspect.summary
        }
        if (spirit.imageUrl !== seedAspect.imageUrl) {
          patch.imageUrl = seedAspect.imageUrl
        }
      } else {
        const seedSpirit = seedSpiritBySlug.get(spirit.slug)
        if (!seedSpirit) {
          missing++
          continue
        }

        if (spirit.setup !== seedSpirit.setup) {
          patch.setup = seedSpirit.setup
        }
        if (spirit.summary !== seedSpirit.summary) {
          patch.summary = seedSpirit.summary
        }
        if (spirit.description !== seedSpirit.description) {
          patch.description = seedSpirit.description
        }
        if (spirit.imageUrl !== seedSpirit.imageUrl) {
          patch.imageUrl = seedSpirit.imageUrl
        }
      }

      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(spirit._id, patch)
        updated++
      }
    }

    return {
      status: 'backfilled',
      message: `Updated ${updated} spirits/aspects${missing > 0 ? `, ${missing} missing seed mapping` : ''}.`,
      updated,
      missing,
    }
  },
})
