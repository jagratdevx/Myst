import { Transaction } from '../types';

export const financeAnalytics = {
  getSpendingByCategory: (transactions: Transaction[]) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};

    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories).map(([name, amount]) => ({
      name,
      amount,
    })).sort((a, b) => b.amount - a.amount);
  },

  getTotalIncome: (transactions: Transaction[]) => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpenses: (transactions: Transaction[]) => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getBalance: (transactions: Transaction[]) => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  },

  getSavingsRate: (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome === 0) return 0;
    const savings = totalIncome - totalExpenses;
    return Math.max(0, (savings / totalIncome) * 100);
  },

  getWeeklyTrends: (transactions: Transaction[]) => {
    // Group last 7 days spending
    const last7Days: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days[dateStr] = 0;
    }

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        // Mock date string parsing for now as we use 'Today' string in some places
        // In real app we would use timestamps
        const dateStr = new Date(t.createdAt).toISOString().split('T')[0];
        if (last7Days[dateStr] !== undefined) {
          last7Days[dateStr] += t.amount;
        }
      });

    return Object.values(last7Days);
  }
};
