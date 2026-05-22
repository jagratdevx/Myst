import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlowButton } from '../../ui/GlowButton';
import { GlassCard } from '../../ui/GlassCard';
import { useTheme } from '../../../hooks/useTheme';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

const SUBJECT_OPTIONS = [
  'Physics', 'Chemistry', 'Mathematics', 'Biology', 
  'English', 'Computer Science', 'History', 'Economics'
];

export const OnboardingSubjects = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { profile, updateProfile } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(profile?.subjects || []);

  const toggleSubject = (subject: string) => {
    if (selected.includes(subject)) {
      setSelected(selected.filter(s => s !== subject));
    } else {
      setSelected([...selected, subject]);
    }
  };

  const handleNext = async () => {
    if (selected.length > 0) {
      await updateProfile({ subjects: selected });
      navigation.navigate('OnboardingGoals');
    }
  };

  return (
    <AnimatedScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Select Subjects</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Pick the subjects you want to organize study materials for.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {SUBJECT_OPTIONS.map((subject, index) => {
            const isSelected = selected.includes(subject);
            return (
              <Animated.View key={subject} entering={FadeInDown.delay(index * 50)} style={styles.subjectItem}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => toggleSubject(subject)}
                >
                  <GlassCard style={[
                    styles.subjectCard, 
                    isSelected && { borderColor: colors.accent, backgroundColor: `${colors.accent}20` }
                  ]}>
                    <Text style={[
                      styles.subjectText, 
                      { color: isSelected ? colors.accent : colors.textPrimary }
                    ]}>{subject}</Text>
                    {isSelected && <Check size={18} color={colors.accent} />}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  subjectItem: {
    width: '48%',
    marginBottom: 16,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    height: 64,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});
