import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGES = [
  { id: 62, name: 'Java', placeholder: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 3, 4, 5, 7, 10, 11};
        int target = 9;
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) {
                System.out.println("Found: " + left + ", " + right);
                break;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
}` },
  { id: 71, name: 'Python', placeholder: `arr = [1, 3, 4, 5, 7, 10, 11]
target = 9
left, right = 0, len(arr) - 1
while left < right:
    s = arr[left] + arr[right]
    if s == target:
        print(f"Found: {left}, {right}")
        break
    elif s < target:
        left += 1
    else:
        right -= 1` },
  { id: 54, name: 'C++', placeholder: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> arr = {1, 3, 4, 5, 7, 10, 11};
    int target = 9;
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            cout << "Found: " << left << ", " << right << endl;
            break;
        } else if (sum < target) left++;
        else right--;
    }
    return 0;
}` }
];

const PATTERNS = [
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack / Queue'
];

function CodeEditor({ setExecutionResult, setIsLoading, isLoading, highlightedLine }) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].placeholder);
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [stdin, setStdin] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleLangChange = (e) => {
    const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
    setSelectedLang(lang);
    setCode(lang.placeholder);
  };

  const handleVisualize = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setExecutionResult(null);
    try {
      const response = await axios.post('http://localhost:8080/api/execute', {
        sourceCode: code,
        languageId: selectedLang.id,
        stdin: stdin
      });
      setExecutionResult({
        output: response.data,
        pattern: pattern,
        language: selectedLang.name,
        code: code
      });
    } catch (err) {
      setExecutionResult({
        output: 'Error: ' + (err.response?.data || err.message),
        pattern: pattern,
        language: selectedLang.name,
        code: code
      });
    }
    setIsLoading(false);
  };

  const lines = code.split('\n');

  return (
    <div className="editor-panel">
      <div className="editor-controls">
        <div className="control-group">
          <label>Language</label>
          <select value={selectedLang.id} onChange={handleLangChange}>
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Pattern</label>
          <select value={pattern} onChange={e => setPattern(e.target.value)}>
            {PATTERNS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Code display with line highlighting */}
      {!isEditing ? (
        <div className="code-display" onClick={() => setIsEditing(true)}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`code-line ${i + 1 === highlightedLine ? 'highlighted' : ''}`}
            >
              <span className="line-number">{i + 1}</span>
              <span className="line-content">{line || ' '}</span>
            </div>
          ))}
          <div className="click-hint">Click to edit code</div>
        </div>
      ) : (
        <textarea
          className="code-textarea"
          value={code}
          onChange={e => setCode(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          spellCheck={false}
        />
      )}

      <div className="control-group" style={{ marginTop: '8px' }}>
        <label>Custom Input (stdin)</label>
        <input
          type="text"
          className="stdin-input"
          placeholder="Optional input for your program..."
          value={stdin}
          onChange={e => setStdin(e.target.value)}
        />
      </div>

      <button
        className="visualize-btn"
        onClick={handleVisualize}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Running...' : '▶ Visualize'}
      </button>
    </div>
  );
}

export default CodeEditor;