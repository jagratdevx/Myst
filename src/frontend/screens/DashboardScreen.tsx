import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedStatCard } from '../ui/AnimatedStatCard';
import { AnimatedProgressRing } from '../ui/AnimatedProgressRing';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { usePDFStore } from '../../store/usePDFStore';
import { StatItem } from '../components/StatItem';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  Flame,
  FileText,
  ChevronRight
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { aggregateData, loading, fetchData } = useAnalyticsStore();
  const { profile } = useOnboardingStore();
  const { pdfs, fetchPDFs } = usePDFStore();

  useEffect(() => {
    fetchData();
    fetchPDFs();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      fetchPDFs();
    });
    return unsubscribe;
  }, [navigation, fetchData, fetchPDFs]);

  const data = useMemo(() => aggregateData || {
    productivity: { totalFocusTime: 0, focusSessions: 0, streak: 0, taskCompletionRate: 0, completedTasks: 0, totalTasks: 0 },
    finance: { balance: 0, monthlySpending: 0 }
  }, [aggregateData]);

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1) + 'h';
  };

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  }), []);

  if (!aggregateData && loading) {
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
        {/* Header Section */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Hi, {profile?.name?.split(' ')[0] || 'Student'}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>
        </Animated.View>

        {/* Productivity Ring Section */}
        <View style={styles.ringSection}>
          <GlassCard style={[styles.mainRingCard, isTablet && styles.tabletRingCard]}>
            <View style={styles.ringContainer}>
              <AnimatedProgressRing 
                progress={data.productivity.taskCompletionRate / 100} 
                size={isTablet ? 200 : 160} 
                strokeWidth={isTablet ? 18 : 15} 
              />
            </View>
            <View style={styles.ringStats}>
              <StatItem 
                label="Focus Time" 
                value={formatHours(data.productivity.totalFocusTime)} 
                icon={<Clock size={20} color={colors.accentSecondary} />} 
              />
              <StatItem 
                label="Tasks Done" 
                value={`${data.productivity.completedTasks}/${data.productivity.totalTasks}`} 
                icon={<Zap size={20} color={colors.accent} />} 
              />
            </View>
          </GlassCard>
        </View>

        {/* Library Quick Access */}
        <SectionHeader 
          title="Study Library" 
          actionLabel="View All" 
          onActionPress={() => navigation.navigate('Library')}
        />
        <GlassCard style={styles.libraryCard}>
          <View style={styles.libraryRow}>
            <View style={[styles.libIconBox, { backgroundColor: `${colors.accentSecondary}20` }]}>
              <FileText size={24} color={colors.accentSecondary} />
            </View>
            <View style={styles.libInfo}>
              <Text style={[styles.libTitle, { color: colors.textPrimary }]}>{pdfs.length} Documents</Text>
              <Text style={[styles.libSub, { color: colors.textSecondary }]}>Imported study materials</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Library')}>
              <ChevronRight size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Quick Stats Horizontal Scroll */}
        <SectionHeader 
          title="Performance" 
          actionLabel="Details" 
          onActionPress={() => navigation.navigate('Analytics')}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={{ paddingHorizontal: contentPadding }}
        >
          <AnimatedStatCard 
            label="Focus Streak" 
            value={`${data.productivity.streak} Days`}
            icon={<Flame size={20} color={colors.accentSecondary} />}
            delay={300}
          />
          <AnimatedStatCard 
            label="Daily Goal" 
            value={data.productivity.taskCompletionRate > 80 ? 'Met' : 'In Progress'} 
            icon={<Zap size={20} color={colors.success} />}
            delay={400}
          />
          <AnimatedStatCard 
            label="Grade" 
            value={profile?.grade || 'N/A'} 
            icon={<Clock size={20} color={colors.accent} />}
            delay={500}
          />
        </ScrollView>

        {/* Spending Summary */}
        <SectionHeader 
          title="Finance" 
          actionLabel="View Budget" 
          onActionPress={() => navigation.navigate('Finance')}
        />
        <GlassCard style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View>
              <Text style={[styles.financeLabel, { color: colors.textSecondary }]}>Remaining Balance</Text>
              <Text style={[styles.financeValue, { color: colors.textPrimary }]}>${data.finance.balance.toFixed(2)}</Text>
            </View>
            <View style={[styles.financeTrend, { backgroundColor: `${colors.accent}20` }]}>
              <Text style={[styles.trendText, { color: colors.accent }]}>Local Vault</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  ringSection: {
    marginTop: 24,
  },
  mainRingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'space-between',
  },
  tabletRingCard: {
    padding: 40,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringMainValue: {
    fontWeight: '800',
  },
  ringSubValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  ringStats: {
    flex: 1,
    marginLeft: 24,
    justifyContent: 'center',
  },
  libraryCard: {
    padding: 16,
  },
  libraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  libInfo: {
    flex: 1,
  },
  libTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  libSub: {
    fontSize: 12,
    marginTop: 2,
  },
  statsScroll: {
    marginHorizontal: -40,
  },
  financeCard: {
    padding: 20,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  financeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  financeValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  financeTrend: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
