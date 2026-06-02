import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';
import '../styles/forms.css';
import '../styles/auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = {
      emailOrUsername: form.emailOrUsername ? '' : 'Email atau username wajib diisi',
      password: validatePassword(form.password)
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await login(form.emailOrUsername, form.password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.');
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="auth-form-title">Masuk</h2>
      {serverError && <p className="error-text auth-server-error">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email atau Username</label>
          <input type="text" value={form.emailOrUsername}
            onChange={e => setForm(f => ({ ...f, emailOrUsername: e.target.value }))}
            placeholder="contoh@email.com" autoComplete="username" />
          {errors.emailOrUsername && <p className="error-text">{errors.emailOrUsername}</p>}
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••" autoComplete="current-password" />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button type="submit" className="btn btn-accent btn-block auth-submit-btn" disabled={loading}>
          {loading ? 'Memproses...' : '🚀 Masuk'}
        </button>
      </form>
      <p className="auth-footer-text">
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </>
  );
}