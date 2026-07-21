import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface BreathingOrbProps {
  isBreathing?: boolean;
}

export const BreathingOrb = (_props: BreathingOrbProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 4000, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 4000, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 4000 }),
        withTiming(0.3, { duration: 4000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.2 }],
    opacity: opacity.value * 0.5,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, glowStyle, { backgroundColor: colors.accent, shadowColor: colors.accent }]} />
      <Animated.View style={[styles.orb, animatedStyle, { backgroundColor: colors.accentSecondary, shadowColor: colors.accentSecondary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9B87F5',
    shadowColor: '#9B87F5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5EEBFF',
    shadowColor: '#5EEBFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
});
