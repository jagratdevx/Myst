import { Transaction } from '../types';

export interface BudgetAnalytics {
  monthlyBudget: number;
  savingsGoal: number;
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  spendingPercentage: number;
  savingsPercentage: number;
}

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

  getBudgetAnalytics: (
    transactions: Transaction[],
    monthlyBudget = 12000,
    savingsGoal = 0
  ): BudgetAnalytics => {
    const totalIncome = financeAnalytics.getTotalIncome(transactions);
    const totalExpenses = financeAnalytics.getTotalExpenses(transactions);
    const availableFunds = monthlyBudget + totalIncome;
    const remainingBalance = availableFunds - totalExpenses;
    const spendingPercentage = monthlyBudget > 0
      ? Math.min(100, (totalExpenses / monthlyBudget) * 100)
      : 0;
    const savingsPercentage = savingsGoal > 0
      ? Math.min(100, Math.max(0, (remainingBalance / savingsGoal) * 100))
      : Math.max(0, monthlyBudget > 0 ? (remainingBalance / monthlyBudget) * 100 : 0);

    return {
      monthlyBudget,
      savingsGoal,
      totalIncome,
      totalExpenses,
      remainingBalance,
      spendingPercentage,
      savingsPercentage,
    };
  },

  getSavingsRate: (
    transactions: Transaction[],
    monthlyBudget = 12000,
    savingsGoal = 0
  ) => {
    return financeAnalytics.getBudgetAnalytics(transactions, monthlyBudget, savingsGoal).savingsPercentage;
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
