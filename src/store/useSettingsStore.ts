import { create } from 'zustand';
import { AppSettings } from '../types';
import { settingsService } from '../services/settingsService';

interface SettingsState {
  settings: AppSettings;
  loading: boolean;
  fetchData: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  exportData: () => Promise<string>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    theme: 'dark',
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5,
  },
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const settings = await settingsService.getSettings();
      set({ settings, loading: false });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ loading: false });
    }
  },

  updateSettings: async (updates) => {
    try {
      const updatedSettings = await settingsService.updateSettings(updates);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },

  resetAllData: async () => {
    try {
      await settingsService.resetData();
      // Re-fetch default settings after clear
      const settings = await settingsService.getSettings();
      set({ settings });
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  },

  exportData: async () => {
    return await settingsService.exportAllData();
  }
}));
