export async function getAIChatResponse(messages) {
  try {
    // Try the serverless function first
    let response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
        // In local development, if /api/chat fails, we can try to call OpenRouter directly
        // IF we have the VITE_OPENROUTER_API_KEY set (for debugging)
        const devKey = String(import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
        if (devKey && import.meta.env.DEV) {
            const systemPrompt = `
You are a high-level AI sales assistant for NoorToMark, a marketing agency.
Mission: Identify business needs, suggest services (Ads, SEO, Branding, Web), and convert to leads/calls.
Tone: Confident, professional, persuasive. Mix Darija + simple business English.
Strategy: Understand -> Educate -> Suggest. Propose a call if traveler is interested.
`;
            response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${devKey}`,
                  'HTTP-Referer': 'https://noortomark-ten.vercel.app', // Required by OpenRouter
                  'X-Title': 'Noortomark Local Dev',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  model: 'openai/gpt-3.5-turbo', // Switching models for testing
                  messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                  ]
                })
            });
        }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('AI detailed error:', data);
      const errMsg = data.error?.message || response.statusText;
      
      // If the error is 401 (Unauthorized) or 'User not found', provide a helpful mock response
      if (response.status === 401 || errMsg.includes('User not found')) {
        return "⚠️ **DEMO MODE**: \n\nلقد وصلنا إلى هنا، ولكن يبدو أن مفتاح الـ **API Key** الخاص بك في OpenRouter غير صالح (401 User not found). \n\nالمشكل ليس من الكود، بل من الحساب الخاص بك. يجب عليك التأكد من أن حسابك في منصة OpenRouter يحتوي على رصيد كافٍ، أو أنك قمت بنسخ المفتاح الصحيح. \n\n*إلى حين إصلاح المفتاح، أنا أعمل في وضع التجربة.*";
      }

      throw new Error(`AI error: ${response.status} ${errMsg}`);
    }

    return data.choices?.[0]?.message?.content || 'I encountered an error. Please try again.';
  } catch (error) {
    console.error('Chat context error:', error);
    return 'Sorry, I am having trouble connecting right now. Please try again later.';
  }
}
