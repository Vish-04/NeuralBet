export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled' | 'void';

export type OddsFormat = 'american' | 'decimal' | 'fractional';

export interface AmericanOdds {
  value: number; // e.g., +120, -140
  format: 'american';
}

export interface DecimalOdds {
  value: number; // e.g., 2.20, 1.71
  format: 'decimal';
}

export interface FractionalOdds {
  value: string; // e.g., "6/5", "5/7"
  format: 'fractional';
}

export type Odds = AmericanOdds | DecimalOdds | FractionalOdds;

export interface BetSelection {
  id: string;
  eventId: string;
  marketId: string;
  selectionId: string;
  eventName: string;
  marketName: string;
  selectionName: string;
  odds: Odds;
  timestamp: string;
}

export interface Bet {
  id: string;
  userId: string;
  selections: BetSelection[];
  stake: number; // in credits
  potentialPayout: number; // in credits
  actualPayout?: number; // in credits, only set when bet is settled
  status: BetStatus;
  placedAt: string;
  settledAt?: string;
  type: 'single' | 'multiple' | 'system';
}

export interface WalletBalance {
  id: string;
  userId: string;
  credits: number;
  lastUpdated: string;
}

export interface BettingHistoryFilters {
  status?: BetStatus;
  dateFrom?: string;
  dateTo?: string;
  minStake?: number;
  maxStake?: number;
}

export interface BettingHistorySortOption {
  field: 'placedAt' | 'stake' | 'potentialPayout' | 'actualPayout';
  direction: 'asc' | 'desc';
}

// Utility types for component props
export interface OddsDisplayProps {
  odds: Odds;
  className?: string;
  showProbability?: boolean;
}

export interface BetSlipProps {
  selections: BetSelection[];
  onPlaceBet: (
    bet: Omit<Bet, 'id' | 'userId' | 'placedAt' | 'status'>
  ) => Promise<void>;
  onRemoveSelection: (selectionId: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  className?: string;
}

export interface WalletBalanceProps {
  balance?: WalletBalance;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
}

export interface BettingHistoryProps {
  bets: Bet[];
  isLoading?: boolean;
  error?: string;
  filters?: BettingHistoryFilters;
  sortOption?: BettingHistorySortOption;
  onFiltersChange?: (filters: BettingHistoryFilters) => void;
  onSortChange?: (sort: BettingHistorySortOption) => void;
  onRefresh?: () => void;
  className?: string;
}

// Utility functions type definitions
export type FormatCurrency = (credits: number) => string;
export type FormatOdds = (odds: Odds, targetFormat?: OddsFormat) => string;
export type CalculatePayout = (stake: number, odds: Odds) => number;
export type ConvertOdds = (odds: Odds, targetFormat: OddsFormat) => Odds;
