/**
 * Spirit Island scenario reference data
 */
export const SCENARIOS = [
  { name: 'No Scenario', difficulty: 0 },
  { name: 'Blitz', difficulty: 0 },
  { name: "Guard the Isle's Heart", difficulty: 0 },
  { name: 'Rituals of Terror', difficulty: 3 },
  { name: 'Dahan Insurrection', difficulty: 4 },
  { name: 'Second Wave', difficulty: 1 },
  { name: 'Powers Long Forgotten', difficulty: 1 },
  { name: 'Ward the Shores', difficulty: 2 },
  { name: 'Rituals of the Destroying Flame', difficulty: 3 },
  { name: 'Elemental Invocation', difficulty: 1 },
  { name: 'Despicable Theft', difficulty: 2 },
  { name: 'The Great River', difficulty: 3 },
  { name: 'A Diversity of Spirits', difficulty: 0 },
] as const

/**
 * Win types for detailed outcome tracking
 * Spirit Island victory conditions based on Terror Level
 */
export const WIN_TYPES = [
  'Fear Victory',
  'Terror Level 1 Victory',
  'Terror Level 2 Victory',
  'Terror Level 3 Victory',
] as const

/**
 * Loss types for detailed outcome tracking
 * Spirit Island official loss conditions
 */
export const LOSS_TYPES = [
  'Blighted Island',
  'Spirit Destroyed',
  'Time Ran Out',
  'Scenario/Adversary',
] as const
