// A custom Prompt node for handling text prompts, using the BaseNode abstraction for consistent UI and behavior across all nodes.



import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const PromptNode = (props) => {
    
  const { id, data } = props;      // Destructure props to get node id and data (which contains prompt text, etc)

  const updateNodeField = useStore((state) => state.updateNodeField);  // Get the function to update node data in global store

  // Local state initialized with existing data or default values
  const [currentPrompt, setCurrentPrompt] = useState(data?.prompt || 'Enter your prompt here...');

  const [variables, setVariables] = useState([]);

  useEffect(() => {
    const reges = /{(.*?)}/g;  // Regex to match {variable} patterns in the prompt
    const foundVars = [];
    let match;

    while ((match = reges.exec(currPrompt)) !== null) {
        const varName = match[1];
        if (!foundVars.includes(varName)) {
            foundVars.push(varName);
        }
    }
    setVariables(foundVars);
    updateNodeField(id, { variables: foundVars });  // Update global store with extracted variables
    updateNodeField(id, { prompt: currentPrompt });  // Update global store with current prompt text
  }, [currentPrompt, id, updateNodeField]);

  const handlePromptChange = (e) => {
    setCurrentPrompt(e.target.value);
  }


    // Defineing a single output handle for the prompt text and variables
    const baseHandles = [
        {
            type: 'source',
            position: Position.Right,
            id: `${id}-output`,
            style: { top: '50%' },
        }
    ];


    // Dynamic variable handles on the left 
    const variableHandles = variables.map((variable, idx) => {
        const topPosition = variables.length === 1 
            ? '50%'
            : `${(idx + 1) * (100 / (variables.length + 1))}%`;  // Evenly space handles if multiple variables

        return {
            type: 'target',
            position: Position.Left,
            id: `${id}-var-${variable}`,
            style: { top: topPosition },
        }
    });

    const handles = [...baseHandles, ...variableHandles]; // Combine base handles with dynamic variable handles

    return (
        <BaseNode
            id={id}
            title="Prompt Node"
            icon="💬"
            colorScheme="prompt"
            handles={handles}
        >
            <label>
                Template Prompt:
                <textarea
                    value={currentPrompt}
                    onChange={handlePromptChange}
                    placeholder="Enter your prompt here..."
                    style = {{ height: '80px', resize: 'vertical' }}
                />
            </label>

            {variables.length > 0 && (
                <div style = {{ display: 'flex', flexWrap: 'wrap', gap: '5px',  marginTop:   '10px' }}>
                    {variables.map((variable) => (

                        <span
                            key={variable}
                            style = {{ 
                                backgroundColor: 'lightgray', 
                                padding: '5px', 
                                borderRadius: '3px',
                                fontSize: '0.6rem',
                                color: 'black',
                                borderRadius: '3px',
                                border: '1px solid gray'
                            }}
                        >
                            {variable}
                        </span>

                    ))}

                </div>
            )}
        </BaseNode>
    ); 
};

