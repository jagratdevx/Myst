import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color?: string;
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  size = 120,
  strokeWidth = 12,
  progress,
  color
}) => {
  const { colors } = useTheme();
  const ringColor = color || colors.accentSecondary;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const sharedProgress = useSharedValue(0);

  useEffect(() => {
    sharedProgress.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - sharedProgress.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.5}
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: colors.textPrimary, fontSize: size * 0.2 }]}>
          {Math.round(progress * 100)}%
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: size * 0.08 }]}>
          Efficiency
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
});
