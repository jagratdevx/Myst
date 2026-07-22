import { create } from 'zustand';
import { gamificationService } from '../services/gamificationService';
import { GamificationState, XPReason, BADGE_DEFINITIONS } from '../types/gamification';

interface GamificationStore extends GamificationState {
  loading: boolean;
  fetchData: () => Promise<void>;
  addXP: (amount: number, reason: string, source: XPReason) => Promise<void>;
  updateCounters: (updates: Partial<Pick<GamificationState, 'totalFocusSessions' | 'totalTasksCompleted' | 'totalScoresRecorded' | 'totalPDFsImported' | 'highestScore'>>) => Promise<void>;
  getLevelProgress: () => number;
}

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  xp: 0,
  level: 1,
  xpToNextLevel: 100,
  badges: [],
  recentActivity: [],
  totalFocusSessions: 0,
  totalTasksCompleted: 0,
  totalScoresRecorded: 0,
  totalPDFsImported: 0,
  highestScore: 0,
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    const state = await gamificationService.getState();
    set({ ...state, loading: false });
  },

  addXP: async (amount, reason, source) => {
    const state = await gamificationService.addXP(amount, reason, source);
    set({ ...state });
  },

  updateCounters: async (updates) => {
    const state = await gamificationService.updateCounters(updates);
    set({ ...state });
  },

  getLevelProgress: () => {
    const { xp, xpToNextLevel } = get();
    if (xpToNextLevel === 0) return 1;
    return xp / xpToNextLevel;
  },
}));

export function awardFocusXP(durationSeconds: number) {
  const xp = Math.max(5, Math.floor(durationSeconds / 60));
  useGamificationStore.getState().addXP(xp, `Focus session: ${Math.floor(durationSeconds / 60)} min`, 'focus');
  useGamificationStore.getState().updateCounters({ totalFocusSessions: useGamificationStore.getState().totalFocusSessions + 1 });
}

export function awardTaskXP() {
  useGamificationStore.getState().addXP(15, 'Task completed', 'task');
  useGamificationStore.getState().updateCounters({ totalTasksCompleted: useGamificationStore.getState().totalTasksCompleted + 1 });
}

export function awardTestScoreXP(percentage: number) {
  useGamificationStore.getState().addXP(20, 'Test score recorded', 'test_score');
  const current = useGamificationStore.getState().highestScore;
  useGamificationStore.getState().updateCounters({
    totalScoresRecorded: useGamificationStore.getState().totalScoresRecorded + 1,
    highestScore: Math.max(current, percentage),
  });
}

export function awardPDFImportXP() {
  useGamificationStore.getState().addXP(10, 'PDF imported', 'pdf_import');
  useGamificationStore.getState().updateCounters({ totalPDFsImported: useGamificationStore.getState().totalPDFsImported + 1 });
}
