export interface PDFDocument {
  id: string;
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  subject: string;
  category: string;
  dateImported: number;
  lastOpened?: number;
  isFavorite: boolean;
}

export interface PDFCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface UserProfile {
  name: string;
  grade: string;
  subjects: string[];
  goals: string[];
  onboardingCompleted: boolean;
}
