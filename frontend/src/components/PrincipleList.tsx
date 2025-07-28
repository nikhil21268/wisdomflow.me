import React from 'react';

export interface Principle {
  id: string;
  text: string;
  created_at: string;
  similarity?: number;
}

interface Props {
  items: Principle[];
}

export default function PrincipleList({ items }: Props) {
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>
          <div>{p.text}</div>
          <small>{new Date(p.created_at).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
}
