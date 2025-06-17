'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  MessageCircle,
  Send,
  BarChart3,
  Clock,
  Zap,
  Trophy,
  Eye,
  DollarSign,
  Gamepad2,
  Activity,
  Star,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types for the match page
interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  winRate: number;
  specialty: string;
  color: string;
}

interface GameMove {
  id: string;
  agentId: string;
  move: string;
  timestamp: Date;
  evaluation?: number;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface Match {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'finished';
  startTime: Date;
  duration: number;
  gameType: 'chess' | 'go' | 'poker' | 'rts' | 'puzzle';
  participants: AIAgent[];
  currentOdds: { [agentId: string]: number };
  viewerCount: number;
  totalPool: number;
  description: string;
  gameState: Record<string, unknown>;
  moves: GameMove[];
}

interface UserBet {
  id: string;
  agentId: string;
  amount: number;
  odds: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost';
}

// Mock data
const mockMatch: Match = {
  id: '1',
  title: 'ChessGPT vs DeepMind Alpha',
  status: 'live',
  startTime: new Date(Date.now() - 25 * 60 * 1000),
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
      color: 'white',
    },
    {
      id: 'chess2',
      name: 'DeepMind Alpha',
      avatar: '♚',
      rating: 2920,
      winRate: 0.82,
      specialty: 'Positional Play',
      color: 'black',
    },
  ],
  currentOdds: { chess1: 2.1, chess2: 1.8 },
  viewerCount: 1247,
  totalPool: 15750.5,
  description: 'Elite AI chess match featuring aggressive tactical play',
  gameState: {
    currentPlayer: 'chess1',
    moveCount: 23,
    position: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR',
  },
  moves: [
    {
      id: '1',
      agentId: 'chess1',
      move: 'e4',
      timestamp: new Date(Date.now() - 24 * 60 * 1000),
      evaluation: 0.2,
    },
    {
      id: '2',
      agentId: 'chess2',
      move: 'e5',
      timestamp: new Date(Date.now() - 23 * 60 * 1000),
      evaluation: 0.1,
    },
    {
      id: '3',
      agentId: 'chess1',
      move: 'Bc4',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      evaluation: 0.3,
    },
    {
      id: '4',
      agentId: 'chess2',
      move: 'Nf6',
      timestamp: new Date(Date.now() - 21 * 60 * 1000),
      evaluation: 0.1,
    },
  ],
};

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'ChessEnthusiast',
    message: 'This opening is incredible!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    username: 'System',
    message: 'ChessGPT played Bc4',
    timestamp: new Date(Date.now() - 9 * 60 * 1000),
    isSystem: true,
  },
  {
    id: '3',
    username: 'BettingPro',
    message: 'Those odds are shifting fast',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: '4',
    username: 'AIWatcher',
    message: 'DeepMind Alpha showing strong positional play',
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
  },
  {
    id: '5',
    username: 'System',
    message: 'New viewer milestone: 1000+ watching!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isSystem: true,
  },
];

const mockUserBets: UserBet[] = [
  {
    id: '1',
    agentId: 'chess1',
    amount: 50,
    odds: 2.2,
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    status: 'active',
  },
  {
    id: '2',
    agentId: 'chess2',
    amount: 25,
    odds: 1.9,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'active',
  },
];

// Chess board component (simplified)
function ChessBoard({
  position,
  lastMove,
}: {
  position: string;
  lastMove?: GameMove;
}) {
  // This is a simplified representation - in reality you'd use a proper chess library
  return (
    <div className="aspect-square bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-800 p-4">
      <div className="grid grid-cols-8 gap-0 h-full w-full">
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          return (
            <div
              key={i}
              className={`
                aspect-square flex items-center justify-center text-2xl font-bold
                ${
                  isLight
                    ? 'bg-amber-100 dark:bg-amber-800/30'
                    : 'bg-amber-300 dark:bg-amber-900/50'
                }
              `}
            >
              {/* Simplified piece placement - would use actual FEN parsing */}
              {i === 4 && '♔'}
              {i === 60 && '♚'}
              {i === 28 && '♗'}
              {i === 42 && '♞'}
            </div>
          );
        })}
      </div>
      {lastMove && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Last move: <span className="font-medium">{lastMove.move}</span>
        </div>
      )}
    </div>
  );
}

