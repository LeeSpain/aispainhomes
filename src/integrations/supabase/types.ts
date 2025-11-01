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
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          invoice_pdf: string | null
          payment_date: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_pdf?: string | null
          payment_date?: string | null
          status: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_pdf?: string | null
          payment_date?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          current_country: string | null
          full_name: string | null
          has_pets: boolean | null
          household_size: number | null
          id: string
          moving_reason: string | null
          nationality: string | null
          phone: string | null
          preferred_locations: string[] | null
          property_type_preference: string | null
          relocation_timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          current_country?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          moving_reason?: string | null
          nationality?: string | null
          phone?: string | null
          preferred_locations?: string[] | null
          property_type_preference?: string | null
          relocation_timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          current_country?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          moving_reason?: string | null
          nationality?: string | null
          phone?: string | null
          preferred_locations?: string[] | null
          property_type_preference?: string | null
          relocation_timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      property_recommendations: {
        Row: {
          area_sqm: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          features: string[] | null
          id: string
          images: Json | null
          is_active: boolean | null
          location: string
          match_reasons: string[] | null
          match_score: number | null
          price: number
          property_id: string | null
          property_type: string | null
          source_url: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          location: string
          match_reasons?: string[] | null
          match_score?: number | null
          price: number
          property_id?: string | null
          property_type?: string | null
          source_url: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          location?: string
          match_reasons?: string[] | null
          match_score?: number | null
          price?: number
          property_id?: string | null
          property_type?: string | null
          source_url?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          additional_notes: string | null
          amenities_required: string[] | null
          budget_range: Json | null
          completed_at: string | null
          created_at: string | null
          employment_status: string | null
          guardian_service_tier: string | null
          household_details: Json | null
          id: string
          legal_documentation: Json | null
          lifestyle_preferences: Json | null
          location_preferences: Json | null
          personal_info: Json | null
          property_type: string | null
          property_types: string[] | null
          referral_source: string | null
          relocation_budget_range: Json | null
          relocation_date: string | null
          relocation_timeline: Json | null
          service_type: string
          services_needed: Json | null
          special_requirements: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          amenities_required?: string[] | null
          budget_range?: Json | null
          completed_at?: string | null
          created_at?: string | null
          employment_status?: string | null
          guardian_service_tier?: string | null
          household_details?: Json | null
          id?: string
          legal_documentation?: Json | null
          lifestyle_preferences?: Json | null
          location_preferences?: Json | null
          personal_info?: Json | null
          property_type?: string | null
          property_types?: string[] | null
          referral_source?: string | null
          relocation_budget_range?: Json | null
          relocation_date?: string | null
          relocation_timeline?: Json | null
          service_type: string
          services_needed?: Json | null
          special_requirements?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          amenities_required?: string[] | null
          budget_range?: Json | null
          completed_at?: string | null
          created_at?: string | null
          employment_status?: string | null
          guardian_service_tier?: string | null
          household_details?: Json | null
          id?: string
          legal_documentation?: Json | null
          lifestyle_preferences?: Json | null
          location_preferences?: Json | null
          personal_info?: Json | null
          property_type?: string | null
          property_types?: string[] | null
          referral_source?: string | null
          relocation_budget_range?: Json | null
          relocation_date?: string | null
          relocation_timeline?: Json | null
          service_type?: string
          services_needed?: Json | null
          special_requirements?: string | null
          updated_at?: string | null
          user_id?: string
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
      service_recommendations: {
        Row: {
          business_name: string
          contact_info: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          metadata: Json | null
          rating: number | null
          service_category: string
          source_url: string | null
          updated_at: string | null
          user_id: string
          why_recommended: string | null
        }
        Insert: {
          business_name: string
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          metadata?: Json | null
          rating?: number | null
          service_category: string
          source_url?: string | null
          updated_at?: string | null
          user_id: string
          why_recommended?: string | null
        }
        Update: {
          business_name?: string
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          metadata?: Json | null
          rating?: number | null
          service_category?: string
          source_url?: string | null
          updated_at?: string | null
          user_id?: string
          why_recommended?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string | null
          id: string
          monthly_price: number
          next_billing_date: string | null
          plan: string
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_method_id: string | null
          stripe_subscription_id: string | null
          trial_end_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          monthly_price?: number
          next_billing_date?: string | null
          plan: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          monthly_price?: number
          next_billing_date?: string | null
          plan?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      user_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          property_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          property_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          property_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          id: string
          invitation_code: string
          invited_by: string | null
          is_used: boolean
          metadata: Json | null
          role: Database["public"]["Enums"]["app_role"]
          subscription_plan: string | null
          subscription_type: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          invitation_code: string
          invited_by?: string | null
          is_used?: boolean
          metadata?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          subscription_plan?: string | null
          subscription_type?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          invitation_code?: string
          invited_by?: string | null
          is_used?: boolean
          metadata?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          subscription_plan?: string | null
          subscription_type?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      user_questionnaire_history: {
        Row: {
          changed_at: string | null
          field_changed: string
          id: string
          new_value: Json | null
          old_value: Json | null
          questionnaire_response_id: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          field_changed: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          questionnaire_response_id?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          field_changed?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          questionnaire_response_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_questionnaire_history_questionnaire_response_id_fkey"
            columns: ["questionnaire_response_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      check_questionnaire_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      generate_invitation_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
