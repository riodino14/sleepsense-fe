import React from 'react';
import { useNotification } from '../context/NotificationContext';
import '../styles/forms.css';

export default function NotificationReminder() {
  const { permission, requestPermission } = useNotification();

  if (permission === 'granted') {
    return <div className="notif-active">✅ Notifikasi aktif</div>;
  }

  return (
    <button className="notif-activate-btn" onClick={requestPermission}>
      🔔 Aktifkan Notifikasi Pengingat
    </button>
  );
}