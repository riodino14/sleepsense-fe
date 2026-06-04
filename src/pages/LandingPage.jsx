import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.png';
// ── Star background generator ─────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: 'white', opacity: 0,
          animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20, padding: '28px 24px', backdropFilter: 'blur(12px)',
      transition: 'transform 0.3s, border-color 0.3s, background 0.3s',
      animation: `fadeUp 0.6s ${delay}s both`,
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
      e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
    }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E2E8F0', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ── Stat Item ─────────────────────────────────────────────────
function StatItem({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1,
        background: 'linear-gradient(135deg, #A78BFA, #38BDF8)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        fontFamily: "'Playfair Display', Georgia, serif",
      }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: '🛌', title: 'Pelacak Tidur Cerdas', desc: 'Catat dan analisis durasi, kualitas, dan konsistensi tidurmu setiap malam dengan insight yang bermakna.', delay: 0.1 },
    { icon: '🤖', title: 'Analisis Risiko AI', desc: 'Model machine learning 90.9% akurasi mendeteksi risiko gangguan tidur dan hipertensi berdasarkan pola hidupmu.', delay: 0.2 },
    { icon: '💬', title: 'SobatSense AI', desc: 'Chatbot kesehatan personal yang siap 24/7 menjawab pertanyaan seputar tidur dan kesehatan mentalmu.', delay: 0.3 },
    { icon: '🧠', title: 'Skrining DASS-21', desc: 'Ukur tingkat depresi, kecemasan, dan stres dengan instrumen yang tervalidasi secara ilmiah.', delay: 0.4 },
    { icon: '📱', title: 'Kontrol Screen Time', desc: 'Pantau dan kelola waktu layar harianmu — faktor kunci yang sering diabaikan dalam kualitas tidur.', delay: 0.5 },
    { icon: '📄', title: 'Laporan Mingguan PDF', desc: 'Unduh laporan kesehatan tidur lengkap mingguan untuk dibagikan ke profesional medis.', delay: 0.6 },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #020817 0%, #0F172A 40%, #1E1B4B 100%)',
      color: '#E2E8F0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        .land-btn { transition: all 0.25s !important; }
        .land-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(139,92,246,0.35) !important; }
        .land-link:hover { color: #A78BFA !important; }
      `}</style>

      <Stars />

      {/* Glowing orbs background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', animation: 'glow 5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', animation: 'glow 7s 2s ease-in-out infinite' }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '14px 5%',
        background: scrolled ? 'rgba(2,8,23,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        animation: 'slideDown 0.5s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img 
            src={logoUrl} 
            alt="SleepSense Logo" 
            style={{ width: 32, height: 32, objectFit: 'contain' }} 
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Sleep<span style={{ color: '#A78BFA' }}>Sense</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} className="land-btn" style={{
            padding: '8px 20px', borderRadius: 24,
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: '#CBD5E1',
            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
          }}>Masuk</button>
          <button onClick={() => navigate('/register')} className="land-btn" style={{
            padding: '8px 20px', borderRadius: 24,
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            border: 'none', color: 'white',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          }}>Mulai Gratis</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '160px 5% 100px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600, marginBottom: 28, animation: 'fadeUp 0.5s 0.1s both', letterSpacing: '0.05em' }}>
          ✦ DBS FOUNDATION CODING CAMP 2026 · TEAM CC26-PSU230
        </div>

        <div style={{ fontSize: 72, marginBottom: 8, animation: 'float 6s ease-in-out infinite' }}>🌙</div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          fontWeight: 800, lineHeight: 1.12,
          marginBottom: 24, animation: 'fadeUp 0.6s 0.2s both',
          letterSpacing: '-0.03em',
        }}>
          Tidur Lebih Baik,{' '}
          <span style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hidup Lebih Sehat
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#94A3B8',
          lineHeight: 1.7, marginBottom: 40, maxWidth: 640, margin: '0 auto 40px',
          animation: 'fadeUp 0.6s 0.35s both',
        }}>
          Platform monitoring kesehatan tidur dan mental berbasis AI yang memahami pola hidupmu — bukan sekadar alarm, tapi teman perjalanan menuju kesehatan yang sesungguhnya.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.5s both' }}>
          <button onClick={() => navigate('/register')} className="land-btn" style={{
            padding: '14px 32px', borderRadius: 30,
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            border: 'none', color: 'white', fontSize: '1rem',
            fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em',
          }}>🚀 Mulai Sekarang — Gratis</button>
          <button onClick={() => navigate('/login')} className="land-btn" style={{
            padding: '14px 32px', borderRadius: 30,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            color: '#CBD5E1', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
          }}>Sudah punya akun? Masuk</button>
        </div>

        {/* Scrolling indicator */}
        <div style={{ marginTop: 72, color: '#334155', fontSize: '0.75rem', letterSpacing: '0.1em', animation: 'fadeUp 0.6s 0.8s both' }}>
          SCROLL UNTUK MENJELAJAHI ↓
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 5%' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 32,
          background: 'rgba(255,255,255,0.03)', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '40px 48px', backdropFilter: 'blur(8px)',
        }}>
          <StatItem value="90.9%" label="Akurasi Model AI" />
          <StatItem value="21" label="Pertanyaan DASS-21" />
          <StatItem value="24/7" label="SobatSense Online" />
          <StatItem value="5★" label="Fitur Lengkap" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: 10 }}>FITUR UNGGULAN</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Semua yang kamu butuhkan<br />
              <span style={{ color: '#64748B' }}>dalam satu genggaman</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 5%' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#38BDF8', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: 10 }}>CARA KERJA</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginBottom: 56 }}>Tiga langkah menuju tidur berkualitas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: '01', icon: '📝', title: 'Catat & Pantau', desc: 'Rekam jadwal tidur, screen time, dan kesehatan mentalmu setiap hari.' },
              { step: '02', icon: '🔬', title: 'Analisis AI', desc: 'Model AI menganalisis polamu dan mendeteksi risiko gangguan tidur secara personal.' },
              { step: '03', icon: '✨', title: 'Tingkatkan Kualitas', desc: 'Dapatkan rekomendasi spesifik dan pantau progresmu dari waktu ke waktu.' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 700, letterSpacing: '0.15em', marginBottom: 12 }}>{item.step}</div>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#E2E8F0' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 5%' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(37,99,235,0.2) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 28, padding: '56px 40px', backdropFilter: 'blur(16px)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700, marginBottom: 16 }}>
            Mulai perjalanan tidur sehatmu malam ini
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: 32, lineHeight: 1.6 }}>
            Gratis selamanya. Tidak perlu kartu kredit.<br />Data kamu aman dan terlindungi.
          </p>
          <button onClick={() => navigate('/register')} className="land-btn" style={{
            padding: '15px 40px', borderRadius: 30,
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            border: 'none', color: 'white', fontSize: '1rem',
            fontWeight: 700, cursor: 'pointer',
          }}>Daftar Sekarang — Gratis 🚀</button>
        </div>
      </section>

      {/* ── TEAM PREVIEW ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 5% 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>DIBANGUN DENGAN ❤️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 12 }}>Tim di balik SleepSense</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 32, lineHeight: 1.6 }}>
            Empat mahasiswa yang berkolaborasi membangun solusi kesehatan tidur berbasis AI untuk Indonesia.
          </p>
          <button onClick={() => navigate('/team')} className="land-btn" style={{
            padding: '12px 32px', borderRadius: 30,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            color: '#CBD5E1', fontSize: '0.95rem',
            fontWeight: 600, cursor: 'pointer',
          }}>👥 Kenalan dengan Tim Kami</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>😴</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Sleep<span style={{ color: '#7C3AED' }}>Sense</span></span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#334155', textAlign: 'center' }}>
          © 2026 Team CC26-PSU230 · DBS Foundation Coding Camp · Bukan pengganti konsultasi medis profesional
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
          <span onClick={() => navigate('/login')} style={{ color: '#475569', cursor: 'pointer' }} className="land-link">Masuk</span>
          <span onClick={() => navigate('/register')} style={{ color: '#475569', cursor: 'pointer' }} className="land-link">Daftar</span>
          <span onClick={() => navigate('/team')} style={{ color: '#475569', cursor: 'pointer' }} className="land-link">Tim</span>
        </div>
      </footer>
    </div>
  );
}
