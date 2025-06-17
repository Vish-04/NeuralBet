'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  BarChart3,
  RefreshCw,
  Plus,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { BettingHistory, WalletBalance } from '@/components/Betting';
import type {
  Bet,
  WalletBalance as WalletBalanceType,
  BettingHistoryFilters,
  BettingHistorySortOption,
} from '@/types/betting';

// Mock data for portfolio
const mockWalletBalance: WalletBalanceType = {
  id: 'wallet-1',
  userId: 'user-1',
  credits: 2847.5,
  lastUpdated: new Date().toISOString(),
};

const mockBets: Bet[] = [
  {
    id: 'bet-1',
    userId: 'user-1',
    selections: [
      {
        id: 'sel-1',
        eventId: 'match-1',
        marketId: 'winner',
        selectionId: 'agent-1',
        eventName: 'ChessGPT vs DeepMind Alpha',
        marketName: 'Match Winner',
        selectionName: 'ChessGPT',
        odds: { value: 2.1, format: 'decimal' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stake: 100,
    potentialPayout: 210,
    status: 'pending',
    placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'single',
  },
  {
    id: 'bet-2',
    userId: 'user-1',
    selections: [
      {
        id: 'sel-2',
        eventId: 'match-2',
        marketId: 'winner',
        selectionId: 'agent-2',
        eventName: 'Go Masters Semifinal',
        marketName: 'Match Winner',
        selectionName: 'AlphaGo Supreme',
        odds: { value: 1.85, format: 'decimal' },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stake: 150,
    potentialPayout: 277.5,
    actualPayout: 277.5,
    status: 'won',
    placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    type: 'single',
  },
  {
    id: 'bet-3',
    userId: 'user-1',
    selections: [
      {
        id: 'sel-3',
        eventId: 'match-3',
        marketId: 'winner',
        selectionId: 'agent-3',
        eventName: 'Poker Championship Finals',
        marketName: 'Tournament Winner',
        selectionName: 'PokerBot Pro',
        odds: { value: 3.2, format: 'decimal' },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stake: 75,
    potentialPayout: 240,
    status: 'lost',
    placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(),
    type: 'single',
  },
  {
    id: 'bet-4',
    userId: 'user-1',
    selections: [
      {
        id: 'sel-4',
        eventId: 'match-4',
        marketId: 'winner',
        selectionId: 'agent-4',
        eventName: 'RTS Battle Royale',
        marketName: 'Match Winner',
        selectionName: 'StrategyAI Elite',
        odds: { value: 2.5, format: 'decimal' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stake: 200,
    potentialPayout: 500,
    actualPayout: 500,
    status: 'won',
    placedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000
    ).toISOString(),
    type: 'single',
  },
];

interface PerformanceStats {
  totalBets: number;
  totalStaked: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
  averageStake: number;
  biggestWin: number;
  biggestLoss: number;
  currentStreak: { type: 'win' | 'loss'; count: number };
  monthlyStats: {
    month: string;
    bets: number;
    staked: number;
    won: number;
    profit: number;
  }[];
}

// Calculate performance stats from bets
function calculateStats(bets: Bet[]): PerformanceStats {
  const settledBets = bets.filter(
    (bet) => bet.status === 'won' || bet.status === 'lost'
  );
  const wonBets = bets.filter((bet) => bet.status === 'won');
  const lostBets = bets.filter((bet) => bet.status === 'lost');

  const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalWon = wonBets.reduce(
    (sum, bet) => sum + (bet.actualPayout || 0),
    0
  );
  const totalLost = lostBets.reduce((sum, bet) => sum + bet.stake, 0);
  const netProfit = totalWon - totalLost;

  const winRate =
    settledBets.length > 0 ? (wonBets.length / settledBets.length) * 100 : 0;
  const averageStake = bets.length > 0 ? totalStaked / bets.length : 0;

  const biggestWin =
    wonBets.length > 0
      ? Math.max(...wonBets.map((bet) => (bet.actualPayout || 0) - bet.stake))
      : 0;
  const biggestLoss =
    lostBets.length > 0 ? Math.max(...lostBets.map((bet) => bet.stake)) : 0;

  // Calculate current streak
  let currentStreak: { type: 'win' | 'loss'; count: number } = {
    type: 'win',
    count: 0,
  };
  const sortedBets = [...settledBets].sort(
    (a, b) =>
      new Date(b.settledAt || b.placedAt).getTime() -
      new Date(a.settledAt || a.placedAt).getTime()
  );

  if (sortedBets.length > 0) {
    const streakType: 'win' | 'loss' =
      sortedBets[0].status === 'won' ? 'win' : 'loss';
    let count = 0;
    for (const bet of sortedBets) {
      if (bet.status === (streakType === 'win' ? 'won' : 'lost')) {
        count++;
      } else {
        break;
      }
    }
    currentStreak = { type: streakType, count };
  }

  // Monthly stats (simplified - last 6 months)
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthBets = bets.filter((bet) => {
      const betDate = new Date(bet.placedAt);
      return (
        betDate.getMonth() === date.getMonth() &&
        betDate.getFullYear() === date.getFullYear()
      );
    });

    const monthWon = monthBets.filter((bet) => bet.status === 'won');
    const monthStaked = monthBets.reduce((sum, bet) => sum + bet.stake, 0);
    const monthWonAmount = monthWon.reduce(
      (sum, bet) => sum + (bet.actualPayout || 0),
      0
    );
    const monthLost = monthBets
      .filter((bet) => bet.status === 'lost')
      .reduce((sum, bet) => sum + bet.stake, 0);

    return {
      month: date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      bets: monthBets.length,
      staked: monthStaked,
      won: monthWonAmount,
      profit: monthWonAmount - monthLost,
    };
  }).reverse();

  return {
    totalBets: bets.length,
    totalStaked,
    totalWon,
    netProfit,
    winRate,
    averageStake,
    biggestWin,
    biggestLoss,
    currentStreak,
    monthlyStats,
  };
}

export default function PortfolioPage() {
  const [walletBalance] = useState<WalletBalanceType>(mockWalletBalance);
  const [bets] = useState<Bet[]>(mockBets);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<BettingHistoryFilters>({});
  const [sortOption, setSortOption] = useState<BettingHistorySortOption>({
    field: 'placedAt',
    direction: 'desc',
  });

  const stats = calculateStats(bets);
  const activeBets = bets.filter((bet) => bet.status === 'pending');
  const settledBets = bets.filter(
    (bet) => bet.status === 'won' || bet.status === 'lost'
  );

  const handleRefreshBalance = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleRefreshBets = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your betting performance and manage your wallet
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/buy-credits">
              <Plus className="h-4 w-4 mr-2" />
              Buy Credits
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshBalance}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <WalletBalance
          balance={walletBalance}
          isLoading={isLoading}
          onRefresh={handleRefreshBalance}
          className="max-w-none"
        />

        {/* Net Profit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            {stats.netProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.netProfit >= 0 ? '+' : ''}
              {formatCurrency(stats.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalBets} total bets
            </p>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.winRate.toFixed(1)}%
            </div>
            <div className="mt-2">
              <Progress value={stats.winRate} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {settledBets.filter((b) => b.status === 'won').length} wins of{' '}
              {settledBets.length} settled
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            {stats.currentStreak.type === 'win' ? (
              <Trophy className="h-4 w-4 text-yellow-600" />
            ) : (
              <Activity className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentStreak.count}
            </div>
            <Badge
              variant={
                stats.currentStreak.type === 'win' ? 'default' : 'secondary'
              }
              className="mt-2"
            >
              {stats.currentStreak.type === 'win' ? 'Win' : 'Loss'} Streak
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active-bets">
            Active Bets ({activeBets.length})
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Staked
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(stats.totalStaked)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Won
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(stats.totalWon)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Average Stake
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(stats.averageStake)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Biggest Win
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      +{formatCurrency(stats.biggestWin)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.monthlyStats.slice(-6).map((month, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="text-sm font-medium">{month.month}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground">
                          {month.bets} bets
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            month.profit >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {month.profit >= 0 ? '+' : ''}
                          {formatCurrency(month.profit)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bets.slice(0, 5).map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {bet.status === 'pending' && (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        {bet.status === 'won' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {bet.status === 'lost' && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {bet.status === 'cancelled' && (
                          <AlertCircle className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {bet.selections[0].eventName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bet.selections[0].selectionName} •{' '}
                          {formatCurrency(bet.stake)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          bet.status === 'won'
                            ? 'default'
                            : bet.status === 'lost'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {bet.status}
                      </Badge>
                      {bet.status === 'won' && bet.actualPayout && (
                        <div className="text-xs text-green-600 mt-1">
                          +{formatCurrency(bet.actualPayout - bet.stake)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-bets" className="space-y-4">
          {activeBets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Bets</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any pending bets at the moment.
                </p>
                <Button asChild>
                  <Link href="/lobby">Browse Matches</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeBets.map((bet) => (
                <Card key={bet.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {bet.selections[0].eventName}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Selection:
                        </span>
                        <span className="font-medium">
                          {bet.selections[0].selectionName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Odds:</span>
                        <span className="font-medium">
                          {bet.selections[0].odds.value}x
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stake:</span>
                        <span className="font-medium">
                          {formatCurrency(bet.stake)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Potential Win:
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(bet.potentialPayout)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Placed: {new Date(bet.placedAt).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/match/${bet.selections[0].eventId}`}>
                            View Match
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <BettingHistory
            bets={bets}
            isLoading={isLoading}
            filters={filters}
            sortOption={sortOption}
            onFiltersChange={setFilters}
            onSortChange={setSortOption}
            onRefresh={handleRefreshBets}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
