export interface TestScore {
  id: string;
  subject: string;
  score: number;
  totalMarks: number;
  date: string;
  label?: string;
}

export interface SubjectTotal {
  subject: string;
  totalScore: number;
  totalMarks: number;
  percentage: number;
  count: number;
}
