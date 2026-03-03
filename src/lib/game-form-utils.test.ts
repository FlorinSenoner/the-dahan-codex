import { describe, expect, it } from 'vitest'
import type { GameFormData } from '@/components/games/game-form'
import { transformGameFormToPayload } from '@/lib/game-form-utils'

function baseForm(): GameFormData {
  return {
    date: '2026-03-02',
    result: 'win',
    spirits: [{ spiritId: null, name: '', variant: undefined, player: undefined }],
    adversary: null,
    secondaryAdversary: null,
    scenario: null,
    winType: '',
    invaderStage: undefined,
    blightCount: undefined,
    dahanCount: undefined,
    cardsRemaining: undefined,
    score: undefined,
    notes: '',
  }
}

describe('transformGameFormToPayload', () => {
  it('drops synthetic spirit ids from generated snapshot data', () => {
    const form = baseForm()
    form.spirits = [
      {
        spiritId: 'spirit_vital-strength-of-the-earth' as never,
        name: 'Vital Strength of the Earth',
        variant: undefined,
      },
    ]

    const payload = transformGameFormToPayload(form)
    expect(payload.spirits[0]?.spiritId).toBeUndefined()
    expect(payload.spirits[0]?.name).toBe('Vital Strength of the Earth')
  })

  it('keeps real convex spirit ids untouched', () => {
    const form = baseForm()
    form.spirits = [
      {
        spiritId: 'k17d1s2w3v4x5y6z7a8b9c0d1e2f3g4h' as never,
        name: 'Vital Strength of the Earth',
        variant: undefined,
      },
    ]

    const payload = transformGameFormToPayload(form)
    expect(payload.spirits[0]?.spiritId).toBe('k17d1s2w3v4x5y6z7a8b9c0d1e2f3g4h')
  })
})
