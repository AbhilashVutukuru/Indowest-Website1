// Live site: GET /api/chat/health — runs as a Vercel serverless function.
const { handleHealth } = require('../../chat-server/chat-core');

module.exports = handleHealth;
