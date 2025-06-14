import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      dog_avatars: {
        Row: {
          id: string;
          emoji: string;
          label: string;
          trait: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          emoji: string;
          label: string;
          trait: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          emoji?: string;
          label?: string;
          trait?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          dog_avatar_id: string | null;
          bio: string;
          has_dog: boolean;
          volunteers: boolean;
          wants_adoption: boolean;
          profile_complete: boolean;
          preferred_energy: string;
          preferred_size: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          dog_avatar_id?: string | null;
          bio?: string;
          has_dog?: boolean;
          volunteers?: boolean;
          wants_adoption?: boolean;
          profile_complete?: boolean;
          preferred_energy?: string;
          preferred_size?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          dog_avatar_id?: string | null;
          bio?: string;
          has_dog?: boolean;
          volunteers?: boolean;
          wants_adoption?: boolean;
          profile_complete?: boolean;
          preferred_energy?: string;
          preferred_size?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          created_at?: string;
        };
      };
      user_tags: {
        Row: {
          user_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      profile_prompts: {
        Row: {
          id: string;
          user_id: string;
          prompt_type: 'ideal_day' | 'dog_connection' | 'weekend' | 'dream_bond' | 'fun_activity';
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt_type: 'ideal_day' | 'dog_connection' | 'weekend' | 'dream_bond' | 'fun_activity';
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt_type?: 'ideal_day' | 'dog_connection' | 'weekend' | 'dream_bond' | 'fun_activity';
          answer?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      shelters: {
        Row: {
          id: string;
          name: string;
          address: string;
          lat_lng: any; // PostGIS geography type
          contact: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          lat_lng?: any;
          contact: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          lat_lng?: any;
          contact?: string;
          created_at?: string;
        };
      };
      dogs: {
        Row: {
          id: string;
          shelter_id: string;
          name: string;
          breed: string;
          age: string;
          size: 'Small' | 'Medium' | 'Large';
          distance: string;
          images: string[];
          tags: string[];
          fun_fact: string;
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shelter_id: string;
          name: string;
          breed: string;
          age: string;
          size: 'Small' | 'Medium' | 'Large';
          distance: string;
          images?: string[];
          tags?: string[];
          fun_fact: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shelter_id?: string;
          name?: string;
          breed?: string;
          age?: string;
          size?: 'Small' | 'Medium' | 'Large';
          distance?: string;
          images?: string[];
          tags?: string[];
          fun_fact?: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          start_date: string;
          status: 'pending' | 'active' | 'expired' | 'booked';
          chat_unlocked: boolean;
          dog_match_unlocked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          start_date?: string;
          status?: 'pending' | 'active' | 'expired' | 'booked';
          chat_unlocked?: boolean;
          dog_match_unlocked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          start_date?: string;
          status?: 'pending' | 'active' | 'expired' | 'booked';
          chat_unlocked?: boolean;
          dog_match_unlocked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      match_dog_likes: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          dog_id: string;
          liked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          dog_id: string;
          liked: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          dog_id?: string;
          liked?: boolean;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          content: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          sender_id: string;
          content: string;
          sent_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          sender_id?: string;
          content?: string;
          sent_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          match_id: string;
          dog_id: string;
          shelter_id: string;
          date_time: string;
          status: 'pending' | 'confirmed' | 'canceled';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          dog_id: string;
          shelter_id: string;
          date_time: string;
          status?: 'pending' | 'confirmed' | 'canceled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          dog_id?: string;
          shelter_id?: string;
          date_time?: string;
          status?: 'pending' | 'confirmed' | 'canceled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      prompt_type: 'ideal_day' | 'dog_connection' | 'weekend' | 'dream_bond' | 'fun_activity';
      match_status: 'pending' | 'active' | 'expired' | 'booked';
      booking_status: 'pending' | 'confirmed' | 'canceled';
      dog_size: 'Small' | 'Medium' | 'Large';
    };
  };
}