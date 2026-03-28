import React, { useState, useRef, useEffect } from 'react';
import { getAIChatResponse } from '../../services/aiChat';
import { useI18n } from '../../hooks/useI18n';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { lang, t } = useI18n();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial bot message based on current language
    const welcomeMsgs = {
      en: "Hi, I'm the Noorbot. How can I help with your marketing strategy today?",
      fr: "Bonjour, je suis le Noorbot. Comment puis-je vous aider avec votre stratégie marketing aujourd'hui ?",
      ar: "أهلاً، أنا نوربوت. كيف نقدر نعاونك في استراتيجية التسويق ديالك اليوم؟"
    };
    
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMsgs[lang] || welcomeMsgs.en }]);
    }
  }, [lang, messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await getAIChatResponse(chatHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having a bit of trouble connecting to the AI brain. Please try again or reach out directly!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex flex-col items-end`}>
      {/* Bot Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] bg-bg/95 border border-border rounded-xl shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold-dk">
                <span className="text-gold text-xs font-bold">NB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-semibold text-gold tracking-widest uppercase">NoorToMark</span>
                <span className="text-[10px] text-muted2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  AI Assistant Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted2 hover:text-text transition-colors p-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gold/10 text-gold border border-gold-dk/30 rounded-br-none'
                      : 'bg-surface/50 text-text border border-border rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface/50 text-gold px-4 py-2 rounded-lg border border-border rounded-bl-none flex gap-1">
                    <span className="w-1 h-1 bg-gold rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-gold rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-1 bg-gold rounded-full animate-bounce delay-200"></span>
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
                className="flex-grow bg-bg/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold-dk transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gold text-bg p-2 rounded-lg hover:bg-gold-lt transition-colors disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                   <line x1="22" y1="2" x2="11" y2="13" />
                   <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-surface border border-border scale-90' : 'bg-gold border border-gold-dk'
        }`}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gold">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-bg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
