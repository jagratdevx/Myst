import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlowButton } from '../../ui/GlowButton';
import { GlassCard } from '../../ui/GlassCard';
import { useTheme } from '../../../hooks/useTheme';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Moon, Sun, CheckCircle } from 'lucide-react-native';

export const OnboardingFinal = () => {
  const { colors, theme, setTheme } = useTheme();
  const { completeOnboarding } = useOnboardingStore();

  const handleFinish = async () => {
    await completeOnboarding();
    // RootNavigator will re-render and show the main app
  };

  return (
    <AnimatedScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Animated.View entering={ZoomIn.delay(200)} style={styles.successIcon}>
          <CheckCircle size={64} color={colors.success} />
        </Animated.View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>You're all set!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          One last thing: choose your preferred appearance.
        </Text>
      </View>

      <View style={styles.themeToggle}>
        <TouchableOpacity 
          style={styles.themeOption}
          onPress={() => setTheme('light')}
        >
          <GlassCard style={[
            styles.themeCard,
            theme === 'light' && { borderColor: colors.accent, backgroundColor: `${colors.accent}20` }
          ]}>
            <Sun size={32} color={theme === 'light' ? colors.accent : colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>Light</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.themeOption}
          onPress={() => setTheme('dark')}
        >
          <GlassCard style={[
            styles.themeCard,
            theme === 'dark' && { borderColor: colors.accent, backgroundColor: `${colors.accent}20` }
          ]}>
            <Moon size={32} color={theme === 'dark' ? colors.accent : colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>Dark</Text>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <GlowButton 
          label="Enter Dashboard" 
          onPress={handleFinish} 
        />
      </View>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  themeOption: {
    flex: 1,
  },
  themeCard: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 24,
  },
  themeLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginBottom: 20,
  },
});
