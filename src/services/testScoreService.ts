import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestScore } from '../types/testScore';

const STORAGE_KEY = '@myst_test_scores';

export const testScoreService = {
  getAll: async (): Promise<TestScore[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save: async (score: TestScore): Promise<void> => {
    const scores = await testScoreService.getAll();
    scores.push(score);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  },

  delete: async (id: string): Promise<void> => {
    const scores = await testScoreService.getAll();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores.filter(s => s.id !== id)));
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
