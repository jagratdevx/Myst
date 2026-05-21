import { create } from 'zustand';
import { analyticsService } from '../services/analyticsService';

interface AnalyticsState {
  aggregateData: any;
  focusDistribution: number[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  aggregateData: null,
  focusDistribution: [0, 0, 0, 0, 0, 0, 0],
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const aggregateData = await analyticsService.getAggregateData();
      const focusDistribution = await analyticsService.getWeeklyFocusDistribution();
      set({ aggregateData, focusDistribution, loading: false });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      set({ loading: false });
    }
  },
}));
