# OpenAI-Powered Chatbot for Indowest Website

## Overview
This AI chatbot uses OpenAI's GPT-3.5-Turbo to answer questions based on Indowest website content. If the answer isn't in the website content, it directs users to contact support at info@indowest.com.

## Features
✅ AI-powered responses using OpenAI API
✅ Answers based on website content only
✅ Beautiful floating chat widget UI
✅ Support contact fallback when info not available
✅ Real-time streaming responses
✅ Mobile responsive design
✅ localStorage for API key (secure storage)

## Setup Instructions

### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Create a new API key
4. Copy the key (you won't be able to see it again)

### Step 2: Install Dependencies
The required package is already included. No additional npm install needed.

### Step 3: Start the Application
```bash
cd indowest-website
ng serve --port 4200
```

### Step 4: Use the Chatbot
1. Open http://localhost:4200
2. Click the floating chat bubble in the bottom right
3. Enter your OpenAI API key in the setup panel
4. Start asking questions about Indowest!

## How It Works

### User Flow:
1. User clicks the chat button
2. User enters their OpenAI API key (stored in localStorage)
3. User types a question
4. Question + Website content sent to OpenAI API
5. OpenAI returns an answer
6. Answer displayed in chat

### API Integration:
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: GPT-3.5-Turbo (cost-effective)
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 500 (concise responses)

### Website Content:
The chatbot has access to all Indowest information including:
- Company background (founded 2012, India-based)
- Services (AI Automation, Azure/AWS, Software Dev)
- Team information (13+ professionals)
- Engagement models (Dedicated, Project-based, Hybrid)
- Work process (4-step delivery model)
- Contact information (info@indowest.com)
- Technologies (Angular, React, .NET, Python, etc.)

## Code Structure

```
src/app/chatbot/
├── chatbot.component.ts       # Main component logic
├── chatbot.component.html     # UI template
├── chatbot.component.css      # Styling
├── openai.service.ts          # OpenAI API integration
├── website-content.service.ts # Stores website content
├── chatbot.component.spec.ts  # Tests
├── openai.service.spec.ts     # Tests
└── website-content.service.spec.ts  # Tests
```

## Configuration

### Change OpenAI Model
Edit `openai.service.ts`:
```typescript
model: 'gpt-3.5-turbo'  // Change to 'gpt-4' for more advanced responses
```

### Add More Website Content
Edit `website-content.service.ts` and add to the `websiteContent` string:
```typescript
private websiteContent = `
YOUR NEW CONTENT HERE
`;
```

### Customize System Prompt
Edit `openai.service.ts` to modify how the AI behaves:
```typescript
const systemPrompt = `Your custom instructions here`;
```

## API Costs
- **GPT-3.5-Turbo**: ~$0.0005 per 1K input tokens, ~$0.0015 per 1K output tokens
- **Typical conversation**: 0.1-0.5 cents per message
- Most questions cost less than 1 cent

## Security Notes
⚠️ **Important**: 
- API key is stored in localStorage - not ideal for production
- For production apps, create a backend API proxy
- Never commit API keys to git

## Troubleshooting

### "Invalid API key" Error
- Check your API key is correct
- Ensure API key has access to chat/completions endpoint
- Check account has available credits

### "Rate limited" Error
- You've exceeded OpenAI rate limits
- Wait a few minutes before trying again
- Upgrade your OpenAI account for higher limits

### No Response from AI
- Check browser console for errors (F12 → Console)
- Verify internet connection
- Ensure OpenAI API is not down

### Chat not appearing
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Verify ChatbotComponent is imported in app.module.ts

## Enhancement Ideas
- Add conversation history persistence
- Implement streaming responses
- Add feedback/rating system
- Support for follow-up questions
- Integration with analytics
- Multilingual support

## Support
For issues with the chatbot implementation, check:
1. Browser console for errors
2. Network tab to see API calls
3. OpenAI API status page
