export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          environment: 'Production' | 'Staging' | 'Development'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          environment: 'Production' | 'Staging' | 'Development'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          environment?: 'Production' | 'Staging' | 'Development'
          created_at?: string
          user_id?: string
        }
      }
      errors: {
        Row: {
          id: string
          project_id: string
          message: string
          type: string
          stack_trace: string | null
          browser: string | null
          os: string | null
          created_at: string
          status: 'open' | 'resolved' | 'ignored'
          severity: 'critical' | 'error' | 'warning'
        }
        Insert: {
          id?: string
          project_id: string
          message: string
          type: string
          stack_trace?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
          status?: 'open' | 'resolved' | 'ignored'
          severity?: 'critical' | 'error' | 'warning'
        }
        Update: {
          id?: string
          project_id?: string
          message?: string
          type?: string
          stack_trace?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
          status?: 'open' | 'resolved' | 'ignored'
          severity?: 'critical' | 'error' | 'warning'
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
  }
}