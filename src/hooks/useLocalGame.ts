/**
 * useLocalGame Hook
 *
 * React hook that wraps a GameEngine to provide state management,
 * turn management, move validation, and winner detection for local gameplay.
 */

import { useState, useCallback, useMemo } from 'react';
import { GameEngine, Player, GameResult, GameState } from '../lib/gameEngine';

/**
 * Hook state for local game management
 */
export interface UseLocalGameState<S, M> {
  /** Current game state */
  gameState: GameState<S>;
  /** Whether the game is complete */
  isGameComplete: boolean;
  /** Winner of the game, if any */
  winner: GameResult;
  /** Current player's turn */
  currentPlayer: Player;
  /** Make a move as the current player */
  makeMove: (move: M) => void;
  /** Make a move as a specific player (useful for testing) */
  makeMoveAs: (move: M, player: Player) => void;
  /** Reset the game to initial state */
  resetGame: () => void;
  /** Get string representation of current state */
  getStateString: () => string;
  /** History of all moves made */
  moveHistory: Array<{ move: M; player: Player; timestamp: number }>;
  /** Undo the last move (if available) */
  undoLastMove: () => void;
  /** Whether undo is available */
  canUndo: boolean;
}

/**
 * Error thrown when an invalid move is attempted
 */
export class InvalidMoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMoveError';
  }
}

/**
 * React hook for local game management
 *
 * @param engine - The game engine to use
 * @returns Game state and control functions
 */
export function useLocalGame<S, M>(
  engine: GameEngine<S, M>
): UseLocalGameState<S, M> {
  // Game state - use the wrapper GameState interface
  const [gameState, setGameState] = useState<GameState<S>>({
    boardState: engine.initialState,
    currentPlayer: 'a',
    winner: null,
    moveHistory: [],
  });

  // Derive computed values from game state
  const { isGameComplete, winner, currentPlayer } = useMemo(() => {
    return {
      isGameComplete: gameState.winner !== null,
      winner: gameState.winner,
      currentPlayer: gameState.currentPlayer,
    };
  }, [gameState]);

  // Make a move as a specific player
  const makeMoveAs = useCallback(
    (move: M, player: Player) => {
      try {
        // Validate it's the correct player's turn
        if (gameState.currentPlayer !== player) {
          throw new Error(`It's not player ${player}'s turn`);
        }

        // Validate game is not complete
        if (gameState.winner !== null) {
          throw new Error('Game is already complete');
        }

        // Apply the move to the board state
        const result = engine.reducer(gameState.boardState, move, player);

        // Update game state
        setGameState({
          boardState: result.state,
          currentPlayer: player === 'a' ? 'b' : 'a',
          winner: result.winner || null,
          moveHistory: [
            ...gameState.moveHistory,
            {
              player,
              move,
              timestamp: Date.now(),
            },
          ],
        });
      } catch (error) {
        throw new InvalidMoveError(
          error instanceof Error ? error.message : 'Invalid move'
        );
      }
    },
    [gameState, engine]
  );

  // Make a move as the current player
  const makeMove = useCallback(
    (move: M) => {
      makeMoveAs(move, currentPlayer);
    },
    [makeMoveAs, currentPlayer]
  );

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState({
      boardState: engine.initialState,
      currentPlayer: 'a',
      winner: null,
      moveHistory: [],
    });
  }, [engine]);

  // Get string representation of current state
  const getStateString = useCallback(() => {
    return engine.toString(gameState.boardState);
  }, [engine, gameState]);

  // Undo the last move
  const undoLastMove = useCallback(() => {
    if (gameState.moveHistory.length === 0) {
      return;
    }

    // We need to replay the game from the beginning without the last move
    const newHistory = gameState.moveHistory.slice(0, -1);
    let newGameState: GameState<S> = {
      boardState: engine.initialState,
      currentPlayer: 'a',
      winner: null,
      moveHistory: [],
    };

    // Replay all moves except the last one
    for (const historyEntry of newHistory) {
      const result = engine.reducer(
        newGameState.boardState,
        historyEntry.move,
        historyEntry.player
      );
      newGameState = {
        boardState: result.state,
        currentPlayer: historyEntry.player === 'a' ? 'b' : 'a',
        winner: result.winner || null,
        moveHistory: [...newGameState.moveHistory, historyEntry],
      };
    }

    setGameState(newGameState);
  }, [gameState, engine]);

  // Whether undo is available
  const canUndo = gameState.moveHistory.length > 0;

  return {
    gameState,
    isGameComplete,
    winner,
    currentPlayer,
    makeMove,
    makeMoveAs,
    resetGame,
    getStateString,
    moveHistory: gameState.moveHistory,
    undoLastMove,
    canUndo,
  };
}

export default useLocalGame;
