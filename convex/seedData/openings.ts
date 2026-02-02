// Opening guide data definitions for seeding the database
// Generated from scraped latentoctopus.github.io data
// Total: 22 opening guides for 10 spirits

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
// OPENINGS (22 total, 10 spirits)
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
];
