import AsyncStorage from '@react-native-async-storage/async-storage';
import { GamificationState, Badge, XPActivity, XPReason, BADGE_DEFINITIONS } from '../types/gamification';

const STORAGE_KEY = '@myst_gamification';

function xpForLevel(level: number): number {
  if (level < 10) return 100;
  if (level < 20) return 200;
  return 500;
}

const defaultState: GamificationState = {
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
};

async function load(): Promise<GamificationState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return JSON.parse(raw);
  } catch { return { ...defaultState }; }
}

async function save(state: GamificationState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function checkBadges(state: GamificationState): Badge[] {
  const newBadges: Badge[] = [];
  const earnedIds = new Set(state.badges.map(b => b.id));

  for (const def of BADGE_DEFINITIONS) {
    if (earnedIds.has(def.id)) continue;
    let earned = false;
    switch (def.id) {
      case 'first_focus': earned = state.totalFocusSessions >= 1; break;
      case 'marathon': earned = state.totalFocusSessions >= 10; break;
      case 'task_master': earned = state.totalTasksCompleted >= 50; break;
      case 'streak_king': earned = state.totalTasksCompleted >= 7; break;
      case 'scholar': earned = state.totalScoresRecorded >= 10; break;
      case 'perfect_score': earned = state.highestScore >= 100; break;
      case 'saver': earned = false; break;
      case 'bookworm': earned = state.totalPDFsImported >= 5; break;
      case 'century': earned = state.level >= 100; break;
      case 'planner': earned = state.totalTasksCompleted >= 10; break;
    }
    if (earned) newBadges.push({ ...def, earnedAt: Date.now() });
  }
  return newBadges;
}

export const gamificationService = {
  async getState(): Promise<GamificationState> {
    return load();
  },

  async addXP(amount: number, reason: string, source: XPReason): Promise<GamificationState> {
    const state = await load();
    state.xp += amount;
    state.recentActivity.unshift({ id: Math.random().toString(36).substring(7), amount, reason, source, timestamp: Date.now() });
    state.recentActivity = state.recentActivity.slice(0, 50);

    while (state.xp >= state.xpToNextLevel) {
      state.xp -= state.xpToNextLevel;
      state.level++;
      state.xpToNextLevel = xpForLevel(state.level);
    }

    const newBadges = checkBadges(state);
    if (newBadges.length > 0) state.badges.push(...newBadges);

    await save(state);
    return state;
  },

  async updateCounters(updates: Partial<Pick<GamificationState, 'totalFocusSessions' | 'totalTasksCompleted' | 'totalScoresRecorded' | 'totalPDFsImported' | 'highestScore'>>): Promise<GamificationState> {
    const state = await load();
    Object.assign(state, updates);

    if (updates.highestScore !== undefined && updates.highestScore > state.highestScore) {
      state.highestScore = updates.highestScore;
    }

    const newBadges = checkBadges(state);
    if (newBadges.length > 0) state.badges.push(...newBadges);

    await save(state);
    return state;
  },

  async reset(): Promise<void> {
    await save({ ...defaultState });
  },
};
