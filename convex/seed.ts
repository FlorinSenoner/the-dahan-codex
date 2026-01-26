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
      imageUrl: "/spirits/river-surges-in-sunlight.png",
      expansionId: baseGameId,
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
      specialRules: [],
      growth: [
        {
          title: "Top",
          options: [
            { actions: ["Reclaim All", "Gain 1 Power Card"] },
            { actions: ["Gain 1 Power Card", "Add 1 Presence (Range 1)"] },
          ],
        },
        {
          title: "Bottom",
          options: [
            { actions: ["Gain 1 Energy", "Add 1 Presence (Range 2, Wetland)"] },
            {
              actions: [
                "Gain 1 Energy",
                "Add 1 Presence (Range 1)",
                "Push 1 Explorer from each of your lands",
              ],
            },
          ],
        },
      ],
      presenceTracks: {
        energy: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ],
        cardPlays: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 3 },
          { value: 4 },
          { value: 4, reclaim: true },
        ],
      },
      innates: [
        {
          name: "Massive Flooding",
          speed: "Fast",
          range: "1",
          target: "Any",
          thresholds: [
            {
              elements: { Sun: 1, Water: 2 },
              effect: "Push up to 3 Explorers",
            },
            {
              elements: { Sun: 2, Water: 3 },
              effect: "Push up to 6 Explorers and/or Towns",
            },
            {
              elements: { Sun: 2, Water: 4 },
              effect:
                "Push up to 3 Explorers and/or Towns. You may instead deal 1 Damage to each Invader.",
            },
          ],
        },
        {
          name: "Boon of Vigor",
          speed: "Slow",
          range: "Any Spirit",
          target: "Any Spirit",
          thresholds: [
            {
              elements: { Sun: 2, Water: 2 },
              effect: "Target Spirit gains 2 Energy.",
            },
            {
              elements: { Sun: 3, Water: 3 },
              effect:
                "Target Spirit either gains +3 Energy or may Reclaim up to 2 Power Cards.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "River's Bounty",
          cost: 0,
          speed: "Slow",
          elements: ["Sun", "Water"],
          description:
            "Gather up to 2 Dahan. If there are now at least 2 Dahan, add 1 Fertility.",
        },
        {
          name: "Wash Away",
          cost: 1,
          speed: "Slow",
          elements: ["Water", "Earth"],
          description: "Push up to 3 Explorers / Towns.",
        },
        {
          name: "Flash Floods",
          cost: 2,
          speed: "Fast",
          elements: ["Sun", "Water"],
          description: "1 Damage. If target land is Coastal, +1 Damage.",
        },
        {
          name: "Boon of Vigor",
          cost: 0,
          speed: "Fast",
          elements: ["Sun", "Water"],
          description:
            "Target Spirit gains 1 Energy. If you target another Spirit, you also gain 1 Energy.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=River_Surges_in_Sunlight",
    });

    // River aspects
    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary: "Emphasizes Sun and energy income, with radiant presence.",
      imageUrl: "/spirits/river-surges-in-sunlight-sunshine.png",
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
      imageUrl: "/spirits/river-surges-in-sunlight-travel.png",
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
      // No aspect art available yet - will use placeholder
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
      imageUrl: "/spirits/lightnings-swift-strike.png",
      expansionId: baseGameId,
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
      specialRules: [],
      growth: [
        {
          title: "Top",
          options: [
            { actions: ["Reclaim All", "Gain 1 Power Card"] },
            {
              actions: [
                "Gain 1 Power Card",
                "Add 1 Presence (Range 1, Or Inland)",
              ],
            },
          ],
        },
        {
          title: "Bottom",
          options: [
            {
              actions: [
                "Gain 1 Energy",
                "Add 1 Presence (Range 2, Or Inland)",
                "1 Damage in one of your lands",
              ],
            },
            { actions: ["Add 1 Presence (Range 1)"] },
          ],
        },
      ],
      presenceTracks: {
        energy: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        cardPlays: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
        ],
      },
      innates: [
        {
          name: "Thundering Destruction",
          speed: "Fast",
          range: "0",
          target: "Any",
          thresholds: [
            { elements: { Fire: 2, Air: 1 }, effect: "1 Damage" },
            { elements: { Fire: 3, Air: 2 }, effect: "1 Damage" },
            { elements: { Fire: 4, Air: 3 }, effect: "1 Damage" },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Harbingers of the Lightning",
          cost: 0,
          speed: "Slow",
          elements: ["Fire", "Air"],
          description: "Push up to 2 Dahan.",
        },
        {
          name: "Lightning's Boon",
          cost: 1,
          speed: "Fast",
          elements: ["Fire", "Air"],
          description:
            "Target Spirit may use up to 2 Slow Powers as Fast Powers this turn.",
        },
        {
          name: "Shatter Homesteads",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Air"],
          description: "1 Fear. 1 Damage.",
        },
        {
          name: "Raging Storm",
          cost: 3,
          speed: "Slow",
          elements: ["Fire", "Air", "Water"],
          description: "1 Fear. 2 Damage.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike",
    });

    // Lightning aspects
    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary: "Chaotic lightning that scatters invaders unpredictably.",
      imageUrl: "/spirits/lightnings-swift-strike-pandemonium.png",
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
      imageUrl: "/spirits/lightnings-swift-strike-wind.png",
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
      // No aspect art available yet - will use placeholder
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
      imageUrl: "/spirits/lightnings-swift-strike-immense.png",
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
      imageUrl: "/spirits/river-surges-in-sunlight.png",
      expansionId: baseGameId,
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
      specialRules: [],
      growth: [
        {
          title: "Top",
          options: [
            { actions: ["Reclaim All", "Gain 1 Power Card"] },
            { actions: ["Gain 1 Power Card", "Add 1 Presence (Range 1)"] },
          ],
        },
        {
          title: "Bottom",
          options: [
            { actions: ["Gain 1 Energy", "Add 1 Presence (Range 2, Wetland)"] },
            {
              actions: [
                "Gain 1 Energy",
                "Add 1 Presence (Range 1)",
                "Push 1 Explorer from each of your lands",
              ],
            },
          ],
        },
      ],
      presenceTracks: {
        energy: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ],
        cardPlays: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 3 },
          { value: 4 },
          { value: 4, reclaim: true },
        ],
      },
      innates: [
        {
          name: "Massive Flooding",
          speed: "Fast",
          range: "1",
          target: "Any",
          thresholds: [
            {
              elements: { Sun: 1, Water: 2 },
              effect: "Push up to 3 Explorers",
            },
            {
              elements: { Sun: 2, Water: 3 },
              effect: "Push up to 6 Explorers and/or Towns",
            },
            {
              elements: { Sun: 2, Water: 4 },
              effect:
                "Push up to 3 Explorers and/or Towns. You may instead deal 1 Damage to each Invader.",
            },
          ],
        },
        {
          name: "Boon of Vigor",
          speed: "Slow",
          range: "Any Spirit",
          target: "Any Spirit",
          thresholds: [
            {
              elements: { Sun: 2, Water: 2 },
              effect: "Target Spirit gains 2 Energy.",
            },
            {
              elements: { Sun: 3, Water: 3 },
              effect:
                "Target Spirit either gains +3 Energy or may Reclaim up to 2 Power Cards.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "River's Bounty",
          cost: 0,
          speed: "Slow",
          elements: ["Sun", "Water"],
          description:
            "Gather up to 2 Dahan. If there are now at least 2 Dahan, add 1 Fertility.",
        },
        {
          name: "Wash Away",
          cost: 1,
          speed: "Slow",
          elements: ["Water", "Earth"],
          description: "Push up to 3 Explorers / Towns.",
        },
        {
          name: "Flash Floods",
          cost: 2,
          speed: "Fast",
          elements: ["Sun", "Water"],
          description: "1 Damage. If target land is Coastal, +1 Damage.",
        },
        {
          name: "Boon of Vigor",
          cost: 0,
          speed: "Fast",
          elements: ["Sun", "Water"],
          description:
            "Target Spirit gains 1 Energy. If you target another Spirit, you also gain 1 Energy.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=River_Surges_in_Sunlight",
    });

    await ctx.db.insert("spirits", {
      name: "River Surges in Sunlight",
      slug: "river-surges-in-sunlight",
      complexity: "Low",
      summary: "Emphasizes Sun and energy income, with radiant presence.",
      imageUrl: "/spirits/river-surges-in-sunlight-sunshine.png",
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
      imageUrl: "/spirits/river-surges-in-sunlight-travel.png",
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
      // No aspect art available yet - will use placeholder
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
      imageUrl: "/spirits/lightnings-swift-strike.png",
      expansionId: baseGameId,
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
      specialRules: [],
      growth: [
        {
          title: "Top",
          options: [
            { actions: ["Reclaim All", "Gain 1 Power Card"] },
            {
              actions: [
                "Gain 1 Power Card",
                "Add 1 Presence (Range 1, Or Inland)",
              ],
            },
          ],
        },
        {
          title: "Bottom",
          options: [
            {
              actions: [
                "Gain 1 Energy",
                "Add 1 Presence (Range 2, Or Inland)",
                "1 Damage in one of your lands",
              ],
            },
            { actions: ["Add 1 Presence (Range 1)"] },
          ],
        },
      ],
      presenceTracks: {
        energy: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        cardPlays: [
          { value: 1 },
          { value: 2 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
        ],
      },
      innates: [
        {
          name: "Thundering Destruction",
          speed: "Fast",
          range: "0",
          target: "Any",
          thresholds: [
            { elements: { Fire: 2, Air: 1 }, effect: "1 Damage" },
            { elements: { Fire: 3, Air: 2 }, effect: "1 Damage" },
            { elements: { Fire: 4, Air: 3 }, effect: "1 Damage" },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Harbingers of the Lightning",
          cost: 0,
          speed: "Slow",
          elements: ["Fire", "Air"],
          description: "Push up to 2 Dahan.",
        },
        {
          name: "Lightning's Boon",
          cost: 1,
          speed: "Fast",
          elements: ["Fire", "Air"],
          description:
            "Target Spirit may use up to 2 Slow Powers as Fast Powers this turn.",
        },
        {
          name: "Shatter Homesteads",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Air"],
          description: "1 Fear. 1 Damage.",
        },
        {
          name: "Raging Storm",
          cost: 3,
          speed: "Slow",
          elements: ["Fire", "Air", "Water"],
          description: "1 Fear. 2 Damage.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike",
    });

    await ctx.db.insert("spirits", {
      name: "Lightning's Swift Strike",
      slug: "lightnings-swift-strike",
      complexity: "Low",
      summary: "Chaotic lightning that scatters invaders unpredictably.",
      imageUrl: "/spirits/lightnings-swift-strike-pandemonium.png",
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
      imageUrl: "/spirits/lightnings-swift-strike-wind.png",
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
      // No aspect art available yet - will use placeholder
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
      imageUrl: "/spirits/lightnings-swift-strike-immense.png",
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
