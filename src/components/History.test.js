import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import History from './History';

test('renders "No history yet..." when there are no recordings', () => {
  const { getByText } = render(<History isOpen={true} recordings={[]} />);
  expect(getByText('No history yet...')).toBeInTheDocument();
});

test('renders recordings when there are recordings', () => {
  const recordings = [
    { sessionId: 'current-session-id', url: 'test-url', transcript: 'Test transcript' }
  ];
  const { getByText } = render(<History isOpen={true} recordings={recordings} />);
  expect(getByText('Test transcript')).toBeInTheDocument();
});

test('toggles history visibility when button is clicked', () => {
  const toggleHistory = jest.fn();
  const { getByText } = render(<History isOpen={false} toggleHistory={toggleHistory} recordings={[]} />);
  const button = getByText('Show History');

  fireEvent.click(button);
  expect(toggleHistory).toHaveBeenCalled();
});