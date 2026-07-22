import React, { useEffect, useMemo, useCallback } from 'react';
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
import { useProfileStore } from '../../store/useProfileStore';
import { usePDFStore } from '../../store/usePDFStore';
import { usePlannerStore } from '../../store/usePlannerStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { StatItem } from '../components/StatItem';
import { Zap, Clock, Flame, FileText, ChevronRight, Brain, Trophy, Sparkles, BookOpen } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { formatCurrency } from '../../utils/currency';

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { aggregateData, loading, fetchData } = useAnalyticsStore();
  const { profile, fetchProfile } = useProfileStore();
  const { pdfs, fetchPDFs } = usePDFStore();
  const { tasks, fetchTasks } = usePlannerStore();
  const gamification = useGamificationStore();

  useEffect(() => {
    fetchData();
    fetchProfile();
    fetchPDFs();
    fetchTasks();
    gamification.fetchData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      fetchProfile();
      fetchPDFs();
      fetchTasks();
      gamification.fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const data = useMemo(() => aggregateData || {
    productivity: { totalFocusTime: 0, focusSessions: 0, streak: 0, taskCompletionRate: 0, completedTasks: 0, totalTasks: 0 },
    finance: { balance: 0, monthlySpending: 0, monthlyBudget: 12000, savingsGoal: 0, savingsPercentage: 0, spendingPercentage: 0 }
  }, [aggregateData]);

  const formatHours = (seconds: number) => (seconds / 3600).toFixed(1) + 'h';

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }), []);

  const todayTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.deadline === todayStr);
  }, [tasks]);

  const incompleteTodayTasks = todayTasks.filter(t => !t.completed);

  const levelProgress = gamification.xpToNextLevel > 0 ? gamification.xp / gamification.xpToNextLevel : 0;

  const recentBadges = gamification.badges.slice(-3);

  const handleGenerateStudyPlan = useCallback(() => {
    navigation.navigate('Chat');
    setTimeout(() => {
      const { sendMessage } = require('../../store/useChatStore').useChatStore.getState();
      sendMessage('Create a personalized study plan for me based on my current tasks, test scores, and focus stats.');
    }, 500);
  }, [navigation]);

  if (!aggregateData && loading) {
    return (
      <AnimatedScreenWrapper style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </AnimatedScreenWrapper>
    );
  }

  return (
    <AnimatedScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}>
        <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Hi, {profile?.name?.split(' ')[0] || 'Student'}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(250)}>
          <GlassCard style={styles.xpCard}>
            <View style={styles.xpRow}>
              <View style={[styles.xpIconBox, { backgroundColor: `${colors.accentSecondary}20` }]}>
                <Trophy size={24} color={colors.accentSecondary} />
              </View>
              <View style={styles.xpInfo}>
                <Text style={[styles.xpLevel, { color: colors.textPrimary }]}>Level {gamification.level}</Text>
                <Text style={[styles.xpText, { color: colors.textSecondary }]}>{gamification.xp} / {gamification.xpToNextLevel} XP</Text>
                <View style={[styles.xpBar, { backgroundColor: colors.border }]}>
                  <View style={[styles.xpFill, { width: `${Math.min(100, levelProgress * 100)}%`, backgroundColor: colors.accentSecondary }]} />
                </View>
              </View>
              <View style={styles.xpBadges}>
                {recentBadges.map(b => (
                  <Text key={b.id} style={styles.badgeIcon}>{b.icon}</Text>
                ))}
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={styles.ringSection}>
          <GlassCard style={[styles.mainRingCard, isTablet && styles.tabletRingCard]}>
            <View style={styles.ringContainer}>
              <AnimatedProgressRing progress={data.productivity.taskCompletionRate / 100} size={isTablet ? 200 : 160} strokeWidth={isTablet ? 18 : 15} />
            </View>
            <View style={styles.ringStats}>
              <StatItem label="Focus Time" value={formatHours(data.productivity.totalFocusTime)} icon={<Clock size={20} color={colors.accentSecondary} />} />
              <StatItem label="Tasks Done" value={`${data.productivity.completedTasks}/${data.productivity.totalTasks}`} icon={<Zap size={20} color={colors.accent} />} />
              <StatItem label="Focus Streak" value={`${data.productivity.streak} days`} icon={<Flame size={20} color="#F97316" />} />
            </View>
          </GlassCard>
        </View>

        {incompleteTodayTasks.length > 0 && (
          <>
            <SectionHeader title="Today's Tasks" actionLabel="View All" onActionPress={() => navigation.navigate('Planner')} />
            <GlassCard style={styles.taskCard}>
              {incompleteTodayTasks.slice(0, 4).map(t => (
                <View key={t.id} style={[styles.taskRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.taskPriority, { backgroundColor: t.priority === 'High' ? '#F87171' : t.priority === 'Medium' ? '#FBBF24' : '#4ADE80' }]} />
                  <Text style={[styles.taskTitle, { color: colors.textPrimary }]} numberOfLines={1}>{t.title}</Text>
                  <Text style={[styles.taskSubject, { color: colors.textSecondary }]}>{t.subject}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        <SectionHeader title="Study Library" actionLabel="View All" onActionPress={() => navigation.navigate('Library')} />
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

        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${colors.accent}15` }]} onPress={handleGenerateStudyPlan} activeOpacity={0.7}>
            <Brain size={22} color={colors.accent} />
            <Text style={[styles.actionLabel, { color: colors.accent }]}>Study Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${colors.accentSecondary}15` }]} onPress={() => navigation.navigate('Focus')} activeOpacity={0.7}>
            <Clock size={22} color={colors.accentSecondary} />
            <Text style={[styles.actionLabel, { color: colors.accentSecondary }]}>Focus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${colors.success}15` }]} onPress={() => navigation.navigate('Planner')} activeOpacity={0.7}>
            <BookOpen size={22} color={colors.success} />
            <Text style={[styles.actionLabel, { color: colors.success }]}>Planner</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="Performance" actionLabel="Details" onActionPress={() => navigation.navigate('Analytics')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={{ paddingHorizontal: contentPadding }}>
          <AnimatedStatCard label="Focus Streak" value={`${data.productivity.streak} Days`} icon={<Flame size={20} color={colors.accentSecondary} />} delay={300} />
          <AnimatedStatCard label="Daily Goal" value={data.productivity.taskCompletionRate > 80 ? 'Met' : 'In Progress'} icon={<Zap size={20} color={colors.success} />} delay={400} />
          <AnimatedStatCard label="Grade" value={profile?.grade || 'N/A'} icon={<Sparkles size={20} color={colors.accentSecondary} />} delay={500} />
        </ScrollView>

        <SectionHeader title="Finance" actionLabel="View Budget" onActionPress={() => navigation.navigate('Finance')} />
        <GlassCard style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View>
              <Text style={[styles.financeLabel, { color: colors.textSecondary }]}>Remaining Balance</Text>
              <Text style={[styles.financeValue, { color: colors.textPrimary }]}>{formatCurrency(data.finance.balance)}</Text>
              <Text style={[styles.financeMeta, { color: colors.textSecondary }]}>
                {data.finance.spendingPercentage.toFixed(0)}% spent | {data.finance.savingsPercentage.toFixed(0)}% savings
              </Text>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 10 },
  headerContainer: { alignItems: 'center', marginBottom: 10 },
  greeting: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  date: { fontSize: 16, marginTop: 4, fontWeight: '500', textAlign: 'center' },
  xpCard: { padding: 16, marginTop: 12 },
  xpRow: { flexDirection: 'row', alignItems: 'center' },
  xpIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  xpInfo: { flex: 1 },
  xpLevel: { fontSize: 18, fontWeight: '800' },
  xpText: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  xpBar: { height: 6, borderRadius: 3, marginTop: 6 },
  xpFill: { height: 6, borderRadius: 3 },
  xpBadges: { flexDirection: 'row', marginLeft: 8, gap: 2 },
  badgeIcon: { fontSize: 22 },
  ringSection: { marginTop: 16 },
  mainRingCard: { flexDirection: 'row', alignItems: 'center', padding: 24, justifyContent: 'space-between' },
  tabletRingCard: { padding: 40 },
  ringContainer: { alignItems: 'center', justifyContent: 'center' },
  ringStats: { flex: 1, marginLeft: 24, justifyContent: 'center' },
  taskCard: { padding: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 0.5 },
  taskPriority: { width: 6, height: 6, borderRadius: 3, marginRight: 10 },
  taskTitle: { flex: 1, fontSize: 14, fontWeight: '600' },
  taskSubject: { fontSize: 12, fontWeight: '500', marginLeft: 8 },
  libraryCard: { padding: 16 },
  libraryRow: { flexDirection: 'row', alignItems: 'center' },
  libIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  libInfo: { flex: 1 },
  libTitle: { fontSize: 16, fontWeight: '700' },
  libSub: { fontSize: 12, marginTop: 2 },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 6 },
  actionLabel: { fontSize: 13, fontWeight: '700' },
  statsScroll: { marginHorizontal: -40 },
  financeCard: { padding: 20 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  financeLabel: { fontSize: 14, fontWeight: '600' },
  financeValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  financeMeta: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  financeTrend: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  trendText: { fontSize: 12, fontWeight: '700' },
});
