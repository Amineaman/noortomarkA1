export async function getAIChatResponse(messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('AI detailed error:', data);
      const errMsg = data.error?.message || response.statusText;
      throw new Error(`AI error: ${response.status} ${errMsg}`);
    }

    return data.choices?.[0]?.message?.content || 'I encountered an error. Please try again.';
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw error instanceof Error ? error : new Error('Failed to fetch AI response.');
  } finally {
    clearTimeout(timeoutId);
  }
}
