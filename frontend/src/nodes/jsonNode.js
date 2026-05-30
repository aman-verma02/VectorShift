// jsonNode.js
// A custom JSON utility node using the BaseNode abstraction.
// ----------------------------------------------------------

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const JsonNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [jsonError, setJsonError] = useState('');

  // Local state initialized with existing data or default values
  const [operation, setOperation] = useState(data?.operation || 'parse');

  const handleOperationChange = (e) => {
    const val = e.target.value;
    setOperation(val);
    updateNodeField(id, 'operation', val);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input-json`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output-json`
    }
  ];

  return (
    <BaseNode
      id={id}
      title="JSON Parser"
      icon="JSON Parser"               // Need to add icon in future
      colorScheme="json"
      handles={handles}
    >
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="parse">Parse JSON String</option>
          <option value="stringify">Stringify Object</option>
          <option value="format">Beautify JSON</option>
        </select>
      </label>
      {jsonError && (
      <p style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '2px' }}>
        {jsonError}
      </p>
      )}
      <p className="base-node-description" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
        Converts inputs based on the selected JSON operation.
      </p>
    </BaseNode>
  );
};