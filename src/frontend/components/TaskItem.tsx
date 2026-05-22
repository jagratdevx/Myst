import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';

...

export const TaskItem = React.memo(({ 
  task, 
  index, 
  onToggle, 
  onDelete, 
  getSubjectColor, 
  getPriorityColor 
}: TaskItemProps) => {
  const { colors } = useTheme();

  const handleToggle = () => {
    hapticService.light();
    onToggle(task.id);
  };

  const handleDelete = () => {
    hapticService.selection();
    Alert.alert("Delete Task", "Delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
        hapticService.medium();
        onDelete(task.id);
      }}
    ]);
  };

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 50)} 
      layout={Layout.springify().damping(15)}
    >
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={handleToggle} 
        onLongPress={handleDelete}
      >
        <GlassCard style={[styles.taskCard, task.completed && styles.taskCompleted]}>
          <View style={styles.taskHeader}>
            <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(task.subject) }]}>
              <Text style={[styles.subjectText, { color: colors.textPrimary }]}>{task.subject}</Text>
            </View>
            <View style={styles.priorityRow}>
              <AlertCircle size={14} color={getPriorityColor(task.priority)} />
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>{task.priority}</Text>
            </View>
          </View>
          
          <Text style={[
            styles.taskTitle, 
            { color: colors.textPrimary },
            task.completed && styles.textStrikethrough
          ]}>{task.title}</Text>
          
          <View style={styles.taskFooter}>
            <View style={styles.deadlineRow}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.deadlineText, { color: colors.textSecondary }]}>{task.deadline}</Text>
            </View>
            {task.completed ? (
              <CheckCircle2 size={24} color={colors.success} />
            ) : (
              <Circle size={24} color={colors.border} />
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  taskCard: {
    padding: 16,
    marginBottom: 16,
  },
  taskCompleted: {
    opacity: 0.5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 13,
    marginLeft: 6,
  },
});
