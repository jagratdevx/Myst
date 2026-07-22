export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  source: 'manual' | 'pdf';
  sourcePdfId?: string;
  cardCount: number;
  createdAt: number;
  lastStudied?: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hints?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  createdAt: number;
}

export interface QuizSession {
  deckId: string;
  cards: Flashcard[];
  currentIndex: number;
  correct: number;
  incorrect: number;
  startTime: number;
}
