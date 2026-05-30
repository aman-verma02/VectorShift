// apiNode.js
// A custom API intergration node using the BaseNode abstraction
// -----------------------------------------------------------------


import {useState} from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ApiNode = ({ id, data }) => {
    
  const updateNodeField = useStore((state) => state.updateNodeField);  // Get the function to update node data in global store
  
  // Local state initialized with existing data or defaults vlaues
  const [url, setUrl] = useState(data.url || 'https://api.com/data');
  const [method, setMethod] = useState(data?.method || 'POST');

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    updateNodeField(id, 'url', val);  // Update global store with new URL
  };


  const handleMethodChange = (e) => {
    const val = e.target.value
    setMethod(val);
    updateNodeField(id, { method: val });  // Update global store with new method
  };

  // Defineing inputs and outputs for API node
  const handles = [
    {
        type: 'target',
        position: Position.Left,
        id: `${id}-payload`,
        style: { top: '50%' },
    },
    {
        type: 'source',
        position: Position.Right,
        id: `${id}-response`,
        style: { top: '50%' },
    }
  ]

  return (
    <BaseNode 
      id={id}
      title="API Node"
      icon="API NoDe"             // need to add icon in future
      colorScheme="blue"
      handles={handles}
    >
        <label>
            Endpoint URL:
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://api.com/data"
            />

        </label>
        <label>
            HTTP Method:
            <select value={method} onChange={handleMethodChange}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
            </select>
        </label>
    </BaseNode>
  );
};