import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedBarChart, AnimatedLineChart } from '../ui/ChartComponents';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { usePDFStore } from '../../store/usePDFStore';
import { 
  TrendingUp, 
  Target, 
  Clock,
  BookOpen,
  FileText,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Languages,
  Cpu,
  History as HistoryIcon,
  Coins
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { formatCurrency } from '../../utils/currency';

export const AnalyticsScreen = () => {
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { aggregateData, focusDistribution, loading, fetchData } = useAnalyticsStore();
  const { pdfs } = usePDFStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = useMemo(() => aggregateData || {
    productivity: { totalFocusTime: 0, focusSessions: 0, streak: 0, taskCompletionRate: 0, completedTasks: 0, totalTasks: 0, subjectMastery: [] },
    finance: { balance: 0, monthlySpending: 0, monthlyBudget: 12000, savingsGoal: 0, savingsPercentage: 0, spendingPercentage: 0 }
  }, [aggregateData]);

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(0) + 'h';
  };

  if (loading && !aggregateData) {
    return (
      <AnimatedScreenWrapper style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </AnimatedScreenWrapper>
    );
  }

  return (
    <AnimatedScreenWrapper>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>Academic Insights</Text>

        {/* Productivity Score Trend */}
        <SectionHeader title="Productivity Score" actionLabel="Weekly" />
        <GlassCard style={styles.mainChartCard}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Efficiency Rating</Text>
              <Text style={[styles.scoreValue, { color: colors.textPrimary }]}>{Math.round(data.productivity.taskCompletionRate)}%</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: `${colors.success}20` }]}>
              <TrendingUp size={16} color={colors.success} />
              <Text style={[styles.trendText, { color: colors.success }]}>Stable</Text>
            </View>
          </View>
          <AnimatedLineChart data={[60, 75, 70, 85, 80, Math.round(data.productivity.taskCompletionRate)]} height={120} color={colors.accentSecondary} />
        </GlassCard>

        {/* Focus Hours Breakdown */}
        <SectionHeader title="Focus Distribution" />
        <GlassCard style={styles.barChartCard}>
          <AnimatedBarChart 
            data={focusDistribution} 
            labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            height={isTablet ? 200 : 150}
            color={colors.accent}
          />
        </GlassCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <AnalyticsStatBox 
            icon={<Clock size={20} color={colors.accent} />}
            label="Total Focus"
            value={formatHours(data.productivity.totalFocusTime)}
            sub="Lifetime"
          />
          <AnalyticsStatBox 
            icon={<FileText size={20} color={colors.accentSecondary} />}
            label="Library"
            value={`${pdfs.length}`}
            sub="Study Materials"
            delay={400}
          />
        </View>

        <SectionHeader title="Budget Health" />
        <View style={styles.statsGrid}>
          <AnalyticsStatBox
            icon={<Coins size={20} color={colors.success} />}
            label="Balance"
            value={formatCurrency(data.finance.balance)}
            sub={`${data.finance.spendingPercentage.toFixed(0)}% spent`}
            delay={500}
          />
          <AnalyticsStatBox
            icon={<Target size={20} color={colors.accentSecondary} />}
            label="Savings"
            value={`${data.finance.savingsPercentage.toFixed(0)}%`}
            sub={data.finance.savingsGoal > 0 ? `${formatCurrency(data.finance.savingsGoal)} goal` : 'No goal set'}
            delay={600}
          />
        </View>

        {/* Subject Performance Heatmap */}
        <SectionHeader title="Subject Mastery" />
        <GlassCard style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {(data.productivity.subjectMastery || []).length > 0 ? (
              data.productivity.subjectMastery.map((item: any) => (
                <HeatmapItem key={item.label} label={item.label} progress={item.progress} />
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No mastery data available yet.</Text>
            )}
          </View>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </AnimatedScreenWrapper>
  );
};

const AnalyticsStatBox = React.memo(({ icon, label, value, sub, delay = 300 }: any) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.statBoxWrapper}>
      <GlassCard style={styles.statBox}>
        <View style={[styles.statIcon, { backgroundColor: colors.glass }]}>{icon}</View>
        <Text style={[styles.statBoxValue, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.statBoxLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.statBoxSub, { color: colors.textSecondary, opacity: 0.6 }]}>{sub}</Text>
      </GlassCard>
    </Animated.View>
  );
});

const HeatmapItem = React.memo(({ label, progress }: any) => {
  const { colors } = useTheme();
  
  const getSubjectIcon = (label: string) => {
    const l = label.toUpperCase();
    if (l.includes('PHY')) return <Atom size={18} color="#FFF" />;
    if (l.includes('CHE')) return <FlaskConical size={18} color="#FFF" />;
    if (l.includes('MAT')) return <Calculator size={18} color="#FFF" />;
    if (l.includes('BIO')) return <Dna size={18} color="#FFF" />;
    if (l.includes('ENG')) return <Languages size={18} color="#FFF" />;
    if (l.includes('COM') || l.includes('CS')) return <Cpu size={18} color="#FFF" />;
    if (l.includes('HIS')) return <HistoryIcon size={18} color="#FFF" />;
    if (l.includes('ECO')) return <Coins size={18} color="#FFF" />;
    return <BookOpen size={18} color="#FFF" />;
  };

  return (
    <View style={styles.heatmapItem}>
      <View style={[
        styles.heatmapBox, 
        { 
          opacity: 0.3 + (progress || 0) * 0.7, 
          backgroundColor: colors.accent 
        }
      ]}>
        {getSubjectIcon(label)}
      </View>
      <Text style={[styles.heatmapLabel, { color: colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.heatmapPercent, { color: colors.textSecondary }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainChartCard: {
    padding: 20,
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  barChartCard: {
    padding: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBoxWrapper: {
    width: '48%',
  },
  statBox: {
    padding: 16,
  },
  statIcon: {
    marginBottom: 12,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statBoxLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  statBoxSub: {
    fontSize: 11,
    marginTop: 2,
  },
  heatmapCard: {
    padding: 24,
    marginBottom: 24,
  },
  heatmapGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  heatmapItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  heatmapBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heatmapLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  heatmapPercent: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
    padding: 20,
  }
});
