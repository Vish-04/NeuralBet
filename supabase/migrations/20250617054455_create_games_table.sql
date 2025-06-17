-- Create games table for AI Battle Arena
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add constraint for valid status values
ALTER TABLE public.games 
ADD CONSTRAINT games_status_check 
CHECK (status IN ('draft', 'live', 'retired'));

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- All authenticated users can view live games
CREATE POLICY "Authenticated users can view live games"
  ON public.games
  FOR SELECT
  TO authenticated
  USING (status = 'live');

-- Service role (admin) can view all games regardless of status
CREATE POLICY "Service role can view all games"
  ON public.games
  FOR SELECT
  TO service_role
  USING (true);

-- Service role (admin) can insert games
CREATE POLICY "Service role can insert games"
  ON public.games
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role (admin) can update games
CREATE POLICY "Service role can update games"
  ON public.games
  FOR UPDATE
  TO service_role
  USING (true);

-- Service role (admin) can delete games
CREATE POLICY "Service role can delete games"
  ON public.games
  FOR DELETE
  TO service_role
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS games_slug_idx ON public.games(slug);
CREATE INDEX IF NOT EXISTS games_status_idx ON public.games(status);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON public.games(created_at);

-- Create index for the most common query (live games)
CREATE INDEX IF NOT EXISTS games_live_status_idx ON public.games(status) WHERE status = 'live';

-- Insert initial game data for the 3 MVP games
INSERT INTO public.games (slug, name, status) VALUES
  ('connect4', 'Connect 4', 'live'),
  ('battleship', 'Battleship', 'live'),
  ('treasure-hunt', 'Treasure Hunt', 'live')
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT SELECT ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;