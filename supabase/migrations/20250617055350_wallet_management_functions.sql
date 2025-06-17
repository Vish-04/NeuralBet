-- Wallet Management Functions Migration
-- Creates materialized view for wallet balances and atomic betting functions

-- Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS public.v_wallet_balance;

-- Create materialized view for wallet balances
-- This provides real-time balance calculation: initial credits + credit purchases - bet stakes + bet payouts
CREATE MATERIALIZED VIEW public.v_wallet_balance AS
SELECT 
  w.user_id,
  w.credits as initial_credits,
  COALESCE(SUM(CASE 
    WHEN b.settled = true THEN b.payout - b.stake 
    ELSE -b.stake 
  END), 0) as betting_balance,
  w.credits + COALESCE(SUM(CASE 
    WHEN b.settled = true THEN b.payout - b.stake 
    ELSE -b.stake 
  END), 0) as current_balance,
  w.updated_at as wallet_updated_at,
  MAX(b.created_at) as last_bet_at
FROM public.wallets w
LEFT JOIN public.bets b ON w.user_id = b.bettor
GROUP BY w.user_id, w.credits, w.updated_at;

-- Create unique index on user_id for the materialized view
CREATE UNIQUE INDEX v_wallet_balance_user_id_idx ON public.v_wallet_balance(user_id);

-- Create additional indexes for performance
CREATE INDEX v_wallet_balance_current_balance_idx ON public.v_wallet_balance(current_balance);
CREATE INDEX v_wallet_balance_last_bet_idx ON public.v_wallet_balance(last_bet_at);

-- Note: Materialized views don't support RLS directly in PostgreSQL
-- Security is handled through the underlying tables' RLS policies
-- and by restricting access through functions

-- Restrict direct access to the materialized view for security
-- Only service role should have direct access
REVOKE ALL ON public.v_wallet_balance FROM PUBLIC;
GRANT SELECT ON public.v_wallet_balance TO service_role;

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_wallet_balance_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.v_wallet_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role only
REVOKE EXECUTE ON FUNCTION public.refresh_wallet_balance_view() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refresh_wallet_balance_view() TO service_role;

-- Function to place a bet atomically (deducts from wallet + creates bet record)
CREATE OR REPLACE FUNCTION public.fn_place_bet(
  p_match_id uuid,
  p_side text,
  p_stake numeric(12,2)
)
RETURNS public.bets AS $$
DECLARE
  v_user_id uuid;
  v_match_record public.matches%ROWTYPE;
  v_current_odds numeric(8,2);
  v_wallet_record public.wallets%ROWTYPE;
  v_bet_record public.bets%ROWTYPE;
  v_current_balance numeric(12,2);
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Validate user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to place bets';
  END IF;
  
  -- Validate input parameters
  IF p_side NOT IN ('a', 'b') THEN
    RAISE EXCEPTION 'Invalid side: %. Must be a or b', p_side;
  END IF;
  
  IF p_stake <= 0 THEN
    RAISE EXCEPTION 'Stake must be positive, got: %', p_stake;
  END IF;
  
  IF p_stake > 999999999.99 THEN
    RAISE EXCEPTION 'Stake exceeds maximum allowed: %', p_stake;
  END IF;
  
  -- Get match details and validate
  SELECT * INTO v_match_record
  FROM public.matches
  WHERE id = p_match_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match not found: %', p_match_id;
  END IF;
  
  -- Check if match is still open for betting
  IF v_match_record.winner IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot bet on finished match';
  END IF;
  
  IF v_match_record.starts_at <= NOW() THEN
    RAISE EXCEPTION 'Cannot bet on match that has already started';
  END IF;
  
  -- Get current odds for the side
  IF p_side = 'a' THEN
    v_current_odds := v_match_record.odds_a;
  ELSE
    v_current_odds := v_match_record.odds_b;
  END IF;
  
  IF v_current_odds IS NULL THEN
    RAISE EXCEPTION 'Odds not available for side %', p_side;
  END IF;
  
  -- Get current balance from materialized view (refresh if needed)
  SELECT current_balance INTO v_current_balance
  FROM public.v_wallet_balance
  WHERE user_id = v_user_id;
  
  -- If user not found in materialized view, create wallet and refresh view
  IF NOT FOUND THEN
    -- Create wallet if it doesn't exist
    SELECT * INTO v_wallet_record
    FROM public.get_or_create_wallet(v_user_id);
    
    -- Refresh materialized view
    PERFORM public.refresh_wallet_balance_view();
    
    -- Get balance again
    SELECT current_balance INTO v_current_balance
    FROM public.v_wallet_balance
    WHERE user_id = v_user_id;
    
    -- If still not found, use wallet credits directly
    IF NOT FOUND THEN
      v_current_balance := v_wallet_record.credits;
    END IF;
  END IF;
  
  -- Check if user has sufficient balance
  IF v_current_balance < p_stake THEN
    RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_current_balance, p_stake;
  END IF;
  
  -- Start transaction for atomic operation
  -- Lock the wallet to prevent race conditions
  SELECT * INTO v_wallet_record
  FROM public.wallets
  WHERE user_id = v_user_id
  FOR UPDATE;
  
  -- Create the bet record
  INSERT INTO public.bets (
    match_id,
    bettor,
    side,
    stake,
    odds,
    payout,
    settled
  ) VALUES (
    p_match_id,
    v_user_id,
    p_side,
    p_stake,
    v_current_odds,
    NULL,
    false
  ) RETURNING * INTO v_bet_record;
  
  -- Update wallet credits (deduct stake)
  UPDATE public.wallets
  SET credits = credits - p_stake
  WHERE user_id = v_user_id;
  
  -- Refresh the materialized view to reflect the new bet
  PERFORM public.refresh_wallet_balance_view();
  
  RETURN v_bet_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.fn_place_bet(uuid, text, numeric) TO authenticated;

