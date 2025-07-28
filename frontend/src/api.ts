export const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE + url, { ...options, headers });
  if (res.status === 401) {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      const r = await fetch(API_BASE + '/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh })
      });
      if (r.ok) {
        const data = await r.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh', data.refresh_token);
        return authFetch(url, options);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
  return res;
}
