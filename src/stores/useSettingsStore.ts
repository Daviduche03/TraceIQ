import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ProjectSettings {
  project_id: string;
  notification_email: boolean;
  notification_slack: boolean;
  notification_discord: boolean;
  notification_threshold: number;
  ip_whitelist: string[];
  rate_limit: number;
  enable_source_maps: boolean;
  error_retention_days: number;
  logs_retention_days: number;
}

interface SettingsState {
  settings: ProjectSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: (projectId: string) => Promise<void>;
  updateSettings: (projectId: string, settings: Partial<ProjectSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: Omit<ProjectSettings, 'project_id'> = {
  notification_email: true,
  notification_slack: false,
  notification_discord: false,
  notification_threshold: 5,
  ip_whitelist: [],
  rate_limit: 1000,
  enable_source_maps: true,
  error_retention_days: 30,
  logs_retention_days: 7
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,
  fetchSettings: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('project_settings')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          // Create default settings
          const defaultSettings = {
            project_id: projectId,
            ...DEFAULT_SETTINGS
          };

          const { data: newSettings, error: insertError } = await supabase
            .from('project_settings')
            .insert([defaultSettings])
            .select()
            .single();

          if (insertError) throw insertError;
          set({ settings: newSettings, loading: false });
        } else {
          throw error;
        }
      } else {
        set({ settings: data, loading: false });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ 
        error: (error as Error).message,
        loading: false,
        settings: {
          project_id: projectId,
          ...DEFAULT_SETTINGS
        }
      });
    }
  },
  updateSettings: async (projectId, newSettings) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('project_settings')
        .upsert({
          project_id: projectId,
          ...currentSettings,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      set({
        settings: {
          ...currentSettings,
          ...newSettings
        },
        loading: false
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ 
        error: (error as Error).message,
        loading: false
      });
    }
  }
}));