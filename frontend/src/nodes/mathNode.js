// mathNode.js
// A custom Mathematical calculations node using the BaseNode abstraction.
// ----------------------------------------------------------------------

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Local state initialized with existing data or default values
  const [operator, setOperator] = useState(data?.operator || 'add');

  const handleOperatorChange = (e) => {
    const val = e.target.value;
    setOperator(val);
    updateNodeField(id, 'operator', val);
  };

  // Define operand targets and operation results sources
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-operand-a`,
      style: { top: '30%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-operand-b`,
      style: { top: '70%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-result`,
      style: { top: '50%' }
    }
  ];

  return (
    <BaseNode
      id={id}
      title="Math Operator"
      icon="Maht Operator"                   // need to add icon in future
      colorScheme="math"
      handles={handles}
    >
      <label>
        Operation:
        <select value={operator} onChange={handleOperatorChange}>
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (-)</option>
          <option value="multiply">Multiply (*)</option>
          <option value="divide">Divide (/)</option>
        </select>
      </label>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
        <span>in A & B</span>
        <span>out Result</span>
      </div>
    </BaseNode>
  );
};