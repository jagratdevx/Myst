import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardDeck, Flashcard } from '../types/flashcard';
import { aiService } from './aiService';

const DECKS_KEY = '@myst_flashcard_decks';
const CARDS_KEY = '@myst_flashcard_cards';

async function loadDecks(): Promise<FlashcardDeck[]> {
  try {
    const raw = await AsyncStorage.getItem(DECKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveDecks(decks: FlashcardDeck[]): Promise<void> {
  await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

async function loadCards(): Promise<Flashcard[]> {
  try {
    const raw = await AsyncStorage.getItem(CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveCards(cards: Flashcard[]): Promise<void> {
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const flashcardService = {
  async getDecks(): Promise<FlashcardDeck[]> { return loadDecks(); },
  async getCards(deckId?: string): Promise<Flashcard[]> {
    const all = await loadCards();
    return deckId ? all.filter(c => c.deckId === deckId) : all;
  },

  async createDeck(title: string, description: string, source: 'manual' | 'pdf' = 'manual', sourcePdfId?: string): Promise<FlashcardDeck> {
    const decks = await loadDecks();
    const deck: FlashcardDeck = {
      id: generateId(), title, description, source, sourcePdfId, cardCount: 0, createdAt: Date.now(),
    };
    decks.push(deck);
    await saveDecks(decks);
    return deck;
  },

  async addCard(deckId: string, front: string, back: string, hints?: string): Promise<Flashcard> {
    const cards = await loadCards();
    const card: Flashcard = {
      id: generateId(), deckId, front, back, hints,
      easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: Date.now(), createdAt: Date.now(),
    };
    cards.push(card);
    await saveCards(cards);

    const decks = await loadDecks();
    const deck = decks.find(d => d.id === deckId);
    if (deck) { deck.cardCount++; await saveDecks(decks); }
    return card;
  },

  async generateFromPDF(deckTitle: string, pdfText: string): Promise<FlashcardDeck> {
    const deck = await this.createDeck(deckTitle, `Generated from ${deckTitle}`, 'pdf');
    const systemMsg = { role: 'system' as const, content: 'Extract 5-10 key concepts from the text. Return ONLY valid JSON array of {"front":"question","back":"answer"} objects — absolutely no other text.' };
    const userMsg = { role: 'user' as const, content: pdfText.substring(0, 3000) };
    try {
      const response = await aiService.sendMessage([systemMsg, userMsg]);
      const jsonMatch = response.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const pairs = JSON.parse(jsonMatch[0]);
        for (const pair of pairs) {
          await this.addCard(deck.id, pair.front, pair.back);
        }
      }
    } catch { /* cards may be empty */ }
    return deck;
  },

  async generateDeckFromTopic(title: string, subject: string): Promise<FlashcardDeck> {
    const deck = await this.createDeck(title, `${subject} - ${title}`, 'pdf');
    const systemMsg = { role: 'system' as const, content: 'Generate 5-10 flashcards about this topic. Return ONLY valid JSON array of {"front":"question","back":"answer"} objects — absolutely no other text, markdown, or explanation.' };
    const userMsg = { role: 'user' as const, content: `Topic: ${title}\nSubject: ${subject}\nGenerate flashcards covering key concepts, definitions, and important facts.` };
    try {
      const response = await aiService.sendMessage([systemMsg, userMsg]);
      const jsonMatch = response.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const pairs = JSON.parse(jsonMatch[0]);
        for (const pair of pairs) {
          await this.addCard(deck.id, pair.front, pair.back);
        }
      }
    } catch { /* cards may be empty */ }
    return deck;
  },

  async updateCardReview(cardId: string, quality: number): Promise<void> {
    const cards = await loadCards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (quality >= 3) {
      if (card.repetitions === 0) card.interval = 1;
      else if (card.repetitions === 1) card.interval = 6;
      else card.interval = Math.round(card.interval * card.easeFactor);
      card.repetitions++;
    } else {
      card.repetitions = 0;
      card.interval = 1;
    }

    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    card.nextReview = Date.now() + card.interval * 86400000;
    await saveCards(cards);
  },

  async deleteDeck(deckId: string): Promise<void> {
    const decks = await loadDecks();
    await saveDecks(decks.filter(d => d.id !== deckId));
    const cards = await loadCards();
    await saveCards(cards.filter(c => c.deckId !== deckId));
  },

  async deleteCard(cardId: string): Promise<void> {
    const cards = await loadCards();
    await saveCards(cards.filter(c => c.id !== cardId));
  },

  async getDueCards(deckId: string): Promise<Flashcard[]> {
    const cards = await loadCards();
    return cards.filter(c => c.deckId === deckId && c.nextReview <= Date.now());
  },
};
