import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  intensity 
}) => {
  const { colors, theme } = useTheme();

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: colors.shadow,
      },
      style
    ]}>
      {theme === 'dark' ? (
        <BlurView intensity={intensity || 20} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});
