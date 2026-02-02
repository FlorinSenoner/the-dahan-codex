import Papa from "papaparse";
import { extractSpiritsFromRow, type GameCSVRow } from "./csv-spirits";

/**
 * Parsed row from CSV (matches export column structure)
 * Re-exported as ParsedGameRow for backwards compatibility
 */
export type ParsedGameRow = GameCSVRow;

/**
 * Existing game data for comparison during import
 */
export interface ExistingGame {
  _id: string;
  date: string;
  result: string;
  spirits: Array<{ name: string; variant?: string; player?: string }>;
  adversary?: { name: string; level: number };
  secondaryAdversary?: { name: string; level: number };
  scenario?: { name: string; difficulty?: number };
  winType?: string;
  invaderStage?: number;
  blightCount?: number;
  dahanCount?: number;
  cardsRemaining?: number;
  score?: number;
  notes?: string;
}

/**
 * Validated game ready for import
 */
export interface ValidatedGame {
  row: ParsedGameRow;
  isValid: boolean;
  errors: string[];
  isNew: boolean; // true if ID doesn't match existing game
  isUnchanged: boolean; // true if all fields match existing game
}

/**
 * Compare a CSV row with an existing game to check if they're identical
 */
function areGamesEqual(row: ParsedGameRow, existing: ExistingGame): boolean {
  // Compare required fields
  if (row.date !== existing.date) return false;
  if (row.result !== existing.result) return false;

  // Compare spirits (need to handle all 6 slots)
  const rowSpirits = extractSpiritsFromRow(row);

  if (rowSpirits.length !== existing.spirits.length) return false;
  for (let i = 0; i < rowSpirits.length; i++) {
    const rowSpirit = rowSpirits[i];
    const existingSpirit = existing.spirits[i];
    if (rowSpirit.name !== existingSpirit.name) return false;
    if ((rowSpirit.variant || "") !== (existingSpirit.variant || ""))
      return false;
    if ((rowSpirit.player || "") !== (existingSpirit.player || ""))
      return false;
  }

  // Compare adversary
  const rowHasAdversary = !!row.adversary;
  const existingHasAdversary = !!existing.adversary;
  if (rowHasAdversary !== existingHasAdversary) return false;
  if (rowHasAdversary && existing.adversary) {
    if (row.adversary !== existing.adversary.name) return false;
    if (parseInt(row.adversary_level, 10) !== existing.adversary.level)
      return false;
  }

  // Compare secondary adversary
  const rowHasSecondary = !!row.secondary_adversary;
  const existingHasSecondary = !!existing.secondaryAdversary;
  if (rowHasSecondary !== existingHasSecondary) return false;
  if (rowHasSecondary && existing.secondaryAdversary) {
    if (row.secondary_adversary !== existing.secondaryAdversary.name)
      return false;
    if (
      parseInt(row.secondary_adversary_level, 10) !==
      existing.secondaryAdversary.level
    )
      return false;
  }

  // Compare scenario
  const rowHasScenario = !!row.scenario;
  const existingHasScenario = !!existing.scenario;
  if (rowHasScenario !== existingHasScenario) return false;
  if (rowHasScenario && existing.scenario) {
    if (row.scenario !== existing.scenario.name) return false;
    const rowDiff = row.scenario_difficulty
      ? parseInt(row.scenario_difficulty, 10)
      : undefined;
    if (rowDiff !== existing.scenario.difficulty) return false;
  }

  // Compare win_type
  if ((row.win_type || "") !== (existing.winType || "")) return false;

  // Compare numeric fields
  const rowInvaderStage = row.invader_stage
    ? parseInt(row.invader_stage, 10)
    : undefined;
  if (rowInvaderStage !== existing.invaderStage) return false;

  const rowBlightCount = row.blight_count
    ? parseInt(row.blight_count, 10)
    : undefined;
  if (rowBlightCount !== existing.blightCount) return false;

  const rowDahanCount = row.dahan_count
    ? parseInt(row.dahan_count, 10)
    : undefined;
  if (rowDahanCount !== existing.dahanCount) return false;

  const rowCardsRemaining = row.cards_remaining
    ? parseInt(row.cards_remaining, 10)
    : undefined;
  if (rowCardsRemaining !== existing.cardsRemaining) return false;

  const rowScore = row.score ? parseInt(row.score, 10) : undefined;
  if (rowScore !== existing.score) return false;

  // Compare notes
  if ((row.notes || "") !== (existing.notes || "")) return false;

  return true;
}