-- Function to settle a match and distribute payouts atomically
CREATE OR REPLACE FUNCTION public.fn_settle_match(p_match_id uuid)
RETURNS TABLE (
  bets_settled integer,
  total_payout numeric(12,2),
  winner_side text
) AS $$
DECLARE
  v_match_record public.matches%ROWTYPE;
  v_bet_record public.bets%ROWTYPE;
  v_bets_settled integer := 0;
  v_total_payout numeric(12,2) := 0;
  v_calculated_payout numeric(12,2);
  v_won boolean;
  v_winner_side text;
BEGIN
  -- Get match details
  SELECT * INTO v_match_record
  FROM public.matches
  WHERE id = p_match_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match not found: %', p_match_id;
  END IF;
  
  -- Check if match is already settled
  IF v_match_record.winner IS NOT NULL THEN
    RAISE EXCEPTION 'Match already settled with winner: %', v_match_record.winner;
  END IF;
  
  -- Check if match has finished
  IF v_match_record.finished_at IS NULL THEN
    RAISE EXCEPTION 'Cannot settle unfinished match';
  END IF;
  
  -- For now, we'll determine winner based on some logic
  -- In a real implementation, this would come from the game engine
  -- For this example, we'll randomly assign a winner if not already set
  IF v_match_record.winner IS NULL THEN
    -- This is a placeholder - in reality, the winner should be determined by game logic
    -- For now, we'll require the winner to be passed as a parameter or determined externally
    RAISE EXCEPTION 'Match winner must be determined before settling. Use UPDATE matches SET winner = ? WHERE id = ?';
  END IF;
  
  v_winner_side := v_match_record.winner;
  
  -- Update match as settled (if not already done)
  UPDATE public.matches
  SET winner = v_winner_side
  WHERE id = p_match_id;
  
  -- Process all unsettled bets for this match
  FOR v_bet_record IN 
    SELECT * FROM public.bets 
    WHERE match_id = p_match_id 
    AND settled = false
    FOR UPDATE
  LOOP
    -- Determine if bet won
    IF v_winner_side = 'draw' THEN
      -- On draw, return the stake (no profit/loss)
      v_calculated_payout := v_bet_record.stake;
    ELSE
      -- Check if bettor picked the winner
      v_won := (v_bet_record.side = v_winner_side);
      v_calculated_payout := public.calculate_bet_payout(v_bet_record.stake, v_bet_record.odds, v_won);
    END IF;
    
    -- Update the bet with payout and mark as settled
    UPDATE public.bets
    SET 
      payout = v_calculated_payout,
      settled = true
    WHERE id = v_bet_record.id;
    
    -- Credit the payout to the user's wallet
    UPDATE public.wallets
    SET credits = credits + v_calculated_payout
    WHERE user_id = v_bet_record.bettor;
    
    v_bets_settled := v_bets_settled + 1;
    v_total_payout := v_total_payout + v_calculated_payout;
  END LOOP;
  
  -- Refresh the materialized view to reflect the settled bets
  PERFORM public.refresh_wallet_balance_view();
  
  -- Return settlement results
  RETURN QUERY SELECT v_bets_settled, v_total_payout, v_winner_side;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission only to service role (admin operations)
