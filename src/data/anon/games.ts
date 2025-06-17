'use server';
import { createSupabaseClient } from '@/supabase-clients/server';
import { Table } from '@/types';

/**
 * Get all live games (publicly accessible)
 */
export const getAllLiveGames = async (): Promise<Array<Table<'games'>>> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Get a specific game by slug (only if it's live)
 */
export const getGameBySlug = async (
  slug: string
): Promise<Table<'games'> | null> => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'live')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
};

/**
 * Get game by ID (only if it's live)
 */
export const getGameById = async (
  id: string
): Promise<Table<'games'> | null> => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
};
