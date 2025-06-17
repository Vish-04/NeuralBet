'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type BattleshipCellState = 'empty' | 'ship' | 'hit' | 'miss';

export interface BattleshipCell {
  state: BattleshipCellState;
  shipId?: string; // Optional identifier for ship grouping
}

export type BattleshipBoard = BattleshipCell[][];

export interface BattleshipBoardProps {
  board: BattleshipBoard;
  onCellClick: (row: number, col: number) => void;
  isPlayerBoard?: boolean; // true for ship placement, false for targeting
  isGameOver?: boolean;
  title?: string;
  className?: string;
  showShips?: boolean; // Whether to visually show ships (for own board)
}

/**
 * BattleshipBoard component with:
 * - 10x10 grid for ship placement/targeting
 * - Visual states: empty, ship, hit, miss
 * - Grid coordinate system (A1-J10)
 */
export function BattleshipBoard({
  board,
  onCellClick,
  isPlayerBoard = false,
  isGameOver = false,
  title,
  className,
  showShips = false,
}: BattleshipBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Generate coordinate labels
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const colLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handleCellClick = (row: number, col: number) => {
    if (isGameOver) return;
    onCellClick(row, col);
  };

  const handleCellHover = (row: number, col: number) => {
    if (isGameOver) return;
    setHoveredCell({ row, col });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  const getCellDisplay = (cell: BattleshipCell, row: number, col: number) => {
    const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;

    switch (cell.state) {
      case 'hit':
        return {
          content: '💥',
          className: 'bg-red-500 text-white',
          ariaLabel: 'Hit',
        };
      case 'miss':
        return {
          content: '💧',
          className: 'bg-blue-200 text-blue-800',
          ariaLabel: 'Miss',
        };
      case 'ship':
        if (showShips) {
          return {
            content: '🚢',
            className: 'bg-gray-600 text-white',
            ariaLabel: 'Ship',
          };
        }
      // Fall through to empty if ships shouldn't be shown
      case 'empty':
      default:
        return {
          content: isHovered && !isGameOver ? '🎯' : '',
          className: cn('bg-blue-100 hover:bg-blue-200 border-blue-300', {
            'bg-blue-200 transform scale-105': isHovered && !isGameOver,
            'cursor-not-allowed opacity-50': isGameOver,
          }),
          ariaLabel: 'Empty water',
        };
    }
  };

  return (
    <div className={cn('select-none', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      )}

      <div className="inline-block bg-blue-50 p-4 rounded-lg shadow-lg">
        {/* Column Headers */}
        <div className="grid grid-cols-11 gap-1 mb-1">
          <div></div> {/* Empty corner */}
          {colLabels.map((label) => (
            <div
              key={label}
              className="w-8 h-6 flex items-center justify-center text-xs font-semibold text-blue-800"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid with Row Headers */}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1 mb-1">
            {/* Row Header */}
            <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-blue-800">
              {rowLabels[rowIndex]}
            </div>

            {/* Row Cells */}
            {row.map((cell, colIndex) => {
              const display = getCellDisplay(cell, rowIndex, colIndex);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'w-8 h-8 border border-blue-300 transition-all duration-150',
                    'flex items-center justify-center text-xs font-medium rounded-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                    display.className,
                    {
                      'cursor-pointer': !isGameOver,
                      'cursor-not-allowed': isGameOver,
                    }
                  )}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  onMouseLeave={handleCellLeave}
                  disabled={isGameOver}
                  aria-label={`${rowLabels[rowIndex]}${colLabels[colIndex]} - ${display.ariaLabel}`}
                >
                  <span role="img" aria-hidden="true">
                    {display.content}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-1">
              <span role="img" aria-label="Hit">
                💥
              </span>
              <span>Hit</span>
            </div>
            <div className="flex items-center gap-1">
              <span role="img" aria-label="Miss">
                💧
              </span>
              <span>Miss</span>
            </div>
            {showShips && (
              <div className="flex items-center gap-1">
                <span role="img" aria-label="Ship">
                  🚢
                </span>
                <span>Ship</span>
              </div>
            )}
            {!isGameOver && (
              <div className="flex items-center gap-1">
                <span role="img" aria-label="Target">
                  🎯
                </span>
                <span>Hover to target</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isGameOver && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {isPlayerBoard ? (
            <p>This is your board. Ships are visible to you.</p>
          ) : (
            <p>Click on enemy waters to fire! Find and sink all ships.</p>
          )}
        </div>
      )}
    </div>
  );
}
