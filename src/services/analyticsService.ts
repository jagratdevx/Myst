import { focusService } from './focusService';
import { plannerService } from './plannerService';
import { financeService } from './financeService';
import { financeAnalytics } from './financeAnalytics';
import { profileService } from './profileService';

export const analyticsService = {
  getAggregateData: async () => {
    const focusStats = await focusService.getStats();
    const tasks = await plannerService.getTasks();
    const transactions = await financeService.getTransactions();
    const profile = await profileService.getProfile();

    const completedTasks = tasks.filter(t => t.completed).length;
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const balance = financeAnalytics.getBalance(transactions);
    const monthlySpending = financeAnalytics.getTotalExpenses(transactions);

    // Subject Mastery logic - Use real selected subjects
    const subjects = profile?.subjects || [];
    const subjectMastery = subjects.map(s => {
      const subjectTasks = tasks.filter(t => t.subject === s);
      const completedSubjectTasks = subjectTasks.filter(t => t.completed).length;
      const progress = subjectTasks.length > 0 ? completedSubjectTasks / subjectTasks.length : 0;
      return { label: s.substring(0, 3).toUpperCase(), progress };
    });

    return {
      productivity: {
        totalFocusTime: focusStats.totalFocusTime,
        focusSessions: focusStats.totalSessions,
        streak: focusStats.streakDays,
        taskCompletionRate,
        completedTasks,
        totalTasks: tasks.length,
        subjectMastery,
      },
      finance: {
        balance,
        monthlySpending,
      }
    };
  },

  getWeeklyFocusDistribution: async () => {
    const sessions = await focusService.getRecentSessions();
    const distribution = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    
    sessions.forEach(s => {
      const date = new Date(s.startTime);
      const day = (date.getDay() + 6) % 7; // Convert Sun-Sat to Mon-Sun
      distribution[day] += s.duration / 3600; // hours
    });

    return distribution;
  }
};
