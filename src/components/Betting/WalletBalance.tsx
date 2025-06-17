'use client';

import * as React from 'react';
import { RefreshCw, Wallet, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletBalanceProps } from '@/types/betting';
import { formatCurrency, formatCredits } from '@/lib/betting-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletBalance = React.forwardRef<HTMLDivElement, WalletBalanceProps>(
  (
    { balance, isLoading = false, error, onRefresh, className, ...props },
    ref
  ) => {
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefresh = async () => {
      if (!onRefresh || isRefreshing) return;

      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    };

    if (error) {
      return (
        <Card ref={ref} className={cn('w-full max-w-sm', className)} {...props}>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                {onRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="ml-2"
                  >
                    <RefreshCw
                      className={cn('h-3 w-3', isRefreshing && 'animate-spin')}
                    />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card ref={ref} className={cn('w-full max-w-sm', className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet Balance
          </CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={cn(
                  'h-3 w-3',
                  (isLoading || isRefreshing) && 'animate-spin'
                )}
              />
              <span className="sr-only">Refresh balance</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </>
            ) : balance ? (
              <>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(balance.credits)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCredits(balance.credits)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated:{' '}
                  {new Date(balance.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                No balance information available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

WalletBalance.displayName = 'WalletBalance';

export { WalletBalance };
