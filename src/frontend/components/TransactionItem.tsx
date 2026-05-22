import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { Edit2, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';

...

export const TransactionItem = React.memo(({ item, index, getCategoryIcon, onEdit, onDelete }: TransactionItemProps) => {
  const { colors } = useTheme();

  const handleDelete = () => {
    hapticService.selection();
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          hapticService.medium();
          onDelete?.(item.id);
        }}
      ]
    );
  };

  const handleEdit = () => {
    hapticService.light();
    onEdit?.(item);
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50)}
      layout={Layout.springify().damping(15)}
    >
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={handleEdit}
      >
        <GlassCard style={styles.transactionCard}>
          <View style={styles.transactionLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.glass }]}>
              {getCategoryIcon(item.category)}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.transactionSub, { color: colors.textSecondary }]}>{item.category} • {item.date}</Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text style={[styles.transactionAmount, { color: item.type === 'expense' ? colors.error : colors.success }]}>
              {item.type === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => onEdit?.(item)} style={styles.actionBtn}>
                <Edit2 size={14} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.actionBtn, { marginLeft: 8 }]}>
                <Trash2 size={14} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  transactionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
