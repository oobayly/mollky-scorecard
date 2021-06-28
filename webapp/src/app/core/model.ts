import firebase from "firebase/app";

/** Represents a game. */
export interface Game {
  /** The index of the current player. */
  currentPlayer: number;

  /** The date of the game. */
  date: firebase.firestore.Timestamp;

  /** The ID of the game. */
  id: string;

  /** The list of players in the game. */
  players: PlayerRecord[];

  /** The score that a player is reset to when they exceed the target. */
  resetScore: number;

  /** The target score. */
  targetScore: number;

  /** The list of users who have access to this game. */
  users: string[];

  /** The player that won the game. */
  winner?: string;
}

/** Represents a basic player record. */
export interface PlayerBase {
  /** The ID of the player. */
  id: string;

  /** The maximum number of misses that a player can have in a row. */
  maxMisses: number;

  /** The name of the player. */
  name: string;
}

/** Represents a player record. */
export interface Player extends PlayerBase {
  /** The avatar photo of the player. */
  avatar?: string;

  /** The list of users who have access to this game. */
  users: string[];
}

/** Represents a record of scores */
export interface PlayerRecord extends PlayerBase {
  /** The number of misses. */
  misses: number;

  /** The current score. */
  score: number;

  /** The list of scores. */
  scores: number[];
}

/** Represents an object for sharing data. */
export interface ShareObject {
  /** The ID of the object being shared. */
  id: string;

  /** The type of object being shared. */
  type: "game" | "player";
}

// export interface User {
//   /** The list of game IDs. */
//   gameIds: string[];

//   /** The list of player IDs. */
//   playerIds: string[];
// }

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
