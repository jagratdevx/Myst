import { settingsStorage } from './settingsStorage';
import { AppSettings } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  pomodoroWorkTime: 25,
  pomodoroBreakTime: 5,
};

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const settings = await settingsStorage.getSettings();
    return settings || DEFAULT_SETTINGS;
  },

  updateSettings: async (updates: Partial<AppSettings>): Promise<AppSettings> => {
    const current = await settingsService.getSettings();
    const updated = { ...current, ...updates };
    await settingsStorage.saveSettings(updated);
    return updated;
  },

  resetData: async (): Promise<void> => {
    await settingsStorage.clearAllData();
  },

  exportAllData: async (): Promise<string> => {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    const data: Record<string, any> = {};
    
    pairs.forEach(([key, value]) => {
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });

    return JSON.stringify(data, null, 2);
  }
};
