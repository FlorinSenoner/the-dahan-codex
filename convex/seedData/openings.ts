// Opening guide data definitions for seeding the database
// Sources:
// - latentoctopus.github.io (Spirit Island Hub) - 22 guides for 10 spirits
// - BoardGameGeek Jeremy Lennert threads - 16 guides for 10 base game spirits
// - Spirit Island Wiki Phantaskippy guides - 9 guides for 9 base game spirits
// - BoardGameGeek Nature Incarnate threads - 4 guides for 1 NI spirit
// - BoardGameGeek Jonah Yonker (jyonker13) JE threads - 12 guides for 12 JE spirits
// - BoardGameGeek Jonah Yonker promo spirit threads - 2 guides for 2 promo spirits
// - Spirit Island Wiki Antistone/breppert guides - 3 guides for 2 base game spirits
// Total: 68 opening guides

// ============================================================================
// OPENING DATA INTERFACE
// ============================================================================

interface Turn {
  turn: number;
  title?: string;
  instructions: string;
}

export interface OpeningData {
  spiritSlug: string;
  slug: string;
  name: string;
  description?: string;
  turns: Turn[];
  author?: string;
  sourceUrl?: string;
}

// ============================================================================
// OPENINGS (68 total from 7 sources)
// ============================================================================

export const OPENINGS: OpeningData[] = [
  // ===========================================================================
  // River Surges in Sunlight (1 opening)
  // ===========================================================================
  {
    spiritSlug: "river-surges-in-sunlight",
    slug: "river-surges-in-sunlight-opening-1",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Exploits River's strong, perfect-element Uniques to reliably unlock level 3 Massive Flooding from turn 4 onwards.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 bottom. Play River's Bounty and another card. 1 Sun, 2 Water elements.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 bottom. Reclaim River's Bounty. Play 3 cards. 2 Sun, 3 Water elements.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor. Play River's Bounty and the Minor. Keep 2 Sun, 3 Water, 1 Earth in hand.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 bottom. Reclaim River's Bounty. Play River's Bounty and 3 more cards to unlock max-level Massive Flooding (3 Sun, 4 Water, 1 Earth).",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/river-opening1/",
  },

  // ===========================================================================
  // Sharp Fangs Behind the Leaves (4 openings)
  // ===========================================================================
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-opening-1",
    name: "Top Track Hybrid (Minor Powers)",
    description:
      "Focuses on consistent Ranging Hunt use with minimal reclaiming. Starting hand provides 2 turns of innate activation without reclaim.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 top; G3 Minor. Play 2 cards. Optional: play Plant+Animal to unlock Ranging Hunt damage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; G3 Minor. Play 2 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 bottom. Play Plant and Animal. Ranging Hunt with damage.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 bottom to 3 CP; G4. Play Plant and Animal. Ranging Hunt with damage.",
      },
      {
        turn: 5,
        title: "Turn 5+",
        instructions:
          "G2 bottom; G4 or G3 Minor. Play 3 cards. Continue Plant+Animal for Ranging Hunt.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/fangs-opening1/",
  },
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-opening-2",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Use when consistently activating Ranging Hunt damage threshold isn't a priority. Provides high card plays and early presence spread.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions: "G2 bottom; G3 Minor. Play 2 cards.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 bottom; G4. Play 3 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain Minor; G2 top. Play 3 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 bottom; G3 Minor. Reclaim Too Near the Jungle or another 0-cost. Play 3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "G2 bottom; G4. Play 4 cards.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/fangs-opening2/",
  },
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-opening-3",
    name: "Early-Reclaim Top Track (Minor Powers)",
    description:
      "Activates Ranging Hunt damage from turn 1. Requires finding a Minor with Animal element for consistent activation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 top; G3 Minor. Play Teeth Gleam (or Minor with Animal) and Too Near the Jungle for Ranging Hunt damage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Reclaim, gain Minor; G2 top. Play Plant and Animal for Ranging Hunt.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "G2 bottom; G4. Play Plant and Animal for Ranging Hunt.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Reclaim, gain Minor; G2 bottom to 3 CP. Play Plant and Animal.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "G2 bottom; G4. Play 3 cards with Plant and Animal.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/fangs-opening3/",
  },
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-opening-4",
    name: "Hybrid (Major Powers)",
    description:
      "Transitions into Major powers around turn 4-5 while maintaining Ranging Hunt activation through starting cards.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 top; G3 Minor. Play 2 cards. Aim for Ranging Hunt damage if possible.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 bottom; G4. Play 3 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 bottom. Play Plant and Animal for Ranging Hunt.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 bottom; G3 Major. Forget a Minor. Play 2-3 cards depending on Major cost.",
      },
      {
        turn: 5,
        title: "Turn 5+",
        instructions:
          "Continue building toward Major power while maintaining Beast presence.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/fangs-opening4/",
  },

  // ===========================================================================
  // Thunderspeaker (3 openings)
  // ===========================================================================
  {
    spiritSlug: "thunderspeaker",
    slug: "thunderspeaker-opening-1",
    name: "Hybrid (Minor Powers)",
    description:
      "Balanced opening with strong turn 1 defense. Builds toward consistent Dahan-based damage and control.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom. Play 2 cards. Sudden Ambush + Manifestation works well. Voice of Thunder + Manifestation unlocks level 2 innate.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top. Play Words of Warning and one remaining card.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain 2 Minors. Play 2 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G3 bottom. Play 2 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "G2 bottom. Play 3 cards.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/thunderspeaker-opening1/",
  },
  {
    spiritSlug: "thunderspeaker",
    slug: "thunderspeaker-opening-2",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Maximizes Dahan mobility and presence spread. Good for multiplayer where you can support allies.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom. Play 2 cards. Focus on positioning Dahan near invaders.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G3 bottom; G4. Play 2 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 bottom. Play 2-3 cards with Dahan movement.",
      },
      {
        turn: 4,
        title: "Turn 4+",
        instructions:
          "Continue presence spread and Minor acquisition. Maintain Dahan army of 3-4.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/thunderspeaker-opening2/",
  },
  {
    spiritSlug: "thunderspeaker",
    slug: "thunderspeaker-opening-3",
    name: "Hybrid (Major Powers)",
    description:
      "Transitions to Major powers for explosive late-game. Pairs well with Powerstorm and Dahan-enhancing Majors.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom. Play Sudden Ambush and Manifestation of Power and Glory.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 top. Play Voice of Thunder and Words of Warning for Air elements.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 bottom. Play 2 cards with Fire/Air focus.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G3 bottom; G4. Consider Major on turn 5. Play 2-3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Major (forget a weak card). Play Major with Dahan synergy.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/thunderspeaker-opening3/",
  },

  // ===========================================================================
  // Grinning Trickster Stirs Up Trouble (3 openings)
  // ===========================================================================
  {
    spiritSlug: "grinning-trickster-stirs-up-trouble",
    slug: "grinning-trickster-stirs-up-trouble-opening-1",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Maximizes card plays and strife generation. Strong against adversaries weak to strife.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 bottom; G3 Minor. Play 2 cards. Prioritize strife placement.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 bottom; G4. Play 3 cards. Continue strife and disruption.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 top. Play 3 cards with Moon/Fire elements.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 Minor. Reclaim a 0-cost. Play 3-4 cards.",
      },
      {
        turn: 5,
        title: "Turn 5+",
        instructions:
          "G2 bottom; G4. Play 4+ cards. Look for opportunities to trigger strife.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/trickster-opening1/",
  },
  {
    spiritSlug: "grinning-trickster-stirs-up-trouble",
    slug: "grinning-trickster-stirs-up-trouble-opening-2",
    name: "Top Track Hybrid (Minor Powers)",
    description:
      "Balances energy income with card plays. Good when you need more energy for powerful Minors.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions: "G2 top; G3 Minor. Play 2 cards for strife/disruption.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; G4. Play 2 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain Minor; G2 bottom. Play 2-3 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 Minor. Play 3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "G2 bottom; G4. Play 3-4 cards with element focus.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/trickster-opening2/",
  },
  {
    spiritSlug: "grinning-trickster-stirs-up-trouble",
    slug: "grinning-trickster-stirs-up-trouble-opening-3",
    name: "Hybrid (Major Powers)",
    description:
      "Transitions to Major powers for stronger effects. Good for late-game impact.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions: "G2 bottom; G3 Minor. Play 2 cards.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 bottom; G4. Play 3 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain Minor; G2 top. Play 2-3 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 top; G3 Major. Forget a weak Minor. Play based on Major cost.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Minor. Play Major and supporting cards with Moon/Fire.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/trickster-opening3/",
  },

  // ===========================================================================
  // Heart of the Wildfire (2 openings)
  // ===========================================================================
  {
    spiritSlug: "heart-of-the-wildfire",
    slug: "heart-of-the-wildfire-opening-1",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Maximizes presence damage and fire element generation. Accepts blight for aggressive early game.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom. Play Asphyxiating Smoke. Use presence placement damage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; gain Minor. Play Threatening Flames.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "G3 bottom. Play Flame's Fury and Flash-fires or Minor. Build fire elements.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Reclaim, gain Minor or Major (forget Flash-fires). Play 2 cards.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/wildfire-opening1/",
  },
  {
    spiritSlug: "heart-of-the-wildfire",
    slug: "heart-of-the-wildfire-opening-2",
    name: "Delayed Fire Elements (Minor Powers)",
    description:
      "Early fire access variant with lots of fast damage turns 1-2. Delays secondary element unlock.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 top; G3 Minor. Play 2 cards for fast damage. Use presence placement.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G3 bottom. Play fire-element cards. Continue aggressive placement.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "G2 bottom; G4. Play 2-3 cards. Build toward innate thresholds.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "Reclaim, gain Minor. Play 2-3 cards with fire elements.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "G3 bottom. Consider Major power. Continue fire-focused plays.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/wildfire-opening2/",
  },

  // ===========================================================================
  // Lure of the Deep Wilderness (2 openings)
  // ===========================================================================
  {
    spiritSlug: "lure-of-the-deep-wilderness",
    slug: "lure-of-the-deep-wilderness-opening-1",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Uses G3 for elements and energy while placing presence from bottom for card plays. High CP focus.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 bottom; G3 gain 4 Minors. Play Gift of the Untamed Wild and Perils of the Deepest Island. Unlock left+right innate level 2.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 bottom; G3 gain 3 Moon. Play Softly Beckon Ever Inward and Swallowed by the Wilderness.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim; G3 gain elements based on threats. Play 2 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 gain opposite of turn 3. Play 3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5+",
        instructions:
          "Alternate reclaim and growth. Increase card plays to 4-5. Select 0-cost Minors to preserve energy.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/lure-opening1/",
  },
  {
    spiritSlug: "lure-of-the-deep-wilderness",
    slug: "lure-of-the-deep-wilderness-opening-2",
    name: "Hybrid (Mixed Powers)",
    description:
      "Balances presence spread with element generation. Flexible path to Majors or continued Minors.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 bottom; G3 gain Minors. Play 2 unique powers for early innate.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; G3 gain elements. Play 2 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim; G2 bottom. Play 2-3 cards with Moon/Air elements.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 or G4. Play 3 cards. Build presence.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim; consider Major. Play cards to maintain innate thresholds.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/lure-opening2/",
  },

  // ===========================================================================
  // Many Minds Move as One (2 openings)
  // ===========================================================================
  {
    spiritSlug: "many-minds-move-as-one",
    slug: "many-minds-move-as-one-opening-1",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Leverages cheap Uniques and double presence placement to rush high card plays. Strong card advantage.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 (top+bottom). Play Ever-Multiplying Swarm and Guide the Way. 1 Air, 2 Animal elements.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 bottom. Play 3 cards. 3 Air, 1 Water, 3 Animal.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor (prioritize Animal, 0-cost). Play 3 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G3 bottom. Play 3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Minor. Pay 2 energy for additional Minor. Play 3 cards.",
      },
      {
        turn: 6,
        title: "Turn 6",
        instructions: "G2 bottom. Play 5 cards.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/mm-opening1/",
  },
  {
    spiritSlug: "many-minds-move-as-one",
    slug: "many-minds-move-as-one-opening-2",
    name: "Hybrid (Minor Powers)",
    description:
      "More balanced energy/card play approach. Good when you need flexibility in power costs.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 (top+bottom). Play 2 unique cards. Establish beast presence.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; G4. Play 2-3 cards with Animal elements.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain Minor; G2 bottom. Play 3 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 Minor. Play 3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Minor. Play 3-4 cards with consistent Animal.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/mm-opening2/",
  },

  // ===========================================================================
  // Shroud of Silent Mist (2 openings)
  // ===========================================================================
  {
    spiritSlug: "shroud-of-silent-mist",
    slug: "shroud-of-silent-mist-opening-1",
    name: "Early-Reclaim Bottom Track (Minor Powers)",
    description:
      "Strong opening turn with early reclaim. Creates damaged invaders for energy generation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 (top+bottom). Play The Fog Closes In and Forms Dart By. 2 Moon, 2 Air, 2 Water. Damage invaders in 2 lands.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Reclaim, gain Minor. Play cards for 1 Moon, 2 Air, 1 Water to unlock left innate. Damage invaders in 3 lands.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "G3 bottom; gain Minor. Play 2 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom. Play 2 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "Reclaim, gain Minor. Play 3 cards.",
      },
      {
        turn: 6,
        title: "Turn 6",
        instructions: "G2 bottom. Play 4 cards. Strong late-game scaling.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/mist-opening1/",
  },
  {
    spiritSlug: "shroud-of-silent-mist",
    slug: "shroud-of-silent-mist-opening-2",
    name: "Hybrid (Minor Powers)",
    description:
      "Balanced approach with more energy income. Good when facing higher-health invaders.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G2 (top+bottom). Play 2 unique powers to damage invaders.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 top; G4. Play 2 cards. Continue damaging for energy.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim, gain Minor; G2 bottom. Play 2 cards with Moon/Air/Water.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 bottom; G3 Minor. Play 2-3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Minor. Play 3 cards. Build toward late-game power.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/mist-opening2/",
  },

  // ===========================================================================
  // Downpour Drenches the World (1 opening)
  // ===========================================================================
  {
    spiritSlug: "downpour-drenches-the-world",
    slug: "downpour-drenches-the-world-opening-1",
    name: "Bottom Track Hybrid (Minor Powers)",
    description:
      "Unlocks 2 CP early then goes top track with frequent G2s. Strong water element generation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions: "G3 bottom; gain Minor. Play Gift of Abundance.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions: "G2 bottom. Play 2 cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "Reclaim, gain Minor. Play 2 cards.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "G2 top. Play 2 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions: "Reclaim, gain Minor. Play 2 cards.",
      },
      {
        turn: 6,
        title: "Turn 6",
        instructions:
          "G3 top; gain Minor. Play 2 cards. Continue building water elements.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/downpour-opening1/",
  },

  // ===========================================================================
  // Ember-Eyed Behemoth (2 openings)
  // ===========================================================================
  {
    spiritSlug: "ember-eyed-behemoth",
    slug: "ember-eyed-behemoth-opening-1",
    name: "Hybrid (Mixed Powers)",
    description:
      "Balanced fire and earth elements. Focuses on unlocking Smash, Stomp, and Flatten innate.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom; gain Minor. Play 2 cards with Fire+Earth to unlock Smash, Stomp, and Flatten. Surging Lahar + Grasping Roots or Blazing Intimidation + Grasping Roots.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 bottom. Play 2 cards. May unlock second innate level depending on draws.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "G4 (reclaim+empower Incarna). Play 2 cards. Use Incarna ability.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "G2 bottom to 3 CP. Play 2-3 cards based on element availability.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Reclaim, gain Major or Minor. Play 3 cards. Manage energy carefully.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/behemoth-opening1/",
  },
  {
    spiritSlug: "ember-eyed-behemoth",
    slug: "ember-eyed-behemoth-opening-2",
    name: "Full Bottom Track (Minor Powers)",
    description:
      "Maximizes card plays and presence spread. Good for consistent innate activation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "G3 bottom; gain Minor. Play 2 cards with Fire and Earth elements.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "G2 bottom; G4 (empower). Play 2 cards. Use Incarna for damage.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions: "G2 bottom. Play 3 cards with element focus.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions: "Reclaim, gain Minor; G4 (empower). Play 2-3 cards.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "G2 bottom. Play 3-4 cards. Continue Fire/Earth for innate.",
      },
    ],
    author: "Spirit Island Hub (latentoctopus)",
    sourceUrl: "https://latentoctopus.github.io/guide/behemoth-opening2/",
  },

  // ===========================================================================
  // BGG OPENINGS - Jeremy Lennert's Opening Threads (Base Game Spirits)
  // ===========================================================================

  // A Spread of Rampant Green (2 openings)
  {
    spiritSlug: "a-spread-of-rampant-green",
    slug: "a-spread-of-rampant-green-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's recommended opening for A Spread of Rampant Green, focusing on early presence placement and triggering innates.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place 2 presence (one from each track), +1 card play this turn. Cards: Gift of Proliferation (another spirit places 1 presence), Stem the Flow of Fresh Water (1 damage to a building; combo with innate Creepers Tear into Mortar to destroy a town). Watch out for range limits! Use Choke the Land with Green to stop invaders from building.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 1 presence from bottom track, gain a power card (minor), +3 energy. Cards: Overgrow in a Night (place 1 presence or 3 fear), Fields Choked with Growth (push 1 town or 3 Dahan). Overgrow places presence from top track, uncovering a plant element for All-Enveloping Green (Defend 2).",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim cards. If your minor power has plant+moon+water, you can activate level 2 of Creepers Tear into Mortar to destroy a town without needing a combo.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1965751/openings-a-spread-of-rampant-green",
  },
  {
    spiritSlug: "a-spread-of-rampant-green",
    slug: "a-spread-of-rampant-green-bgg-opening-2",
    name: "BGG Opening: Growth Spurt",
    description:
      "Alternative opening that causes 4 presence placement in a single turn, getting temporary extra card play on turn 2 instead of turn 1.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: +3 energy, gain a power (minor), place 1 presence (from top). Cards: Fields Choked with Growth (push 1 town or 3 Dahan). If you draw a minor with plant+moon (~50%), play Gift of Proliferation instead.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 2 presence (from bottom), +1 card play this turn. Cards: Overgrow in a Night, Gift of Proliferation, Stem the Flow of Fresh Water. You have 2 moon and 1 water for level 2 Creepers and level 1 All-Enveloping Green.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim, gain a power, place 1 presence (from bottom). This gets you to 3 permanent card plays while reclaiming.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1965751/openings-a-spread-of-rampant-green",
  },

  // Thunderspeaker (1 opening)
  {
    spiritSlug: "thunderspeaker",
    slug: "thunderspeaker-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's opening for Thunderspeaker, using careful Dahan positioning to set up devastating turns.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: +4 energy, place 1 presence (bottom track). Cards: Sudden Ambush (gather 1 Dahan, each Dahan destroys 1 explorer), Voice of Thunder (push 4 Dahan or 2 fear). Sudden Ambush kills an explorer before it can build. Use Gather the Warriors and Voice of Thunder to position Dahan in 3 locations for next turn.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 2 presence (top track). Cards: Words of Warning (defend 3, simultaneous damage), Manifestation of Power and Glory (presence×dahan damage). Words of Warning defends against town+explorer with Dahan present. Manifestation can deal 6 damage to destroy city+town+explorer. Lead the Furious Assault destroys an additional town.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim cards, gain 2 powers. Continue the momentum with your powerful innates and Dahan positioning.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1966212/openings-thunderspeaker",
  },

  // River Surges in Sunlight - BGG Opening (1 opening)
  {
    spiritSlug: "river-surges-in-sunlight",
    slug: "river-surges-in-sunlight-bgg-opening-1",
    name: "BGG Opening: Sacred Sites Focus",
    description:
      "Jeremy Lennert's detailed opening for River, focusing on sacred sites in wetlands and building to the powerful third tier of Massive Flooding.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place 2 presence (from bottom track). Cards: Wash Away (push up to 3 towns/explorers), River's Bounty (gather 2 Dahan, add 1 Dahan, +1 energy). Focus on expanding to wetlands for sacred sites. Use Wash Away on lands where invaders just explored with a starting town.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 2 presence (from bottom track), reclaim 1 (River's Bounty). Cards: Flash Floods (1 damage, +1 if coastal), Boon of Vigor (ally gains energy), River's Bounty again. This triggers the second level of Massive Flooding to destroy one town while pushing.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim, gain a power (minor), +1 energy. Cards: varies (e.g., River's Bounty, Flash Floods, Wash Away). Focus on water and sun elements for your minor power draws.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Place 1 presence (bottom track), gain a power (minor). Cards: all available (careful what you reclaim for turn 5). You now have 6 power cards total.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Growth: Reclaim, gain a power (minor), +1 energy. Play all 4 starting cards to activate the highest tier of Massive Flooding. Make sure you have enough energy by playing River's Bounty on turns 3 and 4.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1967085/openings-river-surges-in-sunlight",
  },

  // Lightning's Swift Strike (2 openings)
  {
    spiritSlug: "lightnings-swift-strike",
    slug: "lightnings-swift-strike-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's opening for Lightning's Swift Strike, balancing presence placement with triggering the powerful Thundering Destruction innate.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: 2 presence (from top). Cards: Shatter Homesteads (destroy town, 1 fear). Placing 2 presence establishes a second sacred site for range. Play only 1 card to save elements for triggering innate next turn. Use Swiftness of Lightning to make it fast if destroying a starting town creates safe lands.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +3 energy, place 1 presence (from bottom). Cards: Lightning's Boon (one ally makes 2 powers fast), Raging Storm (1 damage to all), Harbingers of the Lightning (push 2 Dahan; 1 fear if buildings). This triggers Thundering Destruction to destroy another town. Combo Raging Storm with allies.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim, gain a power (minor), +1 energy. You have high enough energy to play Shatter Homesteads + Lightning's Boon + Harbingers and trigger your innate again.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1969985/openings-lightnings-swift-strike",
  },
  {
    spiritSlug: "lightnings-swift-strike",
    slug: "lightnings-swift-strike-bgg-opening-2",
    name: "BGG Opening: Aggressive",
    description:
      "Community alternative opening that pushes for a strong early game with innate triggers from turn 1.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: 1 Presence (from bottom), 3 Energy (4 total). Cards: Shatter Homesteads, Lightning's Boon (for elements in solo or to speed an ally), Harbingers of the Lightning. Triggers innate level 1, allowing you to destroy 2 towns at range 1-2 and move Dahan. Can net 4 fear total.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Reclaim, Gain Minor Power, 1 Energy (3 total). Cards: If towns are not under control, repeat turn 1. Otherwise varies depending on the minor power gained.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: 2 Presence (from top) or 1 Presence (from bottom), 3 Energy. Cards: Everything not played turn 2, possibly except Raging Storm depending on energy/town status.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim, Gain Minor Power, 1 Energy. At this stage, you can play many powers every turn. Focus on reliably triggering Thundering Destruction.",
      },
    ],
    author: "BGG Community",
    sourceUrl:
      "https://boardgamegeek.com/thread/1969985/openings-lightnings-swift-strike",
  },

  // Ocean's Hungry Grasp (1 opening)
  {
    spiritSlug: "oceans-hungry-grasp",
    slug: "oceans-hungry-grasp-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's opening for Ocean's Hungry Grasp, spreading presence to multiple boards quickly and drowning invaders.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Setup: Place presence in a coastal land with a town for Ocean Breaks the Shore targeting. Growth: 2 presence in oceans (from bottom track), +1 energy. Cards: Call of the Deeps (gather 1 explorer, or 2 into ocean), Tidal Boon (ally +2 energy and pushes 1 town + 2 Dahan). This triggers both innates at level 1.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Push presence from oceans, place 1 presence (from bottom), gain a power (minor). Cards: Grasping Tide (Defend 4, 2 fear), Swallow the Land-Dwellers (drown 1 explorer, 1 town, 1 Dahan), your new minor. In 4-player, push presence to get onto the fourth board. Look for minors with water+stone or air.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim. When reclaiming, you MUST gather 1 presence into each ocean. Plan carefully for card targeting. Try to alternate pushing presence on even turns and reclaiming on odd turns.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1970506/openings-oceans-hungry-grasp",
  },

  // Bringer of Dreams and Nightmares (2 openings)
  {
    spiritSlug: "bringer-of-dreams-and-nightmares",
    slug: "bringer-of-dreams-and-nightmares-bgg-opening-1",
    name: "BGG Opening: Major Power Focus",
    description:
      "Jeremy Lennert's opening for Bringer, focusing on getting a major power early due to good energy generation and the reclaim-one growth option.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place 1 presence (from top), gain a power (minor). Cards: Dreams of the Dahan (gather Dahan or fear), Predatory Nightmares (2 nightmare damage, push Dahan). The air element from your presence track triggers Spirits May Yet Dream (reveal a fear card) and level 2 Night Terrors (+2 fear). Use Predatory Nightmares to push a town that's about to ravage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +2 energy, place 1 presence (from top) in land with invaders/Dahan. Cards: Dread Apparitions (fear -> defense, 1 fear), Call on Midnight's Dreams (fear or a major power). Order matters: use Dread Apparitions, then Night Terrors for 2 fear (defense 3), then Spirits May Yet Dream, then Call on Midnight's Dreams for a major power. Forget Call to use the major immediately if it's good.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "If you got a good major, use Reclaim One to cast it again alongside your turn 1 minor. If both cards have moon elements, placing presence from top track gives you the third moon for the second part of Spirits May Yet Dream.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1971193/openings-bringer-of-dreams-and-nightmares",
  },
  {
    spiritSlug: "bringer-of-dreams-and-nightmares",
    slug: "bringer-of-dreams-and-nightmares-bgg-opening-2",
    name: "BGG Opening: Delayed Major",
    description:
      "Community alternative that delays the major power by one turn but sets up a devastating turn 2 with better board control.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place Presence (1 away, top track to uncover Air), Gain Minor Power. Cards: Predatory Nightmares (2 Damage + Dahan Push), Dreams of the Dahan (Gather Dahan or Fear per Dahan). Gather 3 Dahan into a land you'll defend turn 2. Use Predatory Nightmares to 'destroy' a town that was explored during setup. Activates level 2 Night Terrors (2 Fear) and Spirits May Yet Dream.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place Presence (in Dahan land you intend to defend) + 2 Energy. Cards: Dread Apparitions (1 Fear, defend by Fear), Call on Midnight's Dream (Gain Major or 2 Fear). Play Call for the fear. With Night Terrors (2 fear) + Dread Apparitions, you're defending 5. With 3 Dahan, you can wipe out Explorer + Town + City.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim one, use 0-range presence placement to create a sacred site, and get your major power via Call on Midnight's Dreams. You'll have at least 4 Energy before Dahan boost, so you can play almost any major you draw.",
      },
    ],
    author: "BGG Community",
    sourceUrl:
      "https://boardgamegeek.com/thread/1971193/openings-bringer-of-dreams-and-nightmares",
  },

  // Shadows Flicker like Flame (1 opening)
  {
    spiritSlug: "shadows-flicker-like-flame",
    slug: "shadows-flicker-like-flame-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's opening for Shadows, squeezing in presence placement early to take advantage of the excellent presence tracks.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: +3 energy, place 1 presence (from bottom). Cards: Favors Called Due (gather 4 Dahan, 3 fear if they outnumber invaders), Mantle of Dread (2 fear, target spirit pushes 1 explorer and 1 town). Two plays trigger Darkness Swallows the Unwary to stop a build chain. Have an ally use Mantle of Dread to prevent blight.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 1 presence (from top), gain a power (minor). Cards: Concealing Shadows (1 fear, Dahan immune to Ravage), Crops Wither and Fade (2 fear, downgrade a building). If you draw a moon+fire minor, substitute it for Crops. Use Shadows of the Dahan (spend 1 energy) to target Concealing Shadows from any distance on the land where you gathered Dahan.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Place 1 presence (from top), gain a power (minor). Cards: 2 minors (or whatever is left). If you prioritize elements, ~65% chance of triggering your innate. This is your weak turn, but you now earn 3 energy/turn passively.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim all, gain a power. You could have up to 6 energy, making a major power reasonable. You can play 3 cards on both turn 5 and turn 6 without needing to reclaim until turn 7.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1971694/openings-shadows-flicker-like-flame",
  },

  // Vital Strength of the Earth (2 openings)
  {
    spiritSlug: "vital-strength-of-the-earth",
    slug: "vital-strength-of-the-earth-bgg-opening-1",
    name: "BGG Opening: Opportunistic",
    description:
      "Jeremy Lennert's strategy guide for Vital Strength, emphasizing opportunistic play rather than a fixed opening. First 2 presence from bottom track for card plays.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: If invaders explored jungle during setup, learn a power and place presence at range 0 to create a sacred site (free defense for ravage). Otherwise, take +2 energy and place presence where invaders just explored. Cards: Draw of the Fruitful Earth (1 cost), or a minor if you learned one.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Create a sacred site in the explored land if you didn't turn 1. If you played a minor turn 1, you probably need energy to afford 2 cards. Cards: Consider Guard the Healing Land if it removes starting blight AND prevents new blight. Otherwise trigger your innate with Rituals of Destruction + Draw of the Fruitful Earth.",
      },
      {
        turn: 3,
        title: "Turn 3 onwards",
        instructions:
          "Use Draw of the Fruitful Earth to gather Dahan for defense, AND gather lone explorers from adjacent lands to stop multiple builds at once. Your 3-cost cards (Guard, Year of Perfect Stillness, Rituals) are powerful but situational - only use when conditions are favorable.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1974592/openings-vital-strength-of-the-earth",
  },
  {
    spiritSlug: "vital-strength-of-the-earth",
    slug: "vital-strength-of-the-earth-bgg-opening-2",
    name: "BGG Opening: Plays Track Focus",
    description:
      "Community opening that prioritizes card plays early, delaying majors until turn 5 when you have 6 energy generation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Growth 3 (presence from play track in explored land). Cards: Draw of the Fruitful Earth. Left with 3 energy.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Growth 2 (presence from play track in same land, pick 0-1 cost minor). Cards: Minor + one of the 3-cost cards. Left with 1 energy.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "If explored in jungle: Growth 2 (presence from energy track in jungle), pick 0-1 cost minor. Cards: Minor + one of the 3-cost cards. Otherwise might reclaim and play same 2 cards. Left with 0 energy.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Pick from energy track, generate 4 energy. Cards: 3-cost card + minor. Left with 0 energy.",
      },
      {
        turn: 5,
        title: "Turn 5",
        instructions:
          "Growth: Pick from energy track, generate 6 energy. This is when you start looking for majors. Focus on setting up Dahan fights in your sacred sites rather than rushing majors.",
      },
    ],
    author: "BGG Community",
    sourceUrl:
      "https://boardgamegeek.com/thread/1974592/openings-vital-strength-of-the-earth",
  },

  // Sharp Fangs Behind the Leaves - BGG Openings (2 openings)
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-bgg-opening-1",
    name: "BGG Opening: Bottom Track Focus",
    description:
      "Jeremy Lennert's opening for Sharp Fangs, focusing on the bottom presence track for card plays and reclaim-one options.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Setup: Put second presence where you want to push with Terrifying Chase, preferably non-Jungle. Growth: +1 energy, gain a power (minor); Place 1 presence (from bottom). Cards: Prey on the Builders (gather 1 beast; no build), Terrifying Chase (push 2 explorers/towns/dahan, +2 per beast). Learn a power with animal element (~87% chance). Use Ranging Hunt to reposition presence for targeting.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +3 energy; Place 1 presence (from bottom). Cards: Too Near the Jungle (destroy explorer, 1 fear), Teeth Gleam from Darkness (add beast + 1 fear, or 3 fear), minor with animal. This gives 3 animal + 2 plant for full Ranging Hunt. Place presence in new jungle for Too Near the Jungle targeting.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Pay 1 energy, reclaim all, gain a power (minor); Place 1 presence. Cards: Too Near the Jungle, Teeth Gleam from Darkness, any animal element. Choose minor so your two minors combined have at least 1 animal and 1 plant. Place presence from bottom track for 4 card plays on turn 4.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1978097/openings-sharp-fangs-behind-the-leaves",
  },
  {
    spiritSlug: "sharp-fangs-behind-the-leaves",
    slug: "sharp-fangs-behind-the-leaves-bgg-opening-2",
    name: "BGG Opening: Top Track (Ranging Hunt Every Turn)",
    description:
      "Alternative opening that triggers Ranging Hunt every turn including turn 1, by drawing a plant+animal minor early.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Only use this if you draw a minor with both plant AND animal. Growth: +1 energy, gain a power (minor); Place 1 presence (from TOP). Cards: Too Near the Jungle, Teeth Gleam from Darkness. Presence uncovers animal element, so with animal+plant on both cards you have enough for Ranging Hunt damage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +3 energy; Place 1 presence (from TOP). Cards: Plant+animal minor, any other remaining power (probably Prey on the Builders). You now have animal+plant showing on your presence track, so you just need 2 animal and 1 plant from cards.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim. Continue triggering Ranging Hunt every turn. This opening leaves you with fewer card plays for a long time but triggers Ranging Hunt consistently.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1978097/openings-sharp-fangs-behind-the-leaves",
  },

  // Keeper of the Forbidden Wilds (1 opening)
  {
    spiritSlug: "keeper-of-the-forbidden-wilds",
    slug: "keeper-of-the-forbidden-wilds-bgg-opening-1",
    name: "BGG Opening: Standard",
    description:
      "Jeremy Lennert's opening for Keeper, using the expensive presence placement growth to quickly ramp energy generation.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Gain a power (minor); +1 energy, place a presence (only legal spot is starting land). Cards: Boon of Growing Power (target gains a power and 1 energy). Get 2 sun + 1 plant while saving 2 energy. If you draft a 0-cost minor with sun (~45%), place presence from bottom and play both. Otherwise place from top (sun element) and play just Boon. Spreading Wilds clears a land with explorer and places a wilds.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +1 energy, place a presence; Pay 3 energy, place a presence, gain a power (minor). Uncover 2 spaces on top track and 1 on bottom for 4 energy income and 2 card plays. Cards: varies. Again get 2 sun + 1 plant while saving 2 energy. The extra presence pays for itself almost instantly with +2 energy income.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: +1 energy, place presence (from bottom); Pay 3 energy, place presence (from bottom), gain minor. Cards: Towering Wrath (2 damage per sacred site, 2 fear, destroy Dahan), a minor with plant+fire, something with plant (e.g., Regrow from Roots). These elements trigger TWO levels of Punish Those Who Trespass for 4-5 damage at range 0.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim. Play cards similar to turn 3. Keeper falls behind early but catches up in stage 2 when wilds block explores.",
      },
    ],
    author: "Jeremy Lennert (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/1978655/openings-keeper-of-the-forbidden-wilds",
  },

  // ===========================================================================
  // Spirit Island Wiki - Phantaskippy Guides (9 openings)
  // ===========================================================================

  // A Spread of Rampant Green - Phantaskippy
  {
    spiritSlug: "a-spread-of-rampant-green",
    slug: "a-spread-of-rampant-green-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Multi-tasking",
    description:
      "Phantaskippy's approach emphasizing 'juggling' invaders across 3+ lands per turn rather than concentrating powers on single territories.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Second option (place 2 presence total, including 'Always' section). Cards: Gift of Proliferation, Stem the Flow of Fresh Water. Activate Tier 1 Creepers to destroy the back town. Prioritize unlocking your 1 energy space.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Third option (gain a card and 3 energy), take play track presence for 2 card plays. Cards: Overgrow in a Night, Fields Choked with Growth. Resolve Overgrow first to uncover the free plant element. Activate Tier 1 All-Enveloping. Aim for 6 presence on board before invaders ravage.",
      },
      {
        turn: 3,
        title: "Turn 3+",
        instructions:
          "Identify 1-4 'maintenance lands' that you'll allow to build up but prevent from ravaging through Choke the Land. Avoid wasting two powers on one land. Stack presence to 3 in built-up lands to ensure sacred sites remain available for slow powers.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=A_Spread_of_Rampant_Green/Phantaskippy%27s_Guide",
  },

  // Bringer of Dreams and Nightmares - Phantaskippy
  {
    spiritSlug: "bringer-of-dreams-and-nightmares",
    slug: "bringer-of-dreams-and-nightmares-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Moon Unlock",
    description:
      "Phantaskippy's approach focusing on unlocking the moon element on the energy track by turn 3-4, then deciding between major power flexibility or 3-card routes.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Start with 2 plays and 2 energy. Use cards to get a flipped fear card and trigger tier 2 Night Terrors. Take growth option 3 to gain cards and spread out.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Continue with growth option 3 to gain cards and spread out. Use your cards to trigger Night Terrors and Spirits May Yet Dream innates.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Goal: Unlock moon element on energy track (turn 4 is fine if needed). If no element luck, consider reclaiming one card to build a second sacred site. After moon unlock, choose 'any element path' for major power flexibility or '3 cards route' for longer games.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Bringer_of_Dreams_and_Nightmares/Phantaskippy%27s_Guide",
  },

  // Ocean's Hungry Grasp - Phantaskippy
  {
    spiritSlug: "oceans-hungry-grasp",
    slug: "oceans-hungry-grasp-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Coastal Dominance",
    description:
      "Phantaskippy's approach focusing on coordinating with allies to push explorers to coasts and accumulating drowned invader HP for energy conversion.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Second option to gain 1 energy and spread influence. Cards: Call of the Deeps. Coordinate with allies - if they can push an explorer to the coast, you take out 2 explorers on that coast, preventing builds and generating extra HP for energy.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Third option to position presence in newly explored lands. Cards: Tidal Boon, Swallow the Land Dwellers. This gives you 6 drowned invader HP regardless of ally actions. Activate tier 2 Ocean Breaks the Shore (2 fear, City off board, 3 invader HP energy).",
      },
      {
        turn: 3,
        title: "Turn 3+",
        instructions:
          "Prioritize tier 2 Ocean Breaks the Shore over Pound Ships to Splinters due to superior returns. Focus on gathering elements to fuel your innate rather than rushing card plays.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Ocean%27s_Hungry_Grasp/Phantaskippy%27s_Guide",
  },

  // Shadows Flicker Like Flame - Phantaskippy
  {
    spiritSlug: "shadows-flicker-like-flame",
    slug: "shadows-flicker-like-flame-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Flexible Paths",
    description:
      "Phantaskippy presents three distinct opening approaches: Balanced Growth, Aggressive Card Play Rush, and Major Power Focus.",
    turns: [
      {
        turn: 1,
        title: "Path 1: Balanced",
        instructions:
          "Begin playing 2 cards early, then select growth option 3 to secure second card play. By turn 4, achieve 2 card plays, 6 card hand, and 3 energy per turn for stable Dahan support or major power acquisition.",
      },
      {
        turn: 2,
        title: "Path 2: Aggressive",
        instructions:
          "Sacrifice early card plays to accelerate power gain. Take growth option 2 for four consecutive turns, removing presence alternately from energy and play tracks. By turn 5, achieve 9 cards, 3 card plays, and 3 energy for faster Tier 2 Darkness Swallows.",
      },
      {
        turn: 3,
        title: "Path 3: Major Focus",
        instructions:
          "Maintain just 1 card play for two turns while building energy through presence placement. Enables earlier major power acquisition (6-7 energy by turn 3). Use Shadow of the Dahan to target lands with invaders and Dahan anywhere by spending 1 energy.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Shadows_Flicker_Like_Flame/Phantaskippy%27s_Guide",
  },

  // Vital Strength of the Earth - Phantaskippy
  {
    spiritSlug: "vital-strength-of-the-earth",
    slug: "vital-strength-of-the-earth-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Major Power Rush",
    description:
      "Phantaskippy's approach treating Earth as an offensive major power house rather than a minor power defender. Prioritizes replacing expensive starting cards with majors.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Gain 2 energy from energy track (starting with 5 total energy). Focus on building energy reserves for major power acquisition.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Acquire a card and establish a second sacred site. Begin looking for major powers that synergize with your defensive capabilities.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Gain second card play plus 2 bonus energy (totaling 13 energy). Target presence track: 3 energy -> 2 card play -> 6 energy -> 3 card play (by turn 7). Replace expensive starting cards with major powers. Maintain small hand size to enable frequent reclaiming.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Vital_Strength_of_the_Earth/Phantaskippy%27s_Guide",
  },

  // Keeper of the Forbidden Wilds - Phantaskippy
  {
    spiritSlug: "keeper-of-the-forbidden-wilds",
    slug: "keeper-of-the-forbidden-wilds-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Growth 4 Focus",
    description:
      "Phantaskippy's approach centered on Growth option 4 (place 2 presence, gain power card) as the cornerstone of successful play. Critical rule: end every turn with at least 2 energy.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Options 2 and 3. Unlock sun icon on energy track. Cards: Boon of Growing Power. End with 2 energy. This constraint takes priority over almost all other actions.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Options 3 and 4 to reach 4 energy and 2 card plays. This is the most challenging turn requiring careful power card selection. Maintain the 2 energy buffer.",
      },
      {
        turn: 3,
        title: "Turns 3-5",
        instructions:
          "Focus on unlocking 5 energy and plant icon through dual power track advancement. Gradually unlock third card play, potentially reclaiming when necessary. Element priority: fire (highest), sun, plant, major thresholds, air (lowest).",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Keeper_of_the_Forbidden_Wilds/Phantaskippy%27s_Guide",
  },

  // Lightning's Swift Strike - Phantaskippy
  {
    spiritSlug: "lightnings-swift-strike",
    slug: "lightnings-swift-strike-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Three Paths",
    description:
      "Phantaskippy presents three approaches: Destroyer of Towns (frequent reclaim), Stable Card Play (beginner-friendly), and Riding the Storm (hybrid). Power selection ignores card effects in favor of fire/air elements.",
    turns: [
      {
        turn: 1,
        title: "Path 1: Destroyer",
        instructions:
          "Focus on destroying two towns nearly every turn through frequent reclaiming. Avoid playing Raging Storm. Prioritize reclaiming cards with fire elements and zero costs. Sacrifices growth speed for early-game dominance.",
      },
      {
        turn: 2,
        title: "Path 2: Stable",
        instructions:
          "Emphasize consistent hand management and energy generation. Beginner-friendly approach that prioritizes emptying hand before reclaiming. Lower overall power output but familiar playstyle. Innate activation delayed until turn 5.",
      },
      {
        turn: 3,
        title: "Path 3: Storm",
        instructions:
          "Hybrid approach alternating weak and explosive turns. Generates maximum destruction and secures numerous sacred sites. Power priority: 0-cost fire/air cards, then 0-cost fire cards, then 1-cost fire/air. Maintain range-2 coverage with 3 sacred sites.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike/Phantaskippy%27s_Guide",
  },

  // River Surges in Sunlight - Phantaskippy
  {
    spiritSlug: "river-surges-in-sunlight",
    slug: "river-surges-in-sunlight-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Reclaim 1 Rush",
    description:
      "Phantaskippy's approach prioritizing early Reclaim 1 space unlock for superior card play efficiency and tier 2 Massive Flooding activation nearly every turn.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place two presence from different tracks to secure two card plays and two energy. Cards: Flash Flood (enables tier-one Massive Flooding). Prioritize establishing presence in wetlands on neighboring boards.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Take a card and place additional presence, prioritizing wetlands on neighboring boards. Continue building toward Reclaim 1 space.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Rather than reclaiming, place two presence to unlock the Reclaim 1 space. This counterintuitive move provides major advantage - you'll play more cards, replay best cards more, and reclaim all less than other spirits. Enables tier 2 Flooding almost every turn.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=River_Surges_in_Sunlight/Phantaskippy%27s_Guide",
  },

  // Thunderspeaker - Phantaskippy
  {
    spiritSlug: "thunderspeaker",
    slug: "thunderspeaker-wiki-phantaskippy",
    name: "Wiki Opening: Phantaskippy's Dahan Commander",
    description:
      "Phantaskippy's approach emphasizing aggressive Dahan deployment with two paths: Conservative (accumulate energy) or Aggressive (sacrifice energy for early presence clearing).",
    turns: [
      {
        turn: 1,
        title: "Conservative Path",
        instructions:
          "Accumulate energy through growth tracks to support card plays. Starting hand costs 6 energy but has limited early generation. By turn 5, reach 3 card plays plus reclaim capability.",
      },
      {
        turn: 2,
        title: "Aggressive Path",
        instructions:
          "Sacrifice early energy to clear presence quickly. Deploy Dahan immediately with starting innates to eliminate explorers and win ravages. Reach full strength by turn 5.",
      },
      {
        turn: 3,
        title: "Power Selection",
        instructions:
          "Prioritize elements enabling Gather the Warriors and Lead the Furious Assault innates. Don't obsess over threshold completion every turn. Seek push, gather, defense, and Dahan damage cards. Good majors: Instruments of their own Ruin, Vigor of the Breaking Dawn, Powerstorm, Wrap in Wings of Sunlight.",
      },
    ],
    author: "Phantaskippy (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Thunderspeaker/Phantaskippy%27s_Guide",
  },

  // ===========================================================================
  // BoardGameGeek Nature Incarnate Threads (4 openings)
  // ===========================================================================

  // Breath of Darkness Down Your Spine - BGG Community
  {
    spiritSlug: "breath-of-darkness-down-your-spine",
    slug: "breath-of-darkness-bgg-bottom-track",
    name: "BGG Opening: Bottom Track Rush",
    description:
      "Community opening from BGG focusing on getting to 3 plays quickly via the bottom presence track, enabling powerful fear generation through maxed innates.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: G2 (bottom track) - gain a card and place presence from bottom. Play your drafted card to stop a build if possible. Prioritize getting your Incarna to useful positions.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: G2 (bottom track again). Now at 2 card plays. Start hitting your innate thresholds - aim for tier 2 of Leave a Trail of Deathly Silence and tier 1-2 of Swallowed by the Endless Dark.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: G2 (bottom track). Now at 3 card plays with the moon element. This triggers the powerful combination of 4 moon + 3 air + 2 beast (level 3 left innate, all levels of right innate). Can generate 10+ fear per turn from here.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim. Continue spamming your innates at maximum levels. The Reclaim 1 space on bottom track is the goal - once there, the spirit becomes unstoppable with consistent high fear output.",
      },
    ],
    author: "BGG Community (DonKidic, Aminar)",
    sourceUrl:
      "https://boardgamegeek.com/thread/3140699/breath-of-darkness-down-your-spine-analysis-openin",
  },
  {
    spiritSlug: "breath-of-darkness-down-your-spine",
    slug: "breath-of-darkness-bgg-hybrid",
    name: "BGG Opening: Top-to-Bottom Hybrid",
    description:
      "Hybrid approach that grabs energy and moon from top track before switching to bottom track for plays. Balances early stability with mid-game power.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: G2 (top track) - gain a card and place presence from top. Get the 2 energy space. Your Uniques are expensive (total 3 cost), so energy helps.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: G2 (top track) - get the moon element. The moon gives strictly more than the Move-1 (as an extra level for Leave A Trail gives more than just a move).",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: G2 (bottom track) - start working toward 3 card plays. With your accumulated cards from G2 choices, you can delay your first reclaim significantly.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Continue bottom track or G3 if you need energy boost. Goal is reaching Empower or 3-Plays before first reclaim. If you got good 0-cost minors, you can even reach Empower first.",
      },
    ],
    author: "BGG Community (Schattenn, Steve Haas)",
    sourceUrl:
      "https://boardgamegeek.com/thread/3140699/breath-of-darkness-down-your-spine-analysis-openin",
  },
  {
    spiritSlug: "breath-of-darkness-down-your-spine",
    slug: "breath-of-darkness-bgg-threshold-rush",
    name: "BGG Opening: Turn 2 Threshold",
    description:
      "Aggressive opening that skips turn 1 plays to threshold Swallowed by the Endless Dark on turn 2, capable of clearing double-city lands early.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: G2 (bottom track). Either play nothing or play your drafted card and the strife card if excellent. Saving cards sets up massive turn 2.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: G2 or G3 (bottom track). Threshold Swallowed by the Endless Dark and hit your innates. This clears out a major land, even double-city lands like Scotland 6's land #2, with good chances of creating a pocket.",
      },
      {
        turn: 3,
        title: "Turn 3+",
        instructions:
          "Continue down bottom track. Main challenge is minimizing reclaim impact. Underplay when needed, take cheap minors, and work toward the Reclaim 1 spot. Works especially well vs Scotland to eliminate coastal city adjacency builds.",
      },
    ],
    author: "BGG Community (Ian Goth)",
    sourceUrl:
      "https://boardgamegeek.com/thread/3140699/breath-of-darkness-down-your-spine-analysis-openin",
  },
  {
    spiritSlug: "breath-of-darkness-down-your-spine",
    slug: "breath-of-darkness-bgg-adversary-adaptive",
    name: "BGG Opening: Adversary-Adaptive",
    description:
      "Flexible approach that adapts presence track choice to the adversary type: top track for 'tall' adversaries like England, bottom track for 'wide' adversaries.",
    turns: [
      {
        turn: 1,
        title: "Tall Adversaries (England)",
        instructions:
          "Pure top track for adversaries that build up lands heavily. Majors are easy to get and the empowered Incarna handles built-up lands well. Spam G2 to potentially get empowered Incarna before first reclaim.",
      },
      {
        turn: 2,
        title: "Wide Adversaries",
        instructions:
          "Pure bottom track for adversaries that start strong or spread wide. Fastest way to trigger level 2-3 of left innate, setting up strong early position. The fast presence move is great for the Incarna.",
      },
      {
        turn: 3,
        title: "Moderate Adversaries",
        instructions:
          "Hybrid approach: G2 top track first, then switch to bottom. Gives flexibility in card options with access to 2 moons on tracks, making air and animal easier to get. Can max innates as fast as pure bottom while adding major plays.",
      },
    ],
    author: "BGG Community (T. Ips)",
    sourceUrl:
      "https://boardgamegeek.com/thread/3140699/breath-of-darkness-down-your-spine-analysis-openin",
  },

  // ===========================================================================
  // BGG OPENINGS - Jonah Yonker (jyonker13) Jagged Earth Threads
  // ===========================================================================

  // Fractured Days Split the Sky (1 opening)
  {
    spiritSlug: "fractured-days-split-the-sky",
    slug: "fractured-days-split-the-sky-bgg-je-opening-1",
    name: "BGG JE Opening: Flexible Time Build",
    description:
      "A flexible approach leveraging Days That Never Were and Slip the Flow innate, building Time for various Turn 3 options.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Gain Sun, move presence, gain a Minor That Never Was, gain 3 Time (2 from Energy, 1 from Plays). Card Plays: Minor. Choose a Minor for effect, not Elements, even if that effect is just pushing an Explorer to prevent a Build or generating some marginal amount of Fear. Your presence movement should set up for using your Minor optimally, or reposition your presence in a land where you can make a sacred site next turn for Absolute Stasis.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Gain Moon, gain Minor Power, add presence from Energy, gain +2 Card Plays and 1 Time (from Plays). Card Plays: Absolute Stasis (Cost: 1 Time, target land does not exist), Blur the Arc (remove Blight if no Dahan/Invaders, if Invaders Build + Ravage, if Dahan add 1 and Push up to 2), Past Returns (for Elements). Pay 1 Time for Absolute Stasis to prevent a problematic Build or bad Ravage. Use Blur the Arc to get Dahan into defended lands. You can use all three levels of Slip the Flow - consider targeting yourself to use Visions of a Shifting Future fast, then Reclaim a played card based on Elements of your gained Minor.",
      },
      {
        turn: 3,
        title: "Turn 3 (Multiple Options)",
        instructions:
          "Choose based on your Turn 2 decisions: 1) Want a Major? Choose Growth 3, gain a Major That Never Was. 2) Want to let someone Reclaim? If you Reclaimed Past Returns, choose Growth 3, gain 3 Time, play any Moon card + Past Returns to hit tier 2 of Slip the Flow. 3) Reclaimed Blur the Arc? Choose Growth 2 or 3 depending on which tier of Slip the Flow your allies benefit from most. 4) Want tier 3 of Slip the Flow? If you Reclaimed Absolute Stasis, choose Growth 3 and play Sun/Air + Stasis. All options leave at least one more turn before Reclaim All.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2486927/openings-fractured-days-split-the-sky",
  },

  // Shroud of Silent Mist (1 opening)
  {
    spiritSlug: "shroud-of-silent-mist",
    slug: "shroud-of-silent-mist-bgg-je-opening-1",
    name: "BGG JE Opening: Damaged Invaders Engine",
    description:
      "Energy-focused opening ensuring innates stay active regardless of draft, establishing 3 lands with Damaged Invaders for Slow and Silent Death income.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add 2 presence from Energy. Card Plays: The Fog Closes In (deal 1 damage to different Invader per presence in adjacent land, Push 2 Dahan). The Water from your track allows first level of Lost in the Swirling Haze to save a Dahan or group Dahan for favorable trade. Ideally Fog Closes In damages 1 Town/1 City or 1 Town/1 Explorer. Use presence movement from Shift and Flow to deposit presence for Flowing and Silent Forms next turn.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add 1 presence from Energy, 1 presence from Plays. Card Plays: Flowing and Silent Forms Dart By (2 Fear if Invaders, presence protection, gather 1-2 presence of another Spirit), Dissolving Vapors (1 Fear, 1 Damage to each Invader, 1 Damage to each Dahan). Use Flowing and Silent Forms to distribute presence to farther reaches or pull another Spirit onto your board. You hit tier 1 of Suffocating Shroud and tier 2 of Swirling Haze. Between Dissolving Vapors and Suffocating Shroud, try to achieve '3 lands of yours with damaged Invaders' for extra Energy.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Gain a Minor Power, add a presence from Energy. Card Plays: Unnerving Pall, Minor Power. Elements from Energy track let you hit tier 1 of Suffocating Shroud regardless of Minor gained, so focus on gaining beneficial effects (without Fire is preferable, Water nets tier 1 of Swirling Haze). Use Unnerving Pall to protect Dahan or hold down a land your team has been filling.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim All, gain a Minor Power. Card Plays: Varies. Even if both Minors gained are weak, you can play Unnerving Pall + The Fog Closes In to hit tier 2 of Suffocating Shroud. That's 2 Powers that do damage for adjacent presence, so you can replace damaged land easily. This opening provides Elements ensuring innates stay active and surplus Energy allows choosing a cheap/mid-costed Major sooner if necessary.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2488254/openings-shroud-of-silent-mist",
  },

  // Finder of Paths Unseen (1 opening)
  {
    spiritSlug: "finder-of-paths-unseen",
    slug: "finder-of-paths-unseen-bgg-je-opening-1",
    name: "BGG JE Opening: Consistency Focus",
    description:
      "Consistency-focused opening aimed at reducing Finder's barrier to entry, leaving room for player choice after first Reclaim All.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add a presence (from Top), gain a Minor. Card Plays: A Circuitous and Wending Journey (push up to half of Invaders from target land, same for Dahan/presence/Beasts). Add presence to an inner land building a City - Wending Journey can push Town/City into your starting lands. Gain a Minor with Air (Air + Water even better). Use presence push from Wending Journey to position for targeting innates next turn.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add a presence (from Top), +1 Card Play. Card Plays: Offer Passage Between Worlds (move up to 4 Dahan between target/your lands OR 2 fewer Dahan destroyed), Traveler's Boon (target Spirit moves up to 3 presence to your land, bringing 1 Invader/Dahan/Beast). With Sun and Water from top track plus Moon/Air on cards, use first 2 tiers of Lay Paths and tier 1 of Close the Ways. Use Traveler's Boon to help slower Spirit prevent a problematic Build or access difficult land types.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Add a presence (from Bottom), +1 Card Play. Card Plays: Ways of Shore and Heartland (push up to 2 pieces from Coastal/Inland to another Coastal/Inland), Aid From Spirit Speakers (for each Dahan, push 1 piece to land 2 away with Dahan). Uncovering Earth plus these 2 cards hits tier 2 of Lay Paths and first 2 tiers of Close the Ways. Going into first Stage II Explore, try to Isolate empty Coastal lands (covers more outcomes) or inner lands whose Isolation covers multiple Explores.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Options vary based on Turn 1. Card Plays: Paths Tied By Nature (move up to 2 pieces to land within 2 of same terrain), Minor. If your first Minor lacked Air, add presence from Bottom and gain a Minor. If you have Air, either gain another Minor (planning to gain again next turn) or add presence anywhere and take 2 Energy. With an Air card, hit tier 2 of Lay Paths and tier 2 of Close the Ways. Most likely Reclaiming next turn - can grab Minor or Major based on direction you want to go.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2493091/openings-finder-of-paths-unseen",
  },

  // Downpour Drenches the World (1 opening - BGG JE)
  {
    spiritSlug: "downpour-drenches-the-world",
    slug: "downpour-drenches-the-world-bgg-je-opening-1",
    name: "BGG JE Opening: Pour Down Power Engine",
    description:
      "Leveraging Pour Down Power Across the Land for Energy management and card repetition, centralizing presence for Rain and Mud defense scaling.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add a presence (from Energy), gain a Minor Power, gain +1 Energy. Card Plays: Gift of Abundance (target Spirit gains 2 Energy or Repeats a card by paying its cost). Use long-range presence placement to reach a distant Wetland. Use Pour Down Power to gain 1 Energy. More often your Gift grants Energy, but there are tons of starters worth doubling up. If unsure who to give Repeat to, look for Gift/Boon cards or strong Pushes.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add 2 presence (both from Plays), discard 2 cards, gain 2 Waters. Card Plays: Choose based on situation - Dark Skies (hits tier 1 Rain and Mud, good with Wetlands setup), Unbearable Deluge (costs nothing to Repeat, gives defend/push Dahan/Isolate - hits tiers 1-2 of Rain and Mud), Foundations Sink (can decimate Towns if allies stack them - hits tier 2 Rain and Mud), or your new Minor (with 4 Waters you can repeat it twice even without Water element). Keep one card for next turn.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Add a presence (from Plays), gain a Minor Power, gain +1 Energy. Card Plays: Varies based on saved card. Whether you Repeat anything or gain Energy depends on which card you saved. If you gain a Minor with Water and saved card has Water, you can use Pour Down Power twice; otherwise use it once. Most likely accrue some Energy for Reclaim next turn, but if you get 2 uses you can Repeat once.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim All, gain a Minor Power, move a presence up to 2. Card Plays: 2 cards. Playing 2 cards means most likely getting 2 uses of Pour Down Power. If you have a good target for Gift of Abundance use it, but saving it for next turn guarantees hitting tier 1 of Water Nourishes Life's Growth. Next turn, choose Growth 2 and add both presence from Energy - with 2 Plays, 3 Waters on track, and 2 Waters from Growth, you can easily use Pour Down Power 3 times.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2496834/openings-dowpour-drenches-the-world",
  },

  // Many Minds Move as One (1 opening - BGG JE)
  {
    spiritSlug: "many-minds-move-as-one",
    slug: "many-minds-move-as-one-bgg-je-opening-1",
    name: "BGG JE Opening: Beast Distribution",
    description:
      "Building Beast distribution for Beset and Confound defense scaling and Teeming Host gathering, with options for Energy or Plays focus on Turn 3.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add a presence (from Energy) + add a Beast, gain 1 Energy, gather 1 Beast into a land. Card Plays: Ever-Multiplying Swarm (add 2 Beasts). Add presence to a land you'd like to defend next turn (preferably with Dahan, can use range to cover another Spirit's board). Gather Beast from starting land into a more central one, or pull Beast from ally's board closer. Use Ever-Multiplying Swarm in whichever of your 2 lands has more adjacent terrain for Dreadful Tide setup.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add 2 presence (one from Energy, 1 from Plays). Card Plays: Guide the Way on Feathered Wings (move 1 Beast up to 2 lands with up to 2 Dahan), A Dreadful Tide of Scurrying Flesh (remove up to half of Beasts, each removed skips 1 Invader action). If defending land has Dahan, add zero-range presence there. Your sacred site plus added Beast gives 2 Beasts for Beset and Confound. Use Guide the Way to shuttle Dahan to next defense land. You hit tier 2 of Teeming Host and tier 1 of Beset and Confound.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Add 2 presence (options discussed below). Card Plays: Pursue with Scratches, Pecks, and Stings (1 Fear, push Town/Explorer per Beast past first), Boon of Swarming Bedevilment (target Spirit's presence grants Defend 1, Spirit may push 1 presence). Option A: Both from Energy - hits tier 2 of Beset and Confound, good if you need Defend 4 guaranteed. Option B: Both from Plays - spend 2 Energy to gain Minor and play all 3 remaining cards. Minor with Animal hits tier 2 of Beset and Confound; Air hits tier 3 of Teeming Host.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim All, gain a Power. Card Plays: Varies. If you chose Plays last turn, take Minor with Air + Animal if possible. If choosing between Air or Animal: take Air for tier 3 Teeming Host next turn, Animal for tier 3 Beset and Confound. If you chose Energy last turn, consider taking a Major - you'll have 6 Energy. Turn 5 involves adding 2 presence from whichever track you didn't choose on Turn 3, allowing robust innate hits.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2502110/openings-many-minds-move-as-one",
  },

  // Grinning Trickster Stirs Up Trouble (1 opening - BGG JE)
  {
    spiritSlug: "grinning-trickster-stirs-up-trouble",
    slug: "grinning-trickster-stirs-up-trouble-bgg-je-opening-1",
    name: "BGG JE Opening: Authority/Mob Combo",
    description:
      "Reliable Authority/Mob combo for Fear generation with options to break the Reclaim cycle when Cities become scarce.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add a presence (from Plays), gain a Minor Power. Card Plays: Impersonate Authority (add 1 Strife), Incite the Mob (1 Invader with Strife deals damage to other Invaders, 1 Fear per Invader destroyed). Gain a Power with Air to hit Let's See What Happens next turn; if no Air, take Fire for tier 3 of Why Don't You and Them Fight. Push a Dahan into the land where you'll add Strife (ideally building a City). Attach Strife to City, then use Incite the Mob to kill Town/Explorer for 3 Fear total.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add a presence (from Plays), gain +1 Energy per Play. Card Plays: Overenthusiastic Arson (destroy 1 Town, discard Minor - if Fire: 1 Fear, 2 Damage, add Blight), Unexpected Tigers (1 Fear if Invaders, gather Beast/push Explorer, or add Beast), Minor Power. Push another Dahan into Strifed City land for counterattack, or consolidate lone Dahan. Arson prevents City or stops Ravage. If you have 3 Fires, use You and Them Fight to kill Explorer in Dahan land. If hitting What Happens, decide on Tigers - ditch it and the Minor for Energy if you don't need them.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim All, move a presence up to 1, add a presence (from Energy). Card Plays: Impersonate Authority, Incite the Mob, Overenthusiastic Arson. If your board lacks good Authority/Mob targets, move to another board with move + add presence combo. You have just enough Energy for these 3 cards, hitting tier 2 of You and Them Fight and tier 2 of What Happens. When using What Happens, forget Tigers or the Minor you gained. From here, take the Reclaim cycle as needed, or break it by forgetting Arson from play with What Happens (giving 3 cards in hand) or using Growth 3 for third card then Energy for Plays.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2502216/openings-grinning-trickster-stirs-up-trouble",
  },

  // Shifting Memory of Ages (1 opening)
  {
    spiritSlug: "shifting-memory-of-ages",
    slug: "shifting-memory-of-ages-bgg-je-opening-1",
    name: "BGG JE Opening: Double Major Rush",
    description:
      "Rush to gain two Major Powers by Turn 2, then unleash them both on Turn 3 with 12 Energy available. Focus on either keeping Elements for yourself or donating via Elemental Teaching based on team composition.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Gain Major Power, add presence (from Energy). Card Plays: Study the Invader's Fears (2 Fear, reveal top Fear card) OR Boon of Ancient Memories (target yourself to gain Minor, or target ally to give them Power card paying 2 Energy instead of Forgetting). Choose based on team composition - Study for Fear-generating teams, Boon for high-plays Spirits. Discard whichever starter you didn't play when gaining Major. Shoot for mid-costed Major (3-6 range). Use first tier of Observe the Ever Changing World. Prepare an Element for your Major threshold or for an ally.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Gain Major Power, add presence (from Plays). Card Plays: Elemental Teachings (prepare Element marker, discard up to 3 to give target Spirit those Elements) + Share Secrets of Survival (destroy 2 fewer Dahan OR gather 2 Dahan; threshold grants both). Forget Study/Boon from discard when gaining Major. Look for another mid-costed Major that shares Elements with first. Use Secrets of Survival in a Ravaging land. Use second tier of Learn the Invader's Tactics to cover another Ravage. Consider second tier of Ever-Changing World for 2 Elements. Use Elemental Teachings to prepare Element and either give 3 away or gain threshold Elements.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Gain +9 Energy. Card Plays: Both Major Powers. You'll have 12 Energy total. If you haven't used it yet, your Moon Element from Setup can net you the last Element marker needed for a threshold. Even if you gave Elements away, you'll be doing more this turn than basically anyone at the table.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Reclaim All, add a presence (from Energy). Card Plays: Variable. You've got 2 Majors and most likely enough Energy left to play one. Supplement with one of your starters, and continue down your Energy track in subsequent turns.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2506389/openings-shifting-memory-of-ages",
  },

  // Volcano Looming High (1 opening)
  {
    spiritSlug: "volcano-looming-high",
    slug: "volcano-looming-high-bgg-je-opening-1",
    name: "BGG JE Opening: Presence Stacking",
    description:
      "Build up presence for eruptions while using Badlands strategically. Timing of Explosive Eruption is key - save up for specific Adversary interactions or cascades. Choose Mountain closer to coast during Setup.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add 2 presence (both from Energy). Card Plays: Lava Flows (add 1 Badlands and 1 Wilds OR deal 1 damage). Add the Badlands wherever you'll need the damage boost next turn. This is a deep thinking turn about when to erupt.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add 2 presence (both from Plays). Card Plays: Rain of Ash (2 Fear if Invaders, push 2 Dahan and 2 Towns/Explorers to lands without your presence) OR Pyroclastic Bombardment (1 damage to each Town/City/Dahan, 1 damage, 1 damage to Dahan). You can do a small 2-presence eruption - you'll hit first tier of Furnace, only losing 1 presence overall, still get range boost from Volcanic Peaks. Play Bombardment for Town-sized problems or combo with Eruption; play Rain of Ash for distant Build/Explore countering.",
      },
      {
        turn: 3,
        title: "Turn 3 (Option 1: No Eruption/Reposition)",
        instructions:
          "If you don't want to erupt again or want to reposition: Growth: Take Growth 3, gain Minor with Fire if possible, add presence from Plays to a Mountain you'd like to occupy. Card Plays: Exaltation of Molten Stone (+1 Energy per Fire, distributed between you and target Spirit) + your Minor + remaining starter. With a Fire Minor, hit third tier of Furnace of the Earth to relocate presence. Otherwise still add presence back with Furnace.",
      },
      {
        turn: 4,
        title: "Turn 3 (Option 2: Erupt Again)",
        instructions:
          "If you want to erupt again or don't care about repositioning: Growth: Take Growth 2, add 1 presence from Energy and 1 from Plays. Card Plays: Exaltation + remaining starter. You still hit second tier of Furnace of the Earth and add enough presence for second tier of Explosive Eruption with a sacred site left over. Distribute Exaltation Energy as you like - giving yourself 2 allows gaining Minor with Furnace. Next turn: Reclaim All, shoot for cheap Major or dig for Minor Elements.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2508259/openings-volcano-looming-high",
  },

  // Lure of the Deep Wilderness (1 opening - BGG JE)
  {
    spiritSlug: "lure-of-the-deep-wilderness",
    slug: "lure-of-the-deep-wilderness-bgg-je-opening-1",
    name: "BGG JE Opening: Token Moshpit",
    description:
      "Spread out across the middle of the board, creating token concentrations in lands that contact as much real estate as possible. Use Softly Beckon for massive action advantage and Swallowed by the Wilderness for Major-like damage.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add presence (from Energy), gain a Moon and +2 Energy. Card Plays: Softly Beckon Ever Inward (gather up to 2 Explorers, Towns, Beasts, and Dahan). Place presence so Softly Beckon covers maximum lands that will Build/could Explore. This card alone can delay Invaders on several fronts. The Moon from Growth lets you hit second tier of Forsake Society - use to replace a Town in a Building land or break up Coastal fortification for Fear.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add presence (from Plays), gain a Minor Power. Card Plays: Gift of the Untamed Wild (target Spirit adds Wilds in their land OR replaces presence with Disease) + Perils of the Deepest Wild (add Badlands, add Beast within 1 range, push 2 Dahan). Gain Minor with Moon if possible. You'll hit second tier of both Forsake Society and Never Heard From. Use Never Heard From to prevent Build or eat 2 Explorers you caused to Forsake Society. Use Perils to populate midland-moshpit for Swallowed next turn or distribute tokens for Never Heard From. Wilds generally better than Disease unless problematic City brewing.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Add presence (from Energy), gain a Minor Power. Card Plays: Swallowed by the Wilderness (2 Fear, 1 damage per Beast/Disease/Wilds/Badlands, max 5) + Minor Power with Moon. Try again for Moon; if you have it, try for Plant or Air with good effect. Moon + Air is ideal for next turn.",
      },
      {
        turn: 4,
        title: "Turn 4",
        instructions:
          "Growth: Add presence (from Energy), gain a Major Power. Card Plays: Minor Power + Major Power. Forget the Minor you played last turn, or if obsessed with it forget Gift (not recommended - that card is real good). Even a single Plant between your 2 cards nets second tier of Never Heard From Again. Next turn: Reclaim All, grab Energy/Elements for Major or gain Minor for more Plays.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2510069/openings-lure-of-the-deep-wilderness",
  },

  // Stone's Unyielding Defiance (1 opening)
  {
    spiritSlug: "stones-unyielding-defiance",
    slug: "stones-unyielding-defiance-bgg-je-opening-1",
    name: "BGG JE Opening: Blight Guardian",
    description:
      "Occupy Ravaging lands to add Blight from box instead of card, rebounding damage upon Invaders. Encourage allies to dump spare buildings in your lands for Let Them Break Themselves. Distribute Badlands liberally.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add presence (from Top), gain 3 Energy. Card Plays: Jagged Shards Push from the Earth (add 1 Badlands, push up to 2 Dahan) OR Plows Shatter on Rocky Ground (deal 1 damage to each Town/City then push up to 1 Town OR destroy 1 Town). Use presence placement range to move into a land type you don't occupy, preferably with Town/City, possibly Ravaging next turn. Use Jagged Shards if you need to prep for Stubborn Solidity next turn or shuttle Dahan and set up Badlands for damage. Use Plows Shatter if Dahan already positioned and want to counteract Explore in Town land.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add presence (from Top), gain 3 Energy. Card Plays: Stubborn Solidity (defend 1 per Dahan, Dahan cannot be changed/damaged) + Jagged Shards OR Plows Shatter (whichever you didn't play Turn 1). When uncovering +1 Card Play spot, gain Minor with Earth (Sun + Earth ideal). Add presence to Ravaging land or unoccupied type (preferably with buildings when Ravaging next turn). Use Solidity to guarantee favorable trade in Ravaging land. Hit first tier of Bulwark of Will to mitigate other Ravage for 2 Energy.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim All, add presence (from Bottom), gain 2 Earth. Card Plays: Variable. Add presence to distant Mountain if useful, or double up in land you control with Blight. Use Solidity in land with enough Dahan. Use Jagged Shards for Dahan repositioning or Badlands distribution for Let Them Break Themselves. Use Plows Shatter for building management or combined with Break Themselves for dense lands. Use Scarred and Stony Land to clear out already-Ravaged land. With 5 Earth total, use second tier of Let Them Break Themselves - in standard Ravaging land (Explorer + Town + City), deal 5 damage back, kill both buildings, only 1 Energy to pull Blight from box. You should have presence in every land type for Reclaim All abuse on large Ravages.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2512536/openings-stones-unyielding-defiance",
  },

  // Starlight Seeks Its Form (1 opening)
  {
    spiritSlug: "starlight-seeks-its-form",
    slug: "starlight-seeks-its-form-bgg-je-opening-1",
    name: "BGG JE Opening: Thresholded Major Rush",
    description:
      "Draft for Element pairs to hit Major thresholds. Use Boon of Reimagining and Shape the Self Anew to accumulate cards and Energy. Track 1 is topmost track; finish Tracks 1 and 3 with opposite choices (Reclaim vs Power gain).",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Add presence (from Track 1, covering Reclaim 1/2), gain Minor Power, move presence up to 1, gain 1 Energy. Card Plays: Boon of Reimagining (target Forgets a Power card, draws 6 Minors, gains 2) + Shape the Self Anew (gain Minor, Forget to gain 3 Energy, 4 Moons = gain Major) OR your new Minor. If offered strong Turn 1 Minor with Moon, play that instead of Shape. Otherwise draft for ability you like - can trash it during Slow phase. Position presence for Peace of the Nighttime Sky next turn. Use Sidereal Guidance gather to prevent Build or concentrate Dahan. Forget Shape for Energy; use it to gain Minor BEFORE using Boon for more Forgetting options. When using Boon, Forget Gather the Scattered Light or one of gained Minors. Shoot for Element pairs, especially cards with several pairs. Moon cards for next turn are golden.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Add presence (from Track 3, gaining 1 Energy), gain Major Power, move presence up to 1, gain 1 Energy. Card Plays: Peace of the Nighttime Sky (if Terror Level I, Invaders don't Ravage in target land, Forget to repeat and gain Moon) + Minor with Moon OR Shape the Self Anew. Forget Boon of Reimagining from discard when gaining Major. Move presence before adding if needed for Peace positioning. Can swap gain 1 Energy for move presence up to 3 if you don't need the money. Throw out Nighttime Sky to use effect twice - once rolling with Major it'll be hard to work back in, and other Spirits appreciate breathing room.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Gain Major Power, move presence up to 1, add presence (from Track 3, choosing Element and gaining +1 Energy), gain 1 Energy. Card Plays: Major + Minor. If both Majors have pair-able Elements (1 Element needs 3, others only 2), Forget least useful Minor from hand. Forget first Major if it didn't work out. Element gained should be based on Major threshold you're using. Play whichever Major hits hardest; any innate hit will be coincidental based on Element gained.",
      },
      {
        turn: 4,
        title: "Turn 4 (Good Major/Minor Combo)",
        instructions:
          "If you got Major/Minor combo you liked last turn (or Forgot second Major): Add from Track 5 (for income) or Track 6 (for another threshold Element). Reclaim All + gain Minor/move presence and flog that combo!",
      },
      {
        turn: 5,
        title: "Turn 4 (Kept Both Majors)",
        instructions:
          "If you kept both Majors: Uncover any Elements needed for second Major threshold, reclaiming/gaining cards as needed. If threshold isn't compelling/possible, uncover Track 2 for +3 Energy option and midgame becomes more straightforward.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2518429/openings-starlight-seeks-its-form",
  },

  // Vengeance as a Burning Plague (1 opening)
  {
    spiritSlug: "vengeance-as-a-burning-plague",
    slug: "vengeance-as-a-burning-plague-bgg-je-opening-1",
    name: "BGG JE Opening: Standard",
    description:
      "Opening for Vengeance focusing on flexible Disease placement for either Epidemics Run Rampant (utility) or Savage Revenge (tempo) innate paths.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: +1 Energy, gain Minor Power, add presence from Energy track. Cards: Fetid Breath Spreads Infection (+1 Fear and add a Disease). Add presence to land with no buildings, ideally closer to an ally's board. If choosing between Fire or Animal minor, Fire is generally better as second innate scales better. Add Disease to: land with Town that just Explored (prevent City/farm Build), OR empty explored land (farm Build/push with Plaguebearers), OR land with Town+Blight for first innate next turn.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 2 presence (one from Plays, one from Energy/Plays depending on Element needed). Cards: Plaguebearers and new Minor. If using first innate (Epidemics Run Rampant): add first presence from Plays to Ravaging land, second from Energy to different board with Disease. If using second innate (Savage Revenge): add both from Plays to land about to Ravage - lose 1 presence but keep 1 for Savage Revenge. Push Disease with Plaguebearers into land Ravaging next turn to set up Sudden Fevers.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Place 2 presence (Energy/Plays for Element, one from Energy for 3 Energy/turn). Cards: Strike Low with Sudden Fevers (1 Fear, prevent Ravage in land with Disease), Fiery Vengeance (remove destroyed presence, 1 Fear + 1 damage in target Spirit's land). Add both presence to Ravaging land if using second innate. Fiery Vengeance can augment allies' abilities. Next turn: Reclaim All, shoot for Minor matching elements of first one gained.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2484534/openings-vengeance-as-a-burning-plague",
  },

  // ===========================================================================
  // BGG OPENINGS - Jonah Yonker Promo Spirit Threads
  // ===========================================================================

  // Serpent Slumbering Beneath the Island (1 opening)
  {
    spiritSlug: "serpent-slumbering-beneath-the-island",
    slug: "serpent-slumbering-beneath-the-island-bgg-opening-1",
    name: "BGG Opening: Multiplayer Support",
    description:
      "A multiplayer-focused opening for Serpent that emphasizes supporting allies with Gifts while building toward Majors. Rush 2 card plays for consistent innate access, manage your presence cap, and track ally reclaim cycles.",
    turns: [
      {
        turn: 1,
        title: "Turn 1 - Gift an Ally",
        instructions:
          "Growth: +1 Energy, gain Minor Power, place presence (from bottom). Cards: Gift of Flowing Power OR Gift of Primordial Deeps. Rush 2 card plays for consistent innate access. Take a Minor with Moon/Fire and Earth - these are more consistently useful than Plant. Place your first presence in a land touching several lands of the same type, preferably the Build land. Consider which ally benefits most from an extra play (slower Spirits) or Minor access (faster Spirits). Noteworthy plays: Bringer - use Primordial Deeps for Moon/Earth to hit max innates, choose Earth for Serpent Rouses level 2. Vital Strength - use Flowing Power for extra play with Growth 3, enables Rituals + Draw of the Fruitful Earth combo. Wildfire - use Flowing Power for Growth 3, play Flash Fires + Asphyxiating Smoke. Lightning - use Flowing Power for Fire, enables Growth 2 + Harbingers + Shatter Homesteads.",
      },
      {
        turn: 2,
        title: "Turn 2 - Absorb and Defend",
        instructions:
          "Growth: +1 Energy, gain Minor Power, place presence (from bottom). Cards: Absorb Essence + Elemental Aegis. Continue digging for useful cards. Place presence in a land with at least one Town, or touching several Ravage lands. Absorb Essence nets +3 Energy and grants an ally an element they need. Aegis defends your land and all adjacent lands. Hit Serpent Rouses to crush or push a Town (rarely both without setup).",
      },
      {
        turn: 3,
        title: "Turn 3 - Expand Reach",
        instructions:
          "Growth: +4 Energy, place presence (from top). Cards: Remaining Gift + the Minor you like less. Spread presence across the board for better Major targeting next turn. The extra Energy can pay for expensive Events your group wants to avoid.",
      },
      {
        turn: 4,
        title: "Turn 4 - Major Power",
        instructions:
          "Growth: +1 Energy, gain Major Power, place presence (from top). Cards: Other Minor + new Major. You've uncovered the 'Any' element and should have decent Energy. Shoot for a mid-cost Major and forget the Minor in discard. Place presence to meet targeting requirements. Reclaim All next turn.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2282835/openings-serpent-slumbering-beneath-the-island",
  },

  // Heart of the Wildfire (1 opening - BGG Promo)
  {
    spiritSlug: "heart-of-the-wildfire",
    slug: "heart-of-the-wildfire-bgg-promo-opening-1",
    name: "BGG Opening: Flexible Aggro",
    description:
      "A flexible opening for Wildfire focusing on early damage while managing Blight. Rush Plant elements for massive damage scaling. Plan Reclaims carefully to maintain presence placement for Blazing Presence damage.",
    turns: [
      {
        turn: 1,
        title: "Turn 1 - Clear Early Threats",
        instructions:
          "Growth: Add presence from Plays, gain 2 Energy +1 per Fire (3 total). Cards: Asphyxiating Smoke (1 Fear, destroy 1 Town, Push 1 Dahan). Use presence placement to eliminate an Explorer and prevent a Build. Smoke clears a Town that just built or was just Explored, potentially pushing Dahan to a land another Spirit will defend.",
      },
      {
        turn: 2,
        title: "Turn 2 - Gain Plant Elements",
        instructions:
          "Growth: Add presence from Energy, gain a Minor Power. Cards: Threatening Flames OR new Minor. Prioritize Plant elements over Fire (your tracks provide Fire already). 3 Plant is a huge power spike. If no Plant, consider Fire/Air for Flash Fires or Firestorm combos. If new Minor has Plant, add presence to a land with Town about to Ravage or Town/Explorer about to Build. If playing Threatening Flames, add presence to a land with City + Town to destroy City and push Town.",
      },
      {
        turn: 3,
        title: "Turn 3 - Maximum Damage",
        instructions:
          "Growth: Add presence from Plays, gain 2 Energy +1 per Fire (4 total). Cards: Flame's Fury + Flash Fires. With Flame's Fury and 4 Fire showing, deal 5 damage total (2 from placement, 3 from Firestorm + Fury). Divide damage as needed - tear into a populated land OR clean your own lands. Flash Fires also benefits from Fury for another Town kill. First opportunity to remove Blight with Burned Land Regrows.",
      },
      {
        turn: 4,
        title: "Turn 4 - Setup for Reclaim",
        instructions:
          "Growth: Add presence from Energy OR Plays, gain a Minor. Cards: Threatening Flames + new Minor OR both Minors (depending on Turn 2 play). After 8 Minor draws, odds are very high you've seen at least 1 Plant. Use Growth's extra range to position for Reclaim next turn. Take from Plays if Invaders are building significant real estate (3 plays = damage spike next turn). Take from Energy if lands are inaccessible (Blighted, occupied by allies) or you already occupy affected lands.",
      },
      {
        turn: 5,
        title: "Turn 5 - Reclaim and Major",
        instructions:
          "Growth: Reclaim All, gain 1 Energy, gain Major or Minor. Cards: TBD based on draws. If gaining Major, forget a Minor you don't like or Flash Fires (utility drops off, and forgetting a 2-cost opens budget room). Shoot for 3-4 cost Majors so Growth 3 always affords them. Alternatively, grab a Minor if initial draws lacked Plant for better mid-game scaling.",
      },
    ],
    author: "Jonah Yonker (BGG)",
    sourceUrl:
      "https://boardgamegeek.com/thread/2313791/openings-heart-of-the-wildfire",
  },

  // ===========================================================================
  // Spirit Island Wiki - Antistone/breppert Guides
  // ===========================================================================

  // A Spread of Rampant Green - Antistone
  {
    spiritSlug: "a-spread-of-rampant-green",
    slug: "a-spread-of-rampant-green-wiki-antistone",
    name: "Wiki Opening: Antistone's Standard",
    description:
      "Antistone's opening strategy focusing on triggering innates early through presence placement and combining Creepers Tear into Mortar with Dahan counter-attacks.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place 2 presence (one from each track), +1 card play this turn. Cards: Gift of Proliferation (another spirit places 1 presence), Stem the Flow of Fresh Water (1 damage to a building). The energy uncovered on top track lets you play a moon element to trigger your first innate. Use Choke the Land with Green to prevent builds.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place 1 presence from bottom track, gain a minor power, +3 energy. Cards: Overgrow in a Night (place 1 presence or 3 fear), Fields Choked with Growth (push 1 town or 3 Dahan). Overgrow triggers All-Enveloping Green for Defend 2. Coordinate with Creepers Tear into Mortar for additional building damage.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Growth: Reclaim cards. If your minor power has plant+moon+water, you can activate level 2 of Creepers Tear into Mortar to destroy a town without needing a combo.",
      },
    ],
    author: "Antistone (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=A_Spread_of_Rampant_Green/Antistone%27s_Opening",
  },

  // Bringer of Dreams and Nightmares - Antistone
  {
    spiritSlug: "bringer-of-dreams-and-nightmares",
    slug: "bringer-of-dreams-and-nightmares-wiki-antistone",
    name: "Wiki Opening: Antistone's Major Rush",
    description:
      "Antistone's opening focusing on getting a major power early through Call on Midnight's Dreams while maintaining fear generation via Night Terrors innate.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place 1 presence (from top), gain a minor power. Cards: Dreams of the Dahan (gather Dahan or fear), Predatory Nightmares (2 nightmare damage, push Dahan). The air element from your presence track triggers Spirits May Yet Dream (reveal a fear card) and level 2 Night Terrors (+2 fear). Use Predatory Nightmares to push a town about to ravage.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: +2 energy, place 1 presence (from top) in land with invaders/Dahan. Cards: Dread Apparitions (fear -> defense, 1 fear), Call on Midnight's Dreams (fear or major power). Order matters: use Dread Apparitions, then Night Terrors for 2 fear (defense 3), then Spirits May Yet Dream, then Call on Midnight's Dreams for a major power. Forget Call to use the major immediately if good.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "If you got a good major, use Reclaim One to cast it again alongside your turn 1 minor. If both cards have moon elements, placing presence from top track gives you the third moon for the second part of Spirits May Yet Dream.",
      },
    ],
    author: "Antistone (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Bringer_of_Dreams_and_Nightmares/Antistone%27s_Opening",
  },

  // Bringer of Dreams and Nightmares - breppert
  {
    spiritSlug: "bringer-of-dreams-and-nightmares",
    slug: "bringer-of-dreams-and-nightmares-wiki-breppert",
    name: "Wiki Opening: breppert's Dahan Defense",
    description:
      "breppert's opening focusing on gathering 3 Dahan to defend against a full land (Explorer + Town + City) while building up to a major power on turn 3.",
    turns: [
      {
        turn: 1,
        title: "Turn 1",
        instructions:
          "Growth: Place Presence (1 away, top track to uncover Air), gain minor power. Cards: Predatory Nightmares (2 Damage + Dahan Push), Dreams of the Dahan (Gather Dahan or Fear per Dahan). Use Dreams to gather 3 Dahan into a land you'll defend turn 2, ideally with Explorer + Town + City. Predatory Nightmares targets towns built during invader turn 1. Triggers level 2 Night Terrors (2 Fear) and Spirits May Yet Dream.",
      },
      {
        turn: 2,
        title: "Turn 2",
        instructions:
          "Growth: Place Presence in Dahan land + 2 Energy. Cards: Dread Apparitions (1 Fear, defend by Fear), Call on Midnight's Dream (Gain Major or 2 Fear). Play Call for the fear. With Night Terrors (2 fear) + Dread Apparitions, you're defending 5. With 3 Dahan, you can wipe out Explorer + Town + City.",
      },
      {
        turn: 3,
        title: "Turn 3",
        instructions:
          "Reclaim one card, use 0-range presence placement to create a sacred site, and get your major power via Call on Midnight's Dreams. You'll have at least 4 Energy before Dahan boost. Accept some blight this turn while setting up major power for board control starting turn 4.",
      },
    ],
    author: "breppert (Wiki)",
    sourceUrl:
      "https://spiritislandwiki.com/index.php?title=Bringer_of_Dreams_and_Nightmares/breppert%27s_Opening",
  },
];
