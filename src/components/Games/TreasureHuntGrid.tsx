'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TreasureHuntCell {
  revealed: boolean;
  hasTreasure: boolean;
}

export type TreasureHuntGrid = TreasureHuntCell[][];

export interface TreasureHuntGridProps {
  grid: TreasureHuntGrid;
  onCellClick: (row: number, col: number) => void;
  isGameOver?: boolean;
  treasuresFound?: number;
  totalTreasures?: number;
  className?: string;
}

/**
 * TreasureHuntGrid component with:
 * - 10x10 grid layout
 * - Click interactions that reveal emojis (🔍 for miss, 🪙 for treasure)
 * - State management for revealed cells
 * - Game completion detection
 */
export function TreasureHuntGrid({
  grid,
  onCellClick,
  isGameOver = false,
  treasuresFound = 0,
  totalTreasures = 0,
  className,
}: TreasureHuntGridProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || grid[row][col].revealed) return;
    onCellClick(row, col);
  };

  const handleCellHover = (row: number, col: number) => {
    if (isGameOver || grid[row][col].revealed) return;
    setHoveredCell({ row, col });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className={cn('select-none', className)}>
      {/* Progress Indicator */}
      <div className="mb-4 text-center">
        <div className="text-lg font-semibold mb-2">
          Treasures Found: {treasuresFound} / {totalTreasures}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                totalTreasures > 0 ? (treasuresFound / totalTreasures) * 100 : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-10 gap-1 p-4 bg-amber-100 rounded-lg shadow-lg max-w-md mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHovered =
              hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
            const isRevealed = cell.revealed;
            const hasTreasure = cell.hasTreasure;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'w-8 h-8 border border-amber-300 transition-all duration-200',
                  'flex items-center justify-center text-xs font-medium rounded-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                  {
                    // Unrevealed cells
                    'bg-amber-200 hover:bg-amber-300 cursor-pointer':
                      !isRevealed && !isGameOver,
                    'bg-amber-200 cursor-not-allowed opacity-50':
                      !isRevealed && isGameOver,

                    // Revealed cells
                    'bg-green-200': isRevealed && hasTreasure,
                    'bg-gray-300': isRevealed && !hasTreasure,

                    // Hover effect
                    'transform scale-105 shadow-md': isHovered,

                    // Disabled state
                    'cursor-not-allowed': isRevealed,
                  }
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                onMouseLeave={handleCellLeave}
                disabled={isRevealed || isGameOver}
                aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}${
                  isRevealed
                    ? hasTreasure
                      ? ' - Treasure found!'
                      : ' - No treasure'
                    : ''
                }`}
              >
                {!isRevealed ? (
                  // Show question mark for unrevealed cells
                  <span className="text-amber-700">?</span>
                ) : (
                  // Show result for revealed cells
                  <span
                    className="text-lg"
                    role="img"
                    aria-label={hasTreasure ? 'Treasure' : 'Miss'}
                  >
                    {hasTreasure ? '🪙' : '🔍'}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Click on cells to search for hidden treasures!</p>
        <div className="flex justify-center items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="Treasure">
              🪙
            </span>
            <span>Treasure</span>
          </div>
          <div className="flex items-center gap-1">
            <span role="img" aria-label="Miss">
              🔍
            </span>
            <span>Miss</span>
          </div>
        </div>
      </div>

      {/* Game Completion Message */}
      {isGameOver && (
        <div className="mt-4 text-center">
          <div className="inline-block px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
            <span className="text-yellow-800 font-semibold">
              {treasuresFound === totalTreasures
                ? '🎉 Congratulations! You found all treasures!'
                : `Game Over! You found ${treasuresFound} out of ${totalTreasures} treasures.`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
