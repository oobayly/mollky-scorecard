/** Represents a game. */
export interface Game {
  /** The index of the current player. */
  currentPlayer: number;

  /** The date of the game. */
  date: Date;

  /** The ID of the game. */
  id : string;

  /** The list of players in the game. */
  players: PlayerRecord[];

  /** The score that a player is reset to when they exceed the target. */
  resetScore: number;

  /** The target score. */
  targetScore: number;

  /** The player that won the game. */
  winner?: Player;
}

/** Represents a player */
export interface Player {
  /** The avatar photo of the player. */
  avatar?: string;

  /** The ID of the player. */
  id: string;

  /** The maximum number of misses that a player can have in a row. */
  maxMisses: number;

  /** The name of the player. */
  name: string;

  /** The number of wins that the player has had. */
  wins: number;
}

/** Represents a record of scores */
export interface PlayerRecord {
  /** The number of misses. */
  misses: number;

  /** The player. */
  player: Player;

  /** The current score. */
  score: number;

  /** The list of scores. */
  scores: number[];
}

/** Represents a record of the number of wins a player has had. */
export interface PlayerWins {
  /** The player. */
  player: Player;

  /** The number of wins. */
  wins: number;
}

export interface User {
  /** The list of game IDs. */
  gameIds: string[];

  /** The list of player IDs. */
  playerIds: string[];
}

/** Calculates the current score for the specified record in the game. */
export function calculateScore(record: PlayerRecord, targetScore: number, resetScore: number): number {
  record.score = record.scores.reduce((total, value) => {
    total += value;

    if (total > targetScore) {
      total = resetScore;
    }

    return total;
  }, 0);

  const len = record.scores.length;
  let misses = 0;

  for (let i = len - 1; i >= 0; i--) {
    if (record.scores[i] !== 0) {
      break;
    }

    misses++;
  }

  record.misses = misses;

  return record.score;
}
