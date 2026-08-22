'use client';

import { useState } from 'react';
import styles from './Copilot.module.css';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello Admin! I am the AeroSky AI Copilot. I can analyze operations, fetch booking data, and provide insights. What can I help you with today?' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "How many bookings did we receive today?",
    "What is our monthly revenue?",
    "Which route is most popular?",
    "Show today's cancelled bookings.",
    "Analyze this month's performance."
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    
    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Here is the data for: "${text}".\n\nBased on the latest database query, AeroSky is performing 12.4% better this week. The Delhi → Mumbai route continues to be our top performer with 1,248 confirmed bookings.`
      }]);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 1 10 10v9a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h2a8 8 0 0 0-16 0h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9A10 10 0 0 1 12 2Z"></path></svg>
          AeroSky AI Copilot
        </h1>
        <p className={styles.subtitle}>Ask anything about your flight operations.</p>
      </div>

      <div className={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.role === 'bot' ? styles.botMessage : styles.userMessage}`}>
            <div className={`${styles.avatar} ${msg.role === 'bot' ? styles.botAvatar : styles.userAvatar}`}>
              {msg.role === 'bot' ? 'AI' : 'A'}
            </div>
            <div className={styles.bubble} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.suggestions}>
        {suggestions.map((s, i) => (
          <div key={i} className={styles.suggestionChip} onClick={() => handleSend(s)}>
            {s}
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="Ask a question..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button className={styles.sendBtn} onClick={() => handleSend(input)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );
}
