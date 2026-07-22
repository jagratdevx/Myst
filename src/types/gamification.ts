export type XPReason = 'focus' | 'task' | 'test_score' | 'streak_bonus' | 'finance' | 'pdf_import' | 'daily_login';

export interface XPActivity {
  id: string;
  amount: number;
  reason: string;
  source: XPReason;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
}

export const BADGE_DEFINITIONS: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first_focus', name: 'First Focus', description: 'Complete your first focus session', icon: '🎯' },
  { id: 'marathon', name: 'Marathon', description: '10 hours of total focus', icon: '🏃' },
  { id: 'task_master', name: 'Task Master', description: 'Complete 50 tasks', icon: '✅' },
  { id: 'streak_king', name: 'Streak King', description: '7-day focus streak', icon: '👑' },
  { id: 'scholar', name: 'Scholar', description: 'Record 10 test scores', icon: '📚' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on any test', icon: '💯' },
  { id: 'saver', name: 'Saver', description: 'Stay under budget', icon: '💰' },
  { id: 'bookworm', name: 'Bookworm', description: 'Import 5 PDFs', icon: '📖' },
  { id: 'century', name: 'Century', description: 'Reach level 100', icon: '🏆' },
  { id: 'planner', name: 'Planner', description: 'Complete 10 tasks in a single day', icon: '📅' },
];

export interface GamificationState {
  xp: number;
  level: number;
  xpToNextLevel: number;
  badges: Badge[];
  recentActivity: XPActivity[];
  totalFocusSessions: number;
  totalTasksCompleted: number;
  totalScoresRecorded: number;
  totalPDFsImported: number;
  highestScore: number;
}
