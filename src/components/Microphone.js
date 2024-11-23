import React, { useState, useRef } from 'react';

/**
 * Microphone Component
 * Provides a button to start and stop audio recording.
 *
 * @param {function} onStop - Callback when recording stops
 * @param {function} onData - Callback for live audio data
 * @param {function} onTranscription - Callback to update transcription state
 */
const Microphone = ({ onStop, onData, onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const mediaRecorderRef = useRef(null); // Reference to MediaRecorder instance
  const audioChunksRef = useRef([]); // Stores audio chunks

  /**
   * Starts the audio recording
   */
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!window.MediaRecorder) {
        alert('MediaRecorder API is not available in your browser.');
        return;
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      // Event handler for when data is available
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
        onData(event.data); // Pass data for live transcription if needed
      };

      // Event handler for when recording stops
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onStop(audioBlob); // Pass the audio blob to parent
        audioChunksRef.current = []; // Reset audio chunks

        // Transcribe audio
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY; // Use environment variable for API key

          const response = await fetch('https://api.deepgram.com/v1/listen?language=en', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${apiKey}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            handleTranscriptionError(errorData.error || 'Transcription failed. Please try again.');
            throw new Error(errorData.error || 'Transcription failed. Please try again.');
          }

          const data = await response.json();
          console.log('API Response:', data); // Log the API response
          const formatTranscript = (transcript) => {
            // Capitalize the first letter and add punctuation at the end if missing
            let formattedTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1).trim();
            if (!/[.!?;:]/.test(formattedTranscript.slice(-1))) {
              formattedTranscript += '.';
            }
            return formattedTranscript;
          };
          const transcript = formatTranscript(data.results.channels[0].alternatives[0].transcript); // Ensure correct path
          const metadata = data.metadata; // Extract metadata
          console.log('Transcript:', transcript); // Log the transcript
          console.log('Metadata:', metadata); // Log the metadata
          onTranscription({ transcript, metadata, sessionId: 'current-session-id' }, audioBlob); // Include metadata and audioBlob
        } catch (err) {
          console.error('Error during transcription:', err); // Log the error
          handleTranscriptionError(err.message);
        }
      };

      mediaRecorderRef.current.start(); // Begin recording
      setIsRecording(true); // Update state
      console.log('Recording started'); // Log state change
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Error accessing media devices: ' + err.message);
    }
  };

  /**
   * Stops the audio recording
   */
  const handleStopRecording = () => {
    mediaRecorderRef.current.stop(); // Stop recording
    setIsRecording(false); // Update state
    console.log('Recording stopped'); // Log state change
  };

  /**
   * Handles transcription errors
   */
  const handleTranscriptionError = (error) => {
    if (error.includes('audio is not clear')) {
      alert('The audio is not clear. Please try recording again.');
    } else if (error.includes('missing audio')) {
      alert('No audio detected. Please ensure your microphone is working.');
    } else {
      alert('An error occurred during transcription: ' + error);
    }
  };

  return (
    <div className="microphone">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`record-button ${isRecording ? 'recording' : 'not-recording'}`}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && (
        <div className="recording-indicator">
          Recording...
        </div>
      )}
    </div>
  );
};

export default Microphone;