import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import './App.css';

function App() {
  const [executionResult, setExecutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Code Visualizer</h1>
        <p>Understand DSA algorithms step by step</p>
      </header>
      <div className="main-layout">
        <CodeEditor
          setExecutionResult={setExecutionResult}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          highlightedLine={highlightedLine}
        />
        <Visualizer
          executionResult={executionResult}
          isLoading={isLoading}
          onHighlightLine={setHighlightedLine}
        />
      </div>
    </div>
  );
}

export default App;