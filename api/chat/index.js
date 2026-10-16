// Live site: POST /api/chat — runs as a Vercel serverless function.
// Needs GEMINI_API_KEY set in the Vercel project's Environment Variables.
const { handleChat } = require('../../chat-server/chat-core');

module.exports = handleChat;
