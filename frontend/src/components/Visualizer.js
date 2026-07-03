import React from 'react';
import PatternAnimator from './PatternAnimator';

function Visualizer({ executionResult, isLoading, onHighlightLine }) {
  if (isLoading) {
    return (
      <div className="visualizer-panel">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Executing your code...</p>
        </div>
      </div>
    );
  }

  if (!executionResult) {
    return (
      <div className="visualizer-panel">
        <div className="empty-state">
          <h2>👈 Paste your code and click Visualize</h2>
          <p>Supports Java, Python, and C++</p>
          <div className="feature-list">
            <div className="feature">✅ Step by step animation</div>
            <div className="feature">✅ Plain English narration</div>
            <div className="feature">✅ Live variable tracking</div>
            <div className="feature">✅ Video-style controls</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="visualizer-panel">
      <div className="output-section">
        <div className="output-header">
          <span className="lang-badge">{executionResult.language}</span>
          <span className="pattern-badge">{executionResult.pattern}</span>
        </div>
        <div className="output-box">
          <div className="output-label">Output</div>
          <pre className="output-text">{executionResult.output}</pre>
        </div>
      </div>
      <PatternAnimator
        pattern={executionResult.pattern}
        onHighlightLine={onHighlightLine}
      />
    </div>
  );
}

export default Visualizer;