import { create } from 'zustand';
import { flashcardService } from '../services/flashcardService';
import { FlashcardDeck, Flashcard } from '../types/flashcard';

interface FlashcardStore {
  decks: FlashcardDeck[];
  cards: Flashcard[];
  loading: boolean;
  fetchData: () => Promise<void>;
  createDeck: (title: string, description: string, source?: 'manual' | 'pdf', sourcePdfId?: string) => Promise<FlashcardDeck>;
  addCard: (deckId: string, front: string, back: string, hints?: string) => Promise<void>;
  generateFromPDF: (deckTitle: string, pdfText: string) => Promise<FlashcardDeck>;
  generateDeckFromTopic: (title: string, subject: string) => Promise<FlashcardDeck>;
  deleteDeck: (deckId: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  updateCardReview: (cardId: string, quality: number) => Promise<void>;
  getDueCards: (deckId: string) => Promise<Flashcard[]>;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  decks: [],
  cards: [],
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    const decks = await flashcardService.getDecks();
    const cards = await flashcardService.getCards();
    set({ decks, cards, loading: false });
  },

  createDeck: async (title, description, source, sourcePdfId) => {
    const deck = await flashcardService.createDeck(title, description, source, sourcePdfId);
    const decks = await flashcardService.getDecks();
    set({ decks });
    return deck;
  },

  addCard: async (deckId, front, back, hints) => {
    await flashcardService.addCard(deckId, front, back, hints);
    const decks = await flashcardService.getDecks();
    const cards = await flashcardService.getCards();
    set({ decks, cards });
  },

  generateFromPDF: async (deckTitle, pdfText) => {
    const deck = await flashcardService.generateFromPDF(deckTitle, pdfText);
    const decks = await flashcardService.getDecks();
    const cards = await flashcardService.getCards();
    set({ decks, cards });
    return deck;
  },

  generateDeckFromTopic: async (title, subject) => {
    const deck = await flashcardService.generateDeckFromTopic(title, subject);
    const decks = await flashcardService.getDecks();
    const cards = await flashcardService.getCards();
    set({ decks, cards });
    return deck;
  },

  deleteDeck: async (deckId) => {
    await flashcardService.deleteDeck(deckId);
    const decks = await flashcardService.getDecks();
    const cards = await flashcardService.getCards();
    set({ decks, cards });
  },

  deleteCard: async (cardId) => {
    await flashcardService.deleteCard(cardId);
    const cards = await flashcardService.getCards();
    set({ cards });
  },

  updateCardReview: async (cardId, quality) => {
    await flashcardService.updateCardReview(cardId, quality);
    const cards = await flashcardService.getCards();
    set({ cards });
  },

  getDueCards: async (deckId) => {
    return flashcardService.getDueCards(deckId);
  },
}));
