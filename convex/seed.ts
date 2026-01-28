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

    // Seed Fractured Days Split the Sky (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Fractured Days Split the Sky",
      slug: "fractured-days-split-the-sky",
      complexity: "Very High",
      summary:
        "Manipulates time with Days That Never Were cards and choose-any growth options.",
      description:
        "Fractured Days is a time-manipulation spirit that plays with a unique 'Days That Never Were' card pool. Each turn, you gain Time markers which fuel special abilities. Growth is highly flexible - choose any combination of options rather than picking one. The spirit excels at adapting to any situation but requires careful planning across multiple timelines.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Days That Never Were",
          description:
            "Setup: Shuffle the 'Days That Never Were' cards face-down as a separate pool. Each has a one-time effect that can change the game's timeline.",
        },
        {
          name: "Time Markers",
          description:
            "You may spend Time markers for various effects including playing Days That Never Were cards and boosting powers.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky",
    });

    // Seed Starlight Seeks Its Form (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Starlight Seeks Its Form",
      slug: "starlight-seeks-its-form",
      complexity: "Very High",
      summary:
        "Shape-shifting spirit with 6 presence tracks that unlock growth choices as they empty.",
      description:
        "Starlight is a spirit of endless potential, constantly shifting its nature. With 6 presence tracks instead of 2, Starlight can develop in many different directions. As tracks empty, they unlock new growth choices, allowing Starlight to adapt its strategy throughout the game. Extremely flexible but requires careful planning.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Growth Begets Growth",
          description:
            "Some Growth choices are hidden. When you remove the last Presence from a track, reveal and gain access to the Growth choice underneath.",
        },
        {
          name: "Shifting Form",
          description:
            "You may gain elements from any of your revealed presence tracks during the Spirit Phase.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Starlight_Seeks_Its_Form",
    });

    // Seed Finder of Paths Unseen (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Finder of Paths Unseen",
      slug: "finder-of-paths-unseen",
      complexity: "Very High",
      summary:
        "Moves presence freely along paths with unique branching presence tracks.",
      description:
        "Finder is a spirit of hidden connections and secret ways. Unlike other spirits, Finder can move presence backwards along tracks, and its tracks branch and connect in unusual ways. This allows for incredibly dynamic board positioning but requires mastering a unique presence management system.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Paths From Here to There",
          description:
            "You may move Presence along your presence tracks in either direction during Growth. Moving presence backward is how you 'regain' track bonuses.",
        },
        {
          name: "Ways Apart and Unmarked",
          description:
            "Your Presence adds +1 Range to Dahan movement. When a Dahan moves from a land with your Presence, it may move +1 additional land.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Finder_of_Paths_Unseen",
    });

    // Seed Serpent Slumbering Beneath the Island (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Serpent Slumbering Beneath the Island",
      slug: "serpent-slumbering-beneath-the-island",
      complexity: "Very High",
      summary:
        "Ancient power awakening through absorbed presence, with Deep Slumber limit.",
      description:
        "Serpent is an immensely powerful but sleeping spirit. It starts with severe limitations on how many presence it can have on the island (Deep Slumber). By absorbing essence from other spirits and the land, Serpent slowly awakens, increasing its presence limit and unlocking devastating powers. Patient play rewards explosive late-game power.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Deep Slumber",
          description:
            "You cannot have more Presence on the island than the number shown on your Deep Slumber track. If you ever have more, immediately Absorb Essence or return Presence to your tracks.",
        },
        {
          name: "Absorb Essence",
          description:
            "You may remove Presence from the island (yours or another Spirit's, with permission) to advance your Absorbed Essence track. This increases your presence limit.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island",
    });

    // Seed sample opening for River Surges in Sunlight
    await ctx.db.insert("openings", {
      spiritId: riverId,
      slug: "river-standard-opening",
      name: "Standard Opening",
      description:
        "A balanced opening focusing on energy generation and board control.",
      difficulty: "Beginner",
      turns: [
        {
          turn: 1,
          title: "Turn 1: Establish Presence",
          instructions:
            "Take Growth Option 2: Add two Presence and gain a Power Card. Place presence in lands with Dahan to maximize your reach. Play Boon of Vigor on a spirit that needs energy (or yourself).",
          notes:
            "River's first turn is about establishing reach. Don't worry about defending yet.",
        },
        {
          turn: 2,
          title: "Turn 2: Build Momentum",
          instructions:
            "Take Growth Option 3: Add Presence to a Wetland within Range 2 and gain 1 Energy. Play Flash Floods to push Explorers away from a building land, or use River's Bounty to gather Dahan.",
          notes:
            "Start setting up for your innate power by getting Water presence revealed.",
        },
        {
          turn: 3,
          title: "Turn 3: Control the Flow",
          instructions:
            "Take Growth Option 2 again for more presence and cards. By now you should have enough presence to trigger Massive Flooding. Focus on lands where you can push Invaders into each other or off the island.",
          notes:
            "River excels at controlling Invader movement. Use this to create favorable Ravage situations.",
        },
      ],
      author: "Spirit Island Community",
      sourceUrl: "https://querki.net/u/darker/spirit-island-faq/#!.7w4g8aw",
    });

    return {
      status: "seeded",
      message: "Created 3 expansions, 6 base spirits, 7 aspects, 1 opening",
    };
  },
});

