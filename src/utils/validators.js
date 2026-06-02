export function validateEmail(email) {
  if (!email) return 'Email wajib diisi';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Format email tidak valid';
}

export function validatePassword(password) {
  if (!password) return 'Password wajib diisi';
  if (password.length < 6) return 'Password minimal 6 karakter';
  if (password.length > 50) return 'Password maksimal 50 karakter';
  return '';
}

export function validatePasswordMatch(password, confirm) {
  if (!confirm) return 'Konfirmasi password wajib diisi';
  if (password !== confirm) return 'Password tidak cocok';
  return '';
}

export function validateUsername(username) {
  if (!username) return 'Username wajib diisi';
  if (username.length < 3) return 'Username minimal 3 karakter';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Hanya huruf, angka, dan underscore';
  return '';
}

export function validateAgeRange(ageRange) {
  if (!ageRange) return 'Pilih rentang usia';
  return '';
}