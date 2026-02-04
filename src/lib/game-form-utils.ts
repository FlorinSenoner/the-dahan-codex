import type { GameFormData } from '@/components/games/game-form'

/**
 * Transform GameFormData to Convex mutation payload format
 * Shared between new game creation and game updates
 */
export function transformGameFormToPayload(data: GameFormData) {
  // Include spirits with either a spiritId (picked from dropdown) or a name (imported from CSV)
  const validSpirits = data.spirits.filter((s) => s.spiritId !== null || s.name)

  return {
    date: data.date,
    result: data.result,
    spirits: validSpirits.map((s) => ({
      spiritId: s.spiritId ?? undefined,
      name: s.name,
      variant: s.variant,
      player: s.player,
    })),
    adversary: data.adversary ?? undefined,
    secondaryAdversary: data.secondaryAdversary ?? undefined,
    scenario: data.scenario ?? undefined,
    winType: data.winType || undefined,
    invaderStage: data.invaderStage,
    blightCount: data.blightCount,
    dahanCount: data.dahanCount,
    cardsRemaining: data.cardsRemaining,
    score: data.score,
    notes: data.notes || undefined,
  }
}
