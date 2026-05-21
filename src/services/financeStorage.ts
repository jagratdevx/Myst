import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const FINANCE_TRANSACTIONS_KEY = '@myst_finance_transactions';

export const financeStorage = {
  saveTransactions: async (transactions: Transaction[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(FINANCE_TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },

  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const transactionsJson = await AsyncStorage.getItem(FINANCE_TRANSACTIONS_KEY);
      return transactionsJson ? JSON.parse(transactionsJson) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }
};
