import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSleepData } from '../context/SleepDataContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { targetSleep, updateTarget } = useSleepData();
  const { settings, updateSettings, permission, requestPermission } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-content">
      <h2 style={{ fontSize: 20, marginBottom: 16, color:'white' }}>⚙️ Pengaturan</h2>

      {/* Profil */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>👤 Profil</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Nama Panggilan:</strong> {user?.nickname || '-'}</p>
        <p><strong>Fokus Utama:</strong> {user?.focus || '-'}</p>
      </div>

      {/* Target Tidur */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🎯 Target Tidur</h3>
        <div className="input-group">
          <label>Durasi Target (jam)</label>
          <input type="number" min="5" max="12" step="0.5" value={targetSleep.hours}
            onChange={e => updateTarget({ hours: Number(e.target.value) })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Jam Tidur</label>
            <input type="time" value={targetSleep.bedtime}
              onChange={e => updateTarget({ bedtime: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Jam Bangun</label>
            <input type="time" value={targetSleep.wakeTime}
              onChange={e => updateTarget({ wakeTime: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Notifikasi */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🔔 Notifikasi</h3>
        {permission !== 'granted' ? (
          <button className="btn btn-accent btn-block btn-sm" onClick={requestPermission} style={{ marginBottom: 12 }}>
            Aktifkan Notifikasi
          </button>
        ) : (
          <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: 12 }}>✅ Notifikasi diizinkan</p>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.enabled}
            onChange={e => updateSettings({ enabled: e.target.checked })} />
          <span>Aktifkan semua notifikasi</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.bedtimeReminder}
            onChange={e => updateSettings({ bedtimeReminder: e.target.checked })} />
          <span>Pengingat jadwal tidur</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.screenTimeReminder}
            onChange={e => updateSettings({ screenTimeReminder: e.target.checked })} />
          <span>Pengingat batasi screen time</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.checkinReminder}
            onChange={e => updateSettings({ checkinReminder: e.target.checked })} />
          <span>Check-in harian pagi</span>
        </label>
      </div>

      {/* Kontak Darurat */}
      <div className="card" style={{ marginBottom: 16, background: '#FFF3E0' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>🆘 Kontak Darurat</h3>
        <p style={{ fontSize: '0.85rem' }}>Jika kamu atau orang terdekat membutuhkan bantuan segera:</p>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>📞 KESWA: 119 ext 8</p>
        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>📞 021-500-454</p>
      </div>

      {/* Logout */}
      <button className="btn btn-danger btn-block" onClick={handleLogout} style={{ marginTop: 8 }}>
        🚪 Keluar
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 24 }}>
        SleepSense v1.0 · Tidak menggantikan diagnosis medis profesional
      </p>
    </div>
  );
}