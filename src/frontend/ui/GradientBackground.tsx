import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  const { colors, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {theme === 'dark' ? (
        <>
          <LinearGradient
            colors={['rgba(94, 235, 255, 0.05)', 'transparent']}
            style={[styles.glowOrb, { top: -100, left: -50, width: 300, height: 300 }]}
          />
          <LinearGradient
            colors={['rgba(155, 135, 245, 0.05)', 'transparent']}
            style={[styles.glowOrb, { bottom: -50, right: -50, width: 250, height: 250 }]}
          />
        </>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 150,
  },
});