// Betting panel component
function BettingPanel({
  match,
  userBets,
}: {
  match: Match;
  userBets: UserBet[];
}) {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [showBetDialog, setShowBetDialog] = useState(false);

  const totalBetAmount = userBets.reduce((sum, bet) => sum + bet.amount, 0);
  const potentialWinnings = userBets.reduce((sum, bet) => {
    if (bet.status === 'active') {
      return sum + bet.amount * bet.odds;
    }
    return sum;
  }, 0);

  const handlePlaceBet = () => {
    console.log('Placing bet:', {
      matchId: match.id,
      agent: selectedAgent,
      amount: betAmount,
    });
    setShowBetDialog(false);
    setBetAmount('');
    setSelectedAgent('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Betting Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Odds */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Odds</h4>
          {match.participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{participant.avatar}</span>
                <div>
                  <div className="font-medium text-sm">{participant.name}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    +
                    {((match.currentOdds[participant.id] - 1) * 100).toFixed(0)}
                    %
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {match.currentOdds[participant.id]}x
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAgent(participant.id);
                    setShowBetDialog(true);
                  }}
                >
                  Bet
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Your Bets */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Your Active Bets</h4>
          {userBets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active bets</p>
          ) : (
            <div className="space-y-2">
              {userBets.map((bet) => {
                const agent = match.participants.find(
                  (p) => p.id === bet.agentId
                );
                return (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between p-2 rounded bg-blue-50 dark:bg-blue-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <span>{agent?.avatar}</span>
                      <div className="text-sm">
                        <div className="font-medium">${bet.amount}</div>
                        <div className="text-xs text-muted-foreground">
                          @{bet.odds}x
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        bet.status === 'active'
                          ? 'default'
                          : bet.status === 'won'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {bet.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {userBets.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Bet:</span>
                <span className="font-medium">${totalBetAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="font-medium text-green-600">
                  ${potentialWinnings.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Betting Dialog */}
        <Dialog open={showBetDialog} onOpenChange={setShowBetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Bet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAgent && (
                <div className="p-3 bg-muted rounded-lg">
                  {(() => {
                    const agent = match.participants.find(
                      (p) => p.id === selectedAgent
                    );
                    return (
                      agent && (
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{agent.avatar}</span>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Odds: {match.currentOdds[selectedAgent]}x
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })()}
                </div>
              )}
              <div>
                <Label>Bet Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
              </div>
              {betAmount && selectedAgent && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Potential Win:{' '}
                    <span className="font-bold">
                      $
                      {(
                        parseFloat(betAmount) * match.currentOdds[selectedAgent]
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBetDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlaceBet}
                  className="flex-1"
                  disabled={!betAmount || !selectedAgent}
                >
                  Place Bet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Chat component
function LiveChat({ messages }: { messages: ChatMessage[] }) {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Live Chat
          <Badge variant="secondary">{chatMessages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-3 pb-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`text-sm ${
                  message.isSystem
                    ? 'text-center text-muted-foreground italic'
                    : ''
                }`}
              >
                {!message.isSystem && (
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.username[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">
                          {message.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{message.message}</p>
                    </div>
                  </div>
                )}
                {message.isSystem && (
                  <p className="text-xs py-1">{message.message}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              size="sm"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MatchPage() {
  const params = useParams();
  const matchId = params.id as string;

  const [match] = useState<Match>(mockMatch);
  const [chatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [userBets] = useState<UserBet[]>(mockUserBets);

  const getElapsedTime = () => {
    const elapsed = Date.now() - match.startTime.getTime();
    const minutes = Math.floor(elapsed / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const lastMove = match.moves[match.moves.length - 1];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{match.title}</h1>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>
          <p className="text-muted-foreground">{match.description}</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span className="font-medium">
              {match.viewerCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground">watching</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              ${match.totalPool.toLocaleString()}
            </span>
            <span className="text-muted-foreground">pool</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{getElapsedTime()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Board - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          {/* Player Info */}
          <div className="grid grid-cols-2 gap-4">
            {match.participants.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{participant.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-bold">{participant.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Rating: {participant.rating}</span>
                        <span>
                          {(participant.winRate * 100).toFixed(0)}% WR
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {participant.specialty}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {match.currentOdds[participant.id]}x
                      </div>
                      <div className="text-xs text-green-600">
                        +
                        {(
                          (match.currentOdds[participant.id] - 1) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Game Board */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Game Board
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Move {match.gameState.moveCount}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>
                    Turn:{' '}
                    {
                      match.participants.find(
                        (p) => p.id === match.gameState.currentPlayer
                      )?.name
                    }
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChessBoard
                position={match.gameState.position}
                lastMove={lastMove}
              />
            </CardContent>
          </Card>

          {/* Move History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Move History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {match.moves.map((move, index) => {
                    const agent = match.participants.find(
                      (p) => p.id === move.agentId
                    );
                    return (
                      <div
                        key={move.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {Math.floor(index / 2) + 1}.
                          </span>
                          <span>{agent?.avatar}</span>
                          <span className="font-medium">{move.move}</span>
                        </div>
                        {move.evaluation !== undefined && (
                          <Badge
                            variant={
                              move.evaluation > 0 ? 'default' : 'secondary'
                            }
                          >
                            {move.evaluation > 0 ? '+' : ''}
                            {move.evaluation.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat and Betting */}
        <div className="space-y-4">
          {/* Live Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Game Progress</span>
                  <span>
                    {Math.floor(
                      (Date.now() - match.startTime.getTime()) / (1000 * 60)
                    )}{' '}
                    / {match.duration} min
                  </span>
                </div>
                <Progress
                  value={
                    ((Date.now() - match.startTime.getTime()) /
                      (match.duration * 60 * 1000)) *
                    100
                  }
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {match.viewerCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Viewers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ${match.totalPool.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Pool
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Betting Panel */}
          <BettingPanel match={match} userBets={userBets} />

          {/* Live Chat */}
          <div className="h-96">
            <LiveChat messages={chatMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}
