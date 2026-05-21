export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  createdAt: number;
}

export interface FocusSession {
  id: string;
  startTime: number;
  duration: number; // in seconds
  mode: 'study' | 'break';
  completed: boolean;
}

export interface FocusStats {
  totalFocusTime: number;
  totalSessions: number;
  streakDays: number;
  lastSessionDate: string | null;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  pomodoroWorkTime: number;
  pomodoroBreakTime: number;
}
