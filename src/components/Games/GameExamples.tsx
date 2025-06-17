'use client';

import { useState } from 'react';
import { GameWrapper } from './GameWrapper';
import {
  Connect4Board,
  Connect4Player,
  Connect4BoardType,
} from './index';
import {
  TreasureHuntGrid,
  TreasureHuntGridType,
} from './index';
import {
  BattleshipBoard,
  BattleshipBoardType,
} from './index';

/**
 * Example implementations showing how to use the game components.
 * These can be used as reference for implementing actual game logic.
 */

// Connect4 Example
export function Connect4Example() {
  const [board, setBoard] = useState<Connect4BoardType>(() =>
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Connect4Player>('red');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const handleColumnClick = (column: number) => {
    if (gameOver) return;

    // Find the lowest available row in the column
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][column] === null) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][column] = currentPlayer;
        setBoard(newBoard);

        // Switch players
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        break;
      }
    }
  };

  const handleRestart = () => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null))
    );
    setCurrentPlayer('red');
    setGameOver(false);
    setWinner(null);
  };

  return (
    <GameWrapper
      title="Connect 4"
      status={{
        isGameOver: gameOver,
        winner,
        currentPlayer: currentPlayer,
        message: gameOver ? 'Game completed!' : 'Drop a piece in any column',
      }}
      onRestart={handleRestart}
    >
      <Connect4Board
        board={board}
        currentPlayer={currentPlayer}
        onColumnClick={handleColumnClick}
        isGameOver={gameOver}
      />
    </GameWrapper>
  );
}

// Treasure Hunt Example
export function TreasureHuntExample() {
  const [grid, setGrid] = useState<TreasureHuntGridType>(() => {
    // Initialize 10x10 grid with random treasures
    const newGrid = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            revealed: false,
            hasTreasure: Math.random() < 0.15, // 15% chance of treasure
          }))
      );
    return newGrid;
  });

  const [gameOver, setGameOver] = useState(false);
  const totalTreasures = grid.flat().filter((cell) => cell.hasTreasure).length;
  const treasuresFound = grid
    .flat()
    .filter((cell) => cell.revealed && cell.hasTreasure).length;

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || grid[row][col].revealed) return;

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col].revealed = true;
    setGrid(newGrid);

    // Check if all treasures are found
    const newTreasuresFound = newGrid
      .flat()
      .filter((cell) => cell.revealed && cell.hasTreasure).length;
    if (newTreasuresFound === totalTreasures) {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    const newGrid = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            revealed: false,
            hasTreasure: Math.random() < 0.15,
          }))
      );
    setGrid(newGrid);
    setGameOver(false);
  };

  return (
    <GameWrapper
      title="Treasure Hunt"
      status={{
        isGameOver: gameOver,
        winner: gameOver ? 'Treasure Hunter' : null,
        message: gameOver
          ? `Found all ${totalTreasures} treasures!`
          : `Find all ${totalTreasures} hidden treasures`,
      }}
      onRestart={handleRestart}
    >
      <TreasureHuntGrid
        grid={grid}
        onCellClick={handleCellClick}
        isGameOver={gameOver}
        treasuresFound={treasuresFound}
        totalTreasures={totalTreasures}
      />
    </GameWrapper>
  );
}

// Battleship Example (Simplified)
export function BattleshipExample() {
  const [playerBoard, setPlayerBoard] = useState<BattleshipBoardType>(() => {
    // Initialize empty board with proper type
    const board: BattleshipBoardType = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ state: 'empty' as const }))
      );

    // Add some example ships
    board[2][3] = { state: 'ship', shipId: 'destroyer1' };
    board[2][4] = { state: 'ship', shipId: 'destroyer1' };
    board[5][1] = { state: 'ship', shipId: 'submarine1' };
    board[7][6] = { state: 'ship', shipId: 'cruiser1' };
    board[7][7] = { state: 'ship', shipId: 'cruiser1' };
    board[7][8] = { state: 'ship', shipId: 'cruiser1' };

    return board;
  });

  const [enemyBoard, setEnemyBoard] = useState<BattleshipBoardType>(() => {
    const board: BattleshipBoardType = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ state: 'empty' as const }))
      );
    return board;
  });

  const [gameOver, setGameOver] = useState(false);

  const handleEnemyBoardClick = (row: number, col: number) => {
    if (gameOver || enemyBoard[row][col].state !== 'empty') return;

    const newBoard = enemyBoard.map((r) => [...r]);
    // Simulate random hit/miss for demo
    newBoard[row][col].state = Math.random() < 0.3 ? 'hit' : 'miss';
    setEnemyBoard(newBoard);
  };

  const handlePlayerBoardClick = (row: number, col: number) => {
    // Player board is read-only in this example
    console.log(`Clicked on own board at ${row}, ${col}`);
  };

  const handleRestart = () => {
    setPlayerBoard(
      Array(10)
        .fill(null)
        .map(() =>
          Array(10)
            .fill(null)
            .map(() => ({ state: 'empty' as const }))
        )
    );
    setEnemyBoard(
      Array(10)
        .fill(null)
        .map(() =>
          Array(10)
            .fill(null)
            .map(() => ({ state: 'empty' as const }))
        )
    );
    setGameOver(false);
  };

  return (
    <GameWrapper
      title="Battleship"
      status={{
        isGameOver: gameOver,
        currentPlayer: 'Player',
        message: 'Click on enemy waters to fire!',
      }}
      onRestart={handleRestart}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BattleshipBoard
          board={playerBoard}
          onCellClick={handlePlayerBoardClick}
          isPlayerBoard={true}
          title="Your Fleet"
          showShips={true}
        />
        <BattleshipBoard
          board={enemyBoard}
          onCellClick={handleEnemyBoardClick}
          isPlayerBoard={false}
          title="Enemy Waters"
          showShips={false}
        />
      </div>
    </GameWrapper>
  );
}
