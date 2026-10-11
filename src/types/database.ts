// Hand-written to match the Supabase migrations in this repo.
// Regenerate with `npm run types:gen` once the migration is applied.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      landlords: {
        Row: {
          id: string;
          name: string;
          phone: string;
          language: string;
          reminder_tone: string;
          onboarding_completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone: string;
          language?: string;
          reminder_tone?: string;
          onboarding_completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          language?: string;
          reminder_tone?: string;
          onboarding_completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          landlord_id: string;
          name: string;
          address: string | null;
          bank_details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          landlord_id: string;
          name: string;
          address?: string | null;
          bank_details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          landlord_id?: string;
          name?: string;
          address?: string | null;
          bank_details?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey";
            columns: ["landlord_id"];
            isOneToOne: false;
            referencedRelation: "landlords";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          monthly_rent_cents: number;
          due_day: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          monthly_rent_cents: number;
          due_day?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          monthly_rent_cents?: number;
          due_day?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      tenants: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          phone: string;
          language: string;
          move_in_date: string;
          deposit_cents: number;
          move_out_date: string | null;
          access_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          name: string;
          phone: string;
          language?: string;
          move_in_date: string;
          deposit_cents?: number;
          move_out_date?: string | null;
          access_token: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          name?: string;
          phone?: string;
          language?: string;
          move_in_date?: string;
          deposit_cents?: number;
          move_out_date?: string | null;
          access_token?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tenants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      complete_onboarding: {
        Args: {
          p_name: string;
          p_language: string;
          p_property_name: string;
          p_address: string;
          p_rooms: Json;
        };
        Returns: string;
      };
      owns_property: { Args: { p_property_id: string }; Returns: boolean };
      owns_room: { Args: { p_room_id: string }; Returns: boolean };
      get_tenant_page: {
        Args: { p_access_token: string };
        Returns: {
          tenant_name: string;
          move_in_date: string;
          move_out_date: string | null;
          room_name: string;
          property_name: string;
          monthly_rent_cents: number;
          due_day: number;
        }[];
      };
      regenerate_tenant_token: { Args: { p_tenant_id: string }; Returns: string };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
