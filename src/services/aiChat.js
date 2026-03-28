export async function getAIChatResponse(messages) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(`AI error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I encountered an error. Please try again.';
  } catch (error) {
    console.error('Chat context error:', error);
    return 'Sorry, I am having trouble connecting right now. Please try again later.';
  }
}
