import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

const SETTINGS_KEY = '@myst_settings';

export const settingsStorage = {
  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  getSettings: async (): Promise<AppSettings | null> => {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  },

  clearAllData: async (): Promise<void> => {
    await AsyncStorage.clear();
  }
};
