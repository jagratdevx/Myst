import { create } from 'zustand';
import { Task } from '../types';
import { plannerService } from '../services/plannerService';
import { awardTaskXP } from './useGamificationStore';

interface PlannerState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await plannerService.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ loading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const newTask = await plannerService.addTask(taskData);
      set({ tasks: [newTask, ...get().tasks] });
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  },

  toggleTask: async (id) => {
    try {
      const updatedTask = await plannerService.toggleTask(id);
      if (updatedTask) {
        set({
          tasks: get().tasks.map(t => t.id === id ? updatedTask : t)
        });
        if (updatedTask.completed) awardTaskXP();
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  },

  deleteTask: async (id) => {
    try {
      await plannerService.deleteTask(id);
      set({
        tasks: get().tasks.filter(t => t.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  },
}));
