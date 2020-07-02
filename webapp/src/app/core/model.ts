/** Represents a player. */
export interface Game {
  /** The date of the game. */
  date: Date;

  /** The ID of the game. */
  id : string;

  /** The list of players in the game. */
  players: PlayerRecord[];

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
}

/** Represents a record of scores */
export interface PlayerRecord {
  /** The player. */
  player: Player;

  /** The list of scores. */
  score: number[];
}
