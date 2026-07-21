import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, PiggyBank } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlassCard } from '../../ui/GlassCard';
import { GlassInput } from '../../ui/GlassInput';
import { GlowButton } from '../../ui/GlowButton';
import { useTheme } from '../../../hooks/useTheme';
import { useProfileStore } from '../../../store/useProfileStore';
import { parseCurrencyInput } from '../../../utils/currency';

export const OnboardingBudget = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { profile, updateProfile } = useProfileStore();
  const [monthlyBudget, setMonthlyBudget] = useState(String(profile?.monthlyBudget || '12000'));
  const [savingsGoal, setSavingsGoal] = useState(profile?.savingsGoal ? String(profile.savingsGoal) : '');

  const handleNext = async () => {
    const budget = parseCurrencyInput(monthlyBudget);
    const goal = parseCurrencyInput(savingsGoal);
    if (budget > 0) {
      await updateProfile({
        monthlyBudget: budget,
        savingsGoal: goal,
      });
      navigation.navigate('OnboardingFinal');
    }
  };

  return (
    <AnimatedScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Monthly Student Budget</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Set your monthly allowance so Myst can show realistic spending and savings insights.
              </Text>
            </View>

            <Animated.View entering={FadeInDown.delay(150)}>
              <GlassCard style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.accent}18` }]}>
                  <Wallet size={24} color={colors.accent} />
                </View>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Monthly allowance</Text>
                <Text style={[styles.help, { color: colors.textSecondary }]}>Required</Text>
                <GlassInput
                  placeholder="12000"
                  value={monthlyBudget}
                  onChangeText={setMonthlyBudget}
                  keyboardType="numeric"
                />
              </GlassCard>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(250)}>
              <GlassCard style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.accentSecondary}18` }]}>
                  <PiggyBank size={24} color={colors.accentSecondary} />
                </View>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Savings goal</Text>
                <Text style={[styles.help, { color: colors.textSecondary }]}>Optional monthly target</Text>
                <GlassInput
                  placeholder="2000"
                  value={savingsGoal}
                  onChangeText={setSavingsGoal}
                  keyboardType="numeric"
                />
              </GlassCard>
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            <GlowButton
              label="Continue"
              onPress={handleNext}
              disabled={parseCurrencyInput(monthlyBudget) <= 0}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  card: {
    padding: 18,
    marginBottom: 16,
    borderRadius: 18,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
  },
  help: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 14,
  },
  footer: {
    padding: 30,
    paddingTop: 8,
    marginBottom: 10,
  },
});
