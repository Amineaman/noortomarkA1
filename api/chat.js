export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
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
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://noortomark-ten.vercel.app',
        'X-Title': 'Noortomark AI Sales Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('OpenRouter error:', error);
    return res.status(500).json({ error: 'Failed to communicate with AI' });
  }
}
