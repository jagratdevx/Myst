import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusSession, FocusStats } from '../types';

const FOCUS_SESSIONS_KEY = '@myst_focus_sessions';
const FOCUS_STATS_KEY = '@myst_focus_stats';

export const focusStorage = {
  saveSession: async (session: FocusSession): Promise<void> => {
    try {
      const existingSessionsJson = await AsyncStorage.getItem(FOCUS_SESSIONS_KEY);
      const sessions: FocusSession[] = existingSessionsJson ? JSON.parse(existingSessionsJson) : [];
      sessions.unshift(session);
      // Keep only last 100 sessions for performance
      const trimmedSessions = sessions.slice(0, 100);
      await AsyncStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(trimmedSessions));
    } catch (error) {
      console.error('Error saving focus session:', error);
    }
  },

  getSessions: async (): Promise<FocusSession[]> => {
    try {
      const sessionsJson = await AsyncStorage.getItem(FOCUS_SESSIONS_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : [];
    } catch (error) {
      console.error('Error getting focus sessions:', error);
      return [];
    }
  },

  getStats: async (): Promise<FocusStats | null> => {
    try {
      const statsJson = await AsyncStorage.getItem(FOCUS_STATS_KEY);
      return statsJson ? JSON.parse(statsJson) : null;
    } catch (error) {
      console.error('Error getting focus stats:', error);
      return null;
    }
  },

  saveStats: async (stats: FocusStats): Promise<void> => {
    try {
      await AsyncStorage.setItem(FOCUS_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving focus stats:', error);
    }
  },

  clearData: async (): Promise<void> => {
    await AsyncStorage.removeItem(FOCUS_SESSIONS_KEY);
    await AsyncStorage.removeItem(FOCUS_STATS_KEY);
  }
};
