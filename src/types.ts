import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './lib/database.types';

export type AppSupabaseClient = SupabaseClient<Database>;
export type Table<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
/** One of the providers supported by GoTrue. */
export type AuthProvider =
  | 'apple'
  | 'azure'
  | 'bitbucket'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'keycloak'
  | 'linkedin'
  | 'notion'
  | 'slack'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'workos';

// Game Engine Types
export type GamePlayer = 'a' | 'b';
export type GameWinner = GamePlayer | 'draw';

/**
 * Generic game move result
 */
export interface GameMoveResult<S> {
  state: S;
  winner?: GameWinner;
}

/**
 * Base interface for all game states
 */
export interface GameState {
  currentTurn: GamePlayer;
  isComplete: boolean;
  winner?: GameWinner;
}
