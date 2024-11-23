import React from 'react';
import '../App.css';

/**
 * Transcription Component
 *
 * @param {Blob} audioBlob - The recorded audio blob
 * @param {any} liveData - Live data from recording (if applicable)
 * @param {string} transcriptionText - The transcribed text to display
 * @param {boolean} loading - Indicates if the transcription is in progress
 */
const Transcription = ({ audioBlob, liveData, transcriptionText, loading }) => {
  return (
    <div className="transcription-box transcription-box-border">
      <div className="transcription-header">Transcription</div>
      {loading ? (
        <div className="loading-indicator">Transcripting...</div>
      ) : (
        <div className="transcription-text">
          {transcriptionText || <div className="placeholder-text">Start Recording to see the live Transcription.</div>}
        </div>
      )}
    </div>
  );
};

export default Transcription;