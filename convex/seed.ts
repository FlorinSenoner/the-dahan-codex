import { mutation } from "./_generated/server";

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

    // Seed expansions first
    const baseGameId = await ctx.db.insert("expansions", {
      name: "Base Game",
      slug: "base-game",
      releaseYear: 2017,
    });

    const jaggedEarthId = await ctx.db.insert("expansions", {
      name: "Jagged Earth",
      slug: "jagged-earth",
      releaseYear: 2020,
    });

    const promoPack2Id = await ctx.db.insert("expansions", {
      name: "Promo Pack 2",
      slug: "promo-pack-2",
      releaseYear: 2021,
    });

    // Seed River Surges in Sunlight (Base Game, Low complexity)
    const riverId = await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary:
        "A flexible spirit of renewal and cleansing that pushes invaders away and heals the land.",
      description:
        "River is a flexible spirit that excels at moving Invaders and Dahan around the island. With strong energy generation and the ability to heal Blight, River supports other spirits while steadily pushing back the invasion. Best played reactively, responding to threats across multiple lands.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: baseGameId,
      elements: ["Sun", "Water"],
    });

    // River aspects
    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary: "Emphasizes Sun and energy income, with radiant presence.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: baseGameId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Sunshine",
      complexityModifier: "harder",
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary:
        "Mobile spirit that flows across the island to where it's needed.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Haven",
      complexityModifier: "harder",
    });

    // Seed Lightning's Swift Strike (Base Game, Low complexity)
    const lightningId = await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary:
        "An aggressive spirit of speed and destruction, striking fast before invaders can build.",
      description:
        "Lightning is an aggressive spirit focused on dealing damage quickly in the fast phase before Invaders can build. With low defense but high offense, Lightning races to destroy towns and explorers before they establish. Best played proactively, targeting the most dangerous lands early.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: baseGameId,
      elements: ["Fire", "Air"],
    });

    // Lightning aspects
    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary: "Chaotic lightning that scatters invaders unpredictably.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: promoPack2Id,
      elements: ["Fire", "Air"],
      baseSpirit: lightningId,
      aspectName: "Immense",
      complexityModifier: "harder",
    });

    return {
      status: "seeded",
      message: "Created 3 expansions, 2 base spirits, 7 aspects",
    };
  },
});

// Reseed mutation - deletes all data and re-runs seed
// Use: npx convex run seed:reseedSpirits
export const reseedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all spirits first (aspects reference base spirits)
    const allSpirits = await ctx.db.query("spirits").collect();
    for (const spirit of allSpirits) {
      await ctx.db.delete(spirit._id);
    }

    // Delete all expansions
    const allExpansions = await ctx.db.query("expansions").collect();
    for (const expansion of allExpansions) {
      await ctx.db.delete(expansion._id);
    }

    // Re-run the seeding logic inline (can't call seedSpirits directly)
    const baseGameId = await ctx.db.insert("expansions", {
      name: "Base Game",
      slug: "base-game",
      releaseYear: 2017,
    });

    const jaggedEarthId = await ctx.db.insert("expansions", {
      name: "Jagged Earth",
      slug: "jagged-earth",
      releaseYear: 2020,
    });

    const promoPack2Id = await ctx.db.insert("expansions", {
      name: "Promo Pack 2",
      slug: "promo-pack-2",
      releaseYear: 2021,
    });

    const riverId = await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary:
        "A flexible spirit of renewal and cleansing that pushes invaders away and heals the land.",
      description:
        "River is a flexible spirit that excels at moving Invaders and Dahan around the island. With strong energy generation and the ability to heal Blight, River supports other spirits while steadily pushing back the invasion. Best played reactively, responding to threats across multiple lands.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: baseGameId,
      elements: ["Sun", "Water"],
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary: "Emphasizes Sun and energy income, with radiant presence.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: baseGameId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Sunshine",
      complexityModifier: "harder",
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary:
        "Mobile spirit that flows across the island to where it's needed.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Haven",
      complexityModifier: "harder",
    });

    const lightningId = await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary:
        "An aggressive spirit of speed and destruction, striking fast before invaders can build.",
      description:
        "Lightning is an aggressive spirit focused on dealing damage quickly in the fast phase before Invaders can build. With low defense but high offense, Lightning races to destroy towns and explorers before they establish. Best played proactively, targeting the most dangerous lands early.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: baseGameId,
      elements: ["Fire", "Air"],
    });

    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary: "Chaotic lightning that scatters invaders unpredictably.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
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
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: promoPack2Id,
      elements: ["Fire", "Air"],
      baseSpirit: lightningId,
      aspectName: "Immense",
      complexityModifier: "harder",
    });

    return {
      status: "reseeded",
      message:
        "Deleted all data and created 3 expansions, 2 base spirits, 7 aspects",
    };
  },
});
