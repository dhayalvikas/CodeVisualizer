import React, { useState, useEffect, useRef } from 'react';

const PATTERN_STEPS = {
  'Two Pointers': [
    { l: 0, r: 6, narration: 'Initialize: left=0, right=6. Array is sorted — perfect for two pointers.', found: false, highlightLine: 5, vars: { left: 0, right: 6, sum: '?' } },
    { l: 0, r: 6, narration: 'sum = arr[0]+arr[6] = 1+11 = 12. Too big → move right left.', found: false, highlightLine: 7, vars: { left: 0, right: 6, sum: 12 } },
    { l: 0, r: 5, narration: 'sum = arr[0]+arr[5] = 1+10 = 11. Too big → move right left.', found: false, highlightLine: 13, vars: { left: 0, right: 5, sum: 11 } },
    { l: 0, r: 4, narration: 'sum = arr[0]+arr[4] = 1+7 = 8. Too small → move left right.', found: false, highlightLine: 11, vars: { left: 0, right: 4, sum: 8 } },
    { l: 1, r: 4, narration: 'sum = arr[1]+arr[4] = 3+7 = 10. Too big → move right left.', found: false, highlightLine: 13, vars: { left: 1, right: 4, sum: 10 } },
    { l: 1, r: 3, narration: 'sum = arr[1]+arr[3] = 3+5 = 8. Too small → move left right.', found: false, highlightLine: 11, vars: { left: 1, right: 3, sum: 8 } },
    { l: 2, r: 3, narration: '✅ sum = arr[2]+arr[3] = 4+5 = 9 == target! Found at [2,3].', found: true, highlightLine: 9, vars: { left: 2, right: 3, sum: 9 } },
  ],
  'Sliding Window': [
    { l: 0, r: 2, narration: 'Build initial window [0..2]: sum = 2+1+5 = 8.', found: false, highlightLine: 2, vars: { left: 0, right: 2, windowSum: 8, maxSum: 8 } },
    { l: 0, r: 2, narration: 'Set maxSum = 8. Now slide window right.', found: false, highlightLine: 3, vars: { left: 0, right: 2, windowSum: 8, maxSum: 8 } },
    { l: 1, r: 3, narration: 'Add arr[3]=1, remove arr[0]=2. windowSum=7. max stays 8.', found: false, highlightLine: 5, vars: { left: 1, right: 3, windowSum: 7, maxSum: 8 } },
    { l: 2, r: 4, narration: 'Add arr[4]=3, remove arr[1]=1. windowSum=9. New max!', found: false, highlightLine: 5, vars: { left: 2, right: 4, windowSum: 9, maxSum: 9 } },
    { l: 3, r: 5, narration: '✅ Done! Maximum sum of 3 consecutive elements = 9.', found: true, highlightLine: 6, vars: { left: 3, right: 5, windowSum: 6, maxSum: 9 } },
  ],
  'Binary Search': [
    { l: 0, r: 6, mid: 3, narration: 'Initialize left=0, right=6. mid=3. arr[3]=5.', found: false, highlightLine: 2, vars: { left: 0, right: 6, mid: 3, target: 7 } },
    { l: 4, r: 6, mid: 5, narration: 'target=7 > arr[3]=5 → search right half. mid=5.', found: false, highlightLine: 5, vars: { left: 4, right: 6, mid: 5, target: 7 } },
    { l: 4, r: 4, mid: 4, narration: 'target=7 < arr[5]=10 → search left. mid=4.', found: false, highlightLine: 4, vars: { left: 4, right: 4, mid: 4, target: 7 } },
    { l: 4, r: 4, mid: 4, narration: '✅ arr[4]=7 == target! Found at index 4.', found: true, highlightLine: 3, vars: { left: 4, right: 4, mid: 4, target: 7 } },
  ],
  'Stack / Queue': [
    { stack: [], cur: 0, narration: 'Initialize empty stack. Process ( [ { } ] ) one by one.', found: false, highlightLine: 1, vars: { stackSize: 0, current: '-', top: '-' } },
    { stack: ['('], cur: 1, narration: "'(' is opening → push onto stack.", found: false, highlightLine: 3, vars: { stackSize: 1, current: '(', top: '(' } },
    { stack: ['(', '['], cur: 2, narration: "'[' is opening → push onto stack.", found: false, highlightLine: 3, vars: { stackSize: 2, current: '[', top: '[' } },
    { stack: ['(', '[', '{'], cur: 3, narration: "'{' is opening → push onto stack.", found: false, highlightLine: 3, vars: { stackSize: 3, current: '{', top: '{' } },
    { stack: ['(', '['], cur: 4, narration: "'}' matches top '{' → pop from stack.", found: false, highlightLine: 5, vars: { stackSize: 2, current: '}', top: '[' } },
    { stack: ['('], cur: 5, narration: "']' matches top '[' → pop from stack.", found: false, highlightLine: 5, vars: { stackSize: 1, current: ']', top: '(' } },
    { stack: [], cur: 6, narration: "✅ ')' matches '(' → pop. Stack empty = Valid!", found: true, highlightLine: 6, vars: { stackSize: 0, current: ')', top: '-' } },
  ]
};

const ARR = [1, 3, 4, 5, 7, 10, 11];

