import { focusStorage } from './focusStorage';
import { FocusSession, FocusStats } from '../types';

export const focusService = {
  completeSession: async (duration: number, mode: 'study' | 'break'): Promise<FocusStats> => {
    const session: FocusSession = {
      id: Math.random().toString(36).substring(7),
      startTime: Date.now() - (duration * 1000),
      duration,
      mode,
      completed: true,
    };

    await focusStorage.saveSession(session);

    let stats = await focusStorage.getStats();
    if (!stats) {
      stats = {
        totalFocusTime: 0,
        totalSessions: 0,
        streakDays: 0,
        lastSessionDate: null,
      };
    }

    if (mode === 'study') {
      stats.totalFocusTime += duration;
      stats.totalSessions += 1;
      
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (stats.lastSessionDate !== today) {
        // Simple streak logic: if last session was yesterday, increment. If today, stay same. Else reset to 1.
        if (stats.lastSessionDate) {
          const lastDate = new Date(stats.lastSessionDate);
          const y = new Date();
          y.setDate(y.getDate() - 1);
          const yesterdayStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
          
          if (stats.lastSessionDate === yesterdayStr) {
            stats.streakDays += 1;
          } else if (stats.lastSessionDate !== today) {
            stats.streakDays = 1;
          }
        } else {
          stats.streakDays = 1;
        }
        stats.lastSessionDate = today;
      }
    }

    await focusStorage.saveStats(stats);
    return stats;
  },

  getStats: async (): Promise<FocusStats> => {
    const stats = await focusStorage.getStats();
    return stats || {
      totalFocusTime: 0,
      totalSessions: 0,
      streakDays: 0,
      lastSessionDate: null,
    };
  },

  getRecentSessions: async (): Promise<FocusSession[]> => {
    return await focusStorage.getSessions();
  }
};
