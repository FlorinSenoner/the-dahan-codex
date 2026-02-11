// Spirit and Aspect data definitions for seeding the database
// Generated from scraped Spirit Island Wiki data

// ============================================================================
// EXPANSIONS
// ============================================================================

export const EXPANSIONS = [
  { name: 'Base Game', slug: 'base-game', releaseYear: 2017 },
  { name: 'Branch & Claw', slug: 'branch-and-claw', releaseYear: 2017 },
  { name: 'Jagged Earth', slug: 'jagged-earth', releaseYear: 2020 },
  { name: 'Promo Pack 2', slug: 'promo-pack-2', releaseYear: 2021 },
  { name: 'Feather and Flame', slug: 'feather-and-flame', releaseYear: 2022 },
  { name: 'Horizons of Spirit Island', slug: 'horizons', releaseYear: 2022 },
  { name: 'Nature Incarnate', slug: 'nature-incarnate', releaseYear: 2023 },
] as const

export type ExpansionSlug = (typeof EXPANSIONS)[number]['slug']

// ============================================================================
// SPIRIT DATA INTERFACE
// ============================================================================

export interface SpiritData {
  name: string
  slug: string
  complexity: 'Low' | 'Moderate' | 'High' | 'Very High'
  summary: string
  description?: string
  imageUrl?: string
  expansion: ExpansionSlug
  elements: string[]
  strengths?: string[]
  weaknesses?: string[]
  powerRatings?: {
    offense: number
    defense: number
    control: number
    fear: number
    utility: number
  }
  wikiUrl?: string
}

// ============================================================================
// SPIRITS (37 total)
// ============================================================================

