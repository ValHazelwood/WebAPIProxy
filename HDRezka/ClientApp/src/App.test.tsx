import React from 'react';
import { render } from '@testing-library/react';
import App from './components/App';

test('renders Search component', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/No results yet/i);
  expect(linkElement).toBeInTheDocument();
});
