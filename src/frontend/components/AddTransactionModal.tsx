import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { GlassModal } from '../ui/GlassModal';
import { GlassInput } from '../ui/GlassInput';
import { GlowButton } from '../ui/GlowButton';
import { useTheme } from '../../hooks/useTheme';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Transaction } from '../../types';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const CATEGORIES = ['Food', 'Travel', 'Stationery', 'Subscriptions', 'Entertainment', 'Shopping', 'Other'];

export const AddTransactionModal = ({ visible, onClose, editingTransaction }: AddTransactionModalProps) => {
  const { colors } = useTheme();
  const { addTransaction, updateTransaction } = useFinanceStore();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (visible) {
      if (editingTransaction) {
        setTitle(editingTransaction.title);
        setAmount(editingTransaction.amount.toString());
        setCategory(editingTransaction.category);
        setType(editingTransaction.type);
      } else {
        setTitle('');
        setAmount('');
        setCategory(CATEGORIES[0]);
        setType('expense');
      }
    }
  }, [visible, editingTransaction]);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (!title || isNaN(numAmount)) {
      Alert.alert("Error", "Please enter a valid title and amount.");
      return;
    }

    const data = {
      title,
      amount: numAmount,
      category,
      date: editingTransaction ? editingTransaction.date : new Date().toLocaleDateString(),
      type,
    };

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }

    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.typeContainer, { backgroundColor: colors.glass }]}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'expense' && { backgroundColor: `${colors.error}20` }
            ]}
            onPress={() => setType('expense')}
          >
            <Text style={[
              styles.typeText, 
              { color: colors.textSecondary },
              type === 'expense' && { color: colors.error }
            ]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'income' && { backgroundColor: `${colors.success}20` }
            ]}
            onPress={() => setType('income')}
          >
            <Text style={[
              styles.typeText, 
              { color: colors.textSecondary },
              type === 'income' && { color: colors.success }
            ]}>Income</Text>
          </TouchableOpacity>
        </View>

        <GlassInput 
          label="Title"
          placeholder="e.g. Campus Lunch"
          value={title}
          onChangeText={setTitle}
        />

        <GlassInput 
          label="Amount (₹)"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {CATEGORIES.map(c => (
            <TouchableOpacity 
              key={c} 
              style={[
                styles.chip, 
                { backgroundColor: colors.glass, borderColor: colors.border },
                category === c && { backgroundColor: `${colors.accent}20`, borderColor: colors.accent }
              ]}
              onPress={() => setCategory(c)}
            >
              <Text style={[
                styles.chipText, 
                { color: colors.textSecondary },
                category === c && { color: colors.textPrimary }
              ]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <GlowButton 
            title={editingTransaction ? "Save Changes" : `Add ${type === 'expense' ? 'Expense' : 'Income'}`} 
            onPress={handleSubmit} 
            color={type === 'expense' ? colors.error : colors.success} 
          />
        </View>
      </ScrollView>
    </GlassModal>
  );
};

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  chipScroll: {
    marginBottom: 30,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    marginTop: 10,
    marginBottom: 20,
  },
});
