/**
 * Connect4 Game Implementation
 *
 * Reference implementation of the GameEngine interface for Connect4.
 * Features:
 * - 6 rows x 7 columns grid
 * - Gravity-based piece dropping
 * - Win condition checking (4 in a row: horizontal, vertical, diagonal)
 * - Immutable state management
 */

import { GameEngine, Player } from '../gameEngine';

export const CONNECT4_ROWS = 6;
export const CONNECT4_COLS = 7;

/**
 * Connect4 game state
 */
export interface Connect4State {
  board: Array<Array<Player | null>>; // [row][col] - null means empty
  lastMove?: { row: number; col: number; player: Player };
}

/**
 * Connect4 move - just specify the column (gravity handles the row)
 */
export interface Connect4Move {
  col: number; // 0-6
}

/**
 * Create initial Connect4 game state
 */
function createInitialState(): Connect4State {
  return {
    board: Array(CONNECT4_ROWS)
      .fill(null)
      .map(() => Array(CONNECT4_COLS).fill(null)),
  };
}

/**
 * Check if a column is full
 */
function isColumnFull(
  board: Array<Array<Player | null>>,
  col: number
): boolean {
  return board[0][col] !== null;
}

/**
 * Find the lowest available row in a column (gravity)
 */
function findDropRow(
  board: Array<Array<Player | null>>,
  col: number
): number | null {
  for (let row = CONNECT4_ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return null; // Column is full
}

/**
 * Check for 4 in a row starting from a position in a given direction
 */
function checkDirection(
  board: Array<Array<Player | null>>,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  player: Player
): boolean {
  let count = 0;
  let currentRow = row;
  let currentCol = col;

  // Check in the positive direction
  while (
    currentRow >= 0 &&
    currentRow < CONNECT4_ROWS &&
    currentCol >= 0 &&
    currentCol < CONNECT4_COLS &&
    board[currentRow][currentCol] === player
  ) {
    count++;
    currentRow += deltaRow;
    currentCol += deltaCol;
  }

  // Check in the negative direction (don't double count the starting position)
  currentRow = row - deltaRow;
  currentCol = col - deltaCol;
  while (
    currentRow >= 0 &&
    currentRow < CONNECT4_ROWS &&
    currentCol >= 0 &&
    currentCol < CONNECT4_COLS &&
    board[currentRow][currentCol] === player
  ) {
    count++;
    currentRow -= deltaRow;
    currentCol -= deltaCol;
  }

  return count >= 4;
}

/**
 * Check if there's a winner after placing a piece at the given position
 */
function checkWinner(
  board: Array<Array<Player | null>>,
  row: number,
  col: number
): Player | null {
  const player = board[row][col];
  if (!player) return null;

  // Check all four directions: horizontal, vertical, diagonal /, diagonal \
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal \
    [1, -1], // diagonal /
  ];

  for (const [deltaRow, deltaCol] of directions) {
    if (checkDirection(board, row, col, deltaRow, deltaCol, player)) {
      return player;
    }
  }

  return null;
}

/**
 * Check if the board is full (draw condition)
 */
function isBoardFull(board: Array<Array<Player | null>>): boolean {
  return board[0].every((cell) => cell !== null);
}

/**
 * Apply a move to the Connect4 game state
 */
function reducer(state: Connect4State, move: Connect4Move, by: Player) {

  // Validate column is in bounds
  if (move.col < 0 || move.col >= CONNECT4_COLS) {
    throw new Error(
      `Invalid column: ${move.col}. Must be between 0 and ${CONNECT4_COLS - 1}`
    );
  }

  // Check if column is full
  if (isColumnFull(state.board, move.col)) {
    throw new Error(`Column ${move.col} is full`);
  }

  // Find where the piece will land
  const dropRow = findDropRow(state.board, move.col);
  if (dropRow === null) {
    throw new Error(`Column ${move.col} is full`);
  }

  // Create new board with the move applied
  const newBoard = state.board.map((row) => [...row]);
  newBoard[dropRow][move.col] = by;

  // Check for winner
  const winner = checkWinner(newBoard, dropRow, move.col);
  const isFull = isBoardFull(newBoard);
  const isComplete = winner !== null || isFull;
  const finalWinner: 'a' | 'b' | 'draw' | undefined = winner || (isFull ? 'draw' : undefined);

  // Create new state
  const newState: Connect4State = {
    board: newBoard,
    lastMove: { row: dropRow, col: move.col, player: by },
  };

  return { state: newState, winner: finalWinner };
}

/**
 * Convert board state to string for debugging/logging
 */
function toString(state: Connect4State): string {
  const lines: string[] = [];

  // Column numbers header
  lines.push(
    '  ' + Array.from({ length: CONNECT4_COLS }, (_, i) => i.toString()).join(' ')
  );
  lines.push('  ' + '-'.repeat(CONNECT4_COLS * 2 - 1));

  // Board rows
  for (let row = 0; row < CONNECT4_ROWS; row++) {
    const rowStr = state.board[row]
      .map((cell) => {
        if (cell === 'a') return 'A';
        if (cell === 'b') return 'B';
        return '·';
      })
      .join(' ');
    lines.push(`${row.toString()} ${rowStr}`);
  }

  if (state.lastMove) {
    lines.push('');
    lines.push(
      `Last move: Player ${state.lastMove.player.toUpperCase()} -> Column ${
        state.lastMove.col.toString()
      }`
    );
  }

  return lines.join('\n');
}

/**
 * Connect4 Game Engine Implementation
 */
export const connect4Engine: GameEngine<Connect4State, Connect4Move> = {
  initialState: createInitialState(),
  reducer,
  toString,
};

