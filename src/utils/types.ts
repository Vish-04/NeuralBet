// ============================================================================
// GAME ENGINE ABSTRACTION LAYER
// ============================================================================

export interface GameEngine<S, M> {
  /** initial immutable board */
  initialState: S;
  /** apply player move, return new state & optional winner */
  reducer: (
    state: S,
    move: M,
    by: 'a' | 'b'
  ) => { state: S; winner?: 'a' | 'b' | 'draw' };
  /** pretty‑print for logs */
  toString: (state: S) => string;
}

// ============================================================================
// CORE TYPES
// ============================================================================

export type Player = 'a' | 'b';
export type GameResult = 'a' | 'b' | 'draw' | null;

export type Odds = {
  a: number; // e.g. +120
  b: number; // e.g. -140
};

// ============================================================================
// DATABASE TYPES (aligned with implementation plan)
// ============================================================================

export type Profile = {
  id: string; // uuid, references auth.users
  display_name: string;
  avatar_url?: string;
  created_at: string;
};

export type Wallet = {
  user_id: string; // uuid PK
  credits: number; // numeric(12,2), 1 credit = 0.01 USD
  updated_at: string;
};

export type Game = {
  id: string; // uuid PK
  slug: string; // unique
  name: string;
  status: 'draft' | 'live' | 'retired';
  created_at: string;
};

export type Match = {
  id: string; // uuid PK
  game_id: string; // uuid FK
  llm_a: string;
  llm_b: string;
  winner: GameResult;
  starts_at: string;
  finished_at?: string;
  simulated: boolean;
  odds?: Odds;
  game_state: Connect4State | BattleshipState | TreasureHuntState;
};

export type Bet = {
  id: string; // uuid PK
  match_id: string; // uuid FK
  bettor: string; // uuid FK
  side: Player;
  stake: number; // numeric(12,2)
  odds: number; // decimal
  payout: number; // numeric(12,2)
  created_at: string;
  settled: boolean;
};

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export type Connect4State = {
  board: (Player | null)[][]; // 6x7 grid
  current_turn: Player;
  game_over: boolean;
  winner?: GameResult;
};

export type BattleshipState = {
  board_a: ('hit' | 'miss' | 'ship' | null)[][]; // 10x10
  board_b: ('hit' | 'miss' | 'ship' | null)[][]; // 10x10
  ships_a: Ship[];
  ships_b: Ship[];
  current_turn: Player;
  game_over: boolean;
  winner?: GameResult;
};

export type TreasureHuntState = {
  board: ('treasure' | 'empty' | 'revealed')[][]; // 10x10
  treasure_position: { row: number; col: number };
  guesses_a: { row: number; col: number }[];
  guesses_b: { row: number; col: number }[];
  current_turn: Player;
  game_over: boolean;
  winner?: GameResult;
};

export type Ship = {
  name: string;
  length: number;
  positions: { row: number; col: number }[];
  hits: number;
  sunk: boolean;
};

// ============================================================================
// MOVE TYPES
// ============================================================================

export type Connect4Move = {
  column: number; // 0-6
};

export type BattleshipMove = {
  row: number; // 0-9
  col: number; // 0-9
};

export type TreasureHuntMove = {
  row: number; // 0-9
  col: number; // 0-9
};

export type GameMove = Connect4Move | BattleshipMove | TreasureHuntMove;

// ============================================================================
// LLM INTEGRATION
// ============================================================================

export type LLMEndpoint = {
  id: string;
  name: string;
  url: string; // e.g. http://localhost:5001/llm_a/move
  rating: number; // Elo rating, default 1200
};

export type LLMRating = {
  llm_id: string;
  game_id: string;
  rating: number;
  games_played: number;
  updated_at: string;
};
