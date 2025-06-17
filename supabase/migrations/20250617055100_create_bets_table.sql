-- Create bets table for AI Battle Arena betting system
CREATE TABLE IF NOT EXISTS public.bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  bettor uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  side text NOT NULL,
  stake numeric(12,2) NOT NULL,
  odds numeric(8,2) NOT NULL,
  payout numeric(12,2),
  created_at timestamptz DEFAULT now() NOT NULL,
  settled boolean DEFAULT false NOT NULL
);

-- Add constraints for data integrity
-- Side must be 'a' or 'b' (which LLM they're betting on)
ALTER TABLE public.bets 
ADD CONSTRAINT bets_side_check 
CHECK (side IN ('a', 'b'));

-- Stake must be positive
ALTER TABLE public.bets 
ADD CONSTRAINT bets_stake_positive_check 
CHECK (stake > 0);

-- Odds must be in reasonable range (American odds: -9999.99 to +9999.99)
ALTER TABLE public.bets 
ADD CONSTRAINT bets_odds_range_check 
CHECK (odds >= -9999.99 AND odds <= 9999.99);

-- Payout must be positive when not null
ALTER TABLE public.bets 
ADD CONSTRAINT bets_payout_positive_check 
CHECK (payout IS NULL OR payout > 0);

-- Stakes should be within reasonable limits (max 999,999,999.99 per bet)
ALTER TABLE public.bets 
ADD CONSTRAINT bets_stake_max_check 
CHECK (stake <= 999999999.99);

-- Ensure settled bets have a payout (business logic constraint)
ALTER TABLE public.bets 
ADD CONSTRAINT bets_settled_requires_payout_check 
CHECK (NOT settled OR payout IS NOT NULL);

-- Enable Row Level Security
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own bets
CREATE POLICY "Users can view their own bets"
  ON public.bets
  FOR SELECT
  TO authenticated
  USING (bettor = auth.uid());

-- Users can place bets (insert their own bets)
CREATE POLICY "Users can place bets"
  ON public.bets
  FOR INSERT
  TO authenticated
  WITH CHECK (bettor = auth.uid());

-- Service role (admin) can view all bets
CREATE POLICY "Service role can view all bets"
  ON public.bets
  FOR SELECT
  TO service_role
  USING (true);

-- Service role (admin) can insert bets (for admin operations)
CREATE POLICY "Service role can insert bets"
  ON public.bets
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role (admin) can update bets (for settling bets)
CREATE POLICY "Service role can update bets"
  ON public.bets
  FOR UPDATE
  TO service_role
  USING (true);

-- Service role (admin) can delete bets (for admin operations)
CREATE POLICY "Service role can delete bets"
  ON public.bets
  FOR DELETE
  TO service_role
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS bets_bettor_idx ON public.bets(bettor);
CREATE INDEX IF NOT EXISTS bets_match_id_idx ON public.bets(match_id);
CREATE INDEX IF NOT EXISTS bets_created_at_idx ON public.bets(created_at);
CREATE INDEX IF NOT EXISTS bets_settled_idx ON public.bets(settled);
CREATE INDEX IF NOT EXISTS bets_side_idx ON public.bets(side);

-- Create composite indexes for common queries
-- User's bet history (most recent first)
CREATE INDEX IF NOT EXISTS bets_bettor_created_at_idx ON public.bets(bettor, created_at DESC);

-- Bets for a specific match
CREATE INDEX IF NOT EXISTS bets_match_created_at_idx ON public.bets(match_id, created_at);

-- Unsettled bets for processing
CREATE INDEX IF NOT EXISTS bets_unsettled_match_idx ON public.bets(match_id) WHERE settled = false;

-- User's unsettled bets
CREATE INDEX IF NOT EXISTS bets_bettor_unsettled_idx ON public.bets(bettor) WHERE settled = false;

-- Match betting activity (for analytics)
CREATE INDEX IF NOT EXISTS bets_match_side_idx ON public.bets(match_id, side);

-- Recent betting activity
CREATE INDEX IF NOT EXISTS bets_recent_activity_idx ON public.bets(created_at DESC) WHERE settled = false;

-- Grant necessary permissions
GRANT SELECT ON public.bets TO authenticated;
GRANT INSERT ON public.bets TO authenticated;
GRANT ALL ON public.bets TO service_role;

-- Add helpful comments for documentation
COMMENT ON TABLE public.bets IS 'Stores user bets on AI vs AI matches';
COMMENT ON COLUMN public.bets.match_id IS 'Reference to the match being bet on';
COMMENT ON COLUMN public.bets.bettor IS 'User ID of the person placing the bet';
COMMENT ON COLUMN public.bets.side IS 'Which LLM they are betting on: a or b';
COMMENT ON COLUMN public.bets.stake IS 'Amount of credits wagered (must be positive)';
COMMENT ON COLUMN public.bets.odds IS 'Odds at time of bet placement (American format)';
COMMENT ON COLUMN public.bets.payout IS 'Calculated payout amount (null until settled)';
COMMENT ON COLUMN public.bets.settled IS 'Whether the bet has been resolved/paid out';

-- Create function to calculate payout based on odds and stake
CREATE OR REPLACE FUNCTION public.calculate_bet_payout(
  p_stake numeric(12,2),
  p_odds numeric(8,2),
  p_won boolean
)
RETURNS numeric(12,2) AS $$
BEGIN
  -- If bet lost, payout is 0
  IF NOT p_won THEN
    RETURN 0;
  END IF;
  
  -- If bet won, calculate payout based on American odds
  -- Positive odds: payout = stake + (stake * odds / 100)
  -- Negative odds: payout = stake + (stake * 100 / ABS(odds))
  IF p_odds > 0 THEN
    RETURN p_stake + (p_stake * p_odds / 100);
  ELSE
    RETURN p_stake + (p_stake * 100 / ABS(p_odds));
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant execute permission on the payout calculation function
GRANT EXECUTE ON FUNCTION public.calculate_bet_payout(numeric, numeric, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_bet_payout(numeric, numeric, boolean) TO service_role;

-- Create function to settle bets for a match
CREATE OR REPLACE FUNCTION public.settle_match_bets(
  p_match_id uuid,
  p_winner text
)
RETURNS integer AS $$
DECLARE
  bet_record public.bets%ROWTYPE;
  bets_settled integer := 0;
  won boolean;
  calculated_payout numeric(12,2);
BEGIN
  -- Validate winner parameter
  IF p_winner NOT IN ('a', 'b', 'draw') THEN
    RAISE EXCEPTION 'Invalid winner value: %. Must be a, b, or draw', p_winner;
  END IF;
  
  -- Process all unsettled bets for this match
  FOR bet_record IN 
    SELECT * FROM public.bets 
    WHERE match_id = p_match_id 
    AND settled = false
    FOR UPDATE
  LOOP
    -- Determine if bet won
    IF p_winner = 'draw' THEN
      -- On draw, return the stake (no profit)
      calculated_payout := bet_record.stake;
    ELSE
      -- Check if bettor picked the winner
      won := (bet_record.side = p_winner);
      calculated_payout := public.calculate_bet_payout(bet_record.stake, bet_record.odds, won);
    END IF;
    
    -- Update the bet with payout and mark as settled
    UPDATE public.bets
    SET 
      payout = calculated_payout,
      settled = true
    WHERE id = bet_record.id;
    
    bets_settled := bets_settled + 1;
  END LOOP;
  
  RETURN bets_settled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the settle function only to service role
REVOKE EXECUTE ON FUNCTION public.settle_match_bets(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.settle_match_bets(uuid, text) TO service_role;

-- Create function to get user's betting stats
CREATE OR REPLACE FUNCTION public.get_user_betting_stats(p_user_id uuid)
RETURNS TABLE (
  total_bets bigint,
  total_wagered numeric(12,2),
  total_payout numeric(12,2),
  settled_bets bigint,
  unsettled_bets bigint,
  net_profit numeric(12,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_bets,
    COALESCE(SUM(stake), 0) as total_wagered,
    COALESCE(SUM(payout), 0) as total_payout,
    COUNT(*) FILTER (WHERE settled = true) as settled_bets,
    COUNT(*) FILTER (WHERE settled = false) as unsettled_bets,
    COALESCE(SUM(payout), 0) - COALESCE(SUM(stake), 0) as net_profit
  FROM public.bets
  WHERE bettor = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on stats function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_betting_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_betting_stats(uuid) TO service_role;