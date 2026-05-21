import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import { useTheme } from '../../hooks/useTheme';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';
import { usePlannerStore } from '../../store/usePlannerStore';
import { AddTaskModal } from '../components/AddTaskModal';
import { TaskItem } from '../components/TaskItem';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const PlannerScreen = () => {
  const { colors } = useTheme();
  const { tasks, loading, fetchTasks, toggleTask, deleteTask } = usePlannerStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date(selectedDate);
    // Get the Monday of the current selected week
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === selectedDate.toDateString();
    });
  }, [tasks, selectedDate]);

  const { completedCount, progressPercent } = useMemo(() => {
    const completed = filteredTasks.filter(t => t.completed).length;
    const percent = filteredTasks.length > 0 ? (completed / filteredTasks.length) * 100 : 0;
    return { completedCount: completed, progressPercent: percent };
  }, [filteredTasks]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(nextDate);
  };

  const getSubjectColor = useCallback((subject: string) => {
    switch(subject) {
      case 'Physics': return `${colors.accentSecondary}40`;
      case 'Chemistry': return `${colors.accent}40`;
      case 'Mathematics': return `${colors.error}40`;
      case 'English': return `${colors.success}40`;
      default: return colors.glass;
    }
  }, [colors]);

  const getPriorityColor = useCallback((priority: string) => {
    switch(priority) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.accent;
      default: return colors.textSecondary;
    }
  }, [colors]);

  const ListHeader = useMemo(() => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Study Planner</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigateWeek('prev')}
            style={[styles.navButton, { backgroundColor: colors.glass }]}
          >
            <ChevronLeft color={colors.textPrimary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigateWeek('next')}
            style={[styles.navButton, { backgroundColor: colors.glass, marginLeft: 8 }]}
          >
            <ChevronRight color={colors.textPrimary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Calendar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
        {weekDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => setSelectedDate(date)}
              style={[
                styles.dateItem, 
                { backgroundColor: colors.glass, borderColor: colors.border },
                isSelected && { backgroundColor: `${colors.accent}20`, borderColor: colors.accent }
              ]}
            >
              <Text style={[
                styles.dayText, 
                { color: colors.textSecondary },
                isSelected && { color: colors.accent }
              ]}>{DAYS[date.getDay()]}</Text>
              <Text style={[
                styles.dateText, 
                { color: colors.textPrimary },
                isSelected && { color: colors.textPrimary }
              ]}>{date.getDate()}</Text>
              {isSelected && <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Progress Overview */}
      <GlassCard style={styles.progressCard}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Day Progress</Text>
          <Text style={[styles.progressSub, { color: colors.textSecondary }]}>
            {completedCount} of {filteredTasks.length} tasks completed
          </Text>
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
          <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: colors.accent }]} />
        </View>
      </GlassCard>

      {/* Tasks Section */}
      <SectionHeader title={selectedDate.toDateString() === new Date().toDateString() ? "Today's Assignments" : "Assignments"} />
    </View>
  ), [colors, selectedDate, weekDates, completedCount, filteredTasks.length, progressPercent]);

  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {loading ? "Loading tasks..." : "No tasks for this day. Rest easy!"}
      </Text>
    </View>
  ), [colors, loading]);

  return (
    <AnimatedScreenWrapper>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TaskItem 
            task={item} 
            index={index} 
            onToggle={toggleTask} 
            onDelete={deleteTask}
            getSubjectColor={getSubjectColor}
            getPriorityColor={getPriorityColor}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
      
      <FloatingActionButton onPress={() => setModalVisible(true)} />
      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  calendarScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '800',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  progressCard: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 24,
  },
  progressInfo: {
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressSub: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.7,
  },
});
