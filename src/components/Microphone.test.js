import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Microphone from './Microphone';

// Mock window.alert
window.alert = jest.fn();

// Mock MediaStream
global.MediaStream = jest.fn();

// Mock MediaRecorder and getUser Media
if (!navigator.mediaDevices) {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUser Media: jest.fn().mockResolvedValue(new MediaStream()),
    },
    writable: true,
  });
} else {
  navigator.mediaDevices.getUser Media = jest.fn().mockResolvedValue(new MediaStream());
}

global.MediaRecorder = jest.fn().mockImplementation(() => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    ondataavailable: jest.fn(),
    onstop: jest.fn(),
  };
});

describe('Microphone', () => {
  test('Microphone button toggles recording state', async () => {
    render(<Microphone onStop={jest.fn()} onData={jest.fn()} onTranscription={jest.fn()} />);

    // Check initial state
    const startButton = screen.getByRole('button', { name: 'Start Recording' });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveTextContent('Start Recording');

    // Start recording
    fireEvent.click(startButton);

    // Wait for the stop button to appear
    const stopButton = await waitFor(() =>
      screen.getByRole('button', { name: 'Stop Recording' })
    );
    expect(stopButton).toBeInTheDocument();

    // Stop recording
    fireEvent.click(stopButton);

    // Wait for the start button to reappear
    const newStartButton = await waitFor(() =>
      screen.getByRole('button', { name: 'Start Recording' })
    );
    expect(newStartButton).toBeInTheDocument();
  });
});