import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassInput } from '../ui/GlassInput';
import { GlowButton } from '../ui/GlowButton';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useProfileStore } from '../../store/useProfileStore';
import { 
  ChevronLeft, 
  Check, 
  Plus, 
  X,
  BookOpen,
  Target,
  User as UserIcon,
  GraduationCap,
  Wallet,
  PiggyBank
} from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { parseCurrencyInput } from '../../utils/currency';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const SUBJECT_OPTIONS = [
  'Physics', 'Chemistry', 'Mathematics', 'Biology', 
  'English', 'Computer Science', 'History', 'Economics'
];

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { contentPadding } = useResponsive();
  const { profile, updateProfile, fetchProfile } = useProfileStore();
  const refreshFinance = useFinanceStore(state => state.fetchTransactions);
  const refreshAnalytics = useAnalyticsStore(state => state.fetchData);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setGrade(profile.grade);
      setMonthlyBudget(String(profile.monthlyBudget || 12000));
      setSavingsGoal(profile.savingsGoal ? String(profile.savingsGoal) : '');
      setSubjects(profile.subjects || []);
      setGoals(profile.goals || []);
    }
  }, [profile]);

  const toggleSubject = useCallback((subject: string) => {
    setSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  }, []);

  const addGoal = useCallback(() => {
    if (newGoal.trim()) {
      setGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal('');
    }
  }, [newGoal]);

  const removeGoal = useCallback((index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    await updateProfile({
      name: name.trim(),
      grade: grade.trim(),
      monthlyBudget: parseCurrencyInput(monthlyBudget),
      savingsGoal: parseCurrencyInput(savingsGoal),
      subjects,
      goals
    });
    await fetchProfile();
    await refreshFinance();
    await refreshAnalytics();
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <AnimatedScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.glass }]}
          >
            <ChevronLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        >
          {/* Basic Info */}
          <SectionHeader title="Basic Information" icon={<UserIcon size={20} color={colors.accent} />} />
          <GlassCard style={styles.sectionCard}>
            <GlassInput 
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              icon={<UserIcon size={18} color={colors.textSecondary} />}
            />
            <View style={{ height: 16 }} />
            <GlassInput 
              label="Class / Grade"
              value={grade}
              onChangeText={setGrade}
              placeholder="e.g. 11th Grade"
              icon={<GraduationCap size={18} color={colors.textSecondary} />}
            />
          </GlassCard>

          {/* Budget */}
          <SectionHeader title="Budget Setup" icon={<Wallet size={20} color={colors.accent} />} />
          <GlassCard style={styles.sectionCard}>
            <GlassInput
              label="Monthly Budget"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              placeholder="12000"
              keyboardType="numeric"
              icon={<Wallet size={18} color={colors.textSecondary} />}
            />
            <View style={{ height: 16 }} />
            <GlassInput
              label="Savings Goal"
              value={savingsGoal}
              onChangeText={setSavingsGoal}
              placeholder="2000"
              keyboardType="numeric"
              icon={<PiggyBank size={18} color={colors.textSecondary} />}
            />
          </GlassCard>

          {/* Subjects */}
          <SectionHeader title="My Subjects" icon={<BookOpen size={20} color={colors.accentSecondary} />} />
          <View style={styles.subjectsGrid}>
            {SUBJECT_OPTIONS.map((subject, index) => {
              const isSelected = subjects.includes(subject);
              return (
                <Animated.View 
                  key={subject} 
                  entering={FadeInRight.delay(index * 50)}
                  style={styles.subjectWrapper}
                >
                  <TouchableOpacity 
                    onPress={() => toggleSubject(subject)}
                    activeOpacity={0.7}
                  >
                    <GlassCard style={[
                      styles.subjectCard,
                      isSelected && { borderColor: colors.accentSecondary, backgroundColor: `${colors.accentSecondary}10` }
                    ]}>
                      <Text style={[
                        styles.subjectText, 
                        { color: isSelected ? colors.accentSecondary : colors.textPrimary }
                      ]}>
                        {subject}
                      </Text>
                      {isSelected && <Check size={16} color={colors.accentSecondary} />}
                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Academic Goals */}
          <SectionHeader title="Academic Goals" icon={<Target size={20} color={colors.accent} />} />
          <GlassCard style={styles.sectionCard}>
            <View style={styles.goalInputRow}>
              <View style={{ flex: 1 }}>
                <GlassInput 
                  value={newGoal}
                  onChangeText={setNewGoal}
                  placeholder="Add a new goal..."
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <TouchableOpacity 
                onPress={addGoal}
                style={[styles.addButton, { backgroundColor: colors.accent }]}
              >
                <Plus color="#FFF" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.goalsList}>
              {goals.map((goal, index) => (
                <View key={index} style={[styles.goalItem, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                  <Text style={[styles.goalText, { color: colors.textPrimary }]}>{goal}</Text>
                  <TouchableOpacity onPress={() => removeGoal(index)}>
                    <X size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
              {goals.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No goals set yet.</Text>
              )}
            </View>
          </GlassCard>

          <View style={styles.footer}>
            <GlowButton 
              label="Save All Changes" 
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scrollContent: {
    paddingTop: 10,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 24,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  subjectWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 50,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  goalsList: {
    marginTop: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    marginTop: 10,
  },
  saveButton: {
    height: 56,
  },
});
