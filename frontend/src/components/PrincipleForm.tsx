import React, { useState } from 'react';
import { authFetch } from '../api';

interface Props {
  onAdded(): void;
}

export default function PrincipleForm({ onAdded }: Props) {
  const [text, setText] = useState('');
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
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      setText('');
      onAdded();
    }
  }

  return (
    <form onSubmit={submit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Add</button>
    </form>
  );
}
