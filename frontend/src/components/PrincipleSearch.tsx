import React, { useState } from 'react';
import { authFetch } from '../api';
import { Principle } from './PrincipleList';

export default function PrincipleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Principle[]>([]);

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query });
    const res = await authFetch('/api/principles/search?' + params.toString());
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
  }

  return (
    <div>
      <form onSubmit={doSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search principles"
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </div>
  );
}
