import React, { useState } from 'react';
import './App.css';
import Transcription from './components/Transcription';
import History from './components/History';
import Microphone from './components/Microphone';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle history visibility
  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  // Add a new recording
  const addRecording = (recording, blob) => {
    setRecordings([...recordings, { ...recording, url: URL.createObjectURL(blob) }]);
  };

  // Handle stop event from Microphone component
  const handleStop = (blob) => {
    setAudioBlob(blob);
    setLoading(true); // Set loading state when recording stops
  };

  // Handle live data from Microphone component
  const handleData = (data) => {
    setLiveData(data);
  };

  // Handle transcription data from Microphone component
  const handleTranscription = (data, blob) => {
    setTranscriptionText(data.transcript);
    setLoading(false); // Clear loading state when transcription is received
    addRecording(data, blob); // Update immediately
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Transcription App</h1>
          <p className="App-subheader">Real-time audio transcription</p>
        </div>
      </header>
      
      <main className="App-main">
        <Microphone onStop={handleStop} onData={handleData} onTranscription={handleTranscription} />
        <Transcription audioBlob={audioBlob} liveData={liveData} transcriptionText={transcriptionText} loading={loading} />
        <History isOpen={isHistoryOpen} recordings={recordings} toggleHistory={toggleHistory} />
      </main>
      
      <footer>
        {/* Add footer content here if needed */}
      </footer>
    </div>
  );
}

export default App;