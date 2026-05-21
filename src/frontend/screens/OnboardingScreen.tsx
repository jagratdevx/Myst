import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlowButton } from '../ui/GlowButton';
import { COLORS } from '../../constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Brain, Sparkles, Rocket } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const OnboardingScreen = ({ navigation }: any) => {
  return (
    <AnimatedScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.iconContainer}
        >
          <View style={styles.glowOrb} />
          <Brain size={120} color={COLORS.accentPurple} strokeWidth={1.5} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <Text style={styles.title}>Myst</Text>
          <Text style={styles.subtitle}>Your Student Life Operating System</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.features}>
          <FeatureItem 
            icon={<Sparkles size={20} color={COLORS.accentCyan} />}
            text="Focus Better. Live Balanced."
          />
          <FeatureItem 
            icon={<Rocket size={20} color={COLORS.accentCyan} />}
            text="Spend Smarter. Study Harder."
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.footer}>
        <GlowButton 
          title="Get Started" 
          onPress={() => navigation.replace('Main')} 
          style={styles.button}
        />
        <Text style={styles.footerText}>Offline-first. Private. Secure.</Text>
      </Animated.View>
    </AnimatedScreenWrapper>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View style={styles.featureItem}>
    {icon}
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accentPurple,
    opacity: 0.1,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  features: {
    marginTop: 48,
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureText: {
    color: COLORS.white,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    opacity: 0.6,
  },
});
