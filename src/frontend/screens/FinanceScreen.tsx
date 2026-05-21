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
  ArrowUpRight
} from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { TransactionItem } from '../components/TransactionItem';
import { Transaction } from '../../types';

const INITIAL_ALLOWANCE = 800;

export const FinanceScreen = () => {
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { 
    transactions, 
    loading, 
    totalExpenses, 
    balance, 
    savingsRate,
    spendingByCategory, 
    fetchTransactions,
    deleteTransaction
  } = useFinanceStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const progressPercent = useMemo(() => Math.max(0, (INITIAL_ALLOWANCE - totalExpenses) / INITIAL_ALLOWANCE), [totalExpenses]);

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
      {/* Allowance Header */}
      <View style={styles.headerArea}>
        <GlassCard style={styles.allowanceCard}>
          <View style={styles.allowanceInfo}>
            <Text style={[styles.allowanceLabel, { color: colors.textSecondary }]}>Remaining Balance</Text>
            <Text style={[styles.allowanceValue, { color: colors.textPrimary }]}>${balance.toFixed(2)}</Text>
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
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>${totalExpenses.toFixed(2)}</Text>
        </GlassCard>
        <GlassCard style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Budget</Text>
          <Text style={[styles.statValue, { color: colors.accentSecondary }]}>${INITIAL_ALLOWANCE}</Text>
        </GlassCard>
      </View>

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
  ), [colors, balance, savingsRate, progressPercent, isTablet, totalExpenses, spendingByCategory]);

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
    paddingTop: 20,
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
    marginBottom: 24,
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
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
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
