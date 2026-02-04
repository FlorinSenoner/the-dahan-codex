import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { OPENINGS } from './seedData/openings'
import { ASPECTS, EXPANSIONS, type ExpansionSlug, SPIRITS } from './seedData/spirits'

// =============================================================================
// OPENING PRESERVATION STRATEGY
// =============================================================================
//
// Problem: reseedSpirits deletes ALL data including user-created openings.
// This destroys user-contributed content during spirit data updates.
//
// Solution: Backup openings by spirit SLUG (not ID) before delete, restore after.
//
// Why slug instead of ID?
// - Spirit IDs change during reseed (old records deleted, new ones created)
// - Slugs are stable identifiers that persist across reseeds
// - We can map openings back to their spirits using slug lookup
//
// Process:
// 1. BACKUP: Before clearing data, query all openings and store:
//    - The spirit's slug (for remapping after reseed)
//    - All opening data except _id, _creationTime, spiritId (these will change)
//    - Whether it's a seed opening (author: "Spirit Island Community")
//
// 2. CLEAR: Delete all openings, spirits, expansions (existing behavior)
//
// 3. SEED: Create expansions, spirits, aspects (existing behavior)
//    - Track spiritIdsBySlug map as spirits are created
//
// 4. RESTORE: For each backed-up opening:
//    - Look up new spirit ID by slug
//    - Check if opening with same slug already exists (idempotency)
//    - Insert opening with new spiritId
//    - Handle orphaned openings gracefully (spirit no longer exists)
//
// Edge cases handled:
// - Duplicate prevention: Check by slug before insert (running reseed twice is safe)
// - Orphaned openings: Log warning and skip if spirit was removed from seed data
// - Seed vs user openings: Both preserved, duplicates prevented by slug check
// =============================================================================

/**
 * Backup data structure for an opening being preserved across reseed.
 * Stores the spirit's slug (stable identifier) instead of ID (changes during reseed).
 */
interface OpeningBackup {
  /** Spirit slug - used to look up new spirit ID after reseed */
  spiritSlug: string
  /** Opening data without DB-managed fields */
  data: Omit<Doc<'openings'>, '_id' | '_creationTime' | 'spiritId'>
  /** True if this is a seed opening (author: "Spirit Island Community") */
  isSeedOpening: boolean
}

/**
 * Backup all openings before clearing data.
 * Maps each opening to its spirit's slug for later restoration.
 */
async function backupOpenings(ctx: MutationCtx): Promise<OpeningBackup[]> {
  const openings = await ctx.db.query('openings').collect()
  const backups: OpeningBackup[] = []

  for (const opening of openings) {
    // Look up the spirit to get its slug
    const spirit = await ctx.db.get(opening.spiritId)
    if (!spirit) {
      // Spirit already deleted or invalid reference - skip
      console.warn(`Opening "${opening.slug}" has invalid spiritId, skipping backup`)
      continue
    }

    // Extract opening data without DB-managed fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _creationTime, spiritId, ...data } = opening

    backups.push({
      spiritSlug: spirit.slug,
      data,
      isSeedOpening: opening.author === 'Spirit Island Community',
    })
  }

  return backups
}

/**
 * Restore backed-up openings after seeding.
 * Uses spiritIdsBySlug map to find new spirit IDs.
 * Handles idempotency and orphaned openings gracefully.
 */
async function restoreOpenings(
  ctx: MutationCtx,
  backups: OpeningBackup[],
  spiritIdsBySlug: Map<string, Id<'spirits'>>,
): Promise<{ restored: number; skipped: number; orphaned: number }> {
  let restored = 0
  let skipped = 0
  let orphaned = 0

  for (const backup of backups) {
    // Look up new spirit ID by slug
    const spiritId = spiritIdsBySlug.get(backup.spiritSlug)

    // Handle spirits that no longer exist in seed data
    if (!spiritId) {
      console.warn(
        `Opening "${backup.data.slug}" orphaned: spirit "${backup.spiritSlug}" no longer exists`,
      )
      orphaned++
      continue
    }

    // Check if opening with same slug already exists (idempotency)
    // This prevents duplicates if reseed is run multiple times
    const existing = await ctx.db
      .query('openings')
      .withIndex('by_slug', (q) => q.eq('slug', backup.data.slug))
      .first()

    if (existing) {
      skipped++
      continue
    }

    // Restore the opening with the new spirit ID
    await ctx.db.insert('openings', {
      spiritId,
      ...backup.data,
    })
    restored++
  }

  return { restored, skipped, orphaned }
}

// =============================================================================
// EXPANSION IDS TYPE
// =============================================================================

type ExpansionIds = Record<ExpansionSlug, Id<'expansions'>>

// =============================================================================
// CLEAR DATA
// =============================================================================

