// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';



export const LLMNode = ({ id, data }) => {

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: `${100/3}%` },
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: `${200/3}%` },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
    }
  ];
    

  return (
    <BaseNode
      id = {id}
      title = "LLM Node"
      icon = "LLM Node"
      colorScheme = "llm"
      handles = {handles}
    >

      <p className="base-node-description">
        This is LLM
      </p>
    
    </BaseNode>
  );
}
