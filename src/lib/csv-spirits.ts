/**
 * Shared constants and utilities for CSV spirit field handling
 * Used by both csv-import.ts and csv-export.ts
 */

/**
 * CSV column structure for game import/export
 * Fixed columns for Excel compatibility - spirits 1-6 have dedicated columns
 */
export interface GameCSVRow {
  id: string
  date: string
  result: string
  spirit1: string
  spirit1_variant: string
  spirit1_player: string
  spirit2: string
  spirit2_variant: string
  spirit2_player: string
  spirit3: string
  spirit3_variant: string
  spirit3_player: string
  spirit4: string
  spirit4_variant: string
  spirit4_player: string
  spirit5: string
  spirit5_variant: string
  spirit5_player: string
  spirit6: string
  spirit6_variant: string
  spirit6_player: string
  adversary: string
  adversary_level: string
  secondary_adversary: string
  secondary_adversary_level: string
  scenario: string
  scenario_difficulty: string
  win_type: string
  invader_stage: string
  blight_count: string
  dahan_count: string
  cards_remaining: string
  score: string
  notes: string
}

interface SpiritFieldData {
  name: string
  variant: string
  player: string
}

/**
 * Extract spirits from a CSV row with spirit1-spirit6 columns
 * Returns only spirits that have a name (filters empty slots)
 */
export function extractSpiritsFromRow(row: {
  spirit1?: string
  spirit1_variant?: string
  spirit1_player?: string
  spirit2?: string
  spirit2_variant?: string
  spirit2_player?: string
  spirit3?: string
  spirit3_variant?: string
  spirit3_player?: string
  spirit4?: string
  spirit4_variant?: string
  spirit4_player?: string
  spirit5?: string
  spirit5_variant?: string
  spirit5_player?: string
  spirit6?: string
  spirit6_variant?: string
  spirit6_player?: string
}): SpiritFieldData[] {
  return [
    {
      name: row.spirit1 || '',
      variant: row.spirit1_variant || '',
      player: row.spirit1_player || '',
    },
    {
      name: row.spirit2 || '',
      variant: row.spirit2_variant || '',
      player: row.spirit2_player || '',
    },
    {
      name: row.spirit3 || '',
      variant: row.spirit3_variant || '',
      player: row.spirit3_player || '',
    },
    {
      name: row.spirit4 || '',
      variant: row.spirit4_variant || '',
      player: row.spirit4_player || '',
    },
    {
      name: row.spirit5 || '',
      variant: row.spirit5_variant || '',
      player: row.spirit5_player || '',
    },
    {
      name: row.spirit6 || '',
      variant: row.spirit6_variant || '',
      player: row.spirit6_player || '',
    },
  ].filter((s) => s.name)
}

/**
 * Get spirit info at a specific index from an array
 * Returns empty strings for missing spirits
 */
export function getSpiritAtIndex(
  spirits: Array<{ name?: string; variant?: string; player?: string }>,
  index: number,
): SpiritFieldData {
  const spirit = spirits[index]
  return {
    name: spirit?.name ?? '',
    variant: spirit?.variant ?? '',
    player: spirit?.player ?? '',
  }
}