REVOKE EXECUTE ON FUNCTION public.fn_settle_match(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fn_settle_match(uuid) TO service_role;

-- Create function to get user's current balance efficiently
CREATE OR REPLACE FUNCTION public.get_user_balance(p_user_id uuid DEFAULT auth.uid())
RETURNS numeric(12,2) AS $$
DECLARE
  v_balance numeric(12,2);
  v_current_user_id uuid;
BEGIN
  -- Get current user
  v_current_user_id := auth.uid();
  
  -- Validate user
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID required';
  END IF;
  
  -- Security check: users can only get their own balance unless they're service role
  IF v_current_user_id IS NOT NULL AND v_current_user_id != p_user_id THEN
    -- Check if current user has service role privileges
    IF NOT EXISTS (
      SELECT 1 FROM auth.jwt() 
      WHERE (auth.jwt() ->> 'role') = 'service_role'
    ) THEN
      RAISE EXCEPTION 'Access denied: users can only view their own balance';
    END IF;
  END IF;
  
  -- Get balance from materialized view
  SELECT current_balance INTO v_balance
  FROM public.v_wallet_balance
  WHERE user_id = p_user_id;
  
  -- If not found, try to create wallet and refresh view
  IF NOT FOUND THEN
    -- Create wallet if it doesn't exist
    PERFORM public.get_or_create_wallet(p_user_id);
    
    -- Refresh materialized view
    PERFORM public.refresh_wallet_balance_view();
    
    -- Try again
    SELECT current_balance INTO v_balance
    FROM public.v_wallet_balance
    WHERE user_id = p_user_id;
    
    -- If still not found, return 0
    IF NOT FOUND THEN
      v_balance := 0;
    END IF;
  END IF;
  
  RETURN COALESCE(v_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_balance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_balance(uuid) TO service_role;

-- Create function to get detailed wallet balance info (for authenticated users only)
CREATE OR REPLACE FUNCTION public.get_user_wallet_details(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  user_id uuid,
  initial_credits numeric(12,2),
  betting_balance numeric(12,2),
  current_balance numeric(12,2),
  wallet_updated_at timestamptz,
  last_bet_at timestamptz
) AS $$
DECLARE
  v_current_user_id uuid;
BEGIN
  -- Get current user
  v_current_user_id := auth.uid();
  
  -- Validate user
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID required';
  END IF;
  
  -- Security check: users can only get their own details unless they're service role
  IF v_current_user_id IS NOT NULL AND v_current_user_id != p_user_id THEN
    -- Check if current user has service role privileges  
    IF NOT EXISTS (
      SELECT 1 FROM auth.jwt() 
      WHERE (auth.jwt() ->> 'role') = 'service_role'
    ) THEN
      RAISE EXCEPTION 'Access denied: users can only view their own wallet details';
    END IF;
  END IF;
  
  -- Return wallet details from materialized view
  RETURN QUERY
  SELECT 
    wb.user_id,
    wb.initial_credits,
    wb.betting_balance,
    wb.current_balance,
    wb.wallet_updated_at,
    wb.last_bet_at
  FROM public.v_wallet_balance wb
  WHERE wb.user_id = p_user_id;
  
  -- If no results, try to create wallet and refresh view
  IF NOT FOUND THEN
    -- Create wallet if it doesn't exist
    PERFORM public.get_or_create_wallet(p_user_id);
    
    -- Refresh materialized view
    PERFORM public.refresh_wallet_balance_view();
    
    -- Try again
    RETURN QUERY
    SELECT 
      wb.user_id,
      wb.initial_credits,
      wb.betting_balance,
      wb.current_balance,
      wb.wallet_updated_at,
      wb.last_bet_at
    FROM public.v_wallet_balance wb
    WHERE wb.user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_wallet_details(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_wallet_details(uuid) TO service_role;

-- Create trigger to refresh materialized view when wallets or bets are modified
CREATE OR REPLACE FUNCTION public.trigger_refresh_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh the materialized view (non-blocking)
  PERFORM public.refresh_wallet_balance_view();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic view refresh
CREATE TRIGGER refresh_balance_on_wallet_change
  AFTER INSERT OR UPDATE OR DELETE ON public.wallets
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_refresh_wallet_balance();

CREATE TRIGGER refresh_balance_on_bet_change
  AFTER INSERT OR UPDATE OR DELETE ON public.bets
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_refresh_wallet_balance();

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW public.v_wallet_balance;

-- Add helpful comments
COMMENT ON MATERIALIZED VIEW public.v_wallet_balance IS 'Real-time wallet balance view showing current balance including betting activity';
COMMENT ON FUNCTION public.fn_place_bet(uuid, text, numeric) IS 'Atomically places a bet and deducts stake from wallet';
COMMENT ON FUNCTION public.fn_settle_match(uuid) IS 'Settles all bets for a match and distributes payouts';
COMMENT ON FUNCTION public.get_user_balance(uuid) IS 'Gets current user balance efficiently from materialized view';
COMMENT ON FUNCTION public.refresh_wallet_balance_view() IS 'Refreshes the wallet balance materialized view';