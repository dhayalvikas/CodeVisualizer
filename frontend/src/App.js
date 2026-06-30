import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');

  const checkBackend = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/health');
      setStatus(res.data);
    } catch (err) {
      setStatus('Backend not connected!');
    }
  };

  return (
    <div className="app">
      <h1>Code Visualizer</h1>
      <p>Backend status: {status || 'Click button to check'}</p>

      <textarea
        rows={15}
        cols={60}
        placeholder="Paste your Java, Python, or C++ code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={checkBackend}>Check Backend Connection</button>
    </div>
  );
}

export default App;