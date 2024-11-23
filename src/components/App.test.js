import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Transcription App title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Transcription App/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Real-time audio transcription subheader', () => {
  render(<App />);
  const subheaderElement = screen.getByText(/Real-time audio transcription/i);
  expect(subheaderElement).toBeInTheDocument();
});
