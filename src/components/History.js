// src/components/History.js

import React, { useState, useEffect } from 'react';

// History component to display session recordings
const History = ({ isOpen, recordings, toggleHistory }) => {
  const [currentSessionRecordings, setCurrentSessionRecordings] = useState([]);

  useEffect(() => {
    const currentSessionId = 'current-session-id'; // Replace with actual session ID logic
    const sessionRecordings = recordings.filter(recording => recording.sessionId === currentSessionId);
    setCurrentSessionRecordings(sessionRecordings);
  }, [recordings]);

  return (
    <div className="history-container">
      <button onClick={toggleHistory} className="history-toggle-button">
        {isOpen ? 'Hide History' : 'Show History'}
      </button>
      {isOpen && (
        <div>
          {currentSessionRecordings.length === 0 ? (
            <p style={{ color: 'white' }}>No history yet...</p>
          ) : (
            <ul className="history-list">
              {currentSessionRecordings.map((recording, index) => (
                <li key={index} className="history-item">
                  <audio controls src={recording.url}></audio>
                  <p>{recording.transcript}</p>
                  {recording.metadata && recording.metadata.decryptedText && (
                    <div className="metadata">
                      <p>Decrypted Text: {recording.metadata.decryptedText}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default History;