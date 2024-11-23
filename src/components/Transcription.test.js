import React from 'react';
import { render } from '@testing-library/react';
import Transcription from './Transcription'; // Corrected import path

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      results: {
        channels: [
          {
            alternatives: [
              { transcript: 'Test transcription' }
            ]
          }
        ]
      }
    })
  })
);

test('renders loading indicator when loading is true', () => {
  const { getByText } = render(<Transcription loading={true} />);
  expect(getByText('Transcripting...')).toBeInTheDocument();
});

test('renders transcription text when loading is false', () => {
  const transcriptionText = 'Test transcription';
  const { getByText } = render(<Transcription loading={false} transcriptionText={transcriptionText} />);
  expect(getByText(transcriptionText)).toBeInTheDocument();
});

test('renders placeholder text when no transcription text is provided', () => {
  const { getByText } = render(<Transcription loading={false} />);
  expect(getByText('Start Recording to see the live Transcription.')).toBeInTheDocument();
});