export const SPIRITS: SpiritData[] = [
  // Base Game (8 spirits)
  {
    name: 'River Surges in Sunlight',
    slug: 'river-surges-in-sunlight',
    complexity: 'Low',
    elements: ['Sun', 'Water'],
    summary: 'Put 1 Presence on your starting board in the highest-numbered Wetlands.',
    description:
      'Put 1 Presence on your starting board in the highest-numbered Wetlands. While capable of some direct offense, River Surges in Sunlight is best at flooding out Explorers and Towns, displacing them from lands where they might Build or Ravage. The ability to get free Sacred Sites makes a wide range of Powers more useful. On most of Spirit Island, the rivers run high during the rainy season, as one would expect. There is one exception: the lingering remains of an ancient curse keep a high ridge shrouded...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 1,
      control: 5,
      fear: 1,
      utility: 4,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/river-surges-in-sunlight.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=River_Surges_in_Sunlight',
  },
  {
    name: "Lightning's Swift Strike",
    slug: 'lightnings-swift-strike',
    complexity: 'Low',
    elements: ['Air', 'Fire', 'Water'],
    summary: 'Put 2 Presence on your starting board in the highest-numbered Sands.',
    description:
      'Put 2 Presence on your starting board in the highest-numbered Sands. Virtually all offense to start with: without a more defensive teammate, Blight may become a problem. Excellent at destroying buildings, less good at containing Explorers. Using Thundering Destruction tends to be a burst affair: a turn or two of position and build up Energy, followed by a really big turn. Starting Powers are extremely focused on Air and Fire: good for Thundering Destruction, bad for Major Power versatility. SWIFTNESS OF LIGHTNING...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 2,
      fear: 3,
      utility: 2,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/lightnings-swift-strike.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike',
  },
  {
    name: 'Shadows Flicker Like Flame',
    slug: 'shadows-flicker-like-flame',
    complexity: 'Low',
    elements: ['Moon', 'Fire'],
    summary:
      'Put 3 Presence on your starting board: 2 in the highest-numbered Jungle and 1 in land #5',
    description:
      "Put 3 Presence on your starting board: 2 in the highest-numbered Jungle and 1 in land #5. Good at causing Fear and picking off lone Explorers and Towns, containing the Invaders. Not so good at massive damage - may need to rely on allies to handle thoroughly colonized lands. The ability to boost Range gives more flexibility to Range 0 Powers, and can be important in larger games. SHADOWS OF THE DAHAN: Whenever you use a Power, you may pay 1 Energy to target a land with Dahan regardless of the Power's Range...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 1,
      control: 3,
      fear: 5,
      utility: 1,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/shadows-flicker-like-flame.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Shadows_Flicker_Like_Flame',
  },
  {
    name: 'Vital Strength of the Earth',
    slug: 'vital-strength-of-the-earth',
    complexity: 'Low',
    elements: ['Sun', 'Earth', 'Plant'],
    summary:
      'Put 3 Presence on your starting board: 2 in the highest-numbered Mountain, 1 in the highest-numbered Jungle.',
    description:
      'Put 3 Presence on your starting board: 2 in the highest-numbered Mountain, 1 in the highest-numbered Jungle. Powerful but slow: has potent Power Cards and an excellent Energy income, but starts with only one card play per turn, and Growth is limited to adding one Presence per turn. Also slow to change: learning new Powers carries slightly more cost than reclaiming played Power Cards. A spirit of great and unhurried power. The life that earth yields up to roots, the ground supporting the life that lives...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 5,
      control: 3,
      fear: 1,
      utility: 3,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/vital-strength-of-the-earth.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Vital_Strength_of_the_Earth',
  },
  {
    name: 'A Spread of Rampant Green',
    slug: 'a-spread-of-rampant-green',
    complexity: 'Moderate',
    elements: ['Moon', 'Plant', 'Water'],
    summary:
      'Put 2 Presence on your starting board; 1 in the highest-numbered Wetland, and 1 in the Jungle without any Blight.',
    description:
      "Put 2 Presence on your starting board; 1 in the highest-numbered Wetland, and 1 in the Jungle without any Blight. (If there is more than 1 such Jungle, you may choose) Fairly good at dealing with Towns, but terrible at handling Explorers (who are unfazed by prolific foliage). Can get Presence onto the board faster than most other Spirits. Extra Presence is good for targeting and especially for 'Choke the Land with Green', which can be extremely effective at slowing down invaders. Just be careful not to des...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 5,
      control: 3,
      fear: 2,
      utility: 4,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/a-spread-of-rampant-green.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=A_Spread_of_Rampant_Green',
  },
  {
    name: 'Thunderspeaker',
    slug: 'thunderspeaker',
    complexity: 'Moderate',
    elements: ['Air', 'Sun', 'Fire'],
    summary: 'Put 2 Presence on your starting board: 1 in each of the 2 lands with the most Dahan.',
    description:
      'Put 2 Presence on your starting board: 1 in each of the 2 lands with the most Dahan. Has a keen interest in where the Dahan are - partly because so many of its starting powers work through them, partly because its Presence can move along with them. When picking new Power Cards, it will often want to take good Dahan-centric Powers, but it can also branch out into other areas. ALLY OF THE DAHAN: Your Presence may move with Dahan. (Whenever Dahan move from 1 of your lands to another land, you may move 1 Presence along with them.)',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 2,
      control: 5,
      fear: 3,
      utility: 1,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/thunderspeaker.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Thunderspeaker',
  },
  {
    name: 'Bringer of Dreams and Nightmares',
    slug: 'bringer-of-dreams-and-nightmares',
    complexity: 'High',
    elements: ['Moon', 'Air', 'Animal'],
    summary: 'Put 2 Presence on your starting board in the highest-numbered Sands.',
    description:
      'Put 2 Presence on your starting board in the highest-numbered Sands. With most Spirits, Terror Victories are a backup plan if the main push against the Invaders stalls out for too long, but Bringer turns Fear into a more viable primary strategy. Its transformation of damage & destruction into Fear can turn Major Powers into tremendous sources of terror and panic. However, the only real offense Bringer has is the Dahan fighting back. While it does have some defensive ability, it is fundamentally poor...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 2,
      control: 2,
      fear: 5,
      utility: 2,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/bringer-of-dreams-and-nightmares.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Bringer_of_Dreams_and_Nightmares',
  },
  {
    name: "Ocean's Hungry Grasp",
    slug: 'oceans-hungry-grasp',
    complexity: 'High',
    elements: ['Moon', 'Air', 'Water', 'Earth'],
    summary:
      'Put 2 Presence onto your starting board: 1 in the Ocean, and 1 in a Coastal land of your choice.',
    description:
      'Put 2 Presence onto your starting board: 1 in the Ocean, and 1 in a Coastal land of your choice. Extremely good at assaulting the coasts where the Invaders start out strong, but quite weak inland - the ocean is not accustomed to affecting events so far ashore. Its Presence shifts in and out like the tide, which can be tricky to manage, but permits re-positioning and tactical retreats or offensives in the hands of a skillful player. Has fairly inexpensive Unique Powers, but the energy gained from drow...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 3,
      control: 4,
      fear: 4,
      utility: 2,
    },
    expansion: 'base-game',
    imageUrl: '/spirits/oceans-hungry-grasp.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Ocean%27s_Hungry_Grasp',
  },
  // Branch & Claw (2 spirits)
  {
    name: 'Keeper of the Forbidden Wilds',
    slug: 'keeper-of-the-forbidden-wilds',
    complexity: 'Moderate',
    elements: ['Sun', 'Fire', 'Plant'],
    summary: 'Put 1 Presence and 1 Wilds on your starting board in the highest-numbered Jungle.',
    description:
      'Put 1 Presence and 1 Wilds on your starting board in the highest-numbered Jungle. A slowly growing wall - expanding can sometimes be difficult, but the Invaders will have an equally difficult time penetrating wherever the Keeper plants itself. In larger games, it may be useful to spread to one of the two far-distant lands early on, to have multiple points from which to slowly grow. FORBIDDEN GROUND: After you create a Wilds, Push all Explorers from that land. Dahan Events never move Explorers to your Wilds, but Powers can do so.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 4,
      control: 2,
      fear: 1,
      utility: 3,
    },
    expansion: 'branch-and-claw',
    imageUrl: '/spirits/keeper-of-the-forbidden-wilds.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Keeper_of_the_Forbidden_Wilds',
  },
  {
    name: 'Sharp Fangs Behind the Leaves',
    slug: 'sharp-fangs-behind-the-leaves',
    complexity: 'Moderate',
    elements: ['Animal', 'Moon', 'Fire'],
    summary:
      'Put 1 Presence and 1 Beasts on your starting board in the highest-numbered Jungle. Put 1 Beasts in a land of your choice with Dahan anywhere on the island.',
    description:
      "Put 1 Presence and 1 Beasts on your starting board in the highest-numbered Jungle. Put 1 Beasts in a land of your choice with Dahan anywhere on the island. All about Beasts and Jungles. Can be very fast out of the gate, but doesn't have the late-game power that some spirits do, and is likely to have some difficulty with Blighted areas. 'Ranging Hunt' is a critical Innate ability, particularly in early-game: it simultaneously gives Beasts mobility and permits picking off a stray Explorers or Towns on most turns. ALLY OF THE BEASTS...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 3,
      defense: 2,
      control: 3,
      fear: 4,
      utility: 1,
    },
    expansion: 'branch-and-claw',
    imageUrl: '/spirits/sharp-fangs-behind-the-leaves.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Sharp_Fangs_Behind_the_Leaves',
  },
  // Jagged Earth (14 spirits)
  {
    name: 'Fractured Days Split the Sky',
    slug: 'fractured-days-split-the-sky',
    complexity: 'Very High',
    elements: ['Moon', 'Air', 'Sun'],
    summary:
      'Put 3 Presence on your starting board: 1 in the lowest-numbered land with 1 Blight, and 2 in the highest-numbered land without Blight. Deal 4 Minor and Major Powers face-up as your initial Days That Never Were cards.',
    description:
      "Put 3 Presence on your starting board: 1 in the lowest-numbered land with 1 Blight, and 2 in the highest-numbered land without Blight. Deal 4 Minor and Major Powers face-up as your initial Days That Never Were cards; in a 1 or 2-player game, instead deal 6 of each. In a 1-board game, gain 1 Time. Excellent at support and sweeping indirect effects, but starts off very limited otherwise. Several of its Unique Powers need setup to use well; it's entirely possible 1 or 2 of them may see no play in a given game. Has...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 3,
      control: 2,
      fear: 1,
      utility: 5,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/fractured-days-split-the-sky.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky',
  },
  {
    name: 'Starlight Seeks Its Form',
    slug: 'starlight-seeks-its-form',
    complexity: 'Very High',
    elements: ['Moon', 'Air', 'Earth', 'Fire', 'Water', 'Plant', 'Animal', 'Sun'],
    summary:
      'A build-your-own-Spirit, capable of going in many different directions based on Elements picked, Growth choices selected, and Power Cards kept.',
    description:
      "A build-your-own-Spirit, capable of going in many different directions based on Elements picked, Growth choices selected, and Power Cards kept. Has a very high personal/visual complexity and a huge number of early-game options, but doesn't alter play much for other players at the table. As it commits to choices, it loses versatility - not all paths will be good (or even possible) at all things. It especially wants a measure of adaptation to early Power Cards, rather than trying to pre-select...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 2,
      control: 1,
      fear: 1,
      utility: 2,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/starlight-seeks-its-form.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Starlight_Seeks_Its_Form',
  },
  {
    name: 'Finder of Paths Unseen',
    slug: 'finder-of-paths-unseen',
    complexity: 'Very High',
    elements: ['Moon', 'Air', 'Water'],
    summary:
      'Put 1 Presence on your starting board in land #3. Put 1 Presence on any board in land #1. Note that you have 6 Unique Power Cards.',
    description:
      "Put 1 Presence on your starting board in land #3. Put 1 Presence on any board in land #1. Note that you have 6 Unique Power Cards. All about moving the Invaders - and sometimes Dahan from time to time. Good at creating Invader-free 'safe-zones,' due to its many movement Powers and its capacity to Isolate. Can't afford to Destroy Invaders too often without a way to re-add Destroyed Presence, so either needs a big-hammer Major Power or to rely on its teammates for offense. Changes the topology of the board, which increases complex...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 2,
      control: 5,
      fear: 1,
      utility: 2,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/finder-of-paths-unseen.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Finder_of_Paths_Unseen',
  },
  {
    name: 'Serpent Slumbering Beneath the Island',
    slug: 'serpent-slumbering-beneath-the-island',
    complexity: 'High',
    elements: ['Fire', 'Water', 'Plant', 'Earth', 'Moon'],
    summary:
      'There are several ways to play the Serpent, but all require patience: early game involves slowly building up Powers and Presence.',
    description:
      "There are several ways to play the Serpent, but all require patience: early game involves slowly building up Powers and Presence. It's not helpless during this time, but it isn't as effective as anyone else. It becomes incredibly powerful after awakening, but getting there requires a lot of time. Make sure to Absorb Essence before you run up against your Presence cap - and to get other players' buy-in before using Absorb Essence on their Presence. Serpent Slumbering Beneath the Island...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 4,
      control: 2,
      fear: 2,
      utility: 5,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/serpent-slumbering-beneath-the-island.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Serpent_Slumbering_Beneath_the_Island',
  },
  {
    name: 'Grinning Trickster Stirs Up Trouble',
    slug: 'grinning-trickster-stirs-up-trouble',
    complexity: 'Moderate',
    elements: ['Moon', 'Fire', 'Air'],
    summary:
      'Put 2 Presence on your starting board: 1 in the highest-numbered land with Dahan, and 1 in land #4.',
    description:
      "Put 2 Presence on your starting board: 1 in the highest-numbered land with Dahan, and 1 in land #4. Requires some comfort with risk: both Overenthusiastic Arson and Let's See What Will Happen involve uncertainty about how the Fast Powers phase will pan out. Can be effective from the get-go, but benefits greatly from not working too hard, instead improving its capacity for mischief by adding Presence and gaining Power Cards. Bonus Energy from Let's See What Will Happen can be extremely helpful in avoiding the dist...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 5,
      control: 3,
      fear: 2,
      utility: 4,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/grinning-trickster-stirs-up-trouble.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Grinning_Trickster_Stirs_Up_Trouble',
  },
  {
    name: 'Lure of the Deep Wilderness',
    slug: 'lure-of-the-deep-wilderness',
    complexity: 'Moderate',
    elements: ['Moon', 'Air', 'Animal', 'Plant'],
    summary:
      'Put 3 Presence on your starting board: 2 in land #8, and 1 in land #7. Add 1 Badlands to land #8.',
    description:
      "Put 3 Presence on your starting board: 2 in land #8, and 1 in land #7. Add 1 Badlands to land #8. Very focused on the interior - its best options for coastal lands are 'draw the Invaders inland' or 'turn Towns/Cities into Badlands, then draw them inland'. Likes the interior to be dangerous, full of Wilds, Badlands, Beasts, and Disease, ideally where its Presence is. Has better-than-average potential for containing Invaders and setting up a zone safe from Explores, but the coasts may get messy while doing so.",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 2,
      control: 4,
      fear: 4,
      utility: 1,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/lure-of-the-deep-wilderness.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Lure_of_the_Deep_Wilderness',
  },
  {
    name: 'Many Minds Move as One',
    slug: 'many-minds-move-as-one',
    complexity: 'Moderate',
    elements: ['Air', 'Animal'],
    summary:
      'Put 1 Presence and 1 Beasts on your starting board, in a land with Dahan. Note that you have 5 Unique Power Cards.',
    description:
      'Put 1 Presence and 1 Beasts on your starting board, in a land with Dahan. Note that you have 5 Unique Power Cards. Requires heavy spatial thought for Beasts movement, due to its improved Push/Gather and large numbers of Beasts. Has no offense to start with, but an excellent stalling defense combined with Fear generation; outright Fear victories may be plausible in smaller games. Both Fear Cards and Beasts events are unpredictable, however, so swings of fortune are apt to be more relevant than usual.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 5,
      control: 5,
      fear: 5,
      utility: 1,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/many-minds-move-as-one.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Many_Minds_Move_as_One',
  },
  {
    name: 'Shifting Memory of Ages',
    slug: 'shifting-memory-of-ages',
    complexity: 'Moderate',
    elements: ['Moon', 'Air', 'Earth'],
    summary:
      'Put 2 Presence on your starting board in the highest-numbered land that is Sands or Mountain. Prepare 1 Sun, 1 Moon, and 1 Air marker (put them by your Special Rules).',
    description:
      'Put 2 Presence on your starting board in the highest-numbered land that is Sands or Mountain. Prepare 1 Sun, 1 Moon, and 1 Air marker (put them by your Special Rules). Starts with little ability to influence the board - most of what it does in that regard will come from new Power Cards. Extremely good with Major Powers and usually wants to take them early and often. Can either try sprinting towards victory with its phenomenal Energy Growth or build up towards becoming a late-game powerhouse.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 4,
      control: 2,
      fear: 2,
      utility: 5,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/shifting-memory-of-ages.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Shifting_Memory_of_Ages',
  },
  {
    name: "Stone's Unyielding Defiance",
    slug: 'stones-unyielding-defiance',
    complexity: 'Moderate',
    elements: ['Earth', 'Plant', 'Sun'],
    summary:
      'Put 2 Presence on your starting board: 1 in the lowest-numbered Mountain without Blight; 1 in an adjacent land that has Dahan (if possible) or is Sands (if not).',
    description:
      'Put 2 Presence on your starting board: 1 in the lowest-numbered Mountain without Blight; 1 in an adjacent land that has Dahan (if possible) or is Sands (if not). Most of its special rules and innates require being where the Invaders are - particularly in the worst, most-overrun lands, so it can mitigate incoming Blight and (eventually) destroy the Invaders with their own Ravages. Does best with the patience to build up a position over time, and the temperance to hold some Energy in reserve so it can take advant...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 5,
      control: 2,
      fear: 1,
      utility: 2,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/stones-unyielding-defiance.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Stone%27s_Unyielding_Defiance',
  },
  {
    name: 'Volcano Looming High',
    slug: 'volcano-looming-high',
    complexity: 'Moderate',
    elements: ['Fire', 'Earth', 'Air'],
    summary:
      'Put 1 Presence and 1 Badlands on your starting board in a mountain of your choice. Push all Dahan from that land.',
    description:
      'Put 1 Presence and 1 Badlands on your starting board in a mountain of your choice. Push all Dahan from that land. Benefits more than most Spirits from getting Presence onto the board; in addition to the usual benefits, it can fuel an Explosive Eruption. This can result in a huge turn, but if overdone the following turn or two may be very constrained. Bigger eruptions are extremely powerful, but cause Blight, and the Invaders may not provide the luxury of enough time to build up the desired pressure - judging the timing of when...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 1,
      fear: 2,
      utility: 3,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/volcano-looming-high.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Volcano_Looming_High',
  },
  {
    name: 'Shroud of Silent Mist',
    slug: 'shroud-of-silent-mist',
    complexity: 'High',
    elements: ['Moon', 'Air', 'Water'],
    summary:
      'Put 2 Presence on your starting board: 1 in the highest-numbered Wetland and 1 in the highest-numbered Mountain.',
    description:
      'Put 2 Presence on your starting board: 1 in the highest-numbered Wetland and 1 in the highest-numbered Mountain. Constantly shifting and moving its Presence around the board. Hurt more than most by Presence loss due to its desire to surround and envelop the Invaders. Can (slowly) clear the most built-up of lands, but its real strength is the free Fear from Slow and Silent Death.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 2,
      control: 4,
      fear: 5,
      utility: 1,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/shroud-of-silent-mist.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Shroud_of_Silent_Mist',
  },
  {
    name: 'Vengeance as a Burning Plague',
    slug: 'vengeance-as-a-burning-plague',
    complexity: 'High',
    elements: ['Fire', 'Animal', 'Water', 'Air'],
    summary:
      '1 of your Presence starts the game already Destroyed. Put 2 Presence on your starting board: 1 in a land with Blight, 1 in a Wetland without Blight.',
    description:
      '1 of your Presence starts the game already Destroyed. Put 2 Presence on your starting board: 1 in a land with Blight, 1 in a Wetland without Blight. Not so powerful early, but can be a late-game juggernaut, especially if things are going badly: Blight adds to its Damage and its Presence being Destroyed adds Fear. It may even want to engineer these situations, which can make other Spirits nervous (and be risky if things go poorly). When Blight would prevent a Build on a board with your Presence, you may let the Build happen (removing no Blight). If you do, 1 Fear.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 2,
      fear: 3,
      utility: 1,
    },
    expansion: 'jagged-earth',
    imageUrl: '/spirits/vengeance-as-a-burning-plague.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Vengeance_as_a_Burning_Plague',
  },
  // Feather and Flame (2 spirits)
  {
    name: 'Heart of the Wildfire',
    slug: 'heart-of-the-wildfire',
    complexity: 'High',
    elements: ['Fire', 'Plant'],
    summary:
      'Put 3 Presence and 2 Blight on your starting board in the highest-numbered Sands. (Blight comes from the box, not the Blight Card)',
    description:
      'Put 3 Presence and 2 Blight on your starting board in the highest-numbered Sands. (Blight comes from the box, not the Blight Card) Starts with good offense and gets better from there, but lays down Blight as it grows. The smaller the game, the more restraint is needed to prevent tipping the island over into being completely Blighted. The Wildfire can heal the land where it is, but may benefit from other Blight removal Powers so it can add Presence to problem lands without triggering Blight cascade. Removing Blig...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 3,
      fear: 4,
      utility: 2,
    },
    expansion: 'feather-and-flame',
    imageUrl: '/spirits/heart-of-the-wildfire.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Heart_of_the_Wildfire',
  },
  {
    name: 'Downpour Drenches the World',
    slug: 'downpour-drenches-the-world',
    complexity: 'High',
    elements: ['Water', 'Air', 'Earth', 'Plant'],
    summary: 'Put 1 Presence on your starting board in the lowest-numbered Wetlands.',
    description:
      "Put 1 Presence on your starting board in the lowest-numbered Wetlands. Cares about the question 'How useful is this Power in the current context?' even more than most Spirits; it rarely plays all its Power Cards in any given Reclaim cycle (some get discarded to Growth), and for those it does play, it often has the option of using them multiple times. Benefits even more than most Spirits from having lots of Presence on the board, both for Rain and Mud Suppress Conflict and to facilitate its Unique Pow...",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 5,
      control: 3,
      fear: 1,
      utility: 3,
    },
    expansion: 'feather-and-flame',
    imageUrl: '/spirits/downpour-drenches-the-world.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Downpour_Drenches_the_World',
  },
  // Horizons of Spirit Island (5 spirits)
  {
    name: 'Devouring Teeth Lurk Underfoot',
    slug: 'devouring-teeth-lurk-underfoot',
    complexity: 'Low',
    elements: ['Fire', 'Animal', 'Earth'],
    summary: 'You start with your 4 Unique Power Cards and 0 Energy.',
    description:
      'You start with your 4 Unique Power Cards and 0 Energy. Likes being in the same lands as Invaders, so it can use Range 0 offensive and defensive Powers. The first of its Innate Power can give some mobility, if needed. Has a poor Plays track and potent but expensive Unique Powers, so can be better at handling fewer large threats than lots of little ones.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 2,
      fear: 2,
      utility: 1,
    },
    expansion: 'horizons',
    imageUrl: '/spirits/devouring-teeth-lurk-underfoot.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Devouring_Teeth_Lurk_Underfoot',
  },
  {
    name: 'Eyes Watch from the Trees',
    slug: 'eyes-watch-from-the-trees',
    complexity: 'Low',
    elements: ['Moon', 'Plant', 'Air'],
    summary: 'Put 2 Presence on your starting board, in the highest-numbered Jungle.',
    description:
      'Put 2 Presence on your starting board, in the highest-numbered Jungle. Good at Defending against Ravages, and at steadily earning Fear. Its ability to Gather Dahan to fight back when Defending can make a huge difference, changing a stalling tactic into a blow against the Invaders.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 5,
      control: 3,
      fear: 4,
      utility: 1,
    },
    expansion: 'horizons',
    imageUrl: '/spirits/eyes-watch-from-the-trees.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Eyes_Watch_from_the_Trees',
  },
  {
    name: 'Fathomless Mud of the Swamp',
    slug: 'fathomless-mud-of-the-swamp',
    complexity: 'Low',
    elements: ['Water', 'Moon', 'Earth'],
    summary: 'Put 2 Presence on your starting board, in the lowest-numbered Wetland.',
    description:
      'Put 2 Presence on your starting board, in the lowest-numbered Wetland. Likes having Presence where Invaders will Build, but may need to re-create those Presence after oozing outwards with its Innate Power. In smaller games, might be able to cut off the most Inland lands from Explore actions by Destroying Inland Towns/Cities and stopping new ones from being built. Causes a fair bit of Fear, much of which represents unpleasantness, hardship, and disgust.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 3,
      defense: 3,
      control: 2,
      fear: 3,
      utility: 2,
    },
    expansion: 'horizons',
    imageUrl: '/spirits/fathomless-mud-of-the-swamp.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Fathomless_Mud_of_the_Swamp',
  },
  {
    name: 'Rising Heat of Stone and Sand',
    slug: 'rising-heat-of-stone-and-sand',
    complexity: 'Low',
    elements: ['Fire', 'Air', 'Earth'],
    summary: 'Put 2 Presence on your starting board, in the highest-numbered Sands.',
    description:
      "Put 2 Presence on your starting board, in the highest-numbered Sands. You start with your 4 Unique Power Cards and 0 Energy. Weaken-and-Destroy. Likes having Presence where there's Towns/Cities, as it makes all Spirits' Damage more effective there.",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 2,
      control: 3,
      fear: 1,
      utility: 3,
    },
    expansion: 'horizons',
    imageUrl: '/spirits/rising-heat-of-stone-and-sand.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Rising_Heat_of_Stone_and_Sand',
  },
  {
    name: 'Sun-Bright Whirlwind',
    slug: 'sun-bright-whirlwind',
    complexity: 'Low',
    elements: ['Sun', 'Air'],
    summary:
      'Put 3 Presence on your starting board: 1 in the highest-numbered Sands, 2 in the lowest-numbered Mountain.',
    description:
      "Put 3 Presence on your starting board: 1 in the highest-numbered Sands, 2 in the lowest-numbered Mountain. Incredibly good at handling Explorers, clearing newly-Explored lands of Invaders so they don't Build there. Not nearly so good at dealing with Towns/Cities. Can focus on Energy and largely forego its Innate Power, focus on Plays to aim for mid-to-high Innate thresholds, or strike a more balanced path. Adds at most 1 Presence per turn, so there won't be time to do it all.",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 3,
      defense: 1,
      control: 5,
      fear: 1,
      utility: 3,
    },
    expansion: 'horizons',
    imageUrl: '/spirits/sun-bright-whirlwind.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Sun-Bright_Whirlwind',
  },
  // Nature Incarnate (8 spirits)
  {
    name: 'Ember-Eyed Behemoth',
    slug: 'ember-eyed-behemoth',
    complexity: 'Moderate',
    elements: ['Fire', 'Earth', 'Plant'],
    summary:
      'Put 2 Presence and Incarna, Unempowered side up, in the highest-numbered Wetland on your starting board that is adjacent to any Jungle.',
    description:
      'Put 2 Presence and Incarna, Unempowered side up, in the highest-numbered Wetland on your starting board that is adjacent to any Jungle. You start with your 4 Unique Power Cards and 0 Energy. Slowly but consistently stomps its Incarna around the island, smashing Invaders. (Explorers can keep clear, unless it really gets going.)',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 1,
      control: 1,
      fear: 1,
      utility: 2,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/ember-eyed-behemoth.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Ember-Eyed_Behemoth',
  },
  {
    name: 'Hearth-Vigil',
    slug: 'hearth-vigil',
    complexity: 'Moderate',
    elements: ['Sun', 'Earth', 'Animal', 'Air'],
    summary:
      "Put 3 Presence on your starting board: 1 in the highest-numbered land with Dahan and 2 in the lowest-numbered land with at least 2 Dahan. Add 1 Dahan in each of those lands (additional survivors of the Invaders' diseases).",
    description:
      "Put 3 Presence on your starting board: 1 in the highest-numbered land with Dahan and 2 in the lowest-numbered land with at least 2 Dahan. Add 1 Dahan in each of those lands (additional survivors of the Invaders' diseases). You start with your 4 Unique Power Cards and 1 Energy. Very good at protecting Dahan in its lands, not so great at stopping Blight. In keeping with its nature, largely brings Presence to its Dahan (or vice versa); getting Presence elsewhere may require a bit of forethought with Keep Watch for New Incursions.",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 3,
      defense: 4,
      control: 1,
      fear: 2,
      utility: 4,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/hearth-vigil.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Hearth-Vigil',
  },
  {
    name: 'Towering Roots of the Jungle',
    slug: 'towering-roots-of-the-jungle',
    complexity: 'Moderate',
    elements: ['Sun', 'Plant', 'Earth', 'Moon'],
    summary:
      'Put 3 Presence on your starting board: 1 in the highest-numbered Jungle without Blight, 1 in the highest-numbered Mountain, and 1 in the highest-numbered Wetland. Put Incarna, Unempowered side up, in the Jungle with your Presence.',
    description:
      'Put 3 Presence on your starting board: 1 in the highest-numbered Jungle without Blight, 1 in the highest-numbered Mountain, and 1 in the highest-numbered Wetland. Put Incarna, Unempowered side up, in the Jungle with your Presence. You start with your 4 Unique Power Cards and 0 Energy. Incredibly good at protecting everything at its Incarna - and can draw Invaders towards there - but is constrained in when and where it can move its Incarna. Has some ability to Remove Invaders (driving them from the island), but starts off vastly bet...',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 1,
      defense: 5,
      control: 3,
      fear: 2,
      utility: 2,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/towering-roots-of-the-jungle.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Towering_Roots_of_the_Jungle',
  },
  {
    name: 'Breath of Darkness Down Your Spine',
    slug: 'breath-of-darkness-down-your-spine',
    complexity: 'High',
    elements: ['Moon', 'Animal', 'Air'],
    summary:
      'Put 2 Presence and your Incarna, Unempowered, on your starting board: 1 Presence and Incarna in the lowest-numbered Jungle and 1 in the highest-numbered Jungle. Set The Endless Dark tile next to the island with 1 Fear on it.',
    description:
      'Put 2 Presence and your Incarna, Unempowered, on your starting board: 1 Presence and Incarna in the lowest-numbered Jungle and 1 in the highest-numbered Jungle. Set The Endless Dark tile next to the island with 1 Fear on it. You start with your 4 Unique Power Cards and 0 Energy. Abducts lone Invaders to gain Fear and keep them off the board for a time; its mobile Incarna is particularly useful for this. Reclaiming permits the Invaders to escape its void en masse, so can be quite painful.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 1,
      control: 4,
      fear: 5,
      utility: 2,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/breath-of-darkness-down-your-spine.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Breath_of_Darkness_Down_Your_Spine',
  },
  {
    name: 'Relentless Gaze of the Sun',
    slug: 'relentless-gaze-of-the-sun',
    complexity: 'High',
    elements: ['Sun', 'Fire', 'Air', 'Water', 'Plant'],
    summary: 'Put 2 Presence and 1 Badlands on your starting board, in the lowest-numbered Sands.',
    description:
      'Put 2 Presence and 1 Badlands on your starting board, in the lowest-numbered Sands. You start with your 4 Unique Power Cards and 0 Energy. Uses stacks of 3 Presence and high Energy income to hammer the same lands with repeated Power Cards. Because of its single-mindedness, is better at dealing with large problems than smaller ones.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 2,
      control: 1,
      fear: 3,
      utility: 3,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/relentless-gaze-of-the-sun.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Relentless_Gaze_of_the_Sun',
  },
  {
    name: 'Wandering Voice Keens Delirium',
    slug: 'wandering-voice-keens-delirium',
    complexity: 'High',
    elements: ['Air', 'Moon', 'Sun'],
    summary:
      'Put 2 Presence on your starting board: 1 in land #6 and 1 in land #7. Put Incarna, Unempowered side up, on your starting board in land #6.',
    description:
      'Put 2 Presence on your starting board: 1 in land #6 and 1 in land #7. Put Incarna, Unempowered side up, on your starting board in land #6. You start with your 4 Unique Power Cards and 0 Energy. Very positional; has a highly mobile Incarna (particularly with lots of Presence) that adds Strife and chases Explorers/Towns around as it roams the island.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 2,
      defense: 1,
      control: 5,
      fear: 3,
      utility: 2,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/wandering-voice-keens-delirium.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Wandering_Voice_Keens_Delirium',
  },
  {
    name: 'Wounded Waters Bleeding',
    slug: 'wounded-waters-bleeding',
    complexity: 'High',
    elements: ['Water', 'Animal'],
    summary:
      'On your starting board, put 2 Presence in a land with Dahan, then put 2 Presence and 1 Blight (from the box) in the highest-numbered land with a Setup Symbol.',
    description:
      'On your starting board, put 2 Presence in a land with Dahan, then put 2 Presence and 1 Blight (from the box) in the highest-numbered land with a Setup Symbol. You start with your 4 Unique Power Cards and 4 Energy. Set your 4 Healing Cards nearby. Starts off wounded, losing a Presence or a Power Card every turn. Heals over the course of the game, finding a new nature - while some choices may be a touch better or worse due to Adversary, Power Card picks, teammates, etc., most combinations are viable in most games.',
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 4,
      defense: 1,
      control: 5,
      fear: 2,
      utility: 1,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/wounded-waters-bleeding.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Wounded_Waters_Bleeding',
  },
  {
    name: 'Dances Up Earthquakes',
    slug: 'dances-up-earthquakes',
    complexity: 'Very High',
    elements: ['Earth', 'Moon', 'Fire'],
    summary: 'Put 1 Presence on your starting board in the highest-numbered land with Dahan.',
    description:
      "Put 1 Presence on your starting board in the highest-numbered land with Dahan. You start with your 6 Unique Power Cards and 0 Energy. Set the Quake Tokens nearby. Very much about tempo and timing: Can play high-cost Powers extremely easily, but they won't take effect until later in the game. Faces a constant tension between solving problems now and carefully planning ahead for big turns in the future - neglecting either one can be disastrous.",
    strengths: [],
    weaknesses: [],
    powerRatings: {
      offense: 5,
      defense: 3,
      control: 2,
      fear: 2,
      utility: 4,
    },
    expansion: 'nature-incarnate',
    imageUrl: '/spirits/dances-up-earthquakes.webp',
    wikiUrl: 'https://spiritislandwiki.com/index.php?title=Dances_Up_Earthquakes',
  },
]

