-- Create wallets table for user credit management
CREATE TABLE IF NOT EXISTS public.wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits numeric(12,2) DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Add constraint to ensure credits cannot go negative
ALTER TABLE public.wallets 
ADD CONSTRAINT wallets_credits_non_negative 
CHECK (credits >= 0);

-- Create RLS policies
-- Users can view their own wallet
CREATE POLICY "Users can view their own wallet"
  ON public.wallets
  FOR SELECT
  USING (user_id = auth.uid());

-- System/admin can update wallets (for credit purchases/payouts)
-- This allows service role and admin users to update any wallet
CREATE POLICY "System can update wallets"
  ON public.wallets
  FOR UPDATE
  USING (true);

-- Users can insert their own wallet record
CREATE POLICY "Users can insert their own wallet"
  ON public.wallets
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- System/admin can insert wallet records
CREATE POLICY "System can insert wallets"
  ON public.wallets
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS wallets_credits_idx ON public.wallets(credits);
CREATE INDEX IF NOT EXISTS wallets_updated_at_idx ON public.wallets(updated_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get or create wallet for a user
CREATE OR REPLACE FUNCTION public.get_or_create_wallet(p_user_id uuid)
RETURNS public.wallets AS $$
DECLARE
  wallet_record public.wallets;
BEGIN
  -- Try to get existing wallet
  SELECT * INTO wallet_record
  FROM public.wallets
  WHERE user_id = p_user_id;
  
  -- If wallet doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.wallets (user_id, credits)
    VALUES (p_user_id, 0)
    RETURNING * INTO wallet_record;
  END IF;
  
  RETURN wallet_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_or_create_wallet(uuid) TO authenticated;

-- Create function to safely update wallet credits (prevents race conditions)
CREATE OR REPLACE FUNCTION public.update_wallet_credits(
  p_user_id uuid,
  p_credit_change numeric(12,2)
)
RETURNS public.wallets AS $$
DECLARE
  wallet_record public.wallets;
  new_credits numeric(12,2);
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT * INTO wallet_record
  FROM public.wallets
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- If wallet doesn't exist, create it first
  IF NOT FOUND THEN
    INSERT INTO public.wallets (user_id, credits)
    VALUES (p_user_id, GREATEST(0, p_credit_change))
    RETURNING * INTO wallet_record;
    RETURN wallet_record;
  END IF;
  
  -- Calculate new credits amount
  new_credits := wallet_record.credits + p_credit_change;
  
  -- Ensure credits don't go negative
  IF new_credits < 0 THEN
    RAISE EXCEPTION 'Insufficient credits. Current: %, Attempted change: %', 
      wallet_record.credits, p_credit_change;
  END IF;
  
  -- Update the wallet
  UPDATE public.wallets
  SET credits = new_credits
  WHERE user_id = p_user_id
  RETURNING * INTO wallet_record;
  
  RETURN wallet_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to service role only
-- This function should only be called by server-side code with service role
REVOKE EXECUTE ON FUNCTION public.update_wallet_credits(uuid, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_wallet_credits(uuid, numeric) TO service_role;