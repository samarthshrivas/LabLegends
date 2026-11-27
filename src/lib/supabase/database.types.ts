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
    PostgrestVersion: "17.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string
          icon: Database["public"]["Enums"]["badge_icon"]
          id: string
          name: string
          tone: Database["public"]["Enums"]["badge_tone"]
        }
        Insert: {
          created_at?: string
          description: string
          icon: Database["public"]["Enums"]["badge_icon"]
          id: string
          name: string
          tone: Database["public"]["Enums"]["badge_tone"]
        }
        Update: {
          created_at?: string
          description?: string
          icon?: Database["public"]["Enums"]["badge_icon"]
          id?: string
          name?: string
          tone?: Database["public"]["Enums"]["badge_tone"]
        }
        Relationships: []
      }
      class_members: {
        Row: {
          class_id: string
          joined_at: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          class_id: string
          joined_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          class_id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          join_code: string
          name: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          join_code: string
          name: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          attempt_id: string
          created_at: string
          criteria: Json
          headline: string
          id: string
          mastery_threshold: number
          next_steps: string[]
          passed: boolean
          rubric_version: string
          strengths: string[]
          summary: string
          total: number
        }
        Insert: {
          attempt_id: string
          created_at?: string
          criteria: Json
          headline: string
          id?: string
          mastery_threshold: number
          next_steps?: string[]
          passed: boolean
          rubric_version: string
          strengths?: string[]
          summary: string
          total: number
        }
        Update: {
          attempt_id?: string
          created_at?: string
          criteria?: Json
          headline?: string
          id?: string
          mastery_threshold?: number
          next_steps?: string[]
          passed?: boolean
          rubric_version?: string
          strengths?: string[]
          summary?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: true
            referencedRelation: "mission_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_runs: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          model_version: string | null
          observations: Json
          parameters: Json
          run_number: number
          warnings: string[]
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          model_version?: string | null
          observations: Json
          parameters: Json
          run_number: number
          warnings?: string[]
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          model_version?: string | null
          observations?: Json
          parameters?: Json
          run_number?: number
          warnings?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "experiment_runs_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mission_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      hypotheses: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          justification: string
          prediction: string
          revision: number
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          justification: string
          prediction: string
          revision?: number
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          justification?: string
          prediction?: string
          revision?: number
        }
        Relationships: [
          {
            foreignKeyName: "hypotheses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mission_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_assignments: {
        Row: {
          assigned_by: string
          class_id: string
          created_at: string
          due_at: string | null
          id: string
          instructions: string | null
          is_active: boolean
          mission_id: string
          mission_version: number
        }
        Insert: {
          assigned_by: string
          class_id: string
          created_at?: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          mission_id: string
          mission_version: number
        }
        Update: {
          assigned_by?: string
          class_id?: string
          created_at?: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          mission_id?: string
          mission_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "mission_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_assignments_mission_id_mission_version_fkey"
            columns: ["mission_id", "mission_version"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id", "version"]
          },
        ]
      }
      mission_attempts: {
        Row: {
          class_id: string | null
          completed_at: string | null
          conclusion: string
          created_at: string
          hints_used: number
          id: string
          justification: string
          mission_id: string
          mission_version: number
          prediction: string
          revealed_hint_ids: string[]
          started_at: string
          status: Database["public"]["Enums"]["attempt_status"]
          student_id: string
          updated_at: string
          xp_awarded: number
        }
        Insert: {
          class_id?: string | null
          completed_at?: string | null
          conclusion?: string
          created_at?: string
          hints_used?: number
          id?: string
          justification?: string
          mission_id: string
          mission_version: number
          prediction?: string
          revealed_hint_ids?: string[]
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          student_id: string
          updated_at?: string
          xp_awarded?: number
        }
        Update: {
          class_id?: string | null
          completed_at?: string | null
          conclusion?: string
          created_at?: string
          hints_used?: number
          id?: string
          justification?: string
          mission_id?: string
          mission_version?: number
          prediction?: string
          revealed_hint_ids?: string[]
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          student_id?: string
          updated_at?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "mission_attempts_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_attempts_mission_id_mission_version_fkey"
            columns: ["mission_id", "mission_version"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id", "version"]
          },
          {
            foreignKeyName: "mission_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          base_xp: number
          codename: string
          created_at: string
          definition: Json
          difficulty: Database["public"]["Enums"]["difficulty"]
          estimated_minutes: number
          grade_band: Database["public"]["Enums"]["grade_band"]
          hook: string
          id: string
          is_published: boolean
          review_status: Database["public"]["Enums"]["review_status"]
          subject: Database["public"]["Enums"]["subject"]
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          base_xp: number
          codename: string
          created_at?: string
          definition: Json
          difficulty: Database["public"]["Enums"]["difficulty"]
          estimated_minutes: number
          grade_band: Database["public"]["Enums"]["grade_band"]
          hook: string
          id: string
          is_published?: boolean
          review_status?: Database["public"]["Enums"]["review_status"]
          subject: Database["public"]["Enums"]["subject"]
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          base_xp?: number
          codename?: string
          created_at?: string
          definition?: Json
          difficulty?: Database["public"]["Enums"]["difficulty"]
          estimated_minutes?: number
          grade_band?: Database["public"]["Enums"]["grade_band"]
          hook?: string
          id?: string
          is_published?: boolean
          review_status?: Database["public"]["Enums"]["review_status"]
          subject?: Database["public"]["Enums"]["subject"]
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          grade_band: Database["public"]["Enums"]["grade_band"]
          id: string
          last_seen_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          grade_band?: Database["public"]["Enums"]["grade_band"]
          id: string
          last_seen_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          grade_band?: Database["public"]["Enums"]["grade_band"]
          id?: string
          last_seen_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      student_badges: {
        Row: {
          attempt_id: string | null
          awarded_at: string
          badge_id: string
          student_id: string
        }
        Insert: {
          attempt_id?: string | null
          awarded_at?: string
          badge_id: string
          student_id: string
        }
        Update: {
          attempt_id?: string | null
          awarded_at?: string
          badge_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_badges_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mission_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_badges_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_ledger: {
        Row: {
          amount: number
          attempt_id: string | null
          created_at: string
          id: string
          reason: string
          student_id: string
        }
        Insert: {
          amount: number
          attempt_id?: string | null
          created_at?: string
          id?: string
          reason: string
          student_id: string
        }
        Update: {
          amount?: number
          attempt_id?: string | null
          created_at?: string
          id?: string
          reason?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_ledger_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mission_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_ledger_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_attempt: {
        Args: { target_attempt_id: string }
        Returns: boolean
      }
      can_access_student: {
        Args: { target_student_id: string }
        Returns: boolean
      }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_class_member: { Args: { target_class_id: string }; Returns: boolean }
      is_class_teacher: { Args: { target_class_id: string }; Returns: boolean }
      mission_is_published: {
        Args: { target_id: string; target_version: number }
        Returns: boolean
      }
      owns_attempt: {
        Args: { target_attempt_id: string }
        Returns: boolean
      }
    }
    Enums: {
      attempt_status: "in_progress" | "retry" | "completed"
      badge_icon: "eye" | "sliders" | "search" | "flask" | "trophy" | "spark"
      badge_tone: "primary" | "accent" | "gold" | "positive"
      difficulty: "starter" | "core" | "challenge"
      grade_band: "6-8" | "9-10" | "11-12" | "undergrad"
      review_status: "reviewed" | "pending-subject-review"
      subject: "physics" | "chemistry" | "biology"
      user_role: "student" | "teacher"
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
      attempt_status: ["in_progress", "retry", "completed"],
      badge_icon: ["eye", "sliders", "search", "flask", "trophy", "spark"],
      badge_tone: ["primary", "accent", "gold", "positive"],
      difficulty: ["starter", "core", "challenge"],
      grade_band: ["6-8", "9-10", "11-12", "undergrad"],
      review_status: ["reviewed", "pending-subject-review"],
      subject: ["physics", "chemistry", "biology"],
      user_role: ["student", "teacher"],
    },
  },
} as const
