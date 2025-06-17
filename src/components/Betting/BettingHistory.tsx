'use client';

import * as React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BettingHistoryProps, BetStatus, BettingHistorySortOption } from '@/types/betting';
import { formatCurrency, formatBetDate } from '@/lib/betting-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { OddsDisplay } from './OddsDisplay';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  won: {
    label: 'Won',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-600 dark:text-green-400',
  },
  lost: {
    label: 'Lost',
    icon: XCircle,
    variant: 'destructive' as const,
    color: 'text-red-600 dark:text-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    icon: Ban,
    variant: 'outline' as const,
    color: 'text-gray-600 dark:text-gray-400',
  },
  void: {
    label: 'Void',
    icon: AlertCircle,
    variant: 'outline' as const,
    color: 'text-gray-600 dark:text-gray-400',
  },
};

const BettingHistory = React.forwardRef<HTMLDivElement, BettingHistoryProps>(
  ({ 
    bets, 
    isLoading = false, 
    error,
    filters,
    sortOption,
    onFiltersChange,
    onSortChange,
    onRefresh,
    className,
    ...props 
  }, ref) => {
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [showFilters, setShowFilters] = React.useState(false);
    const [expandedBets, setExpandedBets] = React.useState<Set<string>>(new Set());

    const handleRefresh = async () => {
      if (!onRefresh || isRefreshing) return;
      
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    };

    const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
      if (onSortChange) {
        onSortChange({
          field: field as BettingHistorySortOption['field'],
          direction,
        });
      }
    };

    const toggleBetExpansion = (betId: string) => {
      setExpandedBets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(betId)) {
          newSet.delete(betId);
        } else {
          newSet.add(betId);
        }
        return newSet;
      });
    };

    const getBetStatusIcon = (status: BetStatus) => {
      const config = statusConfig[status];
      const Icon = config.icon;
      return <Icon className={cn('h-4 w-4', config.color)} />;
    };

    const getBetStatusBadge = (status: BetStatus) => {
      const config = statusConfig[status];
      return (
        <Badge variant={config.variant} className="flex items-center gap-1">
          {getBetStatusIcon(status)}
          {config.label}
        </Badge>
      );
    };

    if (error) {
      return (
        <Card ref={ref} className={cn('w-full', className)} {...props}>
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
                    <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
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
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Betting History</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn('h-4 w-4', (isLoading || isRefreshing) && 'animate-spin')} />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select
                    value={filters?.status || 'all'}
                    onValueChange={(value) => 
                      onFiltersChange?.({ 
                        ...filters, 
                        status: value === 'all' ? undefined : value as BetStatus 
                      })
                    }
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="void">Void</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-stake">Min Stake</Label>
                  <Input
                    id="min-stake"
                    type="number"
                    placeholder="0"
                    value={filters?.minStake || ''}
                    onChange={(e) => 
                      onFiltersChange?.({ 
                        ...filters, 
                        minStake: e.target.value ? parseInt(e.target.value) : undefined 
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-stake">Max Stake</Label>
                  <Input
                    id="max-stake"
                    type="number"
                    placeholder="1000"
                    value={filters?.maxStake || ''}
                    onChange={(e) => 
                      onFiltersChange?.({ 
                        ...filters, 
                        maxStake: e.target.value ? parseInt(e.target.value) : undefined 
                      })
                    }
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No betting history</p>
              <p className="text-sm">Your bets will appear here once you start betting</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSortChange('placedAt', 
                          sortOption?.field === 'placedAt' && sortOption.direction === 'desc' ? 'asc' : 'desc'
                        )}
                        className="h-8 p-0 hover:bg-transparent"
                      >
                        Date
                        {sortOption?.field === 'placedAt' && (
                          sortOption.direction === 'desc' ? 
                            <ChevronDown className="ml-1 h-3 w-3" /> : 
                            <ChevronUp className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Selections</TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSortChange('stake', 
                          sortOption?.field === 'stake' && sortOption.direction === 'desc' ? 'asc' : 'desc'
                        )}
                        className="h-8 p-0 hover:bg-transparent"
                      >
                        Stake
                        {sortOption?.field === 'stake' && (
                          sortOption.direction === 'desc' ? 
                            <ChevronDown className="ml-1 h-3 w-3" /> : 
                            <ChevronUp className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSortChange('potentialPayout', 
                          sortOption?.field === 'potentialPayout' && sortOption.direction === 'desc' ? 'asc' : 'desc'
                        )}
                        className="h-8 p-0 hover:bg-transparent"
                      >
                        Payout
                        {sortOption?.field === 'potentialPayout' && (
                          sortOption.direction === 'desc' ? 
                            <ChevronDown className="ml-1 h-3 w-3" /> : 
                            <ChevronUp className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <React.Fragment key={bet.id}>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {formatBetDate(bet.placedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">
                              {bet.selections.length === 1 
                                ? bet.selections[0].eventName 
                                : `${bet.selections.length} selections`
                              }
                            </span>
                            {bet.selections.length === 1 && (
                              <span className="text-xs text-muted-foreground">
                                {bet.selections[0].marketName}: {bet.selections[0].selectionName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(bet.stake)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium">
                              {formatCurrency(bet.actualPayout || bet.potentialPayout)}
                            </span>
                            {bet.status === 'won' && bet.actualPayout && (
                              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                +{formatCurrency(bet.actualPayout - bet.stake)}
                              </div>
                            )}
                            {bet.status === 'lost' && (
                              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                <TrendingDown className="h-3 w-3" />
                                -{formatCurrency(bet.stake)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getBetStatusBadge(bet.status)}
                        </TableCell>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBetExpansion(bet.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedBets.has(bet.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              <span className="sr-only">Toggle details</span>
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <Collapsible open={expandedBets.has(bet.id)}>
                        <CollapsibleContent asChild>
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/30">
                              <div className="py-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Bet Type:</span> {bet.type}
                                  </div>
                                  <div>
                                    <span className="font-medium">Placed At:</span> {formatBetDate(bet.placedAt)}
                                  </div>
                                  {bet.settledAt && (
                                    <div>
                                      <span className="font-medium">Settled At:</span> {formatBetDate(bet.settledAt)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Selections:</h4>
                                  <div className="space-y-2">
                                    {bet.selections.map((selection) => (
                                      <div key={selection.id} className="flex justify-between items-center p-2 bg-background rounded border">
                                        <div className="flex-1">
                                          <p className="font-medium">{selection.eventName}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {selection.marketName}: {selection.selectionName}
                                          </p>
                                        </div>
                                        <OddsDisplay odds={selection.odds} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </Collapsible>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

BettingHistory.displayName = 'BettingHistory';

export { BettingHistory };