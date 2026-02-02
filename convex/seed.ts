import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation } from "./_generated/server";

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
  spiritSlug: string;
  /** Opening data without DB-managed fields */
  data: Omit<Doc<"openings">, "_id" | "_creationTime" | "spiritId">;
  /** True if this is a seed opening (author: "Spirit Island Community") */
  isSeedOpening: boolean;
}

/**
 * Backup all openings before clearing data.
 * Maps each opening to its spirit's slug for later restoration.
 */
async function backupOpenings(ctx: MutationCtx): Promise<OpeningBackup[]> {
  const openings = await ctx.db.query("openings").collect();
  const backups: OpeningBackup[] = [];

  for (const opening of openings) {
    // Look up the spirit to get its slug
    const spirit = await ctx.db.get(opening.spiritId);
    if (!spirit) {
      // Spirit already deleted or invalid reference - skip
      console.warn(
        `Opening "${opening.slug}" has invalid spiritId, skipping backup`,
      );
      continue;
    }

    // Extract opening data without DB-managed fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _creationTime, spiritId, ...data } = opening;

    backups.push({
      spiritSlug: spirit.slug,
      data,
      isSeedOpening: opening.author === "Spirit Island Community",
    });
  }

  return backups;
}

/**
 * Restore backed-up openings after seeding.
 * Uses spiritIdsBySlug map to find new spirit IDs.
 * Handles idempotency and orphaned openings gracefully.
 */
async function restoreOpenings(
  ctx: MutationCtx,
  backups: OpeningBackup[],
  spiritIdsBySlug: Map<string, Id<"spirits">>,
): Promise<{ restored: number; skipped: number; orphaned: number }> {
  let restored = 0;
  let skipped = 0;
  let orphaned = 0;

  for (const backup of backups) {
    // Look up new spirit ID by slug
    const spiritId = spiritIdsBySlug.get(backup.spiritSlug);

    // Handle spirits that no longer exist in seed data
    if (!spiritId) {
      console.warn(
        `Opening "${backup.data.slug}" orphaned: spirit "${backup.spiritSlug}" no longer exists`,
      );
      orphaned++;
      continue;
    }

    // Check if opening with same slug already exists (idempotency)
    // This prevents duplicates if reseed is run multiple times
    const existing = await ctx.db
      .query("openings")
      .withIndex("by_slug", (q) => q.eq("slug", backup.data.slug))
      .first();

    if (existing) {
      skipped++;
      continue;
    }

    // Restore the opening with the new spirit ID
    await ctx.db.insert("openings", {
      spiritId,
      ...backup.data,
    });
    restored++;
  }

  return { restored, skipped, orphaned };
}

// Spirit data definitions (shared between seed and reseed)
const EXPANSIONS = [
  { name: "Base Game", slug: "base-game", releaseYear: 2017 },
  { name: "Jagged Earth", slug: "jagged-earth", releaseYear: 2020 },
  { name: "Promo Pack 2", slug: "promo-pack-2", releaseYear: 2021 },
] as const;

type ExpansionSlug = (typeof EXPANSIONS)[number]["slug"];

interface ExpansionIds {
  "base-game": Id<"expansions">;
  "jagged-earth": Id<"expansions">;
  "promo-pack-2": Id<"expansions">;
}

// Clear all existing data (for reseed)
async function clearExistingData(ctx: MutationCtx) {
  // Delete openings first (they reference spirits)
  const allOpenings = await ctx.db.query("openings").collect();
  for (const opening of allOpenings) {
    await ctx.db.delete(opening._id);
  }

  // Delete spirits (aspects reference base spirits)
  const allSpirits = await ctx.db.query("spirits").collect();
  for (const spirit of allSpirits) {
    await ctx.db.delete(spirit._id);
  }

  // Delete expansions
  const allExpansions = await ctx.db.query("expansions").collect();
  for (const expansion of allExpansions) {
    await ctx.db.delete(expansion._id);
  }
}

