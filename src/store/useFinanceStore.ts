import { create } from 'zustand';
import { Transaction } from '../types';
import { financeService } from '../services/financeService';
import { financeAnalytics } from '../services/financeAnalytics';
import { profileService } from '../services/profileService';

interface FinanceState {
  transactions: Transaction[];
  loading: boolean;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  spendingPercentage: number;
  monthlyBudget: number;
  savingsGoal: number;
  spendingByCategory: { name: string; amount: number }[];
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  loading: false,
  totalExpenses: 0,
  balance: 0,
  savingsRate: 0,
  spendingPercentage: 0,
  monthlyBudget: 12000,
  savingsGoal: 0,
  spendingByCategory: [],

  fetchTransactions: async () => {
    set({ loading: true });
    const transactions = await financeService.getTransactions();
    const profile = await profileService.getProfile();
    const monthlyBudget = profile?.monthlyBudget || 12000;
    const savingsGoal = profile?.savingsGoal || 0;
    
    const budget = financeAnalytics.getBudgetAnalytics(transactions, monthlyBudget, savingsGoal);
    const spendingByCategory = financeAnalytics.getSpendingByCategory(transactions);

    set({ 
      transactions, 
      totalExpenses: budget.totalExpenses,
      balance: budget.remainingBalance,
      savingsRate: budget.savingsPercentage,
      spendingPercentage: budget.spendingPercentage,
      monthlyBudget,
      savingsGoal,
      spendingByCategory,
      loading: false 
    });
  },

  addTransaction: async (transaction) => {
    const newTransaction = await financeService.addTransaction(transaction);
    const updated = [newTransaction, ...get().transactions];
    const { monthlyBudget, savingsGoal } = get();
    const budget = financeAnalytics.getBudgetAnalytics(updated, monthlyBudget, savingsGoal);
    
    set({ 
      transactions: updated,
      totalExpenses: budget.totalExpenses,
      balance: budget.remainingBalance,
      savingsRate: budget.savingsPercentage,
      spendingPercentage: budget.spendingPercentage,
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  },

  updateTransaction: async (id, updates) => {
    await financeService.updateTransaction(id, updates);
    const updated = get().transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    const { monthlyBudget, savingsGoal } = get();
    const budget = financeAnalytics.getBudgetAnalytics(updated, monthlyBudget, savingsGoal);
    
    set({ 
      transactions: updated,
      totalExpenses: budget.totalExpenses,
      balance: budget.remainingBalance,
      savingsRate: budget.savingsPercentage,
      spendingPercentage: budget.spendingPercentage,
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  },

  deleteTransaction: async (id) => {
    await financeService.deleteTransaction(id);
    const updated = get().transactions.filter(t => t.id !== id);
    const { monthlyBudget, savingsGoal } = get();
    const budget = financeAnalytics.getBudgetAnalytics(updated, monthlyBudget, savingsGoal);
    
    set({ 
      transactions: updated,
      totalExpenses: budget.totalExpenses,
      balance: budget.remainingBalance,
      savingsRate: budget.savingsPercentage,
      spendingPercentage: budget.spendingPercentage,
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  }
}));