function PatternAnimator({ pattern, onHighlightLine }) {
  const steps = PATTERN_STEPS[pattern] || PATTERN_STEPS['Two Pointers'];
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const timerRef = useRef(null);

  useEffect(() => {
    setCur(0);
    setPlaying(false);
  }, [pattern]);

  useEffect(() => {
    if (onHighlightLine && steps[cur]) {
      onHighlightLine(steps[cur].highlightLine);
    }
  }, [cur, steps, onHighlightLine]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setTimeout(() => {
        if (cur < steps.length - 1) setCur(c => c + 1);
        else setPlaying(false);
      }, speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [playing, cur, speed, steps.length]);

  const step = steps[cur];
  const prevVars = cur > 0 ? steps[cur - 1].vars : {};

  const seekTimeline = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setCur(Math.round(pct * (steps.length - 1)));
  };

  const renderArray = () => {
    if (pattern === 'Stack / Queue') {
      return (
        <div className="stack-display">
          <div className="stack-label">Stack</div>
          <div className="stack-items">
            {step.stack.length === 0
              ? <div className="stack-empty">empty</div>
              : step.stack.map((s, i) => (
                <div key={i} className="stack-item">{s}</div>
              ))
            }
          </div>
          <div className="input-display">
            {['(', '[', '{', '}', ']', ')'].map((c, i) => (
              <div key={i} className={`cell ${i === step.cur - 1 ? 'active' : i < step.cur ? 'faded' : ''}`}>
                {c}
                <span className="idx">{i}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="array-display">
        <div className="pointer-row">
          {ARR.map((_, i) => (
            <div key={i} className="ptr-cell">
              {i === step.l && <span className="ptr left-ptr">▼L</span>}
              {i === step.r && i !== step.l && <span className="ptr right-ptr">▼R</span>}
              {step.mid !== undefined && i === step.mid && <span className="ptr mid-ptr">▼M</span>}
            </div>
          ))}
        </div>
        <div className="arr-row">
          {ARR.map((v, i) => {
            let cls = 'cell';
            if (step.found && (i === step.l || i === step.r || i === step.mid)) cls += ' found';
            else if (i === step.l) cls += ' left';
            else if (i === step.r) cls += ' right';
            else if (step.mid !== undefined && i === step.mid) cls += ' mid';
            else if (pattern === 'Sliding Window' && i >= step.l && i <= step.r) cls += ' window';
            return (
              <div key={i} className={cls}>
                {v}
                <span className="idx">{i}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animator">
      <div className="pattern-title">{pattern} Visualization</div>

      {renderArray()}

      {/* Variable Panel */}
      <div className="var-panel">
        <div className="var-panel-title">Variables</div>
        <div className="var-chips">
          {Object.entries(step.vars || {}).map(([key, val]) => {
            const changed = prevVars[key] !== val;
            return (
              <div key={key} className={`var-chip ${changed ? 'changed' : ''}`}>
                <span className="var-name">{key}</span>
                <span className="var-eq">=</span>
                <span className="var-val">{String(val)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narration */}
      <div className="narration-box">
        {step.narration}
      </div>

      {/* Key Insight — shows only on last step */}
      {cur === steps.length - 1 && (
        <div className="key-insight">
          <span className="insight-label">💡 Key Insight</span>
          <span className="insight-text">
            {pattern === 'Two Pointers' && "Two Pointers works on sorted arrays — moving pointers inward always narrows toward the answer without missing any pair."}
            {pattern === 'Sliding Window' && "Sliding Window avoids recalculating the entire window — add one element and remove one, making it O(n) instead of O(n²)."}
            {pattern === 'Binary Search' && "Binary Search eliminates half the search space each step — that's why it's O(log n) instead of O(n) linear search."}
            {pattern === 'Stack / Queue' && "Stack works here because brackets must close in reverse order — Last In First Out matches bracket nesting perfectly."}
          </span>
        </div>
      )}

      {/* Timeline */}
      <div className="timeline" onClick={seekTimeline}>
        <div
          className="timeline-fill"
          style={{ width: `${(cur / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((_, i) => (
          <div
            key={i}
            className={`timeline-dot ${i <= cur ? 'done' : ''} ${i === cur ? 'active' : ''}`}
            style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
            onClick={(e) => { e.stopPropagation(); setCur(i); setPlaying(false); }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button onClick={() => { setCur(0); setPlaying(false); }}>⏮</button>
        <button onClick={() => setCur(c => Math.max(0, c - 1))}>◀</button>
        <button className="play-btn" onClick={() => {
          if (cur === steps.length - 1) setCur(0);
          setPlaying(p => !p);
        }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => setCur(c => Math.min(steps.length - 1, c + 1))}>▶</button>
        <button onClick={() => { setCur(steps.length - 1); setPlaying(false); }}>⏭</button>
        <div className="speed-controls">
          <button className={speed === 1200 ? 'active' : ''} onClick={() => setSpeed(1200)}>1×</button>
          <button className={speed === 700 ? 'active' : ''} onClick={() => setSpeed(700)}>1.5×</button>
          <button className={speed === 400 ? 'active' : ''} onClick={() => setSpeed(400)}>2×</button>
        </div>
        <span className="step-count">Step {cur + 1} / {steps.length}</span>
      </div>
    </div>
  );
}

export default PatternAnimator;