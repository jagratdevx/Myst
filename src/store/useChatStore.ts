import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/chat';
import { aiService } from '../services/aiService';
import { buildAppContext } from '../services/appContextService';
import { decryptData, encryptData } from '../utils/encryption';

const CHAT_STORAGE_KEY = '@myst_chat_history_v2';
const LEGACY_CHAT_STORAGE_KEY = '@myst_chat_history';

let storageQueue = Promise.resolve();

const saveMessages = (messages: ChatMessage[]) => {
  storageQueue = storageQueue
    .catch(() => undefined)
    .then(async () => {
      const encrypted = await encryptData(messages);
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, encrypted);
    });
  return storageQueue;
};

const createWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am Myst, your personal AI study assistant. 🚀\n\nHow can I help you today? You can ask me to write a study plan, explain complex topics, test your knowledge, or help manage your finances!',
  timestamp: Date.now(),
});

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  loadMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearChat: () => Promise<void>;
  requestId: number;
  requestController: AbortController | null;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  hydrated: false,
  error: null,
  requestId: 0,
  requestController: null,

  loadMessages: async () => {
    try {
      const encrypted = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      const decryptedMessages = await decryptData<ChatMessage[]>(encrypted);
      let messages: ChatMessage[];
      if (!decryptedMessages) {
        const legacy = await AsyncStorage.getItem(LEGACY_CHAT_STORAGE_KEY);
        messages = legacy ? JSON.parse(legacy) : [createWelcomeMessage()];
        await saveMessages(messages);
        await AsyncStorage.removeItem(LEGACY_CHAT_STORAGE_KEY);
      } else {
        messages = decryptedMessages;
      }
      set({ messages, hydrated: true });
    } catch (e) {
      console.error('Error loading chat history:', e);
      set({ messages: [createWelcomeMessage()], hydrated: true });
    }
  },

  sendMessage: async (text: string) => {
    if (!text.trim() || !get().hydrated || get().loading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const currentMessages = [...get().messages, userMessage];
    const requestId = get().requestId + 1;
    const requestController = new AbortController();
    set({ messages: currentMessages, loading: true, error: null, requestId, requestController });

    try {
      await saveMessages(currentMessages);
      if (get().requestId !== requestId) return;

      const ctxMsg: ChatMessage = { id: 'ctx-' + Math.random().toString(36).substring(7), role: 'system', content: buildAppContext(), timestamp: Date.now() };
      const aiResponseContent = await aiService.sendMessage([ctxMsg, ...currentMessages], requestController.signal);
      if (get().requestId !== requestId) return;

      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: aiResponseContent,
        timestamp: Date.now(),
      };

      const updatedMessages = [...currentMessages, aiMessage];
      set({ messages: updatedMessages, loading: false, requestController: null });
      await saveMessages(updatedMessages);
    } catch (err: any) {
      if (get().requestId !== requestId) return;
      console.error('Failed to send message:', err);
      set({ 
        loading: false, 
        requestController: null,
        error: err.message || 'Failed to get a response. Please try again.' 
      });
    }
  },

  retryLastMessage: async () => {
    const { messages, loading, hydrated } = get();
    if (loading || !hydrated || messages.at(-1)?.role !== 'user') return;

    const requestId = get().requestId + 1;
    const requestController = new AbortController();
    set({ loading: true, error: null, requestId, requestController });
    try {
      const ctxMsg: ChatMessage = { id: 'ctx-' + Math.random().toString(36).substring(7), role: 'system', content: buildAppContext(), timestamp: Date.now() };
      const aiResponseContent = await aiService.sendMessage([ctxMsg, ...messages], requestController.signal);
      if (get().requestId !== requestId) return;
      const updatedMessages = [...messages, {
        id: Math.random().toString(36).substring(7),
        role: 'assistant' as const,
        content: aiResponseContent,
        timestamp: Date.now(),
      }];
      set({ messages: updatedMessages, loading: false, requestController: null });
      await saveMessages(updatedMessages);
    } catch (err: any) {
      if (get().requestId !== requestId) return;
      set({ loading: false, requestController: null, error: err.message || 'Failed to get a response. Please try again.' });
    }
  },

  clearChat: async () => {
    try {
      get().requestController?.abort();
      const welcomeMessage = createWelcomeMessage();
      set({ messages: [welcomeMessage], loading: false, error: null, requestId: get().requestId + 1, requestController: null });
      await saveMessages([welcomeMessage]);
    } catch (e) {
      console.error('Error clearing chat:', e);
    }
  },
}));
