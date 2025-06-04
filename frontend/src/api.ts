export const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE + url, { ...options, headers });
  if (res.status === 401) {
    // TODO refresh token flow
    localStorage.removeItem('token');
  }
  return res;
}
