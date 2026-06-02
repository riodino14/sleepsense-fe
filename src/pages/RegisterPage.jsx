import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validatePasswordMatch, validateUsername } from '../utils/validators';
import '../styles/forms.css';
import '../styles/auth.css';

const AGE_RANGES = [
  'Remaja (13-18 Tahun)',
  'Dewasa Muda (19-35 Tahun)',
  'Dewasa (35-59 Tahun)',
  'Lansia (60 Tahun ke atas)'
];

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', ageRange: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = {
      email: validateEmail(form.email),
      username: validateUsername(form.username),
      ageRange: form.ageRange ? '' : 'Pilih rentang usia',
      password: validatePassword(form.password),
      confirmPassword: validatePasswordMatch(form.password, form.confirmPassword)
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await register({ email: form.email, username: form.username, ageRange: form.ageRange, password: form.password });
      navigate('/onboarding');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    }
    setLoading(false);
  };

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <>
      <h2 className="auth-form-title">Daftar</h2>
      {serverError && <p className="error-text auth-server-error">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="contoh@email.com" autoComplete="email" />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label>Username</label>
          <input type="text" value={form.username} onChange={e => update('username', e.target.value)} placeholder="nama_pengguna" autoComplete="username" />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>
        <div className="input-group">
          <label>Rentang Usia</label>
          <select value={form.ageRange} onChange={e => update('ageRange', e.target.value)}>
            <option value="">Pilih rentang usia</option>
            {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.ageRange && <p className="error-text">{errors.ageRange}</p>}
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Minimal 6 karakter" autoComplete="new-password" />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <div className="input-group">
          <label>Tulis Ulang Password</label>
          <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••" autoComplete="new-password" />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="btn btn-accent btn-block auth-submit-btn" disabled={loading}>
          {loading ? 'Memproses...' : '📝 Daftar'}
        </button>
      </form>
      <p className="auth-footer-text">
        Sudah punya akun? <Link to="/login">Masuk di sini</Link>
      </p>
    </>
  );
}