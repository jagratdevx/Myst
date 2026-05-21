import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export const StatItem = React.memo(({ label, value, icon }: StatItemProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.statItem}>
      {icon}
      <View style={styles.statInfo}>
        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  statItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
