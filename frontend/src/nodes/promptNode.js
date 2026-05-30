// promptNode.js
// A custom Prompt node for handling text prompts, using the BaseNode abstraction for consistent UI and behavior across all nodes.
// ---------------------------------------------------------------------------------


import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { Sparkles } from 'lucide-react';

export const PromptNode = ({ id, data }) => {

    const updateNodeField = useStore((state) => state.updateNodeField);  // Get the function to update node data in global store

    // Local state initialized with existing data or default values
    const [currentPrompt, setCurrentPrompt] = useState(data?.prompt || '');

    const [variables, setVariables] = useState([]);

    useEffect(() => {
        const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g; // Regex to match {variable} patterns in the prompt
        const foundVars = [];
        let match;

        while ((match = regex.exec(currentPrompt)) !== null) {
            const varName = match[1];
            if (!foundVars.includes(varName)) {
                foundVars.push(varName);
            }
        }
        setVariables(foundVars);
        updateNodeField(id, 'variables', foundVars);  // Update global store with extracted variables
        updateNodeField(id, 'prompt', currentPrompt);
    // Update global store with current prompt text
    }, [currentPrompt]);

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
            icon={<Sparkles size={14} strokeWidth={2} />}
            colorScheme="prompt"
            handles={handles}
        >
            <label>
                Template Prompt:
                <textarea
                    value={currentPrompt}
                    onChange={handlePromptChange}
                    placeholder="Enter your prompt here..."
                    style = {{ height: '80px', resize: 'none' }}
                />
            </label>

            {variables.length > 0 && (
                <div style = {{ display: 'flex', flexWrap: 'wrap', gap: '5px',  marginTop:   '10px' }}>
                    {variables.map((variable) => (

                        <span
                            key={variable}
                            style={{
                                background: 'rgba(236, 72, 153, 0.15)',
                                color: '#f472b6',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                border: '1px solid rgba(236, 72, 153, 0.3)',
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