// Clear all existing data (for reseed)
async function clearExistingData(ctx: MutationCtx) {
  // Delete openings first (they reference spirits)
  const allOpenings = await ctx.db.query('openings').collect()
  for (const opening of allOpenings) {
    await ctx.db.delete(opening._id)
  }

  // Delete spirits (aspects reference base spirits)
  const allSpirits = await ctx.db.query('spirits').collect()
  for (const spirit of allSpirits) {
    await ctx.db.delete(spirit._id)
  }

  // Delete expansions
  const allExpansions = await ctx.db.query('expansions').collect()
  for (const expansion of allExpansions) {
    await ctx.db.delete(expansion._id)
  }
}

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

// Seed expansions and return their IDs
async function seedExpansions(ctx: MutationCtx): Promise<ExpansionIds> {
  const ids: Partial<ExpansionIds> = {}

  for (const expansion of EXPANSIONS) {
    const id = await ctx.db.insert('expansions', expansion)
    ids[expansion.slug] = id
  }

  return ids as ExpansionIds
}

/**
 * Seed stats returned from insertSeedData for reporting.
 */
interface SeedStats {
  expansions: number
  spirits: number
  aspects: number
  openings: number
}

/**
 * Result from insertSeedData including spiritIdsBySlug map for opening restoration.
 */
interface InsertSeedResult {
  /** Map of spirit slugs to their new IDs (for opening restoration) */
  spiritIdsBySlug: Map<string, Id<'spirits'>>
  /** Counts of seeded entities */
  stats: SeedStats
}

// Seed all spirits and aspects, return spiritIdsBySlug map for opening restoration
async function seedSpiritsData(
  ctx: MutationCtx,
  expansionIds: ExpansionIds,
): Promise<{
  spiritIdsBySlug: Map<string, Id<'spirits'>>
  spiritCount: number
  aspectCount: number
}> {
  // Track spirit IDs by slug for opening restoration
  const spiritIdsBySlug = new Map<string, Id<'spirits'>>()

  // Create all base spirits from SPIRITS array
  for (const spirit of SPIRITS) {
    const spiritId = await ctx.db.insert('spirits', {
      name: spirit.name,
      slug: spirit.slug,
      complexity: spirit.complexity,
      summary: spirit.summary,
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

  // Create all aspects from ASPECTS array
  for (const aspect of ASPECTS) {
    // Look up base spirit ID by slug
    const baseSpiritId = spiritIdsBySlug.get(aspect.baseSpiritSlug)
    if (!baseSpiritId) {
      console.warn(
        `Aspect "${aspect.name}" references unknown spirit "${aspect.baseSpiritSlug}", skipping`,
      )
      continue
    }

    // Get base spirit data to copy name, complexity, elements
    const baseSpirit = SPIRITS.find((s) => s.slug === aspect.baseSpiritSlug)
    if (!baseSpirit) {
      console.warn(`Base spirit data not found for "${aspect.baseSpiritSlug}", skipping aspect`)
      continue
    }

    await ctx.db.insert('spirits', {
      name: baseSpirit.name,
      slug: baseSpirit.slug,
      complexity: baseSpirit.complexity,
      summary: aspect.summary,
      imageUrl: aspect.imageUrl, // May be undefined (inherit base spirit image)
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

// Seed opening guides from OPENINGS data
async function seedOpenings(
  ctx: MutationCtx,
  spiritIdsBySlug: Map<string, Id<'spirits'>>,
): Promise<number> {
  const now = Date.now()
  let count = 0

  for (const opening of OPENINGS) {
    // Look up spirit ID by slug
    const spiritId = spiritIdsBySlug.get(opening.spiritSlug)
    if (!spiritId) {
      console.warn(
        `Spirit "${opening.spiritSlug}" not found for opening "${opening.slug}", skipping`,
      )
      continue
    }

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

// Shared seed logic used by both seedSpirits and reseedSpirits
// Returns spiritIdsBySlug map for opening restoration during reseed
async function insertSeedData(ctx: MutationCtx): Promise<InsertSeedResult> {
  const expansionIds = await seedExpansions(ctx)
  const { spiritIdsBySlug, spiritCount, aspectCount } = await seedSpiritsData(ctx, expansionIds)
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

// Seed initial spirit data - run manually via Convex dashboard or CLI
// Idempotent: skips if data already exists
export const seedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
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

// Reseed mutation - deletes all data and re-runs seed
// PRESERVES existing openings (user-created and seed) during reseed
// Use: npx convex run seed:reseedSpirits
export const reseedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. BACKUP: Save all openings before clearing data
    // Maps openings to spirit slugs for restoration after reseed
    const openingBackups = await backupOpenings(ctx)

    // 2. CLEAR: Delete all existing data
    await clearExistingData(ctx)

    // 3. SEED: Create expansions, spirits, aspects (returns spiritIdsBySlug map)
    const { spiritIdsBySlug, stats } = await insertSeedData(ctx)

    // 4. RESTORE: Re-insert backed-up openings with new spirit IDs
    // Handles idempotency (skips duplicates) and orphans (spirits removed from seed)
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
