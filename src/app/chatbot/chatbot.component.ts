import { Component, OnInit } from '@angular/core';
import { OpenAiService } from './openai.service';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  isChatOpen = false;
  messages: Message[] = [];
  userInput = '';
  messageCounter = 0;
  isWaitingForResponse = false;
  apiKeyNotSet = false;

  constructor(private openAiService: OpenAiService) { }

  ngOnInit(): void {
    // Set your OpenAI API key here
    const apiKey = 'AIzaSyD7ern8qEkq_Y_GjgtGrovoEpz0qzWIX1A';
    
    if (apiKey) {
      this.openAiService.setApiKey(apiKey);
      this.apiKeyNotSet = false;
      this.addBotMessage('Hello! 👋 Welcome to Indowest United. How can I help you today?');
    } else {
      this.apiKeyNotSet = true;
      this.addBotMessage('⚠️ API key not configured. Contact admin.');
    }
  }

  /**
   * Set API key manually
   */
  setApiKey(key: string): void {
    if (key.trim()) {
      this.openAiService.setApiKey(key);
      localStorage.setItem('OPENAI_API_KEY', key);
      this.apiKeyNotSet = false;
      this.messages = [];
      this.addBotMessage('Hello! 👋 Welcome to Indowest United. How can I help you today?');
    }
  }

  /**
   * Toggle chat window open/close
   */
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  /**
   * Close chat window
   */
  closeChat(): void {
    this.isChatOpen = false;
  }

  /**
   * Send user message
   */
  sendMessage(): void {
    if (!this.userInput.trim() || this.isWaitingForResponse) {
      return;
    }

    if (this.apiKeyNotSet) {
      this.addBotMessage('Please configure your OpenAI API key first.');
      return;
    }

    // Add user message
    this.addUserMessage(this.userInput);
    const userQuestion = this.userInput;
    this.userInput = '';

    // Add loading message
    this.isWaitingForResponse = true;
    this.addBotMessage('', true); // Loading message

    // Call OpenAI API
    this.openAiService.sendMessage(userQuestion).subscribe({
      next: (response) => {
        this.isWaitingForResponse = false;
        
        // Remove loading message
        if (this.messages.length > 0 && this.messages[this.messages.length - 1].isLoading) {
          this.messages.pop();
        }

        // Add bot response
        if (response.choices && response.choices.length > 0) {
          const botResponse = response.choices[0].message.content;
          this.addBotMessage(botResponse);
        } else {
          this.addBotMessage('Sorry, I couldn\'t generate a response. Please try again.');
        }

        this.scrollToBottom();
      },
      error: (error) => {
        this.isWaitingForResponse = false;
        
        // Remove loading message
        if (this.messages.length > 0 && this.messages[this.messages.length - 1].isLoading) {
          this.messages.pop();
        }

        console.error('OpenAI Error:', error);
        
        let errorMessage = 'An error occurred. ';
        if (error.status === 401) {
          errorMessage += 'Invalid API key. Please check your OpenAI API key.';
        } else if (error.status === 429) {
          errorMessage += 'Rate limited. Please try again later.';
        } else if (error.status === 500) {
          errorMessage += 'OpenAI service error. Please try again later.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        this.addBotMessage(errorMessage);
        this.scrollToBottom();
      }
    });
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
  private addBotMessage(text: string = '', isLoading: boolean = false): void {
    this.messages.push({
      id: this.messageCounter++,
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      isLoading: isLoading
    });
    this.scrollToBottom();
  }

  /**
   * Scroll chat to bottom
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBox = document.querySelector('.chatbot-messages');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 100);
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
}
