export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payload?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      households: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payload?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      maids: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payload?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      placements: {
        Row: {
          household_id: string | null;
          id: string;
          payload: Json;
          updated_at: string;
          worker_id: string | null;
        };
        Insert: {
          household_id?: string | null;
          id: string;
          payload: Json;
          updated_at?: string;
          worker_id?: string | null;
        };
        Update: {
          household_id?: string | null;
          id?: string;
          payload?: Json;
          updated_at?: string;
          worker_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "placements_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "placements_worker_id_fkey";
            columns: ["worker_id"];
            isOneToOne: false;
            referencedRelation: "maid_public_listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "placements_worker_id_fkey";
            columns: ["worker_id"];
            isOneToOne: false;
            referencedRelation: "maids";
            referencedColumns: ["id"];
          },
        ];
      };
      registry_activity: {
        Row: {
          actor: string | null;
          created_at: string;
          id: number;
          message: string;
        };
        Insert: {
          actor?: string | null;
          created_at?: string;
          id?: never;
          message: string;
        };
        Update: {
          actor?: string | null;
          created_at?: string;
          id?: never;
          message?: string;
        };
        Relationships: [];
      };
      maid_share_links: {
        Row: {
          created_at: string;
          created_by: string | null;
          expires_at: string | null;
          full_token: string;
          maid_id: string;
          revoked_at: string | null;
          teaser_token: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          expires_at?: string | null;
          full_token: string;
          maid_id: string;
          revoked_at?: string | null;
          teaser_token: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          expires_at?: string | null;
          full_token?: string;
          maid_id?: string;
          revoked_at?: string | null;
          teaser_token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maid_share_links_maid_id_fkey";
            columns: ["maid_id"];
            isOneToOne: true;
            referencedRelation: "maids";
            referencedColumns: ["id"];
          },
        ];
      };
      staff_access: {
        Row: {
          created_at: string;
          email: string;
          enabled: boolean;
          password: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          enabled?: boolean;
          password?: string;
          role: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          enabled?: boolean;
          password?: string;
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      maid_public_listings: {
        Row: {
          area: string | null;
          display_name: string | null;
          experience: number | null;
          id: string | null;
          languages: string | null;
          schedule: string | null;
          services: Json | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      save_registry_changes: {
        Args: { changes: Json; messages?: Json };
        Returns: undefined;
      };
      staff_registration_allowed: {
        Args: { target_email: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