// Seed expansions and return their IDs
async function seedExpansions(ctx: MutationCtx): Promise<ExpansionIds> {
  const ids: Partial<ExpansionIds> = {};

  for (const expansion of EXPANSIONS) {
    const id = await ctx.db.insert("expansions", expansion);
    ids[expansion.slug as ExpansionSlug] = id;
  }

  return ids as ExpansionIds;
}

/**
 * Seed stats returned from insertSeedData for reporting.
 */
interface SeedStats {
  expansions: number;
  spirits: number;
  aspects: number;
}

/**
 * Result from insertSeedData including spiritIdsBySlug map for opening restoration.
 */
interface InsertSeedResult {
  /** Map of spirit slugs to their new IDs (for opening restoration) */
  spiritIdsBySlug: Map<string, Id<"spirits">>;
  /** Counts of seeded entities */
  stats: SeedStats;
}

// Seed all spirits and return spiritIdsBySlug map for opening restoration
async function seedSpiritsData(
  ctx: MutationCtx,
  expansionIds: ExpansionIds,
): Promise<{
  riverId: Id<"spirits">;
  spiritIdsBySlug: Map<string, Id<"spirits">>;
  spiritCount: number;
  aspectCount: number;
}> {
  // Track spirit IDs by slug for opening restoration
  const spiritIdsBySlug = new Map<string, Id<"spirits">>();
  let spiritCount = 0;
  let aspectCount = 0;

  // River Surges in Sunlight (Base Game, Low complexity)
  const riverId = await ctx.db.insert("spirits", {
    name: "River Surges in Sunlight",
    slug: "river-surges-in-sunlight",
    complexity: "Low",
    summary:
      "A flexible spirit of renewal and cleansing that pushes invaders away and heals the land.",
    description:
      "River is a flexible spirit that excels at moving Invaders and Dahan around the island. With strong energy generation and the ability to heal Blight, River supports other spirits while steadily pushing back the invasion. Best played reactively, responding to threats across multiple lands.",
    imageUrl: "/spirits/river-surges-in-sunlight.png",
    expansionId: expansionIds["base-game"],
    elements: ["Sun", "Water"],
    strengths: [
      "Excellent energy generation",
      "Strong at moving Invaders and Dahan",
      "Can heal Blight from the land",
      "Flexible and supportive",
      "Good reach with Water presence",
    ],
    weaknesses: [
      "Low damage output",
      "Relies on Dahan for offense",
      "Needs time to set up",
      "Vulnerable to fast aggression",
    ],
    powerRatings: { offense: 2, defense: 3, control: 4, fear: 2, utility: 4 },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=River_Surges_in_Sunlight",
  });
  spiritIdsBySlug.set("river-surges-in-sunlight", riverId);
  spiritCount++;

  // River aspects
  await ctx.db.insert("spirits", {
    name: "River Surges in Sunlight",
    slug: "river-surges-in-sunlight",
    complexity: "Low",
    summary: "Emphasizes Sun and energy income, with radiant presence.",
    imageUrl: "/spirits/river-surges-in-sunlight-sunshine.png",
    expansionId: expansionIds["base-game"],
    elements: ["Sun", "Water"],
    baseSpirit: riverId,
    aspectName: "Sunshine",
    complexityModifier: "harder",
  });

  await ctx.db.insert("spirits", {
    name: "River Surges in Sunlight",
    slug: "river-surges-in-sunlight",
    complexity: "Low",
    summary: "Mobile spirit that flows across the island to where it's needed.",
    imageUrl: "/spirits/river-surges-in-sunlight-travel.png",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Sun", "Water"],
    baseSpirit: riverId,
    aspectName: "Travel",
    complexityModifier: "harder",
  });

  await ctx.db.insert("spirits", {
    name: "River Surges in Sunlight",
    slug: "river-surges-in-sunlight",
    complexity: "Low",
    summary: "Protective spirit focused on defending sacred sites.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Sun", "Water"],
    baseSpirit: riverId,
    aspectName: "Haven",
    complexityModifier: "harder",
  });
  aspectCount += 3; // River has 3 aspects

  // Lightning's Swift Strike (Base Game, Low complexity)
  const lightningId = await ctx.db.insert("spirits", {
    name: "Lightning's Swift Strike",
    slug: "lightnings-swift-strike",
    complexity: "Low",
    summary:
      "An aggressive spirit of speed and destruction, striking fast before invaders can build.",
    description:
      "Lightning is an aggressive spirit focused on dealing damage quickly in the fast phase before Invaders can build. With low defense but high offense, Lightning races to destroy towns and explorers before they establish. Best played proactively, targeting the most dangerous lands early.",
    imageUrl: "/spirits/lightnings-swift-strike.png",
    expansionId: expansionIds["base-game"],
    elements: ["Fire", "Air"],
    strengths: [
      "Excellent fast damage",
      "Strong Fear generation",
      "Simple and straightforward",
      "Great at destroying explorers",
      "Good energy when aggressive",
    ],
    weaknesses: [
      "Minimal defense",
      "Struggles against built-up areas",
      "Low card plays",
      "Fragile board position",
    ],
    powerRatings: { offense: 5, defense: 1, control: 2, fear: 4, utility: 2 },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike",
  });
  spiritIdsBySlug.set("lightnings-swift-strike", lightningId);
  spiritCount++;

  // Lightning aspects
  await ctx.db.insert("spirits", {
    name: "Lightning's Swift Strike",
    slug: "lightnings-swift-strike",
    complexity: "Low",
    summary: "Chaotic lightning that scatters invaders unpredictably.",
    imageUrl: "/spirits/lightnings-swift-strike-pandemonium.png",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Fire", "Air"],
    baseSpirit: lightningId,
    aspectName: "Pandemonium",
    complexityModifier: "harder",
  });

  await ctx.db.insert("spirits", {
    name: "Lightning's Swift Strike",
    slug: "lightnings-swift-strike",
    complexity: "Low",
    summary:
      "Swift spirit that prioritizes movement and flexibility over raw damage.",
    imageUrl: "/spirits/lightnings-swift-strike-wind.png",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Fire", "Air"],
    baseSpirit: lightningId,
    aspectName: "Wind",
    complexityModifier: "harder",
  });

  await ctx.db.insert("spirits", {
    name: "Lightning's Swift Strike",
    slug: "lightnings-swift-strike",
    complexity: "Low",
    summary: "Focused on efficient, repeated small strikes.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Fire", "Air"],
    baseSpirit: lightningId,
    aspectName: "Sparking",
    complexityModifier: "harder",
  });

  await ctx.db.insert("spirits", {
    name: "Lightning's Swift Strike",
    slug: "lightnings-swift-strike",
    complexity: "Low",
    summary: "Massive presence with devastating area attacks.",
    imageUrl: "/spirits/lightnings-swift-strike-immense.png",
    expansionId: expansionIds["promo-pack-2"],
    elements: ["Fire", "Air"],
    baseSpirit: lightningId,
    aspectName: "Immense",
    complexityModifier: "harder",
  });
  aspectCount += 4; // Lightning has 4 aspects

  // Fractured Days Split the Sky (Jagged Earth, Very High complexity)
  const fracturedDaysId = await ctx.db.insert("spirits", {
    name: "Fractured Days Split the Sky",
    slug: "fractured-days-split-the-sky",
    complexity: "Very High",
    summary:
      "Manipulates time with Days That Never Were cards and choose-any growth options.",
    description:
      "Fractured Days is a time-manipulation spirit that plays with a unique 'Days That Never Were' card pool. Each turn, you gain Time markers which fuel special abilities. Growth is highly flexible - choose any combination of options rather than picking one. The spirit excels at adapting to any situation but requires careful planning across multiple timelines.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Moon", "Air"],
    strengths: [
      "Extremely flexible growth options",
      "Time markers enable powerful abilities",
      "Days That Never Were provide unique solutions",
      "Strong at adapting to changing situations",
      "Can manipulate events across time",
    ],
    weaknesses: [
      "Very complex decision space",
      "Requires tracking multiple resources",
      "Days That Never Were are one-shot",
      "Needs time to build up Time markers",
      "Weak without proper setup",
    ],
    powerRatings: {
      offense: 2,
      defense: 3,
      control: 5,
      fear: 3,
      utility: 5,
    },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky",
  });
  spiritIdsBySlug.set("fractured-days-split-the-sky", fracturedDaysId);
  spiritCount++;

  // Starlight Seeks Its Form (Jagged Earth, Very High complexity)
  const starlightId = await ctx.db.insert("spirits", {
    name: "Starlight Seeks Its Form",
    slug: "starlight-seeks-its-form",
    complexity: "Very High",
    summary:
      "Shape-shifting spirit with 6 presence tracks that unlock growth choices as they empty.",
    description:
      "Starlight is a spirit of endless potential, constantly shifting its nature. With 6 presence tracks instead of 2, Starlight can develop in many different directions. As tracks empty, they unlock new growth choices, allowing Starlight to adapt its strategy throughout the game. Extremely flexible but requires careful planning.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Moon", "Air", "Fire", "Water", "Earth", "Plant"],
    strengths: [
      "Incredible flexibility with 6 presence tracks",
      "Unlocking growth choices rewards long-term planning",
      "Access to all element types",
      "Strong adaptability to any game state",
      "Multiple viable development paths",
    ],
    weaknesses: [
      "Very complex decision space",
      "Slow to develop full power",
      "Requires understanding all elements",
      "Can spread too thin across tracks",
      "Difficult to master optimal paths",
    ],
    powerRatings: {
      offense: 3,
      defense: 3,
      control: 4,
      fear: 3,
      utility: 5,
    },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=Starlight_Seeks_Its_Form",
  });
  spiritIdsBySlug.set("starlight-seeks-its-form", starlightId);
  spiritCount++;

  // Finder of Paths Unseen (Jagged Earth, Very High complexity)
  const finderId = await ctx.db.insert("spirits", {
    name: "Finder of Paths Unseen",
    slug: "finder-of-paths-unseen",
    complexity: "Very High",
    summary:
      "Moves presence freely along paths with unique branching presence tracks.",
    description:
      "Finder is a spirit of hidden connections and secret ways. Unlike other spirits, Finder can move presence backwards along tracks, and its tracks branch and connect in unusual ways. This allows for incredibly dynamic board positioning but requires mastering a unique presence management system.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Moon", "Air"],
    strengths: [
      "Unmatched presence mobility",
      "Can retreat presence to recover track bonuses",
      "Excellent at reaching distant lands",
      "Strong Dahan movement and support",
      "Flexible track progression",
    ],
    weaknesses: [
      "Complex presence track management",
      "Low direct damage",
      "Requires planning several turns ahead",
      "Vulnerable when presence scattered",
      "Limited offensive innates",
    ],
    powerRatings: {
      offense: 1,
      defense: 3,
      control: 5,
      fear: 2,
      utility: 5,
    },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=Finder_of_Paths_Unseen",
  });
  spiritIdsBySlug.set("finder-of-paths-unseen", finderId);
  spiritCount++;

  // Serpent Slumbering Beneath the Island (Jagged Earth, Very High complexity)
  const serpentId = await ctx.db.insert("spirits", {
    name: "Serpent Slumbering Beneath the Island",
    slug: "serpent-slumbering-beneath-the-island",
    complexity: "Very High",
    summary:
      "Ancient power awakening through absorbed presence, with Deep Slumber limit.",
    description:
      "Serpent is an immensely powerful but sleeping spirit. It starts with severe limitations on how many presence it can have on the island (Deep Slumber). By absorbing essence from other spirits and the land, Serpent slowly awakens, increasing its presence limit and unlocking devastating powers. Patient play rewards explosive late-game power.",
    expansionId: expansionIds["jagged-earth"],
    elements: ["Moon", "Earth", "Fire"],
    strengths: [
      "Extremely powerful late game",
      "Can absorb presence from partner spirits",
      "Devastating innate powers when awakened",
      "High energy generation when developed",
      "Excellent at clearing large threats",
    ],
    weaknesses: [
      "Very slow start due to Deep Slumber",
      "Limited presence cap early game",
      "Requires patient, long-term strategy",
      "Dependent on game lasting long enough",
      "Complex awakening mechanics",
    ],
    powerRatings: {
      offense: 5,
      defense: 2,
      control: 3,
      fear: 4,
      utility: 3,
    },
    wikiUrl:
      "https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island",
  });
  spiritIdsBySlug.set("serpent-slumbering-beneath-the-island", serpentId);
  spiritCount++;

  return { riverId, spiritIdsBySlug, spiritCount, aspectCount };
}

