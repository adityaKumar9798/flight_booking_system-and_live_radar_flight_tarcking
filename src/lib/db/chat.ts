import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: any;
}

export const createChatSession = async (userId: string | null = null) => {
  try {
    const sessionRef = await addDoc(collection(db, 'chatSessions'), {
      userId: userId || 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
};

export const saveChatMessage = async (sessionId: string, message: { id: string, role: string, content: string }) => {
  try {
    await setDoc(doc(db, `chatSessions/${sessionId}/messages`, message.id), {
      ...message,
      timestamp: serverTimestamp(),
    });
    
    // Update session timestamp
    await setDoc(doc(db, 'chatSessions', sessionId), {
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};

export const getChatHistory = async (sessionId: string) => {
  try {
    const messagesRef = collection(db, `chatSessions/${sessionId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as ChatMessage);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};
