/**
 * IndoWest AI chat server (local development)
 *
 * Keeps the AI provider's API key off the website: the browser sends the
 * conversation here, this server adds the website knowledge and streams the
 * AI's reply back word by word. The chat logic itself lives in chat-core.js,
 * which the live site also runs as Vercel functions (see api/chat).
 *
 *   Setup:  copy .env.example to .env and put your GEMINI_API_KEY in it
 *   Run:    npm run chat-server        (from the indowest-website folder)
 *
 * No npm packages needed — only Node.js 18+ built-ins.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------- configuration (.env file next to this script, or real env vars) ----------

loadEnvFile(path.join(__dirname, '.env'));

const { handleChat, handleHealth, sendJson, API_KEY, MODEL } = require('./chat-core');

const PORT = Number(process.env.CHAT_PORT || 3000);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',').map(o => o.trim()).filter(Boolean);

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return void res.writeHead(204).end();

  const url = (req.url || '').split('?')[0];

  if (req.method === 'GET' && url === '/api/chat/health') return handleHealth(req, res);
  if (req.method === 'POST' && url === '/api/chat') return handleChat(req, res);

  sendJson(res, 404, { error: 'not_found' });
});

/** Minimal .env reader: KEY=value lines, # comments. */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match || line.trim().startsWith('#')) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

server.listen(PORT, () => {
  console.log(`IndoWest chat server on http://localhost:${PORT}`);
  console.log(API_KEY
    ? `AI enabled (model: ${MODEL})`
    : 'No GEMINI_API_KEY set — the website chatbot will use its built-in answers. Add the key to chat-server/.env');
});
