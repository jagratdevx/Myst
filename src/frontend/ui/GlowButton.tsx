import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { hapticService } from '../../services/hapticService';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';

interface GlowButtonProps {
  title?: string;
  label?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({ 
  title, 
  label,
  onPress, 
  style, 
  color,
  variant = 'primary',
  disabled = false
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  
  const backgroundColor = color || (variant === 'primary' ? colors.accent : colors.accentSecondary);
  const opacity = disabled ? 0.5 : 1;
  const buttonText = title || label || '';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    
    hapticService.light();
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    onPress();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View style={[
        styles.button, 
        { 
          backgroundColor, 
          opacity,
          shadowColor: backgroundColor,
        },
        animatedStyle,
        style
      ]}>
        <Text style={styles.text}>{buttonText}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6, // Reduced elevation for better low-end performance
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