// Seed sample openings
async function seedOpenings(ctx: MutationCtx, riverId: Id<"spirits">) {
  const now = Date.now();

  await ctx.db.insert("openings", {
    spiritId: riverId,
    slug: "river-standard-opening",
    name: "Standard Opening",
    description:
      "A balanced opening focusing on energy generation and board control.",
    turns: [
      {
        turn: 1,
        title: "Turn 1: Establish Presence",
        instructions:
          "Take Growth Option 2: Add two Presence and gain a Power Card. Place presence in lands with Dahan to maximize your reach. Play Boon of Vigor on a spirit that needs energy (or yourself).",
      },
      {
        turn: 2,
        title: "Turn 2: Build Momentum",
        instructions:
          "Take Growth Option 3: Add Presence to a Wetland within Range 2 and gain 1 Energy. Play Flash Floods to push Explorers away from a building land, or use River's Bounty to gather Dahan.",
      },
      {
        turn: 3,
        title: "Turn 3: Control the Flow",
        instructions:
          "Take Growth Option 2 again for more presence and cards. By now you should have enough presence to trigger Massive Flooding. Focus on lands where you can push Invaders into each other or off the island.",
      },
    ],
    author: "Spirit Island Community",
    sourceUrl: "https://querki.net/u/darker/spirit-island-faq",
    createdAt: now,
    updatedAt: now,
  });
}

