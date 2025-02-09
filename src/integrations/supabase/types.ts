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
      achievements: {
        Row: {
          badge_type: string | null
          badge_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          points_required: number
        }
        Insert: {
          badge_type?: string | null
          badge_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          points_required?: number
        }
        Update: {
          badge_type?: string | null
          badge_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          points_required?: number
        }
        Relationships: []
      }
      badge_store: {
        Row: {
          badge_type: string
          cost: number
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          badge_type: string
          cost: number
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          badge_type?: string
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      challenge_completions: {
        Row: {
          completed_date: string
          created_at: string
          id: string
          user_challenge_id: string
        }
        Insert: {
          completed_date?: string
          created_at?: string
          id?: string
          user_challenge_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          id?: string
          user_challenge_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_completions_user_challenge_id_fkey"
            columns: ["user_challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string | null
          completion_criteria: string | null
          created_at: string
          description: string | null
          difficulty: string
          duration_days: number
          id: string
          is_premium: boolean | null
          milestones: Json | null
          motivation_text: string | null
          reward_points: number | null
          tips: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completion_criteria?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_days?: number
          id?: string
          is_premium?: boolean | null
          milestones?: Json | null
          motivation_text?: string | null
          reward_points?: number | null
          tips?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completion_criteria?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_days?: number
          id?: string
          is_premium?: boolean | null
          milestones?: Json | null
          motivation_text?: string | null
          reward_points?: number | null
          tips?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          milestones: Json | null
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          milestones?: Json | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          milestones?: Json | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_categories: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_notifications: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          is_enabled: boolean
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          is_enabled?: boolean
          reminder_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          is_enabled?: boolean
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_notifications_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_sync_queue: {
        Row: {
          action: string
          created_at: string | null
          data: Json | null
          habit_id: string
          id: string
          synced_at: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          data?: Json | null
          habit_id: string
          id?: string
          synced_at?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          data?: Json | null
          habit_id?: string
          id?: string
          synced_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_sync_queue_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string | null
          category_id: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          id: string
          last_synced: string | null
          offline_created: boolean | null
          streak: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          last_synced?: string | null
          offline_created?: boolean | null
          streak?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          category_id?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          last_synced?: string | null
          offline_created?: boolean | null
          streak?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "habit_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      points_guide: {
        Row: {
          category: string
          created_at: string
          description: string
          display_order: number | null
          icon: string | null
          id: string
          points_value: number | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          display_order?: number | null
          icon?: string | null
          id?: string
          points_value?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          points_value?: number | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          has_seen_tour: boolean | null
          id: string
          is_premium: boolean | null
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          has_seen_tour?: boolean | null
          id: string
          is_premium?: boolean | null
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          has_seen_tour?: boolean | null
          id?: string
          is_premium?: boolean | null
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchased_badges: {
        Row: {
          badge_id: string
          id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_store"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_config: {
        Row: {
          created_at: string | null
          id: string
          publishable_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          publishable_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          publishable_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_responses: {
        Row: {
          created_at: string
          fitness_level: string
          goals: string[]
          id: string
          preferred_duration: number
          recommended_challenge_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          fitness_level: string
          goals: string[]
          id?: string
          preferred_duration: number
          recommended_challenge_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          fitness_level?: string
          goals?: string[]
          id?: string
          preferred_duration?: number
          recommended_challenge_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_responses_recommended_challenge_id_fkey"
            columns: ["recommended_challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      medium_challenge_completion: {
        Row: {
          completed_medium: number | null
          completion_percentage: number | null
          total_medium: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_advanced_challenges: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      can_access_app: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      is_premium_user: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      purchase_badge: {
        Args: {
          badge_id: string
        }
        Returns: Json
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
