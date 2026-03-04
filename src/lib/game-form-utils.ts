import type { GameFormData } from '@/components/games/game-form'
import type { GameCreateInput, GameUpdateInput } from '@/types/convex'

function normalizeSpiritId(spiritId: GameCreateInput['spirits'][number]['spiritId']) {
  if (!spiritId) return undefined

  // Synthetic IDs from non-Convex snapshot exports (for example "spirit_<slug>")
  // must never be sent to Convex id validators.
  const raw = String(spiritId)
  if (raw.startsWith('spirit_') || raw.startsWith('aspect_')) {
    return undefined
  }

  return spiritId
}

type GamePayload = GameCreateInput | GameUpdateInput

export function sanitizeGamePayload<TPayload extends GamePayload>(payload: TPayload): TPayload {
  if (!payload.spirits) {
    return payload
  }

  return {
    ...payload,
    spirits: payload.spirits.map((spirit) => ({
      ...spirit,
      spiritId: normalizeSpiritId(spirit.spiritId),
    })),
  } as TPayload
}

/**
 * Transform GameFormData to Convex mutation payload format
 * Shared between new game creation and game updates
 */
export function transformGameFormToPayload(data: GameFormData): GameCreateInput {
  // Include spirits with either a spiritId (picked from dropdown) or a name (imported from CSV)
  const validSpirits = data.spirits.filter((s) => s.spiritId !== null || s.name)

  return sanitizeGamePayload({
    date: data.date,
    result: data.result,
    spirits: validSpirits.map((s) => ({
      spiritId: s.spiritId ?? undefined,
      name: s.name,
      variant: s.variant,
      player: s.player,
    })),
    adversaryRef: data.adversary?.adversaryId
      ? {
          adversaryId: data.adversary.adversaryId,
          level: data.adversary.level,
        }
      : undefined,
    secondaryAdversaryRef: data.secondaryAdversary?.adversaryId
      ? {
          adversaryId: data.secondaryAdversary.adversaryId,
          level: data.secondaryAdversary.level,
        }
      : undefined,
    scenario: data.scenario ?? undefined,
    winType: data.winType || undefined,
    invaderStage: data.invaderStage,
    blightCount: data.blightCount,
    dahanCount: data.dahanCount,
    cardsRemaining: data.cardsRemaining,
    score: data.score,
    notes: data.notes || undefined,
  })
}
