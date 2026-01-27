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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [{ type: "reclaim", variant: "all" }],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "addPresence", range: 1 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 2, terrain: "Wetland" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 4 },
              { value: 5 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 3, reclaim: true },
              { value: 4 },
              { value: 5 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Massive Flooding",
          speed: "Slow",
          range: "Sacred Site",
          target: "Any Land",
          thresholds: [
            {
              elements: { Sun: 1, Water: 2 },
              effect: "Push up to 3 Explorers and/or Towns.",
            },
            {
              elements: { Sun: 2, Water: 3 },
              effect:
                "Instead, push up to 3 Explorers and/or Towns, and up to 3 Dahan.",
            },
            {
              elements: { Sun: 3, Water: 4 },
              effect:
                "You may also deal 1 Damage to each Invader in target land.",
            },
          ],
        },
        {
          name: "Boon of Vigor",
          speed: "Fast",
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
                "If target Spirit has a Sacred Site, they also gain +3 Energy.",
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
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 2 Dahan. If there are now at least 2 Dahan, add 1 Fertility.",
        },
        {
          name: "Wash Away",
          cost: 1,
          speed: "Slow",
          elements: ["Water", "Earth"],
          range: "1",
          target: "Any Land",
          description: "Push up to 3 Explorers / Towns.",
        },
        {
          name: "Flash Floods",
          cost: 2,
          speed: "Fast",
          elements: ["Sun", "Water"],
          range: "1",
          target: "Any Land",
          description: "1 Damage. If target land is Coastal, +1 Damage.",
        },
        {
          name: "Boon of Vigor",
          cost: 0,
          speed: "Fast",
          elements: ["Sun", "Water"],
          range: "Any",
          target: "Any Spirit",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 3 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 4 },
              { value: 5 },
              { value: 6 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Thundering Destruction",
          speed: "Fast",
          range: "0",
          target: "Any Land",
          thresholds: [
            { elements: { Fire: 2, Air: 1 }, effect: "1 Damage." },
            { elements: { Fire: 3, Air: 2 }, effect: "1 Damage." },
            { elements: { Fire: 4, Air: 3 }, effect: "1 Damage." },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Harbingers of the Lightning",
          cost: 0,
          speed: "Slow",
          elements: ["Fire", "Air"],
          range: "1",
          target: "Any Land",
          description: "Push up to 2 Dahan.",
        },
        {
          name: "Lightning's Boon",
          cost: 1,
          speed: "Fast",
          elements: ["Fire", "Air"],
          range: "Any",
          target: "Any Spirit",
          description:
            "Target Spirit may use up to 2 Slow Powers as Fast Powers this turn.",
        },
        {
          name: "Shatter Homesteads",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Air"],
          range: "1",
          target: "Any Land",
          description: "1 Fear. 1 Damage.",
        },
        {
          name: "Raging Storm",
          cost: 3,
          speed: "Slow",
          elements: ["Fire", "Air", "Water"],
          range: "1",
          target: "Any Land",
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
    // Unique mechanic: Choose-from-four growth with OR options
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
      growth: {
        type: "pick-any",
        options: [
          {
            id: "G1",
            actions: [],
            orActions: [
              {
                label: "1 Time",
                actions: [{ type: "gainTime", amount: 1 }],
              },
              {
                label: "2 Card Plays (this turn)",
                actions: [{ type: "gainCardPlays", amount: 2 }],
              },
            ],
          },
          {
            id: "G2",
            actions: [],
            orActions: [
              {
                label: "Reclaim one",
                actions: [{ type: "reclaim", variant: "one" }],
              },
              {
                label: "+1 Range on all Powers",
                actions: [{ type: "gainRange", amount: 1 }],
              },
            ],
          },
          {
            id: "G3",
            actions: [],
            orActions: [
              {
                label: "Add a Presence",
                actions: [{ type: "addPresence", range: 3 }],
              },
              {
                label: "Gain Power Card",
                actions: [{ type: "gainPowerCard" }],
              },
            ],
          },
          {
            id: "G4",
            actions: [],
            orActions: [
              {
                label: "2 Energy",
                actions: [{ type: "gainEnergy", amount: 2 }],
              },
              {
                label: "Forget a Power Card to gain 2 Time",
                actions: [
                  { type: "forgetPowerCard" },
                  { type: "gainTime", amount: 2 },
                ],
              },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            color: "indigo",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 5 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            color: "violet",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3, reclaim: true },
              { value: 4 },
              { value: 5 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Pour Time Sideways",
          speed: "Fast",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect:
                "Gather 1 Explorer. Or, if target land has Dahan, move 1 Dahan to an adjacent land.",
            },
            {
              elements: { Moon: 2, Air: 2 },
              effect: "You may also Push 1 Explorer or 1 Dahan.",
            },
            {
              elements: { Moon: 3, Air: 3 },
              effect:
                "You may also add 1 Strife. If you do, 1 Damage to Invaders.",
            },
          ],
        },
        {
          name: "Absolute Stasis",
          speed: "Slow",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Sun: 2, Moon: 2, Air: 2 },
              effect:
                "Invaders and Dahan in target land do not participate in Ravage or any Action this turn.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "The Past Returns Again",
          cost: 0,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "The next time Dahan would be Destroyed in target land, instead return them to full health.",
        },
        {
          name: "Blur the Arc of Years",
          cost: 1,
          speed: "Slow",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Push up to 2 Explorers and 1 Town. If you have 2 Time, you may instead Push up to 4 Explorers and 2 Towns.",
        },
        {
          name: "Slip the Flow of Time",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "Any Spirit",
          target: "Any Spirit",
          description:
            "Target Spirit may Repeat a Power Card they played this turn by paying its cost again. You may spend 1 Time to do this during the Fast phase.",
        },
        {
          name: "Sever the Ties Between Instants",
          cost: 3,
          speed: "Slow",
          elements: ["Moon", "Air"],
          range: "0",
          target: "Any Land",
          description:
            "Destroy 1 Town. Destroy 1 Explorer. Add 1 Strife to an Invader.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky",
    });

    // Seed Starlight Seeks Its Form (Jagged Earth, Very High complexity)
    // Unique mechanic: 6 presence tracks, 4 unlock growth choices
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 2 },
            ],
          },
        ],
      },
      presenceTracks: {
        layout: "multiple",
        tracks: [
          {
            type: "energy",
            label: "Energy",
            color: "indigo",
            unlocksGrowth: true,
            slots: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            color: "amber",
            unlocksGrowth: true,
            slots: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
          },
          {
            type: "elements",
            label: "Fire/Air",
            color: "orange",
            unlocksGrowth: true,
            slots: [
              { value: 0, elements: ["Fire"] },
              { value: 0, elements: ["Air"] },
              { value: 0, elements: ["Fire", "Air"] },
            ],
          },
          {
            type: "elements",
            label: "Water/Earth",
            color: "cyan",
            unlocksGrowth: true,
            slots: [
              { value: 0, elements: ["Water"] },
              { value: 0, elements: ["Earth"] },
              { value: 0, elements: ["Water", "Earth"] },
            ],
          },
          {
            type: "elements",
            label: "Moon/Plant",
            color: "purple",
            slots: [
              { value: 0, elements: ["Moon"] },
              { value: 0, elements: ["Plant"] },
              { value: 0, elements: ["Moon", "Plant"] },
            ],
          },
          {
            type: "elements",
            label: "Sun/Animal",
            color: "amber",
            slots: [
              { value: 0, elements: ["Sun"] },
              { value: 0, elements: ["Animal"] },
              { value: 0, elements: ["Sun", "Animal"] },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Boon of Reimagining",
          speed: "Fast",
          range: "Any Spirit",
          target: "Any Spirit",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect: "Target Spirit gains 1 Energy.",
            },
            {
              elements: { Moon: 2, Fire: 1, Water: 1 },
              effect: "Target Spirit may Reclaim 1 Power Card.",
            },
            {
              elements: { Moon: 3, Fire: 2, Water: 2, Earth: 1 },
              effect:
                "Target Spirit may Repeat a Power Card by paying its cost.",
            },
          ],
        },
        {
          name: "Shape the Self Anew",
          speed: "Slow",
          range: "0",
          target: "Yourself",
          thresholds: [
            {
              elements: { Moon: 2, Air: 2 },
              effect: "Move 1 of your Presence to an adjacent land.",
            },
            {
              elements: { Moon: 3, Air: 3, Earth: 1 },
              effect:
                "Move up to 2 of your Presence. Each may move up to 2 lands.",
            },
            {
              elements: { Moon: 4, Air: 4, Plant: 2, Animal: 2 },
              effect: "Also add 1 Presence to any land with your Presence.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Gather the Scattered Light of Stars",
          cost: 0,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 1 of your Presence. If you have 4 Moon, you may instead Gather up to 2 Presence.",
        },
        {
          name: "Shape Starlight to Call the Hunter",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Fire", "Animal"],
          range: "1",
          target: "Any Land",
          description: "1 Fear. Push up to 2 Explorers.",
        },
        {
          name: "Peace of the Nighttime Sky",
          cost: 1,
          speed: "Slow",
          elements: ["Moon", "Water", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 2. If target land has your Presence, Defend 4 instead.",
        },
        {
          name: "Starlight Dances as Flame",
          cost: 2,
          speed: "Slow",
          elements: ["Moon", "Fire", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "1 Damage. If you have 3 Fire, +1 Damage. If you have 3 Air, 1 Fear.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Starlight_Seeks_Its_Form",
    });

    // Seed Finder of Paths Unseen (Jagged Earth, Very High complexity)
    // Unique mechanic: Branching presence tracks with bidirectional traversal
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 3 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "addPresence", range: 1 },
            ],
          },
        ],
      },
      presenceTracks: {
        layout: "branching",
        tracks: [
          {
            type: "energy",
            label: "Energy Track",
            color: "violet",
            connectsTo: "cardPlays",
            connectionPoint: 3,
            slots: [
              { value: 0 },
              { value: 1 },
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays Track",
            color: "emerald",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 2, reclaim: true },
              { value: 3 },
              { value: 4 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Traveler's Boon",
          speed: "Fast",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect:
                "Push 1 Dahan. Or, if you have a Sacred Site in an adjacent land, you may Gather 1 Dahan instead.",
            },
            {
              elements: { Moon: 2, Air: 2 },
              effect: "You may also move 1 of your Presence up to 2 lands.",
            },
            {
              elements: { Moon: 3, Air: 3, Plant: 1 },
              effect: "Gather up to 2 Dahan. Push up to 2 Dahan.",
            },
          ],
        },
        {
          name: "Paths Shift and Multiply",
          speed: "Slow",
          range: "0",
          target: "Any Land with Your Presence",
          thresholds: [
            {
              elements: { Moon: 2, Air: 2 },
              effect: "Add 1 of your Presence to an adjacent land.",
            },
            {
              elements: { Moon: 3, Air: 3, Earth: 1 },
              effect:
                "You may instead add 1 of your Presence up to 2 lands away.",
            },
            {
              elements: { Moon: 4, Air: 4, Earth: 2 },
              effect: "Add 1 additional Presence to any land with Dahan.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "A Spreading Plagueof Reckless Abandon",
          cost: 0,
          speed: "Slow",
          elements: ["Moon", "Air", "Animal"],
          range: "1",
          target: "Any Land",
          description:
            "Push up to 2 Explorers. They do not Explore into lands with your Presence this turn.",
        },
        {
          name: "Paths to Safety",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 3. Gather up to 2 Dahan. After Invaders Ravage, Push up to 2 Dahan.",
        },
        {
          name: "Offer Passage Between Worlds",
          cost: 2,
          speed: "Slow",
          elements: ["Moon", "Air", "Water"],
          range: "1",
          target: "Any Land",
          description:
            "Remove 1 Explorer. You may move up to 3 of your Presence from anywhere to target land.",
        },
        {
          name: "Ways of Shore and Heartland",
          cost: 2,
          speed: "Fast",
          elements: ["Moon", "Earth", "Plant"],
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 3 Dahan from lands up to 2 lands away. 1 Damage per Dahan in target land.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Finder_of_Paths_Unseen",
    });

    // Seed Serpent Slumbering Beneath the Island (Jagged Earth, Very High complexity)
    // Unique mechanic: Deep Slumber presence limit track (5-13)
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 3 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            color: "orange",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4, elements: ["Fire"] },
              { value: 5 },
              { value: 6, elements: ["Fire"] },
              { value: 7 },
            ],
          },
          {
            type: "absorbed",
            label: "Absorbed Essence",
            color: "stone",
            slots: [
              { value: 0 },
              { value: 0, elements: ["Moon"] },
              { value: 0, elements: ["Earth"] },
              { value: 0, elements: ["Moon", "Earth"] },
              { value: 0, elements: ["Fire"] },
              { value: 0, elements: ["Moon", "Earth", "Fire"] },
            ],
          },
          {
            type: "presenceLimit",
            label: "Deep Slumber",
            color: "purple",
            slots: [
              { value: 5, presenceCap: 5 },
              { value: 6, presenceCap: 6 },
              { value: 7, presenceCap: 7 },
              { value: 8, presenceCap: 8 },
              { value: 9, presenceCap: 9 },
              { value: 10, presenceCap: 10 },
              { value: 11, presenceCap: 11 },
              { value: 12, presenceCap: 12 },
              { value: 13, presenceCap: 13 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Serpent Wakes in Power",
          speed: "Slow",
          range: "0",
          target: "Any Land",
          thresholds: [
            {
              elements: { Fire: 2, Earth: 2 },
              effect: "2 Damage.",
            },
            {
              elements: { Moon: 2, Fire: 3, Earth: 3 },
              effect: "2 Damage. 2 Fear.",
            },
            {
              elements: { Moon: 3, Fire: 5, Earth: 4 },
              effect:
                "2 Damage. 2 Fear. Destroy 1 Town. Push all Dahan and Invaders.",
            },
          ],
        },
        {
          name: "Serpent Rouses in Anger",
          speed: "Slow",
          range: "0",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 2, Fire: 2 },
              effect: "1 Fear. 1 Damage to each Town/City.",
            },
            {
              elements: { Moon: 3, Fire: 4, Earth: 2 },
              effect: "2 Fear. 2 Damage to each Town/City.",
            },
            {
              elements: { Moon: 4, Fire: 6, Earth: 3 },
              effect:
                "3 Fear. Destroy all Towns and Cities. 2 Damage to each remaining Invader.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Gift of the Primordial Deeps",
          cost: 0,
          speed: "Slow",
          elements: ["Moon", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Add 1 Badlands. Any 1 Spirit may add a Presence to target land at no cost.",
        },
        {
          name: "Absorb Essence",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Earth"],
          range: "0",
          target: "Any Land with Your Presence",
          description:
            "Remove 1 Presence from target land (yours or another Spirit's with permission). Push your Absorbed Essence track 1 step.",
        },
        {
          name: "Elemental Aegis",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Water", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 6. If Invaders do 6 or more Damage during Ravage, after Ravage is complete: 2 Damage to Invaders.",
        },
        {
          name: "Open Gateways of the Abyss",
          cost: 3,
          speed: "Slow",
          elements: ["Moon", "Fire", "Earth"],
          range: "0",
          target: "Any Land",
          description:
            "2 Fear. 1 Damage per Blight in and adjacent to target land. Add 1 Blight.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island",
    });

    return {
      status: "seeded",
      message: "Created 3 expansions, 6 base spirits, 7 aspects",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [{ type: "reclaim", variant: "all" }],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "addPresence", range: 1 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 2, terrain: "Wetland" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 4 },
              { value: 5 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 3, reclaim: true },
              { value: 4 },
              { value: 5 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Massive Flooding",
          speed: "Slow",
          range: "Sacred Site",
          target: "Any Land",
          thresholds: [
            {
              elements: { Sun: 1, Water: 2 },
              effect: "Push up to 3 Explorers and/or Towns.",
            },
            {
              elements: { Sun: 2, Water: 3 },
              effect:
                "Instead, push up to 3 Explorers and/or Towns, and up to 3 Dahan.",
            },
            {
              elements: { Sun: 3, Water: 4 },
              effect:
                "You may also deal 1 Damage to each Invader in target land.",
            },
          ],
        },
        {
          name: "Boon of Vigor",
          speed: "Fast",
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
                "If target Spirit has a Sacred Site, they also gain +3 Energy.",
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
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 2 Dahan. If there are now at least 2 Dahan, add 1 Fertility.",
        },
        {
          name: "Wash Away",
          cost: 1,
          speed: "Slow",
          elements: ["Water", "Earth"],
          range: "1",
          target: "Any Land",
          description: "Push up to 3 Explorers / Towns.",
        },
        {
          name: "Flash Floods",
          cost: 2,
          speed: "Fast",
          elements: ["Sun", "Water"],
          range: "1",
          target: "Any Land",
          description: "1 Damage. If target land is Coastal, +1 Damage.",
        },
        {
          name: "Boon of Vigor",
          cost: 0,
          speed: "Fast",
          elements: ["Sun", "Water"],
          range: "Any",
          target: "Any Spirit",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 3 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 4 },
              { value: 5 },
              { value: 6 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Thundering Destruction",
          speed: "Fast",
          range: "0",
          target: "Any Land",
          thresholds: [
            { elements: { Fire: 2, Air: 1 }, effect: "1 Damage." },
            { elements: { Fire: 3, Air: 2 }, effect: "1 Damage." },
            { elements: { Fire: 4, Air: 3 }, effect: "1 Damage." },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Harbingers of the Lightning",
          cost: 0,
          speed: "Slow",
          elements: ["Fire", "Air"],
          range: "1",
          target: "Any Land",
          description: "Push up to 2 Dahan.",
        },
        {
          name: "Lightning's Boon",
          cost: 1,
          speed: "Fast",
          elements: ["Fire", "Air"],
          range: "Any",
          target: "Any Spirit",
          description:
            "Target Spirit may use up to 2 Slow Powers as Fast Powers this turn.",
        },
        {
          name: "Shatter Homesteads",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Air"],
          range: "1",
          target: "Any Land",
          description: "1 Fear. 1 Damage.",
        },
        {
          name: "Raging Storm",
          cost: 3,
          speed: "Slow",
          elements: ["Fire", "Air", "Water"],
          range: "1",
          target: "Any Land",
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
      growth: {
        type: "pick-any",
        options: [
          {
            id: "G1",
            actions: [],
            orActions: [
              {
                label: "1 Time",
                actions: [{ type: "gainTime", amount: 1 }],
              },
              {
                label: "2 Card Plays (this turn)",
                actions: [{ type: "gainCardPlays", amount: 2 }],
              },
            ],
          },
          {
            id: "G2",
            actions: [],
            orActions: [
              {
                label: "Reclaim one",
                actions: [{ type: "reclaim", variant: "one" }],
              },
              {
                label: "+1 Range on all Powers",
                actions: [{ type: "gainRange", amount: 1 }],
              },
            ],
          },
          {
            id: "G3",
            actions: [],
            orActions: [
              {
                label: "Add a Presence",
                actions: [{ type: "addPresence", range: 3 }],
              },
              {
                label: "Gain Power Card",
                actions: [{ type: "gainPowerCard" }],
              },
            ],
          },
          {
            id: "G4",
            actions: [],
            orActions: [
              {
                label: "2 Energy",
                actions: [{ type: "gainEnergy", amount: 2 }],
              },
              {
                label: "Forget a Power Card to gain 2 Time",
                actions: [
                  { type: "forgetPowerCard" },
                  { type: "gainTime", amount: 2 },
                ],
              },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            color: "indigo",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 5 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            color: "violet",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3, reclaim: true },
              { value: 4 },
              { value: 5 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Pour Time Sideways",
          speed: "Fast",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect:
                "Gather 1 Explorer. Or, if target land has Dahan, move 1 Dahan to an adjacent land.",
            },
            {
              elements: { Moon: 2, Air: 2 },
              effect: "You may also Push 1 Explorer or 1 Dahan.",
            },
            {
              elements: { Moon: 3, Air: 3 },
              effect:
                "You may also add 1 Strife. If you do, 1 Damage to Invaders.",
            },
          ],
        },
        {
          name: "Absolute Stasis",
          speed: "Slow",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Sun: 2, Moon: 2, Air: 2 },
              effect:
                "Invaders and Dahan in target land do not participate in Ravage or any Action this turn.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "The Past Returns Again",
          cost: 0,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "The next time Dahan would be Destroyed in target land, instead return them to full health.",
        },
        {
          name: "Blur the Arc of Years",
          cost: 1,
          speed: "Slow",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Push up to 2 Explorers and 1 Town. If you have 2 Time, you may instead Push up to 4 Explorers and 2 Towns.",
        },
        {
          name: "Slip the Flow of Time",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "Any Spirit",
          target: "Any Spirit",
          description:
            "Target Spirit may Repeat a Power Card they played this turn by paying its cost again. You may spend 1 Time to do this during the Fast phase.",
        },
        {
          name: "Sever the Ties Between Instants",
          cost: 3,
          speed: "Slow",
          elements: ["Moon", "Air"],
          range: "0",
          target: "Any Land",
          description:
            "Destroy 1 Town. Destroy 1 Explorer. Add 1 Strife to an Invader.",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 2 },
            ],
          },
        ],
      },
      presenceTracks: {
        layout: "multiple",
        tracks: [
          {
            type: "energy",
            label: "Energy",
            color: "indigo",
            unlocksGrowth: true,
            slots: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
          },
          {
            type: "cardPlays",
            label: "Card Plays",
            color: "amber",
            unlocksGrowth: true,
            slots: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
          },
          {
            type: "elements",
            label: "Fire/Air",
            color: "orange",
            unlocksGrowth: true,
            slots: [
              { value: 0, elements: ["Fire"] },
              { value: 0, elements: ["Air"] },
              { value: 0, elements: ["Fire", "Air"] },
            ],
          },
          {
            type: "elements",
            label: "Water/Earth",
            color: "cyan",
            unlocksGrowth: true,
            slots: [
              { value: 0, elements: ["Water"] },
              { value: 0, elements: ["Earth"] },
              { value: 0, elements: ["Water", "Earth"] },
            ],
          },
          {
            type: "elements",
            label: "Moon/Plant",
            color: "purple",
            slots: [
              { value: 0, elements: ["Moon"] },
              { value: 0, elements: ["Plant"] },
              { value: 0, elements: ["Moon", "Plant"] },
            ],
          },
          {
            type: "elements",
            label: "Sun/Animal",
            color: "amber",
            slots: [
              { value: 0, elements: ["Sun"] },
              { value: 0, elements: ["Animal"] },
              { value: 0, elements: ["Sun", "Animal"] },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Boon of Reimagining",
          speed: "Fast",
          range: "Any Spirit",
          target: "Any Spirit",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect: "Target Spirit gains 1 Energy.",
            },
            {
              elements: { Moon: 2, Fire: 1, Water: 1 },
              effect: "Target Spirit may Reclaim 1 Power Card.",
            },
            {
              elements: { Moon: 3, Fire: 2, Water: 2, Earth: 1 },
              effect:
                "Target Spirit may Repeat a Power Card by paying its cost.",
            },
          ],
        },
        {
          name: "Shape the Self Anew",
          speed: "Slow",
          range: "0",
          target: "Yourself",
          thresholds: [
            {
              elements: { Moon: 2, Air: 2 },
              effect: "Move 1 of your Presence to an adjacent land.",
            },
            {
              elements: { Moon: 3, Air: 3, Earth: 1 },
              effect:
                "Move up to 2 of your Presence. Each may move up to 2 lands.",
            },
            {
              elements: { Moon: 4, Air: 4, Plant: 2, Animal: 2 },
              effect: "Also add 1 Presence to any land with your Presence.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Gather the Scattered Light of Stars",
          cost: 0,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 1 of your Presence. If you have 4 Moon, you may instead Gather up to 2 Presence.",
        },
        {
          name: "Shape Starlight to Call the Hunter",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Fire", "Animal"],
          range: "1",
          target: "Any Land",
          description: "1 Fear. Push up to 2 Explorers.",
        },
        {
          name: "Peace of the Nighttime Sky",
          cost: 1,
          speed: "Slow",
          elements: ["Moon", "Water", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 2. If target land has your Presence, Defend 4 instead.",
        },
        {
          name: "Starlight Dances as Flame",
          cost: 2,
          speed: "Slow",
          elements: ["Moon", "Fire", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "1 Damage. If you have 3 Fire, +1 Damage. If you have 3 Air, 1 Fear.",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 3 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "addPresence", range: 1 },
            ],
          },
        ],
      },
      presenceTracks: {
        layout: "branching",
        tracks: [
          {
            type: "energy",
            label: "Energy Track",
            color: "violet",
            connectsTo: "cardPlays",
            connectionPoint: 3,
            slots: [
              { value: 0 },
              { value: 1 },
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 3 },
            ],
          },
          {
            type: "cardPlays",
            label: "Card Plays Track",
            color: "emerald",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 2 },
              { value: 2, reclaim: true },
              { value: 3 },
              { value: 4 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Traveler's Boon",
          speed: "Fast",
          range: "1",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 1, Air: 1 },
              effect:
                "Push 1 Dahan. Or, if you have a Sacred Site in an adjacent land, you may Gather 1 Dahan instead.",
            },
            {
              elements: { Moon: 2, Air: 2 },
              effect: "You may also move 1 of your Presence up to 2 lands.",
            },
            {
              elements: { Moon: 3, Air: 3, Plant: 1 },
              effect: "Gather up to 2 Dahan. Push up to 2 Dahan.",
            },
          ],
        },
        {
          name: "Paths Shift and Multiply",
          speed: "Slow",
          range: "0",
          target: "Any Land with Your Presence",
          thresholds: [
            {
              elements: { Moon: 2, Air: 2 },
              effect: "Add 1 of your Presence to an adjacent land.",
            },
            {
              elements: { Moon: 3, Air: 3, Earth: 1 },
              effect:
                "You may instead add 1 of your Presence up to 2 lands away.",
            },
            {
              elements: { Moon: 4, Air: 4, Earth: 2 },
              effect: "Add 1 additional Presence to any land with Dahan.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "A Spreading Plagueof Reckless Abandon",
          cost: 0,
          speed: "Slow",
          elements: ["Moon", "Air", "Animal"],
          range: "1",
          target: "Any Land",
          description:
            "Push up to 2 Explorers. They do not Explore into lands with your Presence this turn.",
        },
        {
          name: "Paths to Safety",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Air"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 3. Gather up to 2 Dahan. After Invaders Ravage, Push up to 2 Dahan.",
        },
        {
          name: "Offer Passage Between Worlds",
          cost: 2,
          speed: "Slow",
          elements: ["Moon", "Air", "Water"],
          range: "1",
          target: "Any Land",
          description:
            "Remove 1 Explorer. You may move up to 3 of your Presence from anywhere to target land.",
        },
        {
          name: "Ways of Shore and Heartland",
          cost: 2,
          speed: "Fast",
          elements: ["Moon", "Earth", "Plant"],
          range: "1",
          target: "Any Land",
          description:
            "Gather up to 3 Dahan from lands up to 2 lands away. 1 Damage per Dahan in target land.",
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
      growth: {
        type: "pick-one",
        options: [
          {
            id: "G1",
            actions: [
              { type: "reclaim", variant: "all" },
              { type: "gainEnergy", amount: 1 },
            ],
          },
          {
            id: "G2",
            actions: [
              { type: "addPresence", range: 2 },
              { type: "gainPowerCard" },
            ],
          },
          {
            id: "G3",
            actions: [
              { type: "addPresence", range: 1 },
              { type: "gainEnergy", amount: 3 },
            ],
          },
        ],
      },
      presenceTracks: {
        tracks: [
          {
            type: "energy",
            label: "Energy/Turn",
            color: "orange",
            slots: [
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4, elements: ["Fire"] },
              { value: 5 },
              { value: 6, elements: ["Fire"] },
              { value: 7 },
            ],
          },
          {
            type: "absorbed",
            label: "Absorbed Essence",
            color: "stone",
            slots: [
              { value: 0 },
              { value: 0, elements: ["Moon"] },
              { value: 0, elements: ["Earth"] },
              { value: 0, elements: ["Moon", "Earth"] },
              { value: 0, elements: ["Fire"] },
              { value: 0, elements: ["Moon", "Earth", "Fire"] },
            ],
          },
          {
            type: "presenceLimit",
            label: "Deep Slumber",
            color: "purple",
            slots: [
              { value: 5, presenceCap: 5 },
              { value: 6, presenceCap: 6 },
              { value: 7, presenceCap: 7 },
              { value: 8, presenceCap: 8 },
              { value: 9, presenceCap: 9 },
              { value: 10, presenceCap: 10 },
              { value: 11, presenceCap: 11 },
              { value: 12, presenceCap: 12 },
              { value: 13, presenceCap: 13 },
            ],
          },
        ],
      },
      innates: [
        {
          name: "Serpent Wakes in Power",
          speed: "Slow",
          range: "0",
          target: "Any Land",
          thresholds: [
            {
              elements: { Fire: 2, Earth: 2 },
              effect: "2 Damage.",
            },
            {
              elements: { Moon: 2, Fire: 3, Earth: 3 },
              effect: "2 Damage. 2 Fear.",
            },
            {
              elements: { Moon: 3, Fire: 5, Earth: 4 },
              effect:
                "2 Damage. 2 Fear. Destroy 1 Town. Push all Dahan and Invaders.",
            },
          ],
        },
        {
          name: "Serpent Rouses in Anger",
          speed: "Slow",
          range: "0",
          target: "Any Land",
          thresholds: [
            {
              elements: { Moon: 2, Fire: 2 },
              effect: "1 Fear. 1 Damage to each Town/City.",
            },
            {
              elements: { Moon: 3, Fire: 4, Earth: 2 },
              effect: "2 Fear. 2 Damage to each Town/City.",
            },
            {
              elements: { Moon: 4, Fire: 6, Earth: 3 },
              effect:
                "3 Fear. Destroy all Towns and Cities. 2 Damage to each remaining Invader.",
            },
          ],
        },
      ],
      uniquePowers: [
        {
          name: "Gift of the Primordial Deeps",
          cost: 0,
          speed: "Slow",
          elements: ["Moon", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Add 1 Badlands. Any 1 Spirit may add a Presence to target land at no cost.",
        },
        {
          name: "Absorb Essence",
          cost: 1,
          speed: "Fast",
          elements: ["Moon", "Earth"],
          range: "0",
          target: "Any Land with Your Presence",
          description:
            "Remove 1 Presence from target land (yours or another Spirit's with permission). Push your Absorbed Essence track 1 step.",
        },
        {
          name: "Elemental Aegis",
          cost: 2,
          speed: "Fast",
          elements: ["Fire", "Water", "Earth"],
          range: "1",
          target: "Any Land",
          description:
            "Defend 6. If Invaders do 6 or more Damage during Ravage, after Ravage is complete: 2 Damage to Invaders.",
        },
        {
          name: "Open Gateways of the Abyss",
          cost: 3,
          speed: "Slow",
          elements: ["Moon", "Fire", "Earth"],
          range: "0",
          target: "Any Land",
          description:
            "2 Fear. 1 Damage per Blight in and adjacent to target land. Add 1 Blight.",
        },
      ],
      wikiUrl:
        "https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island",
    });

    return {
      status: "reseeded",
      message:
        "Deleted all data and created 3 expansions, 6 base spirits, 7 aspects",
    };
  },
});
