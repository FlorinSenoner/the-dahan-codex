/**
 * Spirit Island official score calculation
 * Source: Official Spirit Island rules (Dized)
 */
interface ScoreParams {
  result: "win" | "loss";
  difficulty: number;
  cardsRemaining: number; // Cards left in invader deck
  dahanCount: number;
  blightCount: number;
  playerCount: number;
}

/**
 * Calculate Spirit Island game score
 *
 * Victory: (5 x Difficulty) + 10 + (2 x cards remaining) + (dahan / players) - (blight / players)
 * Defeat: (2 x Difficulty) + cards used + (dahan / players) - (blight / players)
 *
 * Note: cards used for defeat = total invader deck cards - cards remaining
 * Standard invader deck has 12 cards (3 per stage)
 */
export function calculateScore(params: ScoreParams): number {
  const {
    result,
    difficulty,
    cardsRemaining,
    dahanCount,
    blightCount,
    playerCount,
  } = params;

  // Dahan and blight are divided by player count and floored
  const dahanScore = Math.floor(dahanCount / playerCount);
  const blightPenalty = Math.floor(blightCount / playerCount);

  if (result === "win") {
    // Victory formula
    return (
      5 * difficulty + 10 + 2 * cardsRemaining + dahanScore - blightPenalty
    );
  }
  // Defeat formula - cards used is 12 (standard deck) minus remaining
  const cardsUsed = 12 - cardsRemaining;
  return 2 * difficulty + cardsUsed + dahanScore - blightPenalty;
}

/**
 * Calculate difficulty from adversary and scenario
 * This is a simplified version - full difficulty calculation would need adversary/scenario reference data
 */
export function calculateDifficulty(
  adversaryLevel: number = 0,
  secondaryAdversaryLevel: number = 0,
  scenarioDifficulty: number = 0,
): number {
  return adversaryLevel + secondaryAdversaryLevel + scenarioDifficulty;
}
