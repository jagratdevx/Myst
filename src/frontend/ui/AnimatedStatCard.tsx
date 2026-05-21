import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface AnimatedStatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay?: number;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ 
  label, 
  value, 
  icon, 
  delay = 0 
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeInUp.delay(delay).springify()} 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }
      ]}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 130,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
