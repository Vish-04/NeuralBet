'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface GameStatus {
  isGameOver: boolean;
  winner?: string | null;
  currentPlayer?: string;
  message?: string;
}

export interface GameWrapperProps {
  title: string;
  children: React.ReactNode;
  status: GameStatus;
  className?: string;
  onRestart?: () => void;
}

/**
 * Generic container component for games that provides:
 * - Common game layout
 * - Current player turn display
 * - Game status/winner display
 * - Consistent styling
 */
export function GameWrapper({
  title,
  children,
  status,
  className,
  onRestart,
}: GameWrapperProps) {
  const { isGameOver, winner, currentPlayer, message } = status;

  return (
    <div className={cn('w-full max-w-4xl mx-auto p-4', className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>

          {/* Game Status Display */}
          <div className="flex flex-col items-center gap-2 mt-4">
            {isGameOver ? (
              <div className="flex flex-col items-center gap-2">
                {winner ? (
                  <Badge
                    variant="default"
                    className="text-lg px-4 py-2 bg-green-500 hover:bg-green-600"
                  >
                    🎉 {winner} Wins!
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Game Over
                  </Badge>
                )}
                {message && (
                  <p className="text-sm text-muted-foreground">{message}</p>
                )}
                {onRestart && (
                  <button
                    onClick={onRestart}
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Play Again
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {currentPlayer && (
                  <Badge variant="outline" className="text-base px-3 py-1">
                    Current Turn: {currentPlayer}
                  </Badge>
                )}
                {message && (
                  <p className="text-sm text-muted-foreground">{message}</p>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex justify-center">{children}</CardContent>
      </Card>
    </div>
  );
}
