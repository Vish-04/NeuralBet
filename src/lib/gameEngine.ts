export interface GameEngine<S, M> {
  /** initial immutable board */
  initialState: S;
  /** apply player move, return new state & optional winner */
  reducer: (state: S, move: M, by: 'a' | 'b') => { state: S; winner?: 'a' | 'b' | 'draw' };
  /** pretty-print for logs */
  toString: (state: S) => string;
}

export type Player = 'a' | 'b';
export type GameResult = 'a' | 'b' | 'draw' | null;

export interface GameState<S> {
  boardState: S;
  currentPlayer: Player;
  winner: GameResult;
  moveHistory: Array<{ player: Player; move: any; timestamp: number }>;
}