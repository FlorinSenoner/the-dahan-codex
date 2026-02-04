/**
 * Score calculation breakdown component
 * Victory: (5 x Difficulty) + 10 + (2 x cards) + (dahan / players) - (blight / players)
 * Defeat: (2 x Difficulty) + cards used + (dahan / players) - (blight / players)
 */

export interface ScoreBreakdownProps {
  result: 'win' | 'loss'
  difficulty: number
  playerCount: number
  cardsRemaining?: number
  dahanCount?: number
  blightCount?: number
}

export function ScoreBreakdown({
  result,
  difficulty,
  playerCount,
  cardsRemaining,
  dahanCount,
  blightCount,
}: ScoreBreakdownProps) {
  const cards = cardsRemaining ?? 0
  const dahan = dahanCount ?? 0
  const blight = blightCount ?? 0

  const dahanScore = Math.floor(dahan / playerCount)
  const blightPenalty = Math.floor(blight / playerCount)

  if (result === 'win') {
    // Victory: (5 x Difficulty + 10) + (2 x cards) + dahanScore - blightPenalty
    const diffPart = 5 * difficulty + 10
    const cardsPart = 2 * cards

    const parts: string[] = []
    parts.push(`${diffPart} (difficulty × 5 + 10)`)
    if (cardsPart > 0) parts.push(`${cardsPart} (cards × 2)`)
    if (dahanScore > 0) parts.push(`${dahanScore} (dahan)`)

    let formula = parts.join(' + ')
    if (blightPenalty > 0) formula += ` − ${blightPenalty} (blight)`

    return <p className="text-sm text-muted-foreground">= {formula}</p>
  }

  // Defeat: (2 x Difficulty) + cards used + dahanScore - blightPenalty
  const diffPart = 2 * difficulty
  const cardsUsed = 12 - cards

  const parts: string[] = []
  if (diffPart > 0) parts.push(`${diffPart} (difficulty × 2)`)
  if (cardsUsed > 0) parts.push(`${cardsUsed} (cards used)`)
  if (dahanScore > 0) parts.push(`${dahanScore} (dahan)`)

  let formula = parts.length > 0 ? parts.join(' + ') : '0'
  if (blightPenalty > 0) formula += ` − ${blightPenalty} (blight)`

  return <p className="text-sm text-muted-foreground">= {formula}</p>
}

/**
 * Convenience wrapper for game objects
 * Calculates difficulty from adversary, secondaryAdversary, and scenario
 */
export function GameScoreBreakdown({
  game,
}: {
  game: {
    result: 'win' | 'loss'
    spirits: unknown[]
    adversary?: { level: number } | null
    secondaryAdversary?: { level: number } | null
    scenario?: { difficulty?: number } | null
    cardsRemaining?: number
    dahanCount?: number
    blightCount?: number
  }
}) {
  const playerCount = game.spirits.length || 1
  const difficulty =
    (game.adversary?.level ?? 0) +
    (game.secondaryAdversary?.level ?? 0) +
    (game.scenario?.difficulty ?? 0)

  return (
    <ScoreBreakdown
      blightCount={game.blightCount}
      cardsRemaining={game.cardsRemaining}
      dahanCount={game.dahanCount}
      difficulty={difficulty}
      playerCount={playerCount}
      result={game.result}
    />
  )
}
