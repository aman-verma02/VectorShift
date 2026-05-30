// delayNode.js
// A custom Time Delay node using the BaseNode abstraction.
// --------------------------------------------------------

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { Timer } from 'lucide-react';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Local state initialized with existing data or default values
  const [delayMs, setDelayMs] = useState(data?.delayMs || id.replace('customOutput-', 'output_'));

  const handleDelayChange = (e) => {
    const val = Math.max(parseInt(e.target.value, 10) || 0);
    setDelayMs(val);
    updateNodeField(id, 'delayMs', val);
  };

  // Define inputs and outputs for dynamic workflows
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-trigger`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-delayed`
    }
  ];

  return (
    <BaseNode
      id={id}
      title="Time Delay"
      icon={<Timer size={14} strokeWidth={2} />}
      colorScheme="delay"
      handles={handles}
    >
      <label>
        Delay (milliseconds):
        <input 
          type="number" 
          value={delayMs} 
          onChange={handleDelayChange}
          min="0"
          step="100"
        />
      </label>
      <p className="base-node-description" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
        Delays the execution flow by {delayMs} ms.
      </p>
    </BaseNode>
  );
};