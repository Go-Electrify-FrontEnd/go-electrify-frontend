# AI Chatbot Setup Guide

This guide will help you set up and test the AI-powered chatbot in the Go-Electrify dashboard.

## Quick Start

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

### 2. Configure Environment

Create a `.env.local` file in the project root (if it doesn't exist):

```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:

```bash
# OpenAI API Configuration (for AI Chatbot)
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: Never commit your `.env.local` file to Git!

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm run dev
```

### 5. Test the Chatbot

1. Open your browser and navigate to http://localhost:3000
2. Log in to access the dashboard
3. Look for the floating chat button in the bottom-right corner
4. Click the button to open the chat window
5. Type a message like "Hello!" and press Enter

## What Was Implemented

### Files Created

1. **API Route**: [src/app/api/chat/route.ts](src/app/api/chat/route.ts)
   - Handles POST requests to `/api/chat`
   - Uses OpenAI GPT-4o-mini model
   - Streams responses in real-time

2. **Chat Component**: [src/features/chatbot/components/chat-popup.tsx](src/features/chatbot/components/chat-popup.tsx)
   - Popup chat interface
   - Floating button trigger
   - Message history
   - Real-time streaming

3. **Documentation**: [src/features/chatbot/README.md](src/features/chatbot/README.md)
   - Complete feature documentation
   - Customization guide
   - Troubleshooting tips

### Files Modified

1. **Dashboard Layout**: [src/app/(app-layout)/dashboard/layout.tsx](src/app/(app-layout)/dashboard/layout.tsx)
   - Added `<ChatPopup />` component
   - Available on all dashboard pages

2. **Environment Example**: [.env.example](.env.example)
   - Added `OPENAI_API_KEY` configuration

## Features

- ✅ Real-time AI responses with streaming
- ✅ Clean, modern popup UI
- ✅ Message history
- ✅ Error handling
- ✅ Loading states
- ✅ Stop generation button
- ✅ Regenerate last response
- ✅ Responsive design
- ✅ Smooth animations

## Testing the Chatbot

Try these example questions:

```
1. "How do I find charging stations near me?"
2. "What is the pricing for charging my EV?"
3. "How do I add money to my wallet?"
4. "Tell me about reservations"
5. "What connector types are available?"
```

## Customization

### Change AI Model

Edit [src/app/api/chat/route.ts](src/app/api/chat/route.ts):

```typescript
model: openai("gpt-4o-mini"), // Change to "gpt-4o" for better responses
```

Models:
- `gpt-4o-mini`: Fast, cost-effective (recommended)
- `gpt-4o`: More capable, higher cost
- `gpt-4-turbo`: Balance of speed and capability

### Customize System Prompt

Edit the `system` field in [src/app/api/chat/route.ts](src/app/api/chat/route.ts) to change how the AI responds:

```typescript
system: `You are a helpful AI assistant for Go-Electrify...`
```

### Change Position or Size

Edit [src/features/chatbot/components/chat-popup.tsx](src/features/chatbot/components/chat-popup.tsx):

```typescript
// Current: bottom-right, 400x600px
className="w-[400px] h-[600px]" // Change dimensions
className="fixed bottom-6 right-6" // Change position
```

## Troubleshooting

### Problem: Chatbot button not visible

**Solution**:
- Make sure you're on a dashboard page (e.g., `/dashboard`)
- Check browser console for errors
- Verify the build was successful: `pnpm run build`

### Problem: "Failed to process chat request"

**Solutions**:
1. Check if `OPENAI_API_KEY` is set in `.env.local`
2. Verify your OpenAI account has credits
3. Check the browser Network tab for error details
4. Look at server logs in the terminal

### Problem: TypeScript errors

**Solution**:
```bash
pnpm run build
```

If errors persist, check:
- All dependencies are installed: `pnpm install`
- AI SDK versions match package.json

### Problem: No streaming, messages appear all at once

**Solution**:
- This is expected behavior for very short responses
- Try longer queries to see streaming in action
- Streaming works when the AI generates longer responses

## Cost Considerations

### OpenAI Pricing (as of 2025)

**GPT-4o-mini** (default):
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- **Very cost-effective for most use cases**

**GPT-4o**:
- Input: ~$2.50 per 1M tokens
- Output: ~$10.00 per 1M tokens
- Use for more complex queries

### Estimate

Average chat message: ~100-500 tokens
- 1,000 messages with GPT-4o-mini ≈ $0.50 - $2.00
- 1,000 messages with GPT-4o ≈ $7.50 - $25.00

**Tip**: Start with `gpt-4o-mini` to minimize costs during testing.

## Next Steps

### Recommended Enhancements

1. **Add Rate Limiting**: Prevent abuse by limiting requests per user
2. **Persist Chat History**: Save conversations to database
3. **User Context**: Include user role (driver/admin) in prompts
4. **Quick Replies**: Add suggested questions
5. **Analytics**: Track popular queries and user satisfaction

### Production Checklist

- [ ] Set production `OPENAI_API_KEY`
- [ ] Implement rate limiting
- [ ] Add error monitoring (e.g., Sentry)
- [ ] Test on mobile devices
- [ ] Add usage analytics
- [ ] Review system prompt for accuracy
- [ ] Set spending limits on OpenAI account

## Resources

- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Feature README**: [src/features/chatbot/README.md](src/features/chatbot/README.md)

## Support

For issues or questions:
1. Check [src/features/chatbot/README.md](src/features/chatbot/README.md)
2. Review OpenAI API status: https://status.openai.com
3. Check Vercel AI SDK GitHub: https://github.com/vercel/ai

---

**Happy chatting! 🤖**
