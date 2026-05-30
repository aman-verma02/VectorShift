// textNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { FileText } from 'lucide-react';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Local state initialized with existing data or default values
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);

  // Extract variables enclosed in double curly brackets, e.g. {{ input }}
  useEffect(() => {
    // Regex matches valid JS variable names within {{ }} brackets
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const foundVars = [];
    let match;

    while ((match = regex.exec(currText)) !== null) {
      const varName = match[1];
      if (!foundVars.includes(varName)) {
        foundVars.push(varName);
      }
    }
    setVariables(foundVars);
    updateNodeField(id, 'variables', foundVars);
  }, [currText]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    updateNodeField(id, 'text', val);
  };

  // Dynamically compute width and height based on the text contents
  const lines = currText.split('\n');
  const maxLineLength = Math.max(...lines.map((l) => l.length), 15);
  const lineCount = Math.max(lines.length, 2);

  // Dynamic dimensions for the textarea
  const textWidth = Math.max(180, Math.min(450, maxLineLength * 7.5 + 24));
  const textHeight = Math.max(60, Math.min(300, lineCount * 18 + 16));

  // Base output handle on the right
  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    },
  ];

  // Dynamically create target handles on the left for each variable found
  const variableHandles = variables.map((varName, index) => {
    // Spacing handles evenly along the left edge
    const topPosition = variables.length === 1 
      ? 50 
      : ((index + 1) * 100) / (variables.length + 1);

    return {
      type: 'target',
      position: Position.Left,
      id: `${id}-${varName}`,
      style: { top: `${topPosition}%` },
    };
  });

  // Combine standard output handles and dynamic input variable handles
  const allHandles = [...handles, ...variableHandles];

  return (
    <BaseNode
      id={id}
      title="Text"
      icon={<FileText size={14} strokeWidth={2} />}
      colorScheme="text"
      handles={allHandles}
      style={{ width: `${textWidth + 48}px` }} 
    >
      <label>
        Text:
        <textarea
          value={currText}
          onChange={handleTextChange}
          style={{
            width: `${textWidth}px`,
            height: `${textHeight}px`,
            resize: 'none',
            fontFamily: 'monospace',
            lineHeight: '1.4',
          }}
          placeholder="Type {{variable}} to add input handles..."
        />
      </label>

      {/* // Render helper variable labels under the input */}
      {variables.length > 0 && (
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>
            Variable Handles:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {variables.map((v) => (
              <span
                key={v}
                style={{
                  fontSize: '0.65rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};