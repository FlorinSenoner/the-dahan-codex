import Papa from "papaparse";

/**
 * Parsed row from CSV (matches export column structure)
 */
export interface ParsedGameRow {
  id: string;
  date: string;
  result: string;
  spirit1: string;
  spirit1_variant: string;
  spirit1_player: string;
  spirit2: string;
  spirit2_variant: string;
  spirit2_player: string;
  spirit3: string;
  spirit3_variant: string;
  spirit3_player: string;
  spirit4: string;
  spirit4_variant: string;
  spirit4_player: string;
  spirit5: string;
  spirit5_variant: string;
  spirit5_player: string;
  spirit6: string;
  spirit6_variant: string;
  spirit6_player: string;
  adversary: string;
  adversary_level: string;
  secondary_adversary: string;
  secondary_adversary_level: string;
  scenario: string;
  scenario_difficulty: string;
  win_type: string;
  invader_stage: string;
  blight_count: string;
  dahan_count: string;
  cards_remaining: string;
  score: string;
  notes: string;
}

/**
 * Validated game ready for import
 */
export interface ValidatedGame {
  row: ParsedGameRow;
  isValid: boolean;
  errors: string[];
  isNew: boolean; // true if ID doesn't match existing game
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
  existingIds: Set<string>,
): ValidatedGame {
  const errors: string[] = [];

  // Required: date
  if (!row.date) {
    errors.push("Missing date");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    errors.push("Invalid date format (expected YYYY-MM-DD)");
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

  // Check if this is an update or new game
  const isNew = !row.id || !existingIds.has(row.id);

  return {
    row,
    isValid: errors.length === 0,
    errors,
    isNew,
  };
}

/**
 * Convert validated row to game data for import
 */
export function rowToGameData(row: ParsedGameRow) {
  const spirits = [];

  // Collect spirits 1-6
  const spiritFields = [
    {
      name: row.spirit1,
      variant: row.spirit1_variant,
      player: row.spirit1_player,
    },
    {
      name: row.spirit2,
      variant: row.spirit2_variant,
      player: row.spirit2_player,
    },
    {
      name: row.spirit3,
      variant: row.spirit3_variant,
      player: row.spirit3_player,
    },
    {
      name: row.spirit4,
      variant: row.spirit4_variant,
      player: row.spirit4_player,
    },
    {
      name: row.spirit5,
      variant: row.spirit5_variant,
      player: row.spirit5_player,
    },
    {
      name: row.spirit6,
      variant: row.spirit6_variant,
      player: row.spirit6_player,
    },
  ];

  for (const spirit of spiritFields) {
    if (spirit.name) {
      spirits.push({
        name: spirit.name,
        variant: spirit.variant || undefined,
        player: spirit.player || undefined,
      });
    }
  }

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
