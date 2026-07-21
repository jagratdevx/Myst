import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlowButton } from '../../ui/GlowButton';
import { GlassCard } from '../../ui/GlassCard';
import { useTheme } from '../../../hooks/useTheme';
import { useProfileStore } from '../../../store/useProfileStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

const GOAL_OPTIONS = [
  'Academic Excellence', 'Perfect Attendance', 'Exam Preparation', 
  'Skill Development', 'Time Management', 'Higher Education'
];

export const OnboardingGoals = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { profile, updateProfile } = useProfileStore();
  const [selected, setSelected] = useState<string[]>(profile?.goals || []);

  const toggleGoal = (goal: string) => {
    if (selected.includes(goal)) {
      setSelected(selected.filter(g => g !== goal));
    } else {
      setSelected([...selected, goal]);
    }
  };

  const handleNext = async () => {
    if (selected.length > 0) {
      await updateProfile({ goals: selected });
      navigation.navigate('OnboardingBudget');
    }
  };

  return (
    <AnimatedScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Academic Goals</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            What do you want to achieve with Myst?
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {GOAL_OPTIONS.map((goal, index) => {
            const isSelected = selected.includes(goal);
            return (
              <Animated.View key={goal} entering={FadeInDown.delay(index * 100)}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => toggleGoal(goal)}
                >
                  <GlassCard style={[
                    styles.goalCard, 
                    isSelected && { borderColor: colors.accentSecondary, backgroundColor: `${colors.accentSecondary}20` }
                  ]}>
                    <Text style={[
                      styles.goalText, 
                      { color: isSelected ? colors.accentSecondary : colors.textPrimary }
                    ]}>{goal}</Text>
                  </GlassCard>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <GlowButton 
            label="Continue" 
            onPress={handleNext}
            disabled={selected.length === 0}
          />
        </View>
      </View>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  list: {
    gap: 16,
    paddingBottom: 40,
  },
  goalCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});