// Reseed mutation - deletes all data and re-runs seed
// Use: npx convex run seed:reseedSpirits
export const reseedSpirits = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all openings first (they reference spirits)
    const allOpenings = await ctx.db.query("openings").collect();
    for (const opening of allOpenings) {
      await ctx.db.delete(opening._id);
    }

    // Delete all spirits (aspects reference base spirits)
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

    // Reseed Fractured Days Split the Sky (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Fractured Days Split the Sky",
      slug: "fractured-days-split-the-sky",
      complexity: "Very High",
      summary:
        "Manipulates time with Days That Never Were cards and choose-any growth options.",
      description:
        "Fractured Days is a time-manipulation spirit that plays with a unique 'Days That Never Were' card pool. Each turn, you gain Time markers which fuel special abilities. Growth is highly flexible - choose any combination of options rather than picking one. The spirit excels at adapting to any situation but requires careful planning across multiple timelines.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Days That Never Were",
          description:
            "Setup: Shuffle the 'Days That Never Were' cards face-down as a separate pool. Each has a one-time effect that can change the game's timeline.",
        },
        {
          name: "Time Markers",
          description:
            "You may spend Time markers for various effects including playing Days That Never Were cards and boosting powers.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky",
    });

    // Reseed Starlight Seeks Its Form (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Starlight Seeks Its Form",
      slug: "starlight-seeks-its-form",
      complexity: "Very High",
      summary:
        "Shape-shifting spirit with 6 presence tracks that unlock growth choices as they empty.",
      description:
        "Starlight is a spirit of endless potential, constantly shifting its nature. With 6 presence tracks instead of 2, Starlight can develop in many different directions. As tracks empty, they unlock new growth choices, allowing Starlight to adapt its strategy throughout the game. Extremely flexible but requires careful planning.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Growth Begets Growth",
          description:
            "Some Growth choices are hidden. When you remove the last Presence from a track, reveal and gain access to the Growth choice underneath.",
        },
        {
          name: "Shifting Form",
          description:
            "You may gain elements from any of your revealed presence tracks during the Spirit Phase.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Starlight_Seeks_Its_Form",
    });

    // Reseed Finder of Paths Unseen (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Finder of Paths Unseen",
      slug: "finder-of-paths-unseen",
      complexity: "Very High",
      summary:
        "Moves presence freely along paths with unique branching presence tracks.",
      description:
        "Finder is a spirit of hidden connections and secret ways. Unlike other spirits, Finder can move presence backwards along tracks, and its tracks branch and connect in unusual ways. This allows for incredibly dynamic board positioning but requires mastering a unique presence management system.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Paths From Here to There",
          description:
            "You may move Presence along your presence tracks in either direction during Growth. Moving presence backward is how you 'regain' track bonuses.",
        },
        {
          name: "Ways Apart and Unmarked",
          description:
            "Your Presence adds +1 Range to Dahan movement. When a Dahan moves from a land with your Presence, it may move +1 additional land.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Finder_of_Paths_Unseen",
    });

    // Reseed Serpent Slumbering Beneath the Island (Jagged Earth, Very High complexity)
    await ctx.db.insert("spirits", {
      name: "Serpent Slumbering Beneath the Island",
      slug: "serpent-slumbering-beneath-the-island",
      complexity: "Very High",
      summary:
        "Ancient power awakening through absorbed presence, with Deep Slumber limit.",
      description:
        "Serpent is an immensely powerful but sleeping spirit. It starts with severe limitations on how many presence it can have on the island (Deep Slumber). By absorbing essence from other spirits and the land, Serpent slowly awakens, increasing its presence limit and unlocking devastating powers. Patient play rewards explosive late-game power.",
      expansionId: jaggedEarthId,
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
      specialRules: [
        {
          name: "Deep Slumber",
          description:
            "You cannot have more Presence on the island than the number shown on your Deep Slumber track. If you ever have more, immediately Absorb Essence or return Presence to your tracks.",
        },
        {
          name: "Absorb Essence",
          description:
            "You may remove Presence from the island (yours or another Spirit's, with permission) to advance your Absorbed Essence track. This increases your presence limit.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island",
    });

    // Reseed sample opening for River Surges in Sunlight
    await ctx.db.insert("openings", {
      spiritId: riverId,
      slug: "river-standard-opening",
      name: "Standard Opening",
      description:
        "A balanced opening focusing on energy generation and board control.",
      difficulty: "Beginner",
      turns: [
        {
          turn: 1,
          title: "Turn 1: Establish Presence",
          instructions:
            "Take Growth Option 2: Add two Presence and gain a Power Card. Place presence in lands with Dahan to maximize your reach. Play Boon of Vigor on a spirit that needs energy (or yourself).",
          notes:
            "River's first turn is about establishing reach. Don't worry about defending yet.",
        },
        {
          turn: 2,
          title: "Turn 2: Build Momentum",
          instructions:
            "Take Growth Option 3: Add Presence to a Wetland within Range 2 and gain 1 Energy. Play Flash Floods to push Explorers away from a building land, or use River's Bounty to gather Dahan.",
          notes:
            "Start setting up for your innate power by getting Water presence revealed.",
        },
        {
          turn: 3,
          title: "Turn 3: Control the Flow",
          instructions:
            "Take Growth Option 2 again for more presence and cards. By now you should have enough presence to trigger Massive Flooding. Focus on lands where you can push Invaders into each other or off the island.",
          notes:
            "River excels at controlling Invader movement. Use this to create favorable Ravage situations.",
        },
      ],
      author: "Spirit Island Community",
      sourceUrl: "https://querki.net/u/darker/spirit-island-faq/#!.7w4g8aw",
    });

    return {
      status: "reseeded",
      message:
        "Deleted all data and created 3 expansions, 6 base spirits, 7 aspects, 1 opening",
    };
  },
});
