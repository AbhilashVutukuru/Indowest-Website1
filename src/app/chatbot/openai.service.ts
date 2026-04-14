import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { WebsiteContentService } from './website-content.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: ChatMessage;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private apiKey = '';
  // Updated to the high-availability lite model for 2026
  private apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent';

  constructor(
    private http: HttpClient,
    private contentService: WebsiteContentService
  ) { }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  sendMessage(userMessage: string): Observable<OpenAIResponse> {
    if (!this.apiKey) {
      return of(this.createErrorResponse('System: API Key is missing.'));
    }

    // ✅ 1. PREPARING THE PROMPT
    // This tells the AI exactly how to behave.
    const websiteData = this.contentService.getWebsiteContent();
    
    const systemPrompt = `You are the Indowest United official AI Assistant.
STRICT RULES:
1. Answer ONLY using the context provided below.
2. If the user's question is NOT related to Indowest or is not in the context, strictly reply with: "Please contact info@indowestunited.com"
3. Do not answer general knowledge questions (like weather, math, or other companies).
4. Be professional and concise.

CONTEXT:
${websiteData}

USER QUESTION:
${userMessage}`;

    // ✅ 2. BUILDING THE REQUEST BODY
    const body = {
      contents: [{
        parts: [{ text: systemPrompt }]
      }],
      generationConfig: { 
        temperature: 0.1, // Lower temperature makes it more "factual" and less "creative"
        maxOutputTokens: 500 
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-goog-api-key': this.apiKey
    });

    // ✅ 3. EXECUTING THE CALL
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(res => {
        if (res.candidates?.[0]?.finishReason === 'SAFETY') {
          return this.createErrorResponse('Please contact info@indowestunited.com');
        }

        const text = res?.candidates?.[0]?.content?.parts?.[0]?.text;
        return {
          choices: [{
            message: {
              role: 'assistant' as const,
              content: text?.trim() || 'Please contact info@indowestunited.com'
            }
          }]
        };
      }),
      catchError((error: HttpErrorResponse) => {
        let friendlyMessage = 'An unexpected error occurred.';
        if (error.status === 429) friendlyMessage = 'Rate limit reached. Please wait a minute.';
        if (error.status >= 500) friendlyMessage = 'Google servers are busy. Please try again in 10 seconds.';
        
        console.error(`[Gemini Error ${error.status}]`, error.error);
        return of(this.createErrorResponse(friendlyMessage));
      })
    );
  }

  private createErrorResponse(msg: string): OpenAIResponse {
    return {
      choices: [{
        message: { role: 'assistant' as const, content: msg }
      }]
    };
  }
}