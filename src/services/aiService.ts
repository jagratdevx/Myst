import Constants from 'expo-constants';
import { ChatMessage } from '../types/chat';


const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_CONTEXT_MESSAGES = 16;

function getApiKey(): string {
  const key = Constants.expoConfig?.extra?.groqApiKey as string | undefined;
  if (!key) {
    console.warn('GROQ_API_KEY not found in app config. Set it in .env');
    return '';
  }
  return key;
}

export const aiService = {
  sendMessage: async (messages: ChatMessage[], signal?: AbortSignal): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const abortRequest = () => controller.abort();
    signal?.addEventListener('abort', abortRequest, { once: true });

    try {
      const formattedMessages = messages.slice(-MAX_CONTEXT_MESSAGES).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      if (!formattedMessages.some(msg => msg.role === 'system')) {
        formattedMessages.unshift({
          role: 'system',
          content: 'You are Myst, an intelligent, modern, and friendly AI study assistant. Help students manage their studies, focus, productivity, and finance. Keep answers clear, engaging, and concise.',
        });
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: formattedMessages,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from AI model.');
      }

      return content;
    } catch (error) {
      if (controller.signal.aborted && !signal?.aborted) {
        throw new Error('The request timed out. Please try again.');
      }
      console.error('Error in aiService.sendMessage:', error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', abortRequest);
    }
  },
};
