import React, { useState } from 'react';

interface Props {
  onAuth(): void;
}

export default function AuthPage({ onAuth }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const path = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      onAuth();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Error');
    }
  }

  return (
    <div>
      <h1>{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Create account' : 'Have an account? Login'}
      </button>
    </div>
  );
}
