import React, { useEffect, useRef, useState } from 'react';
import { getAIChatResponse } from '../../services/aiChat.js';
import { useI18n } from '../../hooks/useI18n';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const lastPayloadRef = useRef(null);
  const { lang } = useI18n();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const welcomeMsgs = {
      en: "Hi, I'm the Noorbot. How can I help with your marketing strategy today?",
      fr: "Bonjour, je suis le Noorbot. Comment puis-je vous aider avec votre stratégie marketing aujourd'hui ?",
      ar: "أهلاً، أنا نوربوت. كيف نقدر نعاونك فاستراتيجية التسويق ديالك اليوم؟",
    };

    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMsgs[lang] || welcomeMsgs.en }]);
    }
  }, [lang, messages.length]);

  const send = async (nextMessages) => {
    setIsLoading(true);
    setError(null);
    lastPayloadRef.current = nextMessages;

    try {
      const chatHistory = nextMessages.map((msg) => ({ role: msg.role, content: msg.content }));
      const aiResponse = await getAIChatResponse(chatHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');

    await send(nextMessages);
  };

  const handleRetry = async () => {
    if (!lastPayloadRef.current || isLoading) return;
    await send(lastPayloadRef.current);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] bg-bg/95 border border-border rounded-xl shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold-dk">
                <span className="text-gold text-xs font-bold">NB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-semibold text-gold tracking-widest uppercase">
                  NoorToMark
                </span>
                <span className="text-[10px] text-muted2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AI Assistant Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted2 hover:text-text transition-colors p-1"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 scroll-smooth">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200 flex items-center justify-between gap-3">
                <span className="leading-snug">{error}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="shrink-0 rounded-md bg-red-500/20 px-2 py-1 text-[11px] hover:bg-red-500/30 disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-[90%] px-4 py-3 rounded-xl text-[0.85rem] leading-[1.6] whitespace-pre-wrap transition-all ${
                    msg.role === 'user'
                      ? 'bg-gold/10 text-gold border border-gold-dk/30 rounded-br-none'
                      : 'bg-surface/60 text-text border border-border rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface/50 text-gold px-4 py-2 rounded-lg border border-border rounded-bl-none flex gap-1">
                  <span className="w-1 h-1 bg-gold rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-gold rounded-full animate-bounce delay-100" />
                  <span className="w-1 h-1 bg-gold rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-surface">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Noorbot..."
                disabled={isLoading}
                className="flex-grow bg-bg/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold-dk transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gold text-bg p-2 rounded-lg hover:bg-gold-lt transition-colors disabled:opacity-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-surface border border-border scale-90' : 'bg-gold border border-gold-dk'
        }`}
        type="button"
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-gold"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-bg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
