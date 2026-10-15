import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatKnowledgeService, ChatLink } from './chat-knowledge.service';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  link?: ChatLink;
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

  private replyTimer: any;

  constructor(private knowledge: ChatKnowledgeService) { }

  ngOnInit(): void {
    this.addBotMessage('Hi! 👋 I\'m the IndoWest assistant. Ask me about our AI services, AI agents, AI SmartGrader, how we work or how to reach us.');
    this.suggestions = this.knowledge.starterQuestions;
  }

  /**
   * Toggle chat window open/close
   */
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
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

  /** Send a suggestion chip as if the visitor had typed it. */
  ask(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  /**
   * Send user message
   */
  sendMessage(): void {
    const question = this.userInput.trim();
    if (!question || this.isWaitingForResponse) {
      return;
    }

    this.addUserMessage(question);
    this.userInput = '';
    this.suggestions = [];

    // short "typing" pause so the reply doesn't appear instantly
    this.isWaitingForResponse = true;
    this.addBotMessage('', true);

    this.replyTimer = setTimeout(() => {
      const reply = this.knowledge.answer(question);

      if (this.messages.length > 0 && this.messages[this.messages.length - 1].isLoading) {
        this.messages.pop();
      }
      this.addBotMessage(reply.text, false, reply.link);
      this.suggestions = reply.suggestions;
      this.isWaitingForResponse = false;
    }, 650);
  }

  /**
   * Add user message to chat
   */
  private addUserMessage(text: string): void {
    this.messages.push({
      id: this.messageCounter++,
      text: text,
      sender: 'user',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  /**
   * Add bot message to chat
   */
  private addBotMessage(text: string = '', isLoading: boolean = false, link?: ChatLink): void {
    this.messages.push({
      id: this.messageCounter++,
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      isLoading: isLoading,
      link: link
    });
    this.scrollToBottom();
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
    }, 50);
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
    clearTimeout(this.replyTimer);
  }
}
