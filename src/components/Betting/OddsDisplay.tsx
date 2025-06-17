'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { OddsDisplayProps } from '@/types/betting';
import { formatOdds, oddsToImpliedProbability } from '@/lib/betting-utils';

const OddsDisplay = React.forwardRef<HTMLSpanElement, OddsDisplayProps>(
  ({ odds, className, showProbability = false, ...props }, ref) => {
    const formattedOdds = formatOdds(odds);
    const isPositive = odds.format === 'american' && odds.value > 0;
    const probability = showProbability ? oddsToImpliedProbability(odds) : null;

    return (
      <div className={cn('inline-flex flex-col items-center gap-1', className)}>
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-md border transition-colors',
            isPositive
              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
            odds.format === 'decimal' &&
              'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
            odds.format === 'fractional' &&
              'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
          )}
          {...props}
        >
          {formattedOdds}
        </span>
        {showProbability && probability && (
          <span className="text-xs text-muted-foreground">
            {probability.toFixed(1)}%
          </span>
        )}
      </div>
    );
  }
);

OddsDisplay.displayName = 'OddsDisplay';

export { OddsDisplay };
