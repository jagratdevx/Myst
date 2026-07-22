import { create } from 'zustand';
import { FocusStats, FocusSession } from '../types';
import { focusService } from '../services/focusService';
import { awardFocusXP } from './useGamificationStore';

interface FocusState {
  stats: FocusStats;
  recentSessions: FocusSession[];
  loading: boolean;
  fetchData: () => Promise<void>;
  saveSession: (duration: number, mode: 'study' | 'break') => Promise<void>;
}

export const useFocusStore = create<FocusState>((set) => ({
  stats: {
    totalFocusTime: 0,
    totalSessions: 0,
    streakDays: 0,
    lastSessionDate: null,
  },
  recentSessions: [],
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const stats = await focusService.getStats();
      const recentSessions = await focusService.getRecentSessions();
      set({ stats, recentSessions, loading: false });
    } catch (error) {
      console.error('Failed to fetch focus data:', error);
      set({ loading: false });
    }
  },

  saveSession: async (duration, mode) => {
    try {
      const updatedStats = await focusService.completeSession(duration, mode);
      const recentSessions = await focusService.getRecentSessions();
      set({ stats: updatedStats, recentSessions });
      if (mode === 'study') awardFocusXP(duration);
    } catch (error) {
      console.error('Failed to save focus session:', error);
    }
  },
}));
