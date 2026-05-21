import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const PLANNER_TASKS_KEY = '@myst_planner_tasks';

export const plannerStorage = {
  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(PLANNER_TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  getTasks: async (): Promise<Task[]> => {
    try {
      const tasksJson = await AsyncStorage.getItem(PLANNER_TASKS_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }
};
