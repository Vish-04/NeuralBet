# Wallet Management Functions - Test Guide

This document provides a quick guide to test the newly created wallet management functions.

## Created Functions

### 1. `v_wallet_balance` - Materialized View
- **Purpose**: Shows real-time balance for each user
- **Calculation**: initial credits + credit purchases - bet stakes + bet payouts
- **Security**: Access restricted to service role, users must use helper functions

### 2. `fn_place_bet(match_id, side, stake)` - Atomic Bet Placement
- **Purpose**: Atomically places a bet and deducts stake from wallet
- **Parameters**:
  - `match_id`: UUID of the match to bet on
  - `side`: 'a' or 'b' (which LLM to bet on)
  - `stake`: Amount to wager (must be positive)
- **Returns**: The created bet record
- **Security**: Authenticated users only, validates balance before placing bet

### 3. `fn_settle_match(match_id)` - Match Settlement
- **Purpose**: Settles all bets for a match and distributes payouts
- **Parameters**:
  - `match_id`: UUID of the match to settle
- **Returns**: Settlement summary (bets settled, total payout, winner)
- **Security**: Service role only (admin operations)

### 4. `get_user_balance(user_id)` - Balance Retrieval
- **Purpose**: Gets current user balance efficiently
- **Parameters**:
  - `user_id`: User ID (defaults to current user)
- **Returns**: Current balance as numeric
- **Security**: Users can only view their own balance

### 5. `get_user_wallet_details(user_id)` - Detailed Balance Info
- **Purpose**: Gets detailed wallet information
- **Returns**: Table with initial credits, betting balance, current balance, etc.
- **Security**: Users can only view their own details

## Testing with Supabase

### 1. Test Balance Retrieval (as authenticated user)
```sql
SELECT public.get_user_balance();
```

### 2. Test Detailed Wallet Info (as authenticated user)
```sql
SELECT * FROM public.get_user_wallet_details();
```

### 3. Test Bet Placement (as authenticated user)
First, ensure you have:
- A wallet with credits
- An active match to bet on

```sql
-- Example: Bet $10 on side 'a' for match
SELECT * FROM public.fn_place_bet(
  'your-match-id-here'::uuid,
  'a',
  10.00
);
```

### 4. Test Match Settlement (as service role)
```sql
-- First update match winner
UPDATE public.matches 
SET winner = 'a', finished_at = NOW() 
WHERE id = 'your-match-id-here';

-- Then settle the match
SELECT * FROM public.fn_settle_match('your-match-id-here'::uuid);
```

## Features Implemented

✅ **Materialized View**: Real-time balance calculation  
✅ **Atomic Operations**: Bet placement with balance validation  
✅ **Race Condition Prevention**: Proper locking and transactions  
✅ **Security**: Row Level Security and function permissions  
✅ **Performance**: Indexed materialized view for fast queries  
✅ **Automatic Refresh**: Triggers to keep balance view updated  
✅ **Error Handling**: Comprehensive validation and error messages  
✅ **Type Safety**: Full TypeScript types generated  

## Performance Considerations

- Materialized view is automatically refreshed on wallet/bet changes
- Unique and composite indexes for fast queries
- Concurrent refresh to minimize blocking
- Optimized for high-frequency betting operations

## Security Features

- Users can only access their own wallet data
- Bet placement validates user authentication and balance
- Match settlement restricted to service role
- Direct materialized view access blocked for security
- All operations use SECURITY DEFINER for proper privilege escalation