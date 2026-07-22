export type WidgetType = 
  | 'greeting' 
  | 'xp' 
  | 'focus' 
  | 'tasks' 
  | 'test_scores' 
  | 'finance' 
  | 'library' 
  | 'study_plan';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  visible: boolean;
  order: number;
}

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'widget_greeting', type: 'greeting', visible: true, order: 0 },
  { id: 'widget_xp', type: 'xp', visible: true, order: 1 },
  { id: 'widget_focus', type: 'focus', visible: true, order: 2 },
  { id: 'widget_tasks', type: 'tasks', visible: true, order: 3 },
  { id: 'widget_test_scores', type: 'test_scores', visible: true, order: 4 },
  { id: 'widget_finance', type: 'finance', visible: true, order: 5 },
  { id: 'widget_library', type: 'library', visible: true, order: 6 },
  { id: 'widget_study_plan', type: 'study_plan', visible: true, order: 7 },
];

export const WIDGET_LABELS: Record<WidgetType, string> = {
  greeting: 'Greeting',
  xp: 'XP & Level',
  focus: 'Focus Stats',
  tasks: 'Today\'s Tasks',
  test_scores: 'Test Scores',
  finance: 'Finance',
  library: 'Study Library',
  study_plan: 'Study Plan',
};
