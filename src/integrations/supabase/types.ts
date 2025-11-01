export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_client_instructions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          instruction: string
          is_active: boolean | null
          priority: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          instruction: string
          is_active?: boolean | null
          priority?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          instruction?: string
          is_active?: boolean | null
          priority?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          cited_resources: Json | null
          content: string
          created_at: string | null
          id: string
          model: string | null
          role: string
          session_id: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          cited_resources?: Json | null
          content: string
          created_at?: string | null
          id?: string
          model?: string | null
          role: string
          session_id: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          cited_resources?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          model?: string | null
          role?: string
          session_id?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_response_citations: {
        Row: {
          cited_at: string | null
          conversation_id: string
          id: string
          query_context: string | null
          resource_id: string
          user_id: string
        }
        Insert: {
          cited_at?: string | null
          conversation_id: string
          id?: string
          query_context?: string | null
          resource_id: string
          user_id: string
        }
        Update: {
          cited_at?: string | null
          conversation_id?: string
          id?: string
          query_context?: string | null
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_response_citations_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "official_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_settings: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          max_tokens: number | null
          model: string
          system_prompt: string | null
          temperature: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          model?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          model?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_metrics: {
        Row: {
          created_at: string | null
          date: string
          estimated_cost: number | null
          id: string
          model: string | null
          total_requests: number | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          estimated_cost?: number | null
          id?: string
          model?: string | null
          total_requests?: number | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          estimated_cost?: number | null
          id?: string
          model?: string | null
          total_requests?: number | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      extracted_items: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          external_id: string | null
          first_seen_at: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          item_type: string | null
          last_seen_at: string | null
          location: string | null
          metadata: Json | null
          price: number | null
          status_changed_at: string | null
          title: string | null
          tracked_website_id: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id?: string | null
          first_seen_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          item_type?: string | null
          last_seen_at?: string | null
          location?: string | null
          metadata?: Json | null
          price?: number | null
          status_changed_at?: string | null
          title?: string | null
          tracked_website_id: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id?: string | null
          first_seen_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          item_type?: string | null
          last_seen_at?: string | null
          location?: string | null
          metadata?: Json | null
          price?: number | null
          status_changed_at?: string | null
          title?: string | null
          tracked_website_id?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_items_tracked_website_id_fkey"
            columns: ["tracked_website_id"]
            isOneToOne: false
            referencedRelation: "tracked_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      official_resources: {
        Row: {
          authority: string
          category: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          last_verified_at: string | null
          metadata: Json | null
          subcategory: string | null
          title: string
          trust_level: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          authority: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          last_verified_at?: string | null
          metadata?: Json | null
          subcategory?: string | null
          title: string
          trust_level?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          authority?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          last_verified_at?: string | null
          metadata?: Json | null
          subcategory?: string | null
          title?: string
          trust_level?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      resource_content_snapshots: {
        Row: {
          change_detected: boolean | null
          change_summary: string | null
          content_hash: string
          content_text: string | null
          id: string
          resource_id: string
          snapshot_date: string | null
        }
        Insert: {
          change_detected?: boolean | null
          change_summary?: string | null
          content_hash: string
          content_text?: string | null
          id?: string
          resource_id: string
          snapshot_date?: string | null
        }
        Update: {
          change_detected?: boolean | null
          change_summary?: string | null
          content_hash?: string
          content_text?: string | null
          id?: string
          resource_id?: string
          snapshot_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_content_snapshots_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "official_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_websites: {
        Row: {
          category: string
          check_frequency: string | null
          created_at: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          last_checked_at: string | null
          last_error: string | null
          last_status: string | null
          location: string | null
          metadata: Json | null
          name: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          category: string
          check_frequency?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          last_checked_at?: string | null
          last_error?: string | null
          last_status?: string | null
          location?: string | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          category?: string
          check_frequency?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          last_checked_at?: string | null
          last_error?: string | null
          last_status?: string | null
          location?: string | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      website_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string | null
          severity: string | null
          title: string
          tracked_website_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type?: string | null
          severity?: string | null
          title: string
          tracked_website_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string | null
          severity?: string | null
          title?: string
          tracked_website_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_notifications_tracked_website_id_fkey"
            columns: ["tracked_website_id"]
            isOneToOne: false
            referencedRelation: "tracked_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_scrape_results: {
        Row: {
          changed_items: number | null
          created_at: string | null
          error_message: string | null
          id: string
          items_found: number | null
          new_items: number | null
          raw_data: Json | null
          removed_items: number | null
          scrape_duration_ms: number | null
          scrape_timestamp: string | null
          status: string
          tracked_website_id: string
        }
        Insert: {
          changed_items?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_found?: number | null
          new_items?: number | null
          raw_data?: Json | null
          removed_items?: number | null
          scrape_duration_ms?: number | null
          scrape_timestamp?: string | null
          status: string
          tracked_website_id: string
        }
        Update: {
          changed_items?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_found?: number | null
          new_items?: number | null
          raw_data?: Json | null
          removed_items?: number | null
          scrape_duration_ms?: number | null
          scrape_timestamp?: string | null
          status?: string
          tracked_website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_scrape_results_tracked_website_id_fkey"
            columns: ["tracked_website_id"]
            isOneToOne: false
            referencedRelation: "tracked_websites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
