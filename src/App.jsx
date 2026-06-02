import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { SleepDataProvider } from './context/SleepDataContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SleepDataProvider>
            <ChatProvider>
              <AppRouter />
            </ChatProvider>
          </SleepDataProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}