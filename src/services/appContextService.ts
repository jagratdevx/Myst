import { useProfileStore } from '../store/useProfileStore';
import { useTestScoreStore } from '../store/useTestScoreStore';
import { useFocusStore } from '../store/useFocusStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { usePlannerStore } from '../store/usePlannerStore';
import { usePDFStore } from '../store/usePDFStore';

export function buildAppContext(): string {
  const profile = useProfileStore.getState().profile;
  const scores = useTestScoreStore.getState().scores;
  const focusStats = useFocusStore.getState().stats;
  const finance = useFinanceStore.getState();
  const tasks = usePlannerStore.getState().tasks;
  const pdfs = usePDFStore.getState().pdfs;

  const parts: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  parts.push('You are Myst, an intelligent, modern, and friendly AI study assistant inside the Myst Student OS app. The user has the following data in the app — use it to give personalized, relevant responses. Keep answers clear, engaging, and concise.');
  parts.push('');
  parts.push(`Today's date is ${today}. Always use this as the reference date when creating study plans or discussing schedules.`);
  parts.push('App features you can guide the user to use: Planner (tasks), Focus Timer (pomodoro), Finance Tracker, Test Score Tracker, PDF Library, and this Chat AI.');
  parts.push('When the user asks for a study plan, output specific tasks in this format at the end:\n📋 TASK: Task name | Subject | High/Medium/Low | YYYY-MM-DD\nThis allows the app to add them to the Planner automatically.');

  if (profile) {
    parts.push(`\n--- User Profile ---`);
    parts.push(`Name: ${profile.name}`);
    parts.push(`Grade: ${profile.grade}`);
    parts.push(`Subjects: ${profile.subjects.join(', ')}`);
    parts.push(`Goals: ${profile.goals.join(', ')}`);
    if (profile.monthlyBudget) parts.push(`Monthly Budget: ₹${profile.monthlyBudget}`);
    if (profile.savingsGoal) parts.push(`Savings Goal: ₹${profile.savingsGoal}`);
  }

  if (scores.length > 0) {
    const sorted = [...scores].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    parts.push(`\n--- Recent Test Scores (last 5) ---`);
    for (const s of sorted) {
      const pct = ((s.score / s.totalMarks) * 100).toFixed(1);
      parts.push(`${s.subject}: ${s.score}/${s.totalMarks} (${pct}%)${s.label ? ` - ${s.label}` : ''}`);
    }
    const subjectMap = new Map<string, { score: number; total: number }>();
    for (const s of scores) {
      const cur = subjectMap.get(s.subject) || { score: 0, total: 0 };
      cur.score += s.score;
      cur.total += s.totalMarks;
      subjectMap.set(s.subject, cur);
    }
    parts.push(`\n--- Per-Subject Totals ---`);
    for (const [subject, { score, total }] of subjectMap) {
      const pct = ((score / total) * 100).toFixed(1);
      parts.push(`${subject}: ${score}/${total} (${pct}%)`);
    }
  }

  if (focusStats) {
    const hours = Math.floor(focusStats.totalFocusTime / 3600);
    const mins = Math.floor((focusStats.totalFocusTime % 3600) / 60);
    parts.push(`\n--- Focus ---`);
    parts.push(`${hours}h ${mins}m total, ${focusStats.totalSessions} sessions, ${focusStats.streakDays}-day streak`);
  }

  parts.push(`\n--- Finance ---`);
  parts.push(`Balance: ₹${finance.balance}, Expenses: ₹${finance.totalExpenses}, Budget: ₹${finance.monthlyBudget}, Savings Goal: ₹${finance.savingsGoal}, Savings Rate: ${finance.savingsRate}%`);
  if (finance.spendingByCategory.length > 0) {
    parts.push(`Spending by Category: ${finance.spendingByCategory.map(c => `${c.name}: ₹${c.amount}`).join(', ')}`);
  }

  const incompleteTasks = tasks.filter(t => !t.completed);
  const todayTasks = incompleteTasks.filter(t => t.deadline === new Date().toISOString().split('T')[0]);
  parts.push(`\n--- Tasks ---`);
  parts.push(`${incompleteTasks.length} incomplete (${todayTasks.length} due today)`);
  if (incompleteTasks.length > 0) {
    parts.push(`Pending Tasks:`);
    for (const t of incompleteTasks.slice(0, 5)) {
      parts.push(`- ${t.title} (${t.subject}, ${t.priority} priority, due ${t.deadline})`);
    }
  }

  parts.push(`\n--- Documents ---`);
  parts.push(`${pdfs.length} saved documents`);

  return parts.join('\n');
}
