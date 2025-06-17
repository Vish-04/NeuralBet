'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Gamepad2,
  Trophy,
  Bot,
} from 'lucide-react';
import Link from 'next/link';

// Mock data types
interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  winRate: number;
  specialty: string;
}

interface Match {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'finished';
  startTime: Date;
  duration: number; // in minutes
  gameType: 'chess' | 'go' | 'poker' | 'rts' | 'puzzle';
  participants: AIAgent[];
  currentOdds: { [agentId: string]: number };
  viewerCount: number;
  totalPool: number;
  description: string;
  maxBet: number;
  minBet: number;
}

// Mock data
const mockMatches: Match[] = [
  {
    id: '1',
    title: 'ChessGPT vs DeepMind Alpha',
    status: 'live',
    startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
    duration: 60,
    gameType: 'chess',
    participants: [
      {
        id: 'chess1',
        name: 'ChessGPT',
        avatar: '♔',
        rating: 2850,
        winRate: 0.78,
        specialty: 'Tactical Chess',
      },
      {
        id: 'chess2',
        name: 'DeepMind Alpha',
        avatar: '♚',
        rating: 2920,
        winRate: 0.82,
        specialty: 'Positional Play',
      },
    ],
    currentOdds: { chess1: 2.1, chess2: 1.8 },
    viewerCount: 1247,
    totalPool: 15750.5,
    description: 'Elite AI chess match featuring aggressive tactical play',
    maxBet: 1000,
    minBet: 10,
  },
  {
    id: '2',
    title: 'Go Masters Tournament - Semifinals',
    status: 'upcoming',
    startTime: new Date(Date.now() + 30 * 60 * 1000), // Starting in 30 minutes
    duration: 90,
    gameType: 'go',
    participants: [
      {
        id: 'go1',
        name: 'AlphaGo Supreme',
        avatar: '⚫',
        rating: 3100,
        winRate: 0.85,
        specialty: 'Territory Control',
      },
      {
        id: 'go2',
        name: 'KataGo Elite',
        avatar: '⚪',
        rating: 3050,
        winRate: 0.83,
        specialty: 'Fighting Style',
      },
    ],
    currentOdds: { go1: 1.9, go2: 1.95 },
    viewerCount: 892,
    totalPool: 8420.75,
    description: 'High-stakes Go semifinal with innovative opening strategies',
    maxBet: 500,
    minBet: 5,
  },
  {
    id: '3',
    title: 'Neural Poker Championship',
    status: 'upcoming',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starting in 2 hours
    duration: 120,
    gameType: 'poker',
    participants: [
      {
        id: 'poker1',
        name: 'PokerBot Pro',
        avatar: '🂠',
        rating: 2750,
        winRate: 0.72,
        specialty: 'Bluff Detection',
      },
      {
        id: 'poker2',
        name: 'DeepStack AI',
        avatar: '🃏',
        rating: 2800,
        winRate: 0.75,
        specialty: 'Risk Assessment',
      },
      {
        id: 'poker3',
        name: 'Pluribus V2',
        avatar: '🎲',
        rating: 2825,
        winRate: 0.77,
        specialty: 'Multi-way Pots',
      },
    ],
    currentOdds: { poker1: 3.2, poker2: 2.8, poker3: 2.5 },
    viewerCount: 0,
    totalPool: 0,
    description: 'Multi-way poker showdown with advanced betting strategies',
    maxBet: 2000,
    minBet: 25,
  },
];

