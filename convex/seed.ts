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

    // Seed River Surges in Sunlight (Base Game, Low complexity)
    const riverId = await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary:
        "A flexible spirit of renewal and cleansing that pushes invaders away and heals the land.",
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
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Moderate",
      summary:
        "Mobile spirit that flows across the island to where it's needed.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Travel",
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Moderate",
      summary: "Protective spirit focused on defending sacred sites.",
      imageUrl: "/spirits/river-surges-in-sunlight.webp",
      expansionId: jaggedEarthId,
      elements: ["Sun", "Water"],
      baseSpirit: riverId,
      aspectName: "Haven",
    });

    // Seed Lightning's Swift Strike (Base Game, Low complexity)
    const lightningId = await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary:
        "An aggressive spirit of speed and destruction, striking fast before invaders can build.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: baseGameId,
      elements: ["Fire", "Air"],
    });

    // Lightning aspects
    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Moderate",
      summary: "Chaotic lightning that scatters invaders unpredictably.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
      elements: ["Fire", "Air"],
      baseSpirit: lightningId,
      aspectName: "Pandemonium",
    });

    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Moderate",
      summary:
        "Swift spirit that prioritizes movement and flexibility over raw damage.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
      elements: ["Fire", "Air"],
      baseSpirit: lightningId,
      aspectName: "Wind",
    });

    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Moderate",
      summary: "Focused on efficient, repeated small strikes.",
      imageUrl: "/spirits/lightnings-swift-strike.webp",
      expansionId: jaggedEarthId,
      elements: ["Fire", "Air"],
      baseSpirit: lightningId,
      aspectName: "Sparking",
    });

    return {
      status: "seeded",
      message: "Created 2 expansions, 2 base spirits, 6 aspects",
    };
  },
});
