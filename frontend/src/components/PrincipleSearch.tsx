import React, { useState } from 'react';
import { authFetch } from '../api';
import { Principle } from './PrincipleList';

export default function PrincipleSearch() {
  const [query, setQuery] = useState('');
  // Similarity threshold for search results
  const THRESHOLD = 0.75;
  const [results, setResults] = useState<Principle[]>([]);

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query, threshold: String(THRESHOLD) });
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
          <li key={r.id}>
            <div>{r.text}</div>
            <small>{new Date(r.created_at).toLocaleString()}</small>
            {r.similarity !== undefined && (
              <span> - {(r.similarity * 100).toFixed(1)}%</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
