import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'employee'
          department: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'employee'
          department: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'employee'
          department?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          employee_id: string
          check_in: string
          check_out: string | null
          date: string
          status: 'present' | 'absent' | 'late' | 'half_day'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          check_in: string
          check_out?: string | null
          date: string
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          check_in?: string
          check_out?: string | null
          date?: string
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          created_at?: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          employee_id: string
          start_date: string
          end_date: string
          leave_type: 'sick' | 'casual' | 'vacation' | 'other'
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          start_date: string
          end_date: string
          leave_type: 'sick' | 'casual' | 'vacation' | 'other'
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          start_date?: string
          end_date?: string
          leave_type?: 'sick' | 'casual' | 'vacation' | 'other'
          reason?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}
