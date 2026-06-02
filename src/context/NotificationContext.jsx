import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState(Notification.permission);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sleepsense_notif');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      bedtimeReminder: true,
      bedtimeTime: '21:30',
      screenTimeReminder: true,
      screenTimeLimit: 60,
      checkinReminder: true,
      checkinTime: '08:00'
    };
  });

  useEffect(() => {
    localStorage.setItem('sleepsense_notif', JSON.stringify(settings));
  }, [settings]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const sendLocalNotification = useCallback((title, options = {}) => {
    if (permission === 'granted' && settings.enabled) {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        ...options
      });
    }
  }, [permission, settings.enabled]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <NotificationContext.Provider value={{
      permission, settings, requestPermission, sendLocalNotification, updateSettings
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be inside NotificationProvider');
  return ctx;
};