-- Create matches table for AI Battle Arena
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  llm_a text NOT NULL,
  llm_b text NOT NULL,
  winner text,
  starts_at timestamptz NOT NULL,
  finished_at timestamptz,
  simulated boolean DEFAULT false NOT NULL,
  odds_a numeric(8,2),
  odds_b numeric(8,2),
  game_state jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add constraint for valid winner values
ALTER TABLE public.matches 
ADD CONSTRAINT matches_winner_check 
CHECK (winner IS NULL OR winner IN ('a', 'b', 'draw'));

-- Add constraint to ensure finished_at is after starts_at when both are set
ALTER TABLE public.matches 
ADD CONSTRAINT matches_finished_after_starts_check 
CHECK (finished_at IS NULL OR finished_at >= starts_at);

-- Add constraint to ensure starts_at is not in the past (with 1 minute buffer)
ALTER TABLE public.matches 
ADD CONSTRAINT matches_starts_at_future_check 
CHECK (starts_at >= (now() - interval '1 minute'));

-- Add constraint to ensure odds are reasonable (between -9999.99 and +9999.99)
ALTER TABLE public.matches 
ADD CONSTRAINT matches_odds_a_range_check 
CHECK (odds_a IS NULL OR (odds_a >= -9999.99 AND odds_a <= 9999.99));

ALTER TABLE public.matches 
ADD CONSTRAINT matches_odds_b_range_check 
CHECK (odds_b IS NULL OR (odds_b >= -9999.99 AND odds_b <= 9999.99));

-- Add constraint to ensure LLMs are different
ALTER TABLE public.matches 
ADD CONSTRAINT matches_different_llms_check 
CHECK (llm_a != llm_b);

-- Add constraint to ensure winner is only set when match is finished
ALTER TABLE public.matches 
ADD CONSTRAINT matches_winner_requires_finished_check 
CHECK (winner IS NULL OR finished_at IS NOT NULL);

-- Enable Row Level Security
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- All authenticated users can view matches
CREATE POLICY "Authenticated users can view matches"
  ON public.matches
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role (admin) can view all matches
CREATE POLICY "Service role can view all matches"
  ON public.matches
  FOR SELECT
  TO service_role
  USING (true);

-- Service role (admin) can insert matches
CREATE POLICY "Service role can insert matches"
  ON public.matches
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role (admin) can update matches
CREATE POLICY "Service role can update matches"
  ON public.matches
  FOR UPDATE
  TO service_role
  USING (true);

-- Service role (admin) can delete matches
CREATE POLICY "Service role can delete matches"
  ON public.matches
  FOR DELETE
  TO service_role
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS matches_game_id_idx ON public.matches(game_id);
CREATE INDEX IF NOT EXISTS matches_starts_at_idx ON public.matches(starts_at);
CREATE INDEX IF NOT EXISTS matches_winner_idx ON public.matches(winner);
CREATE INDEX IF NOT EXISTS matches_created_at_idx ON public.matches(created_at);
CREATE INDEX IF NOT EXISTS matches_finished_at_idx ON public.matches(finished_at);
CREATE INDEX IF NOT EXISTS matches_simulated_idx ON public.matches(simulated);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS matches_game_starts_at_idx ON public.matches(game_id, starts_at);
CREATE INDEX IF NOT EXISTS matches_game_winner_idx ON public.matches(game_id, winner);
CREATE INDEX IF NOT EXISTS matches_upcoming_idx ON public.matches(starts_at) WHERE finished_at IS NULL;
-- Note: Live matches should be queried with application logic instead of index predicate
-- CREATE INDEX IF NOT EXISTS matches_live_idx ON public.matches(starts_at, finished_at) WHERE starts_at <= now() AND finished_at IS NULL;

-- Grant necessary permissions
GRANT SELECT ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;

-- Add helpful comments for documentation
COMMENT ON TABLE public.matches IS 'Stores AI vs AI matches for the Battle Arena';
COMMENT ON COLUMN public.matches.llm_a IS 'Name/identifier of the first LLM competitor';
COMMENT ON COLUMN public.matches.llm_b IS 'Name/identifier of the second LLM competitor';
COMMENT ON COLUMN public.matches.winner IS 'Winner of the match: a, b, draw, or null if ongoing/not started';
COMMENT ON COLUMN public.matches.odds_a IS 'American odds format for LLM A (e.g., +120, -140)';
COMMENT ON COLUMN public.matches.odds_b IS 'American odds format for LLM B (e.g., +120, -140)';
COMMENT ON COLUMN public.matches.game_state IS 'JSON representation of the current game state';
COMMENT ON COLUMN public.matches.simulated IS 'Whether this match is simulated (true) or real (false)';