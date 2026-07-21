import { create } from 'zustand';
import { TestScore, SubjectTotal } from '../types/testScore';
import { testScoreService } from '../services/testScoreService';

interface TestScoreState {
  scores: TestScore[];
  loading: boolean;
  fetchScores: () => Promise<void>;
  addScore: (subject: string, score: number, totalMarks: number, label?: string) => Promise<void>;
  deleteScore: (id: string) => Promise<void>;
  getSubjectTotals: () => SubjectTotal[];
  getOverallTotal: () => { totalScore: number; totalMarks: number; percentage: number };
}

export const useTestScoreStore = create<TestScoreState>((set, get) => ({
  scores: [],
  loading: true,

  fetchScores: async () => {
    set({ loading: true });
    const scores = await testScoreService.getAll();
    set({ scores, loading: false });
  },

  addScore: async (subject: string, score: number, totalMarks: number, label?: string) => {
    const newScore: TestScore = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      subject,
      score,
      totalMarks,
      date: new Date().toISOString(),
      label,
    };
    await testScoreService.save(newScore);
    set(state => ({ scores: [...state.scores, newScore] }));
  },

  deleteScore: async (id: string) => {
    await testScoreService.delete(id);
    set(state => ({ scores: state.scores.filter(s => s.id !== id) }));
  },

  getSubjectTotals: () => {
    const { scores } = get();
    const map = new Map<string, { totalScore: number; totalMarks: number; count: number }>();

    for (const s of scores) {
      const existing = map.get(s.subject) || { totalScore: 0, totalMarks: 0, count: 0 };
      existing.totalScore += s.score;
      existing.totalMarks += s.totalMarks;
      existing.count += 1;
      map.set(s.subject, existing);
    }

    return Array.from(map.entries()).map(([subject, data]) => ({
      subject,
      totalScore: data.totalScore,
      totalMarks: data.totalMarks,
      percentage: data.totalMarks > 0 ? Math.round((data.totalScore / data.totalMarks) * 100) : 0,
      count: data.count,
    })).sort((a, b) => b.totalMarks - a.totalMarks);
  },

  getOverallTotal: () => {
    const { scores } = get();
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const totalMarks = scores.reduce((sum, s) => sum + s.totalMarks, 0);
    return {
      totalScore,
      totalMarks,
      percentage: totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0,
    };
  },
}));
