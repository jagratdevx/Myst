import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlowButton } from '../../ui/GlowButton';
import { useTheme } from '../../../hooks/useTheme';
import { BookOpen, GraduationCap, Target } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export const OnboardingWelcome = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <AnimatedScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.iconContainer}>
          <GraduationCap size={80} color={colors.accent} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome to Myst</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your premium offline-first academic operating system. Let's get you set up.
          </Text>
        </Animated.View>

        <View style={styles.features}>
          <FeatureItem 
            icon={<BookOpen size={24} color={colors.accentSecondary} />}
            text="Organize your study PDFs subject-wise"
            delay={600}
          />
          <FeatureItem 
            icon={<Target size={24} color={colors.accentSecondary} />}
            text="Track goals and focus sessions"
            delay={800}
          />
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(1000)} style={styles.footer}>
        <GlowButton 
          label="Start Setup" 
          onPress={() => navigation.navigate('OnboardingProfile')} 
        />
      </Animated.View>
    </AnimatedScreenWrapper>
  );
};

const FeatureItem = ({ icon, text, delay }: { icon: React.ReactNode, text: string, delay: number }) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: colors.glass }]}>
        {icon}
      </View>
      <Text style={[styles.featureText, { color: colors.textPrimary }]}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
  },
  content: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  features: {
    width: '100%',
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    marginBottom: 20,
  },
});
