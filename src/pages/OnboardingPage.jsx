import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveOnboarding } from '../services/authService';

const FOCUS_OPTIONS = [
  { value: 'sleep_quality', label: '🌙 Kualitas Tidur', desc: 'Ingin tidur lebih nyenyak dan bangun segar' },
  { value: 'screen_time', label: '📱 Kurangi Screen Time', desc: 'Ingin mengurangi kebiasaan main HP sebelum tidur' },
  { value: 'stress', label: '😰 Kelola Stres', desc: 'Ingin lebih rileks dan tenang' },
  { value: 'health', label: '❤️ Kesehatan Umum', desc: 'Ingin memahami risiko kesehatan terkait tidur' },
  { value: 'habit', label: '🔄 Bangun Kebiasaan', desc: 'Ingin rutinitas tidur yang lebih konsisten' }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [focus, setFocus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeOnboarding, user, token } = useAuth();
  const navigate = useNavigate();

  const handleFinish = async () => {
    if (!nickname.trim()) { setError('Nama panggilan wajib diisi'); return; }
    if (!focus) { setError('Pilih fokus utama kamu'); return; }

    setLoading(true);
    setError('');
    try {
      // FIX: Simpan ke database dulu baru update state lokal
      await saveOnboarding(nickname.trim(), focus, token);
      completeOnboarding({ nickname: nickname.trim(), focus, isOnboarded: true });
      navigate('/');
    } catch (err) {
      console.error('Onboarding error:', err);
      // Kalau API gagal, tetap lanjut (graceful fallback)
      completeOnboarding({ nickname: nickname.trim(), focus, isOnboarded: true });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'linear-gradient(160deg, #E8EEF6 0%, #F0F4F8 100%)'
    }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 48 }}>👋</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>Halo, {user?.username}!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {step === 1 ? 'Siapa nama panggilanmu?' : 'Apa fokus utama kamu menggunakan SleepSense?'}
          </p>
        </div>

        {step === 1 ? (
          <div className="card">
            <div className="input-group">
              <label>Nama Panggilan</label>
              <input
                type="text" value={nickname}
                onChange={e => { setNickname(e.target.value); setError(''); }}
                placeholder="Misal: Budi, Ani, Kak Rina"
                autoFocus
              />
            </div>
            <button className="btn btn-primary btn-block"
              onClick={() => { if (nickname.trim()) { setStep(2); setError(''); } else setError('Nama panggilan wajib diisi'); }}>
              Selanjutnya →
            </button>
          </div>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFocus(opt.value); setError(''); }}
                  style={{
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: focus === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: focus === opt.value ? 'rgba(74,111,165,0.08)' : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>← Kembali</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleFinish} disabled={loading}>
                {loading ? 'Menyimpan...' : '🎉 Mulai!'}
              </button>
            </div>
          </div>
        )}
        {error && <p className="error-text" style={{ textAlign: 'center', marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}
