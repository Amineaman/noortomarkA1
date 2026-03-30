const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitStore = new Map();

function getClientIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (typeof xfwd === 'string' && xfwd.length > 0) return xfwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function applyRateLimitHeaders(res, { limit, remaining, resetSeconds }) {
  res.setHeader('RateLimit-Limit', String(limit));
  res.setHeader('RateLimit-Remaining', String(Math.max(0, remaining)));
  res.setHeader('RateLimit-Reset', String(resetSeconds));
}

function consumeRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.windowStartMs >= RATE_LIMIT_WINDOW_MS) {
    const next = { windowStartMs: now, count: 1 };
    rateLimitStore.set(ip, next);
    return {
      ok: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX - 1,
      resetSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - next.windowStartMs)) / 1000),
    };
  }

  record.count += 1;
  rateLimitStore.set(ip, record);

  return {
    ok: record.count <= RATE_LIMIT_MAX,
    limit: RATE_LIMIT_MAX,
    remaining: RATE_LIMIT_MAX - record.count,
    resetSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.windowStartMs)) / 1000),
  };
}

function isValidMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  for (const m of messages) {
    if (!m || typeof m !== 'object') return false;
    if (typeof m.role !== 'string' || typeof m.content !== 'string') return false;
    if (!['user', 'assistant'].includes(m.role)) return false;
    if (m.content.trim().length === 0) return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  const rl = consumeRateLimit(ip);
  applyRateLimitHeaders(res, rl);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.resetSeconds));
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
  }

  const { messages } = req.body || {};
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!isValidMessages(messages)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid 'messages'. Expected a non-empty array of { role: 'user'|'assistant', content: string }.",
      });
  }

  const systemPrompt = `
You are a high-level AI sales assistant for NoorToMark, a marketing agency.

Your mission:
- Identify potential clients
- Understand their business needs
- Guide them to the best service
- Convert them into leads or booked calls

Tone:
- Confident, professional, persuasive
- Friendly but not casual
- Mix Darija + simple business English

Behavior:
- Ask questions to understand the client's business
- Identify pain points (no sales, no visibility, no leads)
- Suggest solutions (ads, branding, website, strategy)

Services NoorToMark offers:
- Social media marketing
- Paid ads (Facebook, Instagram, TikTok)
- Website creation
- Branding & design
- Content strategy

Sales strategy:
- Never push directly
- First: understand → then educate → then suggest
- If user is interested:
    → propose a call or contact
- If user hesitates:
    → explain value and results

Goal:
Turn visitors into qualified leads and potential clients
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://noortomark-ten.vercel.app',
        'X-Title': 'Noortomark AI Sales Assistant',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      return res
        .status(response.status)
        .json({ error: data?.error?.message || data?.message || 'OpenRouter API failed' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to communicate with AI endpoint' });
  }
}
