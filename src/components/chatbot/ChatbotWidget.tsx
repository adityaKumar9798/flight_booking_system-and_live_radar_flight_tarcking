'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { X, Send, Bot, Plane } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Robot3D from './Robot3D';
import styles from './ChatbotWidget.module.css';
import { createChatSession, saveChatMessage } from '@/lib/db/chat';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export default function ChatbotWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', content: 'Hi there! I am your AI Flight Assistant. Where would you like to travel today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Ensure we have a session ID before saving
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await createChatSession();
      if (currentSessionId) setSessionId(currentSessionId);
    }

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    
    if (currentSessionId) {
      saveChatMessage(currentSessionId, userMsg);
    }

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: loadingId, role: 'ai', content: '✈️ Searching my systems...' }]);

    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      let bookings = [];
      
      if (auth.currentUser) {
        try {
          const q = query(
            collection(db, 'bookings'),
            where('userId', '==', auth.currentUser.uid),
            limit(10) // Fetch a bit more just in case, since we can't orderBy
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
          });
          
          // Sort by dateBooked in JavaScript to avoid Firestore index requirement
          bookings.sort((a, b) => {
            const dateA = a.dateBooked ? new Date(a.dateBooked).getTime() : 0;
            const dateB = b.dateBooked ? new Date(b.dateBooked).getTime() : 0;
            return dateB - dateA; // Descending
          });
          
          // Limit to 5 after sorting
          bookings = bookings.slice(0, 5);
        } catch (dbErr) {
          console.error("Failed to fetch bookings on client:", dbErr);
        }
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
        },
        body: JSON.stringify({ 
          message: input,
          userId: auth.currentUser?.uid,
          userName: auth.currentUser?.displayName || "User",
          bookingsContext: bookings
        }),
      });

      const data = await response.json();
      
      const aiMsg = { id: loadingId, role: 'ai', content: data.message || "Something went wrong." };
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? aiMsg : msg
      ));

      if (currentSessionId) {
        saveChatMessage(currentSessionId, aiMsg);
      }

      if (data.redirect) {
        setTimeout(() => {
          setIsOpen(false);
          router.push(data.redirect);
        }, 1500); // Give user a moment to read the redirect message
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? { ...msg, content: "Sorry, I'm having trouble connecting to my servers right now." } : msg
      ));
    }
  };

  const quickActions = [
    "Find cheapest flight to Delhi",
    "Track my flight status",
    "Weekend flights to Mumbai"
  ];

  const handleQuickAction = (text: string) => {
    setInput(text);
    // Optionally auto-send
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Chat Window */}
      <div className={`${styles.chatWindowContainer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}><Bot size={20} /> AI Flight Assistant</div>
            <div className={styles.headerSubtitle}>Smart Booking Assistant</div>
          </div>
          <button className={styles.closeButton} onClick={toggleChat} aria-label="Close chat">
            <X size={18} />
          </button>
        </div>
        
        <div className={styles.messageArea}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
              {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
            </div>
          ))}
          {messages.length === 1 && (
            <div className={styles.quickActions}>
              {quickActions.map((action, idx) => (
                <button key={idx} className={styles.quickActionBtn} onClick={() => handleQuickAction(action)}>
                  {action}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className={styles.sendButton} 
            onClick={handleSend} 
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Floating Robot Button */}
      <button 
        className={styles.robotButton} 
        onClick={toggleChat}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        aria-label="Toggle AI Chat"
      >
        <div className={styles.robotCanvasContainer}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Suspense fallback={null}>
              <Robot3D hovered={hovered} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </button>
    </div>
  );
}