// Shared seed logic used by both seedSpirits and reseedSpirits
// Returns spiritIdsBySlug map for opening restoration during reseed
async function insertSeedData(ctx: MutationCtx): Promise<InsertSeedResult> {
  const expansionIds = await seedExpansions(ctx);
  const { riverId, spiritIdsBySlug, spiritCount, aspectCount } =
    await seedSpiritsData(ctx, expansionIds);
  await seedOpenings(ctx, riverId);

  return {
    spiritIdsBySlug,
    stats: {
      expansions: EXPANSIONS.length,
      spirits: spiritCount,
      aspects: aspectCount,
    },
  };
}

// Seed initial spirit data - run manually via Convex dashboard or CLI
// Idempotent: skips if data already exists
export const seedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingSpirits = await ctx.db.query("spirits").first();
    if (existingSpirits) {
      return { status: "skipped", message: "Data already seeded" };
    }

    const { stats } = await insertSeedData(ctx);

    return {
      status: "seeded",
      message: `Created ${stats.expansions} expansions, ${stats.spirits} base spirits, ${stats.aspects} aspects, 1 opening`,
    };
  },
});

// Reseed mutation - deletes all data and re-runs seed
// PRESERVES existing openings (user-created and seed) during reseed
// Use: npx convex run seed:reseedSpirits
export const reseedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. BACKUP: Save all openings before clearing data
    // Maps openings to spirit slugs for restoration after reseed
    const openingBackups = await backupOpenings(ctx);

    // 2. CLEAR: Delete all existing data
    await clearExistingData(ctx);

    // 3. SEED: Create expansions, spirits, aspects (returns spiritIdsBySlug map)
    const { spiritIdsBySlug, stats } = await insertSeedData(ctx);

    // 4. RESTORE: Re-insert backed-up openings with new spirit IDs
    // Handles idempotency (skips duplicates) and orphans (spirits removed from seed)
    const { restored, skipped, orphaned } = await restoreOpenings(
      ctx,
      openingBackups,
      spiritIdsBySlug,
    );

    return {
      status: "reseeded",
      message:
        `Created ${stats.expansions} expansions, ${stats.spirits} base spirits, ${stats.aspects} aspects. ` +
        `Openings: ${restored} restored, ${skipped} skipped (duplicates), ${orphaned} orphaned (missing spirit)`,
    };
  },
});
