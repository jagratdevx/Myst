import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedBarChart } from '../ui/ChartComponents';
import { AnimatedProgressRing } from '../ui/AnimatedProgressRing';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { 
  ArrowDownRight, 
  Utensils, 
  Bus, 
  PenTool, 
  ShoppingBag,
  Repeat,
  ArrowUpRight,
  PiggyBank
} from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { TransactionItem } from '../components/TransactionItem';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';

export const FinanceScreen = () => {
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { 
    transactions, 
    loading, 
    totalExpenses, 
    balance, 
    savingsRate,
    spendingPercentage,
    monthlyBudget,
    savingsGoal,
    spendingByCategory, 
    fetchTransactions,
    deleteTransaction
  } = useFinanceStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const progressPercent = useMemo(() => Math.max(0, 1 - (spendingPercentage / 100)), [spendingPercentage]);

  const getCategoryIcon = useCallback((category: string) => {
    switch(category) {
      case 'Food': return <Utensils size={18} color="#FF6B6B" />;
      case 'Travel': return <Bus size={18} color="#4DABF7" />;
      case 'Stationery': return <PenTool size={18} color="#FCC419" />;
      case 'Subscriptions': return <Repeat size={18} color={colors.accentSecondary} />;
      default: return <ShoppingBag size={18} color={colors.accent} />;
    }
  }, [colors]);

  const handleEdit = useCallback((item: Transaction) => {
    setEditingTransaction(item);
    setModalVisible(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingTransaction(null);
    setModalVisible(true);
  }, []);

  const ListHeader = useMemo(() => (
    <View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Finance Vault</Text>
      {/* Allowance Header */}
      <View style={styles.headerArea}>
        <GlassCard style={styles.allowanceCard}>
          <View style={styles.allowanceInfo}>
            <Text style={[styles.allowanceLabel, { color: colors.textSecondary }]}>Remaining Balance</Text>
            <Text style={[styles.allowanceValue, { color: colors.textPrimary }]}>{formatCurrency(balance)}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.trendBadge, { backgroundColor: balance >= 0 ? `${colors.success}20` : `${colors.error}20` }]}>
                {balance >= 0 ? <ArrowUpRight size={14} color={colors.success} /> : <ArrowDownRight size={14} color={colors.error} />}
                <Text style={[styles.trendText, { color: balance >= 0 ? colors.success : colors.error }]}>
                  {balance >= 0 ? 'Surplus' : 'Deficit'}
                </Text>
              </View>
              <View style={[styles.trendBadge, { marginLeft: 8, backgroundColor: `${colors.accent}20` }]}>
                <Text style={[styles.trendText, { color: colors.accent }]}>
                  {savingsRate.toFixed(0)}% Savings
                </Text>
              </View>
            </View>
          </View>
          <AnimatedProgressRing 
            progress={progressPercent} 
            size={isTablet ? 140 : 100} 
            strokeWidth={isTablet ? 12 : 10} 
            color={colors.accent} 
          />
        </GlassCard>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <GlassCard style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Monthly Spent</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatCurrency(totalExpenses)}</Text>
          <Text style={[styles.statMeta, { color: colors.textSecondary }]}>{spendingPercentage.toFixed(0)}% of budget</Text>
        </GlassCard>
        <GlassCard style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Budget</Text>
          <Text style={[styles.statValue, { color: colors.accentSecondary }]}>{formatCurrency(monthlyBudget)}</Text>
          <Text style={[styles.statMeta, { color: colors.textSecondary }]}>Monthly allowance</Text>
        </GlassCard>
      </View>

      <GlassCard style={styles.savingsCard}>
        <View style={[styles.savingsIcon, { backgroundColor: `${colors.success}18` }]}>
          <PiggyBank size={20} color={colors.success} />
        </View>
        <View style={styles.savingsText}>
          <Text style={[styles.savingsTitle, { color: colors.textPrimary }]}>Savings Goal</Text>
          <Text style={[styles.savingsSub, { color: colors.textSecondary }]}>
            {savingsGoal > 0 ? `${formatCurrency(savingsGoal)} target this month` : 'Set a target in Edit Profile'}
          </Text>
        </View>
        <Text style={[styles.savingsPercent, { color: colors.success }]}>{savingsRate.toFixed(0)}%</Text>
      </GlassCard>

      {/* Spending Analytics */}
      <SectionHeader title="Category Breakdown" actionLabel="Details" />
      <GlassCard style={styles.chartCard}>
        {spendingByCategory.length > 0 ? (
          <AnimatedBarChart 
            data={spendingByCategory.slice(0, 6).map(c => c.amount)} 
            labels={spendingByCategory.slice(0, 6).map(c => c.name.substring(0, 3))}
            height={isTablet ? 200 : 150}
            color={colors.accent}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Add transactions to see analytics</Text>
          </View>
        )}
      </GlassCard>

      {/* Transaction History */}
      <SectionHeader title="Recent Transactions" actionLabel="See All" />
    </View>
  ), [colors, balance, savingsRate, progressPercent, isTablet, totalExpenses, spendingByCategory, monthlyBudget, savingsGoal, spendingPercentage]);

  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {loading ? "Loading transactions..." : "No transactions recorded."}
      </Text>
    </View>
  ), [colors, loading]);

  return (
    <AnimatedScreenWrapper>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TransactionItem 
            item={item} 
            index={index} 
            getCategoryIcon={getCategoryIcon} 
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
      
      <FloatingActionButton onPress={handleAddNew} />
      <AddTransactionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        editingTransaction={editingTransaction}
      />
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerArea: {
    marginBottom: 20,
  },
  allowanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  allowanceInfo: {
    flex: 1,
  },
  allowanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  allowanceValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  badgeRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  statMeta: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  savingsCard: {
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  savingsText: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  savingsSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  savingsPercent: {
    fontSize: 18,
    fontWeight: '900',
  },
  chartCard: {
    padding: 20,
    paddingBottom: 10,
    marginBottom: 24,
  },
  emptyChart: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
