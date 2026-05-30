// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';

// New nodes
import { PromptNode } from './nodes/promptNode';
import { MathNode } from './nodes/mathNode';
import { JsonNode } from './nodes/jsonNode';
import { ApiNode } from './nodes/apiNode';
import { DelayNode } from './nodes/delayNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };


// All 9 nodes (4 originanl + 5 new node )
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  promptNode: PromptNode,
  mathNode: MathNode,
  jsonNode: JsonNode,
  apiNode: ApiNode,
  delayNode: DelayNode,
};


const selector = (state) => ({      
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div className='canvas-container'>
          <div ref={reactFlowWrapper} className='reactflow-wrapper'>
              <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onInit={setReactFlowInstance}
                  nodeTypes={nodeTypes}
                  proOptions={proOptions}
                  snapGrid={[gridSize, gridSize]}
                  connectionLineType='smoothstep'
                  // custom connection line style  -------------------
                  connectionLineStyle={{ stroke : '#818cf8', strokeWidth: 2 }} 
              >
                  <Background color="#464b52" variant="dots" gap={10} size={1.5} />
                  <Controls className='custom-flow-controls' />

                  // assigned color for each node
                  <MiniMap 
                    nodeColor={(n) => {
                      if (n.type === 'customInput')  return '#2563eb'
                      if (n.type === 'llm')          return '#7c3aed'
                      if (n.type === 'customOutput') return '#059669'
                      if (n.type === 'text')         return '#d97706'
                      if (n.type === 'promptNode')   return '#db2777'
                      if (n.type === 'mathNode')     return '#0891b2'
                      if (n.type === 'jsonNode')     return '#16a34a'
                      if (n.type === 'apiNode')      return '#ea580c'
                      if (n.type === 'delayNode')    return '#7c3aed'
                      return '#6366f1'
                    }}
                    maskColor='rgba(15, 23, 42, 0.6)'
                    className='custom-minimap'
                  />
                  
               
              </ReactFlow>
          </div>
        </div>
    )
}
