export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          bettor: string
          created_at: string
          id: string
          match_id: string
          odds: number
          payout: number | null
          settled: boolean
          side: string
          stake: number
        }
        Insert: {
          bettor: string
          created_at?: string
          id?: string
          match_id: string
          odds: number
          payout?: number | null
          settled?: boolean
          side: string
          stake: number
        }
        Update: {
          bettor?: string
          created_at?: string
          id?: string
          match_id?: string
          odds?: number
          payout?: number | null
          settled?: boolean
          side?: string
          stake?: number
        }
        Relationships: [
          {
            foreignKeyName: "bets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          status?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          finished_at: string | null
          game_id: string
          game_state: Json | null
          id: string
          llm_a: string
          llm_b: string
          odds_a: number | null
          odds_b: number | null
          simulated: boolean
          starts_at: string
          winner: string | null
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          game_id: string
          game_state?: Json | null
          id?: string
          llm_a: string
          llm_b: string
          odds_a?: number | null
          odds_b?: number | null
          simulated?: boolean
          starts_at: string
          winner?: string | null
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          game_id?: string
          game_state?: Json | null
          id?: string
          llm_a?: string
          llm_b?: string
          odds_a?: number | null
          odds_b?: number | null
          simulated?: boolean
          starts_at?: string
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_wallet_balance: {
        Row: {
          betting_balance: number | null
          current_balance: number | null
          initial_credits: number | null
          last_bet_at: string | null
          user_id: string | null
          wallet_updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_bet_payout: {
        Args: { p_stake: number; p_odds: number; p_won: boolean }
        Returns: number
      }
      fn_place_bet: {
        Args: { p_match_id: string; p_side: string; p_stake: number }
        Returns: {
          bettor: string
          created_at: string
          id: string
          match_id: string
          odds: number
          payout: number | null
          settled: boolean
          side: string
          stake: number
        }
      }
      fn_settle_match: {
        Args: { p_match_id: string }
        Returns: {
          bets_settled: number
          total_payout: number
          winner_side: string
        }[]
      }
      get_or_create_wallet: {
        Args: { p_user_id: string }
        Returns: {
          credits: number
          updated_at: string
          user_id: string
        }
      }
      get_user_balance: {
        Args: { p_user_id?: string }
        Returns: number
      }
      get_user_betting_stats: {
        Args: { p_user_id: string }
        Returns: {
          total_bets: number
          total_wagered: number
          total_payout: number
          settled_bets: number
          unsettled_bets: number
          net_profit: number
        }[]
      }
      get_user_wallet_details: {
        Args: { p_user_id?: string }
        Returns: {
          user_id: string
          initial_credits: number
          betting_balance: number
          current_balance: number
          wallet_updated_at: string
          last_bet_at: string
        }[]
      }
      refresh_wallet_balance_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      settle_match_bets: {
        Args: { p_match_id: string; p_winner: string }
        Returns: number
      }
      update_wallet_credits: {
        Args: { p_user_id: string; p_credit_change: number }
        Returns: {
          credits: number
          updated_at: string
          user_id: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
