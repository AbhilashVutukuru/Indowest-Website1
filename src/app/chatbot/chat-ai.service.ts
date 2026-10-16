import { Injectable } from '@angular/core';

/**
 * Address of the IndoWest chat server (chat-server/server.js).
 * - Local development: "/api/chat" is forwarded to http://localhost:3000 by proxy.conf.json.
 * - Live site: host the chat server and either route /api on your domain to it,
 *   or replace this with its full address, e.g. "https://chat.indowestunited.com/api/chat".
 */
export const CHAT_API_URL = '/api/chat';

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export class ChatAiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatAiService {

  /** True when the chat server is running and has an API key. */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${CHAT_API_URL}/health`, { cache: 'no-store' });
      if (!response.ok) return false;
      const body = await response.json();
      return !!body.aiEnabled;
    } catch {
      return false;
    }
  }

  /**
   * Sends the conversation and calls onText for each piece of the reply as it arrives.
   * Resolves when the reply is complete; throws ChatAiError if the AI can't answer.
   */
  async stream(turns: ChatTurn[], onText: (text: string) => void, signal?: AbortSignal): Promise<void> {
    let response: Response;
    try {
      response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: turns }),
        signal
      });
    } catch {
      throw new ChatAiError(0, 'offline');
    }

    if (!response.ok || !response.body) {
      let code = 'ai_error';
      try { code = (await response.json()).error || code; } catch { /* not json */ }
      throw new ChatAiError(response.status, code);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) onText(text);
    }
  }
}

/**
 * Turns the assistant's light markdown (**bold**, "- " lists, [links](/path)) into safe HTML.
 * Everything is escaped first, so visitor or AI text can never inject markup.
 */
export function formatChatText(text: string): string {
  const escape = (s: string) => s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const inline = (s: string) => escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(((?:\/|https:\/\/|mailto:)[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.]+\w)(?![^<]*<\/a>)/g, '<a href="mailto:$1">$1</a>');

  const html: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  const closeList = () => { if (list) { html.push(`</${list}>`); list = null; } };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-*•])\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (list !== type) { closeList(); html.push(`<${type}>`); list = type; }
      html.push(`<li>${inline((bullet || numbered)![1])}</li>`);
    } else if (!line) {
      closeList();
      html.push('<span class="gap"></span>');
    } else {
      closeList();
      html.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return html.join('');
}