// ============================================================================
// ASPECT DATA INTERFACE
// ============================================================================

export interface AspectData {
  name: string // "Sunshine"
  baseSpiritSlug: string // "river-surges-in-sunlight"
  summary: string
  expansion: ExpansionSlug
  complexityModifier: 'easier' | 'same' | 'harder'
  imageUrl?: string // undefined means use base spirit image
}

// ============================================================================
// ASPECTS (31 total)
// ============================================================================

export const ASPECTS: AspectData[] = [
  // Lightning's Swift Strike aspects (4)
  {
    name: 'Pandemonium',
    baseSpiritSlug: 'lightnings-swift-strike',
    summary: 'Chaotic lightning that scatters invaders unpredictably.',
    expansion: 'jagged-earth',
    complexityModifier: 'harder',
    imageUrl: '/spirits/lightnings-swift-strike-pandemonium.webp',
  },
  {
    name: 'Wind',
    baseSpiritSlug: 'lightnings-swift-strike',
    summary: 'Swift spirit that prioritizes movement and flexibility over raw damage.',
    expansion: 'jagged-earth',
    complexityModifier: 'harder',
    imageUrl: '/spirits/lightnings-swift-strike-wind.webp',
  },
  {
    name: 'Immense',
    baseSpiritSlug: 'lightnings-swift-strike',
    summary: 'Massive presence with devastating area attacks.',
    expansion: 'promo-pack-2',
    complexityModifier: 'harder',
    imageUrl: '/spirits/lightnings-swift-strike-immense.webp',
  },
  {
    name: 'Sparking',
    baseSpiritSlug: 'lightnings-swift-strike',
    summary: 'Focused on efficient, repeated small strikes.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/lightnings-swift-strike-sparking.webp',
  },
  // River Surges in Sunlight aspects (3)
  {
    name: 'Sunshine',
    baseSpiritSlug: 'river-surges-in-sunlight',
    summary: 'Emphasizes Sun and energy income, with radiant presence.',
    expansion: 'jagged-earth',
    complexityModifier: 'harder',
    imageUrl: '/spirits/river-surges-in-sunlight-sunshine.webp',
  },
  {
    name: 'Travel',
    baseSpiritSlug: 'river-surges-in-sunlight',
    summary: "Mobile spirit that flows across the island to where it's needed.",
    expansion: 'promo-pack-2',
    complexityModifier: 'harder',
    imageUrl: '/spirits/river-surges-in-sunlight-travel.webp',
  },
  {
    name: 'Haven',
    baseSpiritSlug: 'river-surges-in-sunlight',
    summary: 'Protective spirit focused on defending sacred sites.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/river-surges-in-sunlight-haven.webp',
  },
  // Shadows Flicker Like Flame aspects (5)
  {
    name: 'Madness',
    baseSpiritSlug: 'shadows-flicker-like-flame',
    summary: 'Induces terror and insanity in the Invaders.',
    expansion: 'jagged-earth',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shadows-flicker-like-flame-madness.webp',
  },
  {
    name: 'Reach',
    baseSpiritSlug: 'shadows-flicker-like-flame',
    summary: 'Extended range allows targeting distant lands with ease.',
    expansion: 'jagged-earth',
    complexityModifier: 'easier',
    imageUrl: '/spirits/shadows-flicker-like-flame-reach.webp',
  },
  {
    name: 'Amorphous',
    baseSpiritSlug: 'shadows-flicker-like-flame',
    summary: 'Shapeshifting presence that flows between lands.',
    expansion: 'promo-pack-2',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shadows-flicker-like-flame-amorphous.webp',
  },
  {
    name: 'Foreboding',
    baseSpiritSlug: 'shadows-flicker-like-flame',
    summary: 'Builds dread and anticipation before striking.',
    expansion: 'promo-pack-2',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shadows-flicker-like-flame-foreboding.webp',
  },
  {
    name: 'Dark Fire',
    baseSpiritSlug: 'shadows-flicker-like-flame',
    summary: 'Combines shadow and flame for devastating attacks.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shadows-flicker-like-flame-dark-fire.webp',
  },
  // Vital Strength of the Earth aspects (3)
  {
    name: 'Resilience',
    baseSpiritSlug: 'vital-strength-of-the-earth',
    summary: 'Endures punishment and slowly wears down the Invaders.',
    expansion: 'jagged-earth',
    complexityModifier: 'harder',
    imageUrl: '/spirits/vital-strength-of-the-earth-resilience.webp',
  },
  {
    name: 'Might',
    baseSpiritSlug: 'vital-strength-of-the-earth',
    summary: 'Raw power focused on crushing the Invaders directly.',
    expansion: 'promo-pack-2',
    complexityModifier: 'harder',
    imageUrl: '/spirits/vital-strength-of-the-earth-might.webp',
  },
  {
    name: 'Nourishing',
    baseSpiritSlug: 'vital-strength-of-the-earth',
    summary: 'Supports growth and healing across the island.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/vital-strength-of-the-earth-nourishing.webp',
  },
  // A Spread of Rampant Green aspects (2)
  {
    name: 'Regrowth',
    baseSpiritSlug: 'a-spread-of-rampant-green',
    summary: 'Focuses on healing Blight and restoring the land.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/a-spread-of-rampant-green-regrowth.webp',
  },
  {
    name: 'Tangles',
    baseSpiritSlug: 'a-spread-of-rampant-green',
    summary: 'Entangling vines that trap and slow Invaders.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/a-spread-of-rampant-green-tangles.webp',
  },
  // Bringer of Dreams and Nightmares aspects (2)
  {
    name: 'Enticing',
    baseSpiritSlug: 'bringer-of-dreams-and-nightmares',
    summary: 'Lures Invaders into dangerous situations with pleasant dreams.',
    expansion: 'nature-incarnate',
    complexityModifier: 'same',
    imageUrl: '/spirits/bringer-of-dreams-and-nightmares-enticing.webp',
  },
  {
    name: 'Violence',
    baseSpiritSlug: 'bringer-of-dreams-and-nightmares',
    summary: 'Nightmares become deadly, dealing actual damage.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/bringer-of-dreams-and-nightmares-violence.webp',
  },
  // Heart of the Wildfire aspects (1)
  {
    name: 'Transforming',
    baseSpiritSlug: 'heart-of-the-wildfire',
    summary: 'Fire that changes the land rather than just destroying.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/heart-of-the-wildfire-transforming.webp',
  },
  // Keeper of the Forbidden Wilds aspects (1)
  {
    name: 'Spreading Hostility',
    baseSpiritSlug: 'keeper-of-the-forbidden-wilds',
    summary: 'Wilds spread more aggressively across the island.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/keeper-of-the-forbidden-wilds-spreading-hostility.webp',
  },
  // Lure of the Deep Wilderness aspects (1)
  {
    name: 'Lair',
    baseSpiritSlug: 'lure-of-the-deep-wilderness',
    summary: 'Creates a central den that draws prey inward.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/lure-of-the-deep-wilderness-lair.webp',
  },
  // Ocean's Hungry Grasp aspects (1)
  {
    name: 'Deeps',
    baseSpiritSlug: 'oceans-hungry-grasp',
    summary: 'Reaches further inland with abyssal power.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/oceans-hungry-grasp-deeps.webp',
  },
  // Serpent Slumbering Beneath the Island aspects (1)
  {
    name: 'Locus',
    baseSpiritSlug: 'serpent-slumbering-beneath-the-island',
    summary: 'Awakens through a central point of power.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/serpent-slumbering-beneath-the-island-locus.webp',
  },
  // Sharp Fangs Behind the Leaves aspects (2)
  {
    name: 'Encircle',
    baseSpiritSlug: 'sharp-fangs-behind-the-leaves',
    summary: 'Pack tactics that surround and trap prey.',
    expansion: 'nature-incarnate',
    complexityModifier: 'same',
    imageUrl: '/spirits/sharp-fangs-behind-the-leaves-encircle.webp',
  },
  {
    name: 'Unconstrained',
    baseSpiritSlug: 'sharp-fangs-behind-the-leaves',
    summary: 'Beasts roam freely without territorial limits.',
    expansion: 'nature-incarnate',
    complexityModifier: 'easier',
    imageUrl: '/spirits/sharp-fangs-behind-the-leaves-unconstrained.webp',
  },
  // Shifting Memory of Ages aspects (2)
  {
    name: 'Intensify',
    baseSpiritSlug: 'shifting-memory-of-ages',
    summary: 'Amplifies the power of remembered elements.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shifting-memory-of-ages-intensify.webp',
  },
  {
    name: 'Mentor',
    baseSpiritSlug: 'shifting-memory-of-ages',
    summary: 'Shares ancient knowledge with other spirits.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/shifting-memory-of-ages-mentor.webp',
  },
  // Shroud of Silent Mist aspects (1)
  {
    name: 'Stranded',
    baseSpiritSlug: 'shroud-of-silent-mist',
    summary: 'Isolates Invaders in the mist, cutting them off.',
    expansion: 'nature-incarnate',
    complexityModifier: 'easier',
    imageUrl: '/spirits/shroud-of-silent-mist-stranded.webp',
  },
  // Thunderspeaker aspects (2)
  {
    name: 'Tactician',
    baseSpiritSlug: 'thunderspeaker',
    summary: 'Strategic positioning of Dahan for maximum effect.',
    expansion: 'nature-incarnate',
    complexityModifier: 'same',
    imageUrl: '/spirits/thunderspeaker-tactician.webp',
  },
  {
    name: 'Warrior',
    baseSpiritSlug: 'thunderspeaker',
    summary: 'Leads the Dahan in direct combat against Invaders.',
    expansion: 'nature-incarnate',
    complexityModifier: 'harder',
    imageUrl: '/spirits/thunderspeaker-warrior.webp',
  },
]
