import { create } from 'zustand';
import { Transaction } from '../types';
import { financeService } from '../services/financeService';
import { financeAnalytics } from '../services/financeAnalytics';

interface FinanceState {
  transactions: Transaction[];
  loading: boolean;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
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
  spendingByCategory: [],

  fetchTransactions: async () => {
    set({ loading: true });
    const transactions = await financeService.getTransactions();
    
    // Calculate derived data
    const totalExpenses = financeAnalytics.getTotalExpenses(transactions);
    const balance = financeAnalytics.getBalance(transactions);
    const savingsRate = financeAnalytics.getSavingsRate(transactions, 800); // 800 is mock allowance
    const spendingByCategory = financeAnalytics.getSpendingByCategory(transactions);

    set({ 
      transactions, 
      totalExpenses, 
      balance, 
      savingsRate,
      spendingByCategory,
      loading: false 
    });
  },

  addTransaction: async (transaction) => {
    const newTransaction = await financeService.addTransaction(transaction);
    const updated = [newTransaction, ...get().transactions];
    
    set({ 
      transactions: updated,
      totalExpenses: financeAnalytics.getTotalExpenses(updated),
      balance: financeAnalytics.getBalance(updated),
      savingsRate: financeAnalytics.getSavingsRate(updated, 800),
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  },

  updateTransaction: async (id, updates) => {
    await financeService.updateTransaction(id, updates);
    const updated = get().transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    
    set({ 
      transactions: updated,
      totalExpenses: financeAnalytics.getTotalExpenses(updated),
      balance: financeAnalytics.getBalance(updated),
      savingsRate: financeAnalytics.getSavingsRate(updated, 800),
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  },

  deleteTransaction: async (id) => {
    await financeService.deleteTransaction(id);
    const updated = get().transactions.filter(t => t.id !== id);
    
    set({ 
      transactions: updated,
      totalExpenses: financeAnalytics.getTotalExpenses(updated),
      balance: financeAnalytics.getBalance(updated),
      savingsRate: financeAnalytics.getSavingsRate(updated, 800),
      spendingByCategory: financeAnalytics.getSpendingByCategory(updated),
    });
  }
}));
