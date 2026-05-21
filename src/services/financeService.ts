import { financeStorage } from './financeStorage';
import { Transaction } from '../types';

export const financeService = {
  getTransactions: async (): Promise<Transaction[]> => {
    return await financeStorage.getTransactions();
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
    const transactions = await financeStorage.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now()
    };
    transactions.unshift(newTransaction);
    await financeStorage.saveTransactions(transactions);
    return newTransaction;
  },

  updateTransaction: async (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<void> => {
    const transactions = await financeStorage.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      await financeStorage.saveTransactions(transactions);
    }
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const transactions = await financeStorage.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    await financeStorage.saveTransactions(filteredTransactions);
  }
};
