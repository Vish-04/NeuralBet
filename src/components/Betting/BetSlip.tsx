'use client';

import * as React from 'react';
import { X, Trash2, Calculator, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BetSlipProps, BetSelection } from '@/types/betting';
import {
  formatCurrency,
  formatOdds,
  calculatePayout,
  calculateProfit,
  validateStake,
} from '@/lib/betting-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OddsDisplay } from './OddsDisplay';

const BetSlip = React.forwardRef<HTMLDivElement, BetSlipProps>(
  (
    {
      selections,
      onPlaceBet,
      onRemoveSelection,
      onClearAll,
      isOpen,
      onOpenChange,
      isLoading = false,
      className,
      ...props
    },
    ref
  ) => {
    const [stake, setStake] = React.useState<string>('');
    const [stakeError, setStakeError] = React.useState<string>('');
    const [isPlacing, setIsPlacing] = React.useState(false);

    const numericStake = React.useMemo(() => {
      const parsed = parseInt(stake);
      return isNaN(parsed) ? 0 : parsed;
    }, [stake]);

    const totalOdds = React.useMemo(() => {
      if (selections.length === 0) return null;

      // For multiple selections, multiply decimal odds
      let combinedDecimal = 1;
      selections.forEach((selection) => {
        const decimalOdds =
          selection.odds.format === 'decimal'
            ? selection.odds.value
            : selection.odds.format === 'american'
            ? selection.odds.value > 0
              ? selection.odds.value / 100 + 1
              : 100 / Math.abs(selection.odds.value) + 1
            : 1; // TODO: Handle fractional odds
        combinedDecimal *= decimalOdds;
      });

      return {
        value:
          combinedDecimal > 2
            ? Math.round((combinedDecimal - 1) * 100)
            : Math.round(-100 / (combinedDecimal - 1)),
        format: 'american' as const,
      };
    }, [selections]);

    const potentialPayout = React.useMemo(() => {
      if (!totalOdds || numericStake === 0) return 0;
      return calculatePayout(numericStake, totalOdds);
    }, [totalOdds, numericStake]);

    const potentialProfit = React.useMemo(() => {
      return potentialPayout - numericStake;
    }, [potentialPayout, numericStake]);

    const handleStakeChange = (value: string) => {
      setStake(value);
      setStakeError('');

      const parsed = parseInt(value);
      if (value !== '' && !isNaN(parsed)) {
        const validation = validateStake(parsed);
        if (!validation.valid) {
          setStakeError(validation.error || 'Invalid stake');
        }
      }
    };

    const handlePlaceBet = async () => {
      if (
        selections.length === 0 ||
        numericStake === 0 ||
        stakeError ||
        !totalOdds
      )
        return;

      const validation = validateStake(numericStake);
      if (!validation.valid) {
        setStakeError(validation.error || 'Invalid stake');
        return;
      }

      setIsPlacing(true);
      try {
        await onPlaceBet({
          selections,
          stake: numericStake,
          potentialPayout,
          type: selections.length === 1 ? 'single' : 'multiple',
        });

        // Reset form on success
        setStake('');
        setStakeError('');
        onOpenChange(false);
      } catch (error) {
        console.error('Error placing bet:', error);
        // Error handling should be done by parent component
      } finally {
        setIsPlacing(false);
      }
    };

    const canPlaceBet =
      selections.length > 0 && numericStake > 0 && !stakeError && !isPlacing;

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn('max-w-md', className)}
          ref={ref}
          {...props}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bet Slip
              </span>
              <Badge variant="secondary">
                {selections.length} selection
                {selections.length !== 1 ? 's' : ''}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No selections added</p>
                <p className="text-sm">Add selections to create a bet</p>
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-60">
                  <div className="space-y-3">
                    {selections.map((selection) => (
                      <div
                        key={selection.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {selection.eventName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {selection.marketName}: {selection.selectionName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <OddsDisplay odds={selection.odds} />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveSelection(selection.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove selection</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stake">Stake</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stake"
                        type="number"
                        min="1"
                        step="1"
                        value={stake}
                        onChange={(e) => handleStakeChange(e.target.value)}
                        placeholder="Enter stake amount"
                        className="pl-9"
                        disabled={isPlacing}
                      />
                    </div>
                    {stakeError && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-xs">
                          {stakeError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {totalOdds && numericStake > 0 && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Total Odds:</span>
                        <OddsDisplay odds={totalOdds} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Stake:</span>
                        <span>{formatCurrency(numericStake)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Potential Profit:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {formatCurrency(potentialProfit)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Potential Payout:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {formatCurrency(potentialPayout)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full gap-2">
              <Button
                variant="outline"
                onClick={onClearAll}
                disabled={selections.length === 0 || isPlacing}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
              <Button
                onClick={handlePlaceBet}
                disabled={!canPlaceBet || isLoading}
                className="flex items-center gap-2 flex-1"
              >
                {isPlacing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Placing Bet...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4" />
                    Place Bet
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

BetSlip.displayName = 'BetSlip';

export { BetSlip };
