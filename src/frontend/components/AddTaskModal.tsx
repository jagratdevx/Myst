import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { GlassModal } from '../ui/GlassModal';
import { GlassInput } from '../ui/GlassInput';
import { GlowButton } from '../ui/GlowButton';
import { useTheme } from '../../hooks/useTheme';
import { usePlannerStore } from '../../store/usePlannerStore';
import { Priority } from '../../types';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'English', 'History', 'Biology'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export const AddTaskModal = ({ visible, onClose }: AddTaskModalProps) => {
  const { colors } = useTheme();
  const addTask = usePlannerStore(state => state.addTask);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = async () => {
    if (!title || !deadline) return;

    await addTask({
      title,
      subject,
      deadline,
      priority,
      completed: false,
    });

    // Reset and close
    setTitle('');
    setDeadline('');
    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="New Assignment">
      <ScrollView showsVerticalScrollIndicator={false}>
        <GlassInput 
          label="Task Title"
          placeholder="e.g. Quantum Mechanics Quiz"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {SUBJECTS.map(s => (
            <TouchableOpacity 
              key={s} 
              style={[
                styles.chip, 
                { backgroundColor: colors.glass, borderColor: colors.border },
                subject === s && { backgroundColor: `${colors.accentSecondary}20`, borderColor: colors.accentSecondary }
              ]}
              onPress={() => setSubject(s)}
            >
              <Text style={[
                styles.chipText, 
                { color: colors.textSecondary },
                subject === s && { color: colors.textPrimary }
              ]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <GlassInput 
          label="Deadline"
          placeholder="e.g. Today, 5:00 PM"
          value={deadline}
          onChangeText={setDeadline}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
        <View style={styles.priorityContainer}>
          {PRIORITIES.map(p => (
            <TouchableOpacity 
              key={p} 
              style={[
                styles.priorityButton, 
                { backgroundColor: colors.glass, borderColor: colors.border },
                priority === p && { backgroundColor: `${colors.accent}15`, borderColor: colors.accent }
              ]}
              onPress={() => setPriority(p)}
            >
              <Text style={[
                styles.priorityText, 
                { color: colors.textSecondary },
                priority === p && { color: colors.accent }
              ]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <GlowButton 
            title="Create Task" 
            onPress={handleSubmit} 
            color={colors.accentSecondary} 
          />
        </View>
      </ScrollView>
    </GlassModal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  chipScroll: {
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    marginTop: 10,
    marginBottom: 20,
  },
});
