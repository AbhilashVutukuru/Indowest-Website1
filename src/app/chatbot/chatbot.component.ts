import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatAiError, ChatAiService, ChatTurn, formatChatText } from './chat-ai.service';

export interface Message {
  id: number;
  text: string;
  html: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
  isError?: boolean;   // "please try again" notice when the AI couldn't answer
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {

  @ViewChild('messageList') messageList?: ElementRef<HTMLElement>;
  @ViewChild('inputBox') inputBox?: ElementRef<HTMLTextAreaElement>;

  isChatOpen = false;
  messages: Message[] = [];
  suggestions: string[] = [];
  userInput = '';
  messageCounter = 0;
  isWaitingForResponse = false;

  /** null = not checked yet, true = AI reachable, false = chat server or API key missing */
  aiEnabled: boolean | null = null;

  /** Starting ideas shown under the greeting; clicking one sends it to the AI. */
  readonly starterQuestions = [
    'What services do you offer?',
    'Which AI agents can you build?',
    'How do I get started with AI?',
    'Tell me about AI SmartGrader',
    'How can I contact you?'
  ];

  private abort?: AbortController;

  constructor(
    private ai: ChatAiService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.addBotMessage('Hi! 👋 I\'m Indie, your personal AI assistant. Ask me anything about our AI services, AI agents, AI SmartGrader, how we work or how to reach us.');
    this.suggestions = this.starterQuestions;
  }

  /**
   * Toggle chat window open/close
   */
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      if (this.aiEnabled === null) this.checkAi();
      this.scrollToBottom();
      setTimeout(() => this.inputBox?.nativeElement.focus(), 150);
    }
  }

  /**
   * Close chat window
   */
  closeChat(): void {
    this.isChatOpen = false;
  }

  private async checkAi(): Promise<void> {
    this.aiEnabled = await this.ai.isAvailable();
  }

  /** Send a suggestion chip as if the visitor had typed it. */
  ask(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  /**
   * Send user message
   */
  async sendMessage(): Promise<void> {
    const question = this.userInput.trim();
    if (!question || this.isWaitingForResponse) {
      return;
    }

    this.addUserMessage(question);
    this.userInput = '';
    this.suggestions = [];
    this.isWaitingForResponse = true;
    const reply = this.addBotMessage('', true);

    // re-check each time the AI was unreachable, so the chat recovers once the server is back
    if (!this.aiEnabled) await this.checkAi();

    if (!this.aiEnabled) {
      this.showError(reply, 'Our AI assistant is offline right now. Please try again shortly, or contact us at info@indowestunited.com or +91 7901666696.');
      return;
    }

    try {
      await this.streamAiReply(reply);
    } catch (error) {
      if (reply.text) {
        // the answer was cut off part-way: keep what arrived
        this.finishReply(reply);
      } else if (error instanceof ChatAiError && error.message === 'rate_limited') {
        this.showError(reply, "I'm answering a lot of questions right now. Please try again in a minute.");
      } else {
        if (error instanceof ChatAiError && (error.status === 0 || error.status === 503)) {
          this.aiEnabled = false;
        }
        this.showError(reply, "Sorry, I couldn't answer that just now. Please try again, or contact us at info@indowestunited.com.");
      }
    }
    this.isWaitingForResponse = false;
  }

  private showError(reply: Message, text: string): void {
    reply.text = text;
    reply.html = formatChatText(text);
    reply.isError = true;
    this.finishReply(reply);
    this.isWaitingForResponse = false;
    this.scrollToBottom();
  }

  /** Streams the AI's answer into the reply bubble as it is written. */
  private async streamAiReply(reply: Message): Promise<void> {
    const history: ChatTurn[] = this.messages
      .filter(m => m !== reply && !m.isLoading && !m.isError && m.text && m.id > 0)   // id 0 is the greeting
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', text: m.text }));

    this.abort = new AbortController();

    await this.ai.stream(history, text => {
      this.zone.run(() => {
        reply.isLoading = false;
        reply.isStreaming = true;
        reply.text += text;
        reply.html = formatChatText(reply.text);
        this.scrollToBottom();
      });
    }, this.abort.signal);

    this.finishReply(reply);
  }

  private finishReply(reply: Message): void {
    reply.isLoading = false;
    reply.isStreaming = false;
  }

  /** Links inside answers navigate within the site instead of reloading the page. */
  onMessageClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    if (href && href.startsWith('/')) {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }

  /**
   * Add user message to chat
   */
  private addUserMessage(text: string): void {
    this.messages.push({
      id: this.messageCounter++,
      text: text,
      html: formatChatText(text),
      sender: 'user',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  /**
   * Add bot message to chat
   */
  private addBotMessage(text: string = '', isLoading: boolean = false): Message {
    const message: Message = {
      id: this.messageCounter++,
      text: text,
      html: formatChatText(text),
      sender: 'bot',
      timestamp: new Date(),
      isLoading: isLoading
    };
    this.messages.push(message);
    this.scrollToBottom();
    return message;
  }

  /**
   * Scroll chat to bottom
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBox = this.messageList?.nativeElement;
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 30);
  }

  /**
   * Handle Enter key press
   */
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngOnDestroy(): void {
    this.abort?.abort();
  }
}
