'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type Connect4Player = 'red' | 'yellow';
export type Connect4Cell = Connect4Player | null;
export type Connect4Board = Connect4Cell[][];

export interface Connect4BoardProps {
  board: Connect4Board;
  currentPlayer: Connect4Player;
  onColumnClick: (column: number) => void;
  isGameOver?: boolean;
  className?: string;
}

/**
 * Connect4Board component with:
 * - CSS grid-based board (6x7)
 * - Hover preview for piece drops
 * - Real-time piece drop animation
 * - Click handlers for column selection
 * - Visual indication of current player
 */
export function Connect4Board({
  board,
  currentPlayer,
  onColumnClick,
  isGameOver = false,
  className,
}: Connect4BoardProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const handleColumnClick = (column: number) => {
    if (isGameOver) return;
    onColumnClick(column);
  };

  const handleColumnHover = (column: number) => {
    if (isGameOver) return;
    setHoveredColumn(column);
  };

  const handleColumnLeave = () => {
    setHoveredColumn(null);
  };

  // Find the next available row in a column for hover preview
  const getNextAvailableRow = (column: number): number | null => {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][column] === null) {
        return row;
      }
    }
    return null;
  };

  return (
    <div className={cn('select-none', className)}>
      {/* Board Container */}
      <div className="bg-blue-600 p-4 rounded-lg shadow-lg">
        {/* Grid */}
        <div className="grid grid-cols-7 gap-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isHoveredColumn = hoveredColumn === colIndex;
              const nextAvailableRow = isHoveredColumn
                ? getNextAvailableRow(colIndex)
                : null;
              const shouldShowHover =
                isHoveredColumn && nextAvailableRow === rowIndex && !isGameOver;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'w-12 h-12 rounded-full border-2 border-blue-500 cursor-pointer transition-all duration-200',
                    'flex items-center justify-center',
                    'hover:border-blue-300',
                    {
                      'bg-red-500': cell === 'red',
                      'bg-yellow-400': cell === 'yellow',
                      'bg-white': cell === null,
                      'cursor-not-allowed opacity-50': isGameOver,
                    }
                  )}
                  onClick={() => handleColumnClick(colIndex)}
                  onMouseEnter={() => handleColumnHover(colIndex)}
                  onMouseLeave={handleColumnLeave}
                >
                  {/* Hover Preview */}
                  {shouldShowHover && (
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full opacity-60 animate-pulse',
                        {
                          'bg-red-400': currentPlayer === 'red',
                          'bg-yellow-300': currentPlayer === 'yellow',
                        }
                      )}
                    />
                  )}

                  {/* Actual Piece */}
                  {cell && (
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full shadow-inner animate-in slide-in-from-top-4 duration-300',
                        {
                          'bg-red-500': cell === 'red',
                          'bg-yellow-400': cell === 'yellow',
                        }
                      )}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column indicators for mobile */}
      <div className="grid grid-cols-7 gap-2 mt-2 md:hidden">
        {Array.from({ length: 7 }, (_, index) => (
          <button
            key={index}
            className={cn(
              'h-8 text-sm font-medium rounded-md transition-colors',
              'border border-gray-300 bg-white hover:bg-gray-50',
              {
                'cursor-not-allowed opacity-50': isGameOver,
                'bg-blue-100 border-blue-300': hoveredColumn === index,
              }
            )}
            onClick={() => handleColumnClick(index)}
            onMouseEnter={() => handleColumnHover(index)}
            onMouseLeave={handleColumnLeave}
            disabled={isGameOver}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Player Indicator */}
      {!isGameOver && (
        <div className="flex items-center justify-center mt-4 gap-2">
          <span className="text-sm font-medium">Drop piece:</span>
          <div
            className={cn('w-6 h-6 rounded-full', {
              'bg-red-500': currentPlayer === 'red',
              'bg-yellow-400': currentPlayer === 'yellow',
            })}
          />
        </div>
      )}
    </div>
  );
}