/**
 * Parse CSV file to rows
 */
export function parseGamesCSV(file: File): Promise<ParsedGameRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ParsedGameRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for validation
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(
            new Error(
              `Parse errors: ${results.errors.map((e) => e.message).join(", ")}`,
            ),
          );
          return;
        }
        resolve(results.data);
      },
      error: reject,
    });
  });
}

/**
 * Validate a parsed game row
 */
export function validateParsedGame(
  row: ParsedGameRow,
  existingGames: ExistingGame[],
): ValidatedGame {
  const errors: string[] = [];

  // Required: date
  // We'll normalize the date to YYYY-MM-DD for storage
  let normalizedDate = row.date;
  if (!row.date) {
    errors.push("Missing date");
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    // Already YYYY-MM-DD format
    normalizedDate = row.date;
  } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(row.date)) {
    // DD.MM.YYYY format - convert to YYYY-MM-DD
    const [day, month, year] = row.date.split(".");
    normalizedDate = `${year}-${month}-${day}`;
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(row.date)) {
    // MM/DD/YYYY format - convert to YYYY-MM-DD
    const [month, day, year] = row.date.split("/");
    normalizedDate = `${year}-${month}-${day}`;
  } else {
    errors.push(
      "Invalid date format (expected YYYY-MM-DD, DD.MM.YYYY, or MM/DD/YYYY)",
    );
  }

  // Mutate the row's date to the normalized format for downstream processing
  if (normalizedDate !== row.date) {
    row.date = normalizedDate;
  }

  // Required: result
  if (!row.result) {
    errors.push("Missing result");
  } else if (row.result !== "win" && row.result !== "loss") {
    errors.push("Result must be 'win' or 'loss'");
  }

  // Required: at least one spirit
  const hasSpirit =
    row.spirit1 ||
    row.spirit2 ||
    row.spirit3 ||
    row.spirit4 ||
    row.spirit5 ||
    row.spirit6;
  if (!hasSpirit) {
    errors.push("At least one spirit is required");
  }

  // Validate adversary level if adversary provided
  if (row.adversary && row.adversary_level) {
    const level = parseInt(row.adversary_level, 10);
    if (Number.isNaN(level) || level < 0 || level > 6) {
      errors.push("Adversary level must be 0-6");
    }
  }

  // Check if this is a new game or update
  const existingGame = row.id
    ? existingGames.find((g) => g._id === row.id)
    : undefined;
  const isNew = !existingGame;

  // Check if game is unchanged (only for updates)
  const isUnchanged = existingGame ? areGamesEqual(row, existingGame) : false;

  return {
    row,
    isValid: errors.length === 0,
    errors,
    isNew,
    isUnchanged,
  };
}

/**
 * Convert validated row to game data for import
 */
export function rowToGameData(row: ParsedGameRow) {
  // Extract spirits using shared utility and convert to API format
  const spirits = extractSpiritsFromRow(row).map((s) => ({
    name: s.name,
    variant: s.variant || undefined,
    player: s.player || undefined,
  }));

  return {
    existingId: row.id || undefined,
    date: row.date,
    result: row.result as "win" | "loss",
    spirits,
    adversary: row.adversary
      ? {
          name: row.adversary,
          level: parseInt(row.adversary_level, 10) || 0,
        }
      : undefined,
    secondaryAdversary: row.secondary_adversary
      ? {
          name: row.secondary_adversary,
          level: parseInt(row.secondary_adversary_level, 10) || 0,
        }
      : undefined,
    scenario: row.scenario
      ? {
          name: row.scenario,
          difficulty: row.scenario_difficulty
            ? parseInt(row.scenario_difficulty, 10)
            : undefined,
        }
      : undefined,
    winType: row.win_type || undefined,
    invaderStage: row.invader_stage
      ? parseInt(row.invader_stage, 10)
      : undefined,
    blightCount: row.blight_count ? parseInt(row.blight_count, 10) : undefined,
    dahanCount: row.dahan_count ? parseInt(row.dahan_count, 10) : undefined,
    cardsRemaining: row.cards_remaining
      ? parseInt(row.cards_remaining, 10)
      : undefined,
    score: row.score ? parseInt(row.score, 10) : undefined,
    notes: row.notes || undefined,
  };
}
