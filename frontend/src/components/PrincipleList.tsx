import React from 'react';

export interface Principle {
  id: string;
  text: string;
}

interface Props {
  items: Principle[];
}

export default function PrincipleList({ items }: Props) {
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>{p.text}</li>
      ))}
    </ul>
  );
}
