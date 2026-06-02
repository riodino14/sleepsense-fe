import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sleeptoken') || null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const profile = await getProfile(token);
      setUser(profile);
      setIsOnboarded(profile?.isOnboarded || false);
    } catch {
      setToken(null);
      localStorage.removeItem('sleeptoken');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const login = async (emailOrUsername, password) => {
    const res = await loginUser(emailOrUsername, password);
    localStorage.setItem('sleeptoken', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsOnboarded(res.user?.isOnboarded || false);
    return res;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    localStorage.setItem('sleeptoken', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsOnboarded(false);
    return res;
  };

  const logout = async () => {
    try { await logoutUser(token); } catch {}
    localStorage.removeItem('sleeptoken');
    setToken(null);
    setUser(null);
    setIsOnboarded(false);
  };

  const completeOnboarding = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, isOnboarded, isAuthenticated: !!token,
      login, register, logout, completeOnboarding, setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};