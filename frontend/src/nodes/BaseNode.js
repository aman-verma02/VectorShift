// BaseNode.js
// A clean, reusable abstraction for pipeline nodes that wll be blueprints for all node types (input, output, function, etc). This component will handle common UI elements like
// headers, icons, handles, and modular layouts across all node types.
// ------------------------------------------------------------------

import React from 'react';
import { Position, Handle } from 'reactflow';
import './BaseNode.css'                // Importing node-specific styles and will be applied to all node 
import { useStore } from '../store';

export const BaseNode = ({
  id,
  title,
  icon,
  colorScheme = 'default',
  handles = [],
  children,
  style = {},

}) => {
    const deleteNode = useStore((state) => state.deleteNode );


  return (
    <div className={`base-node base-node-${colorScheme}`} style={style}>

      {/*------- Node Header------------- */}
      <div className="base-node-header">
        <span className="base-node-icon">{icon}</span>
        <span className="base-node-title">{title}</span>
        <span className="base-node-id">#{id.split('-').pop()}</span>
        <button
          className="base-node-delete"
          onClick={() => deleteNode(id)}
          title="Delete node"
        >
          ×
        </button>
      </div>

      {/* --------------------Node Body / Content ----------------*/}
      <div className="base-node-body">
        {children}
      </div>

      {/* ------------------ Node Handles ---------------------*/}
      {handles.map((handle, idx) => (
        <Handle
          key={`${id}-handle-${idx}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          className={`base-node-handle handle-${handle.type} handle-pos-${handle.position.toLowerCase()}`}
          {...handle.props}
        />
      ))}
    </div>
  );
};