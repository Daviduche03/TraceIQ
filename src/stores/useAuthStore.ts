import { create } from 'zustand';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { errorTracker } from '../lib/errorTracking';



interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      const error = err as AuthError;
      await errorTracker.trackError({
        message: error.message,
        type: 'AuthError',
        severity: 'error',
        environment: import.meta.env.MODE,
        metadata: { email, operation: 'signIn' }
      });
      throw error;
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      const error = err as AuthError;
      await errorTracker.trackError({
        message: error.message,
        type: 'AuthError',
        severity: 'error',
        environment: import.meta.env.MODE,
        metadata: { email, operation: 'signUp' }
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (err) {
      const error = err as AuthError;
      await errorTracker.trackError({
        message: error.message,
        type: 'AuthError',
        severity: 'error',
        environment: import.meta.env.MODE,
        metadata: { operation: 'signOut' }
      });
      throw error;
    }
  },
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
}));