const PREFIX = 'hdfc_chat_';
const MAX_MESSAGES_PER_KEY = 200;
const MAX_STORAGE_BYTES = 4 * 1024 * 1024;

export interface PersistedMessage {
  role: 'user' | 'assistant';
  content: string;
}

function isSSR(): boolean {
  return typeof window === 'undefined';
}

export function saveChatHistory(key: string, messages: PersistedMessage[]): void {
  if (isSSR()) return;
  try {
    const trimmed = messages.slice(-MAX_MESSAGES_PER_KEY);
    const json = JSON.stringify(trimmed);
    if (json.length > MAX_STORAGE_BYTES) {
      const half = Math.floor(trimmed.length / 2);
      localStorage.setItem(PREFIX + key, JSON.stringify(trimmed.slice(half)));
    } else {
      localStorage.setItem(PREFIX + key, json);
    }
  } catch { /* Storage full or unavailable */ }
}

export function loadChatHistory(key: string): PersistedMessage[] {
  if (isSSR()) return [];
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m: unknown) =>
        m &&
        typeof m === 'object' &&
        'role' in (m as Record<string, unknown>) &&
        'content' in (m as Record<string, unknown>) &&
        ((m as PersistedMessage).role === 'user' || (m as PersistedMessage).role === 'assistant')
    );
  } catch {
    return [];
  }
}

export function clearChatHistory(key: string): void {
  if (isSSR()) return;
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

export const CHAT_KEYS = {
  PROMPT_LAB: 'prompt_lab',
  SALES_AI: 'sales_ai',
  DOC_INTELLIGENCE: 'doc_intelligence',
  USE_CASES: 'use_cases',
} as const;