// Quick bet modal component
function QuickBetModal({
  match,
  isOpen,
  onClose,
}: {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [potentialWin, setPotentialWin] = useState<number>(0);

  useEffect(() => {
    if (selectedAgent && betAmount) {
      const odds = match.currentOdds[selectedAgent];
      const amount = parseFloat(betAmount);
      if (odds && !isNaN(amount)) {
        setPotentialWin(amount * odds);
      }
    }
  }, [selectedAgent, betAmount, match.currentOdds]);

  const handlePlaceBet = () => {
    // TODO: Implement actual betting logic
    console.log('Placing bet:', {
      matchId: match.id,
      agent: selectedAgent,
      amount: betAmount,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Bet - {match.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="agent-select">Select AI Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an agent to bet on" />
              </SelectTrigger>
              <SelectContent>
                {match.participants.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{agent.avatar}</span>
                      <span>{agent.name}</span>
                      <Badge variant="secondary">
                        {match.currentOdds[agent.id]}x
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bet-amount">Bet Amount</Label>
            <Input
              id="bet-amount"
              type="number"
              placeholder={`Min: $${match.minBet} - Max: $${match.maxBet}`}
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min={match.minBet}
              max={match.maxBet}
            />
          </div>

          {potentialWin > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-700 dark:text-green-300">
                Potential Win:{' '}
                <span className="font-bold">${potentialWin.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              className="flex-1"
              disabled={
                !selectedAgent ||
                !betAmount ||
                parseFloat(betAmount) < match.minBet
              }
            >
              Place Bet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LobbyPage() {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [quickBetOpen, setQuickBetOpen] = useState(false);

  // Filter matches based on search and filters
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.participants.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesGameType =
      gameTypeFilter === 'all' || match.gameType === gameTypeFilter;
    const matchesStatus =
      statusFilter === 'all' || match.status === statusFilter;

    return matchesSearch && matchesGameType && matchesStatus;
  });

  const liveMatches = filteredMatches.filter((m) => m.status === 'live');
  const upcomingMatches = filteredMatches.filter(
    (m) => m.status === 'upcoming'
  );

  const formatTimeUntilStart = (startTime: Date) => {
    const now = new Date();
    const diffMs = startTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return 'Starting now';
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: Match['status']) => {
    switch (status) {
      case 'live':
        return (
          <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
        );
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">Finished</Badge>;
    }
  };

  const openQuickBet = (match: Match) => {
    setSelectedMatch(match);
    setQuickBetOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Battle Arena</h1>
          <p className="text-muted-foreground">
            Watch elite AI agents compete and place your bets
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {matches
              .reduce((total, match) => total + match.viewerCount, 0)
              .toLocaleString()}{' '}
            watching
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search matches or AI agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Game Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="chess">Chess</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="poker">Poker</SelectItem>
                <SelectItem value="rts">RTS</SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Live and Upcoming Matches Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Live ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming ({upcomingMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Live Matches</h3>
                <p className="text-muted-foreground">
                  Check back soon for live AI battles!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">
                        {match.title}
                      </CardTitle>
                      {getStatusBadge(match.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {match.viewerCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />$
                        {match.totalPool.toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {match.description}
                    </p>

                    {/* Participants and Odds */}
                    <div className="space-y-2">
                      {match.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {participant.avatar}
                            </span>
                            <div>
                              <div className="font-medium text-sm">
                                {participant.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {participant.winRate * 100}% WR
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {match.currentOdds[participant.id]}x
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Link href={`/match/${match.id}`}>
                          <Gamepad2 className="h-4 w-4 mr-1" />
                          Watch
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openQuickBet(match)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Bet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Upcoming Matches
                </h3>
                <p className="text-muted-foreground">
                  New matches are scheduled regularly!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">
                        {match.title}
                      </CardTitle>
                      {getStatusBadge(match.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Starts in {formatTimeUntilStart(match.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {match.gameType.toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {match.description}
                    </p>

                    {/* Participants and Odds */}
                    <div className="space-y-2">
                      {match.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {participant.avatar}
                            </span>
                            <div>
                              <div className="font-medium text-sm">
                                {participant.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Rating: {participant.rating}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {match.currentOdds[participant.id]}x
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Not Started
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openQuickBet(match)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Pre-Bet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Bet Modal */}
      {selectedMatch && (
        <QuickBetModal
          match={selectedMatch}
          isOpen={quickBetOpen}
          onClose={() => {
            setQuickBetOpen(false);
            setSelectedMatch(null);
          }}
        />
      )}
    </div>
  );
}
