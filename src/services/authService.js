import api from './api';

export async function loginUser(emailOrUsername, password) {
  const { data } = await api.post('/auth/login', { emailOrUsername, password });
  return data; // { token, user }
}

export async function registerUser(userData) {
  const { data } = await api.post('/auth/register', userData);
  return data; // { token, user }
}

export async function logoutUser(token) {
  return api.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getProfile(token) {
  const { data } = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

// FIX: Fungsi ini simpan onboarding ke DATABASE (sebelumnya tidak ada)
// Memanggil PATCH /api/auth/onboarding di Express BE
export async function saveOnboarding(nickname, focus, token) {
  const { data } = await api.patch('/auth/onboarding',
    { nickname, focus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
