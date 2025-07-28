import React, { useState } from 'react';
import { authFetch } from '../api';

interface Props {
  onAdded(): void;
}

export default function PrincipleForm({ onAdded }: Props) {
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    if (text.length > 500) {
      setError('Max 500 characters');
      return;
    }
    const res = await authFetch('/api/principles', {
      method: 'POST',
      body: JSON.stringify({ text, created_at: createdAt })
    });
    if (res.ok) {
      setText('');
      setCreatedAt(new Date().toISOString().slice(0, 16));
      onAdded();
    }
  }

  return (
    <form onSubmit={submit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <input
        type="datetime-local"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Add</button>
    </form>
  );
}
