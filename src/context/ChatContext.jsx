import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { sendMessage, sendQuickReply } from '../services/chatService';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sleepStats, setSleepStats] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  // Ambil statistik tidur saat user login
  useEffect(() => {
    if (!user) return;
    api.get('/sleep/stats')
      .then(res => setSleepStats(res.data))
      .catch(() => {});
  }, [user]);

  const addUserMessage = useCallback(async (content) => {
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Kirim semua konteks: user, sleepStats, DAN predictionResult
      const reply = await sendMessage(
        content,
        messages,
        user,
        sleepStats,
        predictionResult   // ← chatbot sekarang tahu hasil prediksi!
      );
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, aku lagi ada gangguan. Coba lagi ya 🙏'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, sleepStats, predictionResult]);

  const handleQuickReply = useCallback(async (optionKey) => {
    const quickLabels = {
      sleep_tips: 'Tips tidur lebih baik',
      screen_time: 'Cara kurangi screen time',
      mood_check: 'Cerita perasaan hari ini',
      dass_info: 'Tentang DASS-21',
      relaxation: 'Teknik relaksasi'
    };
    const displayText = quickLabels[optionKey] || optionKey;
    setMessages(prev => [...prev, { role: 'user', content: displayText }]);
    setIsLoading(true);
    try {
      const reply = await sendQuickReply(optionKey, user, sleepStats, predictionResult);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, coba lagi ya 🙏' }]);
    } finally {
      setIsLoading(false);
    }
  }, [user, sleepStats, predictionResult]);

  const clearChat = useCallback(() => setMessages([]), []);

  return (
    <ChatContext.Provider value={{
      messages, isLoading,
      addUserMessage, handleQuickReply, clearChat,
      sleepStats, predictionResult, setPredictionResult
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be inside ChatProvider');
  return ctx;
};
