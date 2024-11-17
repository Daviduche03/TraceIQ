import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ApiKey {
  id: string;
  project_id: string;
  key_type: 'production' | 'development';
  key_value: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

interface ApiKeyState {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  fetchApiKeys: (projectId: string) => Promise<void>;
  generateApiKey: (projectId: string, keyType: 'production' | 'development') => Promise<void>;
  revokeApiKey: (keyId: string) => Promise<void>;
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  keys: [],
  loading: false,
  error: null,
  fetchApiKeys: async (projectId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ keys: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  generateApiKey: async (projectId, keyType) => {
    try {
      const { data, error } = await supabase.rpc('generate_api_key', {
        key_type: keyType
      });

      if (error) throw error;

      const { error: insertError } = await supabase
        .from('api_keys')
        .insert([{
          project_id: projectId,
          key_type: keyType,
          key_value: data
        }]);

      if (insertError) throw insertError;

      // Refresh the keys list
      const { data: keys, error: fetchError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      set({ keys: keys || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  revokeApiKey: async (keyId) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      set((state) => ({
        keys: state.keys.map((key) =>
          key.id === keyId ? { ...key, is_active: false } : key
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));