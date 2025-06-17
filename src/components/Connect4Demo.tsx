/**
 * Connect4 Demo Component
 * 
 * Demonstrates the useLocalGame hook with the Connect4 engine.
 * This is a basic implementation for testing the game abstraction layer.
 */

'use client';

import React from 'react';
import { useLocalGame } from '../hooks/useLocalGame';
import { connect4Engine, Connect4State, Connect4Move, CONNECT4_ROWS, CONNECT4_COLS } from '../lib/games/connect4';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Connect4Demo() {
  const game = useLocalGame(connect4Engine);

  const handleColumnClick = (col: number) => {
    try {
      game.makeMove({ col });
    } catch (error) {
      console.error('Invalid move:', error);
      // In a real app, you'd show user feedback here
    }
  };

  const renderCell = (row: number, col: number) => {
    const piece = game.gameState.boardState.board[row][col];
    
    let className = 'w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-white font-bold';
    
    if (piece === 'a') {
      className += ' bg-red-500';
    } else if (piece === 'b') {
      className += ' bg-yellow-500';
    } else {
      className += ' bg-gray-100 hover:bg-gray-200 cursor-pointer';
    }

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        onClick={() => !piece && !game.isGameComplete && handleColumnClick(col)}
      >
        {piece === 'a' && 'A'}
        {piece === 'b' && 'B'}
      </div>
    );
  };

  const renderBoard = () => {
    const rows: React.ReactElement[] = [];
    
    for (let row = 0; row < CONNECT4_ROWS; row++) {
      const cells: React.ReactElement[] = [];
      for (let col = 0; col < CONNECT4_COLS; col++) {
        cells.push(renderCell(row, col));
      }
      rows.push(
        <div key={row} className="flex gap-2 justify-center">
          {cells}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-2 p-4 bg-blue-600 rounded-lg">
        {rows}
      </div>
    );
  };

  const getPlayerName = (player: 'a' | 'b') => {
    return player === 'a' ? 'Red (A)' : 'Yellow (B)';
  };

  const getStatusMessage = () => {
    if (game.isGameComplete) {
      if (game.winner === 'draw') {
        return 'Game ended in a draw!';
      } else if (game.winner) {
        return `${getPlayerName(game.winner)} wins!`;
      }
    }
    return `Current turn: ${getPlayerName(game.currentPlayer)}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Connect4 Demo</CardTitle>
        <CardDescription>
          Testing the game abstraction layer with Connect4. Click on columns to drop pieces.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Status */}
        <div className="text-center">
          <p className="text-lg font-medium">{getStatusMessage()}</p>
        </div>

        {/* Game Board */}
        {renderBoard()}

        {/* Column Numbers */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: CONNECT4_COLS }, (_, i) => (
            <div key={i} className="w-12 text-center text-sm font-medium text-gray-600">
              {i}
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={game.resetGame}
            variant="outline"
          >
            Reset Game
          </Button>
          
          {game.canUndo && (
            <Button 
              onClick={game.undoLastMove}
              variant="outline"
              disabled={game.isGameComplete}
            >
              Undo Last Move
            </Button>
          )}
        </div>

        {/* Move History */}
        {game.moveHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Move History:</h4>
            <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
              {game.moveHistory.map((move, index) => (
                <div key={index} className="flex justify-between">
                  <span>Move {index + 1}:</span>
                  <span>{getPlayerName(move.player)} → Column {(move.move as Connect4Move).col}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600">Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
            {game.getStateString()}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}

export default Connect4Demo;