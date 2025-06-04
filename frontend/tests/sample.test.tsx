import { render } from '@testing-library/react';
import React from 'react';
import PrincipleList from '../src/components/PrincipleList';

test('renders list', () => {
  const { getByText } = render(<PrincipleList items={[{ id: '1', text: 'hi' }]} />);
  expect(getByText('hi')).toBeInTheDocument();
});
