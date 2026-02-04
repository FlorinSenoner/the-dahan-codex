import type { Doc } from 'convex/_generated/dataModel'
import Papa from 'papaparse'
import { type GameCSVRow, getSpiritAtIndex } from './csv-spirits'

/**
 * Convert games to CSV rows with fixed column structure
 */
function gamesToCSVRows(games: Doc<'games'>[]): GameCSVRow[] {
  return games.map((game) => {
    const s1 = getSpiritAtIndex(game.spirits, 0)
    const s2 = getSpiritAtIndex(game.spirits, 1)
    const s3 = getSpiritAtIndex(game.spirits, 2)
    const s4 = getSpiritAtIndex(game.spirits, 3)
    const s5 = getSpiritAtIndex(game.spirits, 4)
    const s6 = getSpiritAtIndex(game.spirits, 5)

    return {
      id: game._id,
      date: game.date,
      result: game.result,
      spirit1: s1.name,
      spirit1_variant: s1.variant,
      spirit1_player: s1.player,
      spirit2: s2.name,
      spirit2_variant: s2.variant,
      spirit2_player: s2.player,
      spirit3: s3.name,
      spirit3_variant: s3.variant,
      spirit3_player: s3.player,
      spirit4: s4.name,
      spirit4_variant: s4.variant,
      spirit4_player: s4.player,
      spirit5: s5.name,
      spirit5_variant: s5.variant,
      spirit5_player: s5.player,
      spirit6: s6.name,
      spirit6_variant: s6.variant,
      spirit6_player: s6.player,
      adversary: game.adversary?.name ?? '',
      adversary_level: game.adversary?.level?.toString() ?? '',
      secondary_adversary: game.secondaryAdversary?.name ?? '',
      secondary_adversary_level: game.secondaryAdversary?.level?.toString() ?? '',
      scenario: game.scenario?.name ?? '',
      scenario_difficulty: game.scenario?.difficulty?.toString() ?? '',
      win_type: game.winType ?? '',
      invader_stage: game.invaderStage?.toString() ?? '',
      blight_count: game.blightCount?.toString() ?? '',
      dahan_count: game.dahanCount?.toString() ?? '',
      cards_remaining: game.cardsRemaining?.toString() ?? '',
      score: game.score?.toString() ?? '',
      notes: game.notes ?? '',
    }
  })
}

/**
 * Trigger browser download of a CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Export games to CSV and trigger browser download
 */
export function exportGamesToCSV(games: Doc<'games'>[]): void {
  const rows = gamesToCSVRows(games)

  const csv = Papa.unparse(rows, {
    quotes: true, // Quote all fields for Excel compatibility
    header: true,
  })

  const today = new Date().toISOString().split('T')[0]
  downloadCSV(csv, `spirit-island-games-${today}.csv`)
}
