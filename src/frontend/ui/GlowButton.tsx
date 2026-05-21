import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, StyleProp, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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
  
  const backgroundColor = color || (variant === 'primary' ? colors.accent : colors.accentSecondary);
  const opacity = disabled ? 0.5 : 1;
  const buttonText = title || label || '';

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button, 
        { 
          backgroundColor, 
          opacity,
          shadowColor: backgroundColor,
        },
        style
      ]}
    >
      <Text style={styles.text}>{buttonText}</Text>
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
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
