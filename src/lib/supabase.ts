import { createClient } from '@supabase/supabase-js'
import { env, validateEnv } from './env'

// Validate environment variables on import
validateEnv()

export const supabase = createClient(
  'https://ibqhfgpdgzrhvyfpgjxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDk3NDcsImV4cCI6MjA3MDY4NTc0N30.1vSikm9_Dn978BctKWXhoOfPCKztLaBNgr8OEIVIXNg',
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    // Note: 'enabled' option is handled by Supabase internally
    // Use realtime subscriptions conditionally in components
  }
})

// Database types
export type Database = {
  public: {
    Tables: {
      beneficiaries: {
        Row: {
          id: string
          name: string
          surname: string
          identity_no: string | null
          phone: string | null
          email: string | null
          address: string | null
          city: string | null
          district: string | null
          category: string
          nationality: string | null
          birth_date: string | null
          gender: string | null
          marital_status: string | null
          education_level: string | null
          monthly_income: number | null
          family_size: number
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          surname: string
          identity_no?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          district?: string | null
          category: string
          nationality?: string | null
          birth_date?: string | null
          gender?: string | null
          marital_status?: string | null
          education_level?: string | null
          monthly_income?: number | null
          family_size?: number
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          surname?: string
          identity_no?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          district?: string | null
          category?: string
          nationality?: string | null
          birth_date?: string | null
          gender?: string | null
          marital_status?: string | null
          education_level?: string | null
          monthly_income?: number | null
          family_size?: number
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          beneficiary_id: string
          aid_type: 'cash' | 'in_kind' | 'service' | 'medical'
          amount: number | null
          description: string
          priority: 'low' | 'normal' | 'high' | 'urgent'
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          evaluated_by: string | null
          evaluated_at: string | null
          evaluation_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          beneficiary_id: string
          aid_type: 'cash' | 'in_kind' | 'service' | 'medical'
          amount?: number | null
          description: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          evaluated_by?: string | null
          evaluated_at?: string | null
          evaluation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          beneficiary_id?: string
          aid_type?: 'cash' | 'in_kind' | 'service' | 'medical'
          amount?: number | null
          description?: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          evaluated_by?: string | null
          evaluated_at?: string | null
          evaluation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      aid_records: {
        Row: {
          id: string
          application_id: string | null
          beneficiary_id: string
          aid_type: string
          amount: number | null
          status: 'approved' | 'distributed' | 'completed' | 'cancelled'
          approved_by: string
          approved_at: string
          distributed_at: string | null
          distributed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          beneficiary_id: string
          aid_type: string
          amount?: number | null
          status?: 'approved' | 'distributed' | 'completed' | 'cancelled'
          approved_by: string
          approved_at?: string
          distributed_at?: string | null
          distributed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          beneficiary_id?: string
          aid_type?: string
          amount?: number | null
          status?: 'approved' | 'distributed' | 'completed' | 'cancelled'
          approved_by?: string
          approved_at?: string
          distributed_at?: string | null
          distributed_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          aid_record_id: string
          payment_method: 'cash' | 'bank_transfer' | 'check'
          amount: number
          bank_account: string | null
          transaction_ref: string | null
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          paid_at: string | null
          processed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          aid_record_id: string
          payment_method: 'cash' | 'bank_transfer' | 'check'
          amount: number
          bank_account?: string | null
          transaction_ref?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          paid_at?: string | null
          processed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          aid_record_id?: string
          payment_method?: 'cash' | 'bank_transfer' | 'check'
          amount?: number
          bank_account?: string | null
          transaction_ref?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          paid_at?: string | null
          processed_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          display_name: string | null
          email: string | null
          phone: string | null
          role: 'super_admin' | 'admin' | 'manager' | 'coordinator' | 'volunteer' | 'user'
          department: string | null
          position: string | null
          avatar_url: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
          status: 'active' | 'inactive' | 'suspended' | 'pending'
        }
        Insert: {
          id: string
          full_name: string
          display_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'coordinator' | 'volunteer' | 'user'
          department?: string | null
          position?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended' | 'pending'
        }
        Update: {
          id?: string
          full_name?: string
          display_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'coordinator' | 'volunteer' | 'user'
          department?: string | null
          position?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended' | 'pending'
        }
      }
      in_kind_aids: {
        Row: {
          id: string
          aid_record_id: string
          item_category: string
          item_description: string
          quantity: number
          unit: string
          unit_value: number
          distributed_at: string | null
          distributed_by: string | null
        }
        Insert: {
          id?: string
          aid_record_id: string
          item_category: string
          item_description: string
          quantity: number
          unit: string
          unit_value: number
          distributed_at?: string | null
          distributed_by?: string | null
        }
        Update: {
          id?: string
          aid_record_id?: string
          item_category?: string
          item_description?: string
          quantity?: number
          unit?: string
          unit_value?: number
          distributed_at?: string | null
          distributed_by?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          beneficiary_id: string
          document_type: string
          file_name: string
          file_path: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          beneficiary_id: string
          document_type: string
          file_name: string
          file_path: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          beneficiary_id?: string
          document_type?: string
          file_name?: string
          file_path?: string
          uploaded_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          beneficiary_id: string
          name: string
          surname: string
          relationship: string
          birth_date: string | null
          status: string
        }
        Insert: {
          id?: string
          beneficiary_id: string
          name: string
          surname: string
          relationship: string
          birth_date?: string | null
          status: string
        }
        Update: {
          id?: string
          beneficiary_id?: string
          name?: string
          surname?: string
          relationship?: string
          birth_date?: string | null
          status?: string
        }
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
