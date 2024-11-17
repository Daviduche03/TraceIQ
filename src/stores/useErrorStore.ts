import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Error = Database['public']['Tables']['errors']['Row'];
type ErrorInsert = Database['public']['Tables']['errors']['Insert'];

interface ErrorState {
  errors: Error[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    critical: number;
    error: number;
    warning: number;
  };
  fetchErrors: (projectId: string) => Promise<void>;
  fetchErrorStats: (projectId: string) => Promise<void>;
  createError: (error: ErrorInsert) => Promise<void>;
  updateErrorStatus: (id: string, status: Error['status']) => Promise<void>;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errors: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    critical: 0,
    error: 0,
    warning: 0
  },
  fetchErrors: async (projectId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('errors')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ errors: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  fetchErrorStats: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('errors')
        .select('severity')
        .eq('project_id', projectId);
       
      if (error) throw error;

      const stats = {
        total: data.length,
        critical: data.filter(e => e.severity === 'critical').length,
        error: data.filter(e => e.severity === 'error').length,
        warning: data.filter(e => e.severity === 'warning').length
      };

      set({ stats });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  createError: async (errorData) => {
    try {
      const { data, error } = await supabase
        .from('errors')
        .insert([errorData])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ errors: [data, ...state.errors] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  updateErrorStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('errors')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        errors: state.errors.map((error) =>
          error.id === id ? { ...error, status } : error
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));