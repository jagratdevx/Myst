import { plannerStorage } from './plannerStorage';
import { Task } from '../types';

export const plannerService = {
  getTasks: async (): Promise<Task[]> => {
    return await plannerStorage.getTasks();
  },

  addTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const tasks = await plannerStorage.getTasks();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
      completed: false
    };
    tasks.unshift(newTask);
    await plannerStorage.saveTasks(tasks);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    const tasks = await plannerStorage.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = { ...tasks[index], ...updates };
    await plannerStorage.saveTasks(tasks);
    return tasks[index];
  },

  deleteTask: async (id: string): Promise<void> => {
    const tasks = await plannerStorage.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    await plannerStorage.saveTasks(filteredTasks);
  },

  toggleTask: async (id: string): Promise<Task | null> => {
    const tasks = await plannerStorage.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index].completed = !tasks[index].completed;
    await plannerStorage.saveTasks(tasks);
    return tasks[index];
  }
};
