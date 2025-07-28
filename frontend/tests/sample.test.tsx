import { render } from '@testing-library/react';
import React from 'react';
import PrincipleList from '../src/components/PrincipleList';

test('renders list', () => {
  const { getByText } = render(
    <PrincipleList
      items={[{ id: '1', text: 'hi', created_at: '2024-01-01T00:00:00Z' }]}
    />
  );
  expect(getByText('hi')).toBeInTheDocument();
});